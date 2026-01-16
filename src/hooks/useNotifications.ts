import { useState, useEffect, useMemo } from 'react';
import { useTransactions } from './useTransactions';
import { useAuth } from '@/contexts/AuthContext';
import { differenceInDays, parseISO, isAfter, isBefore, addDays } from 'date-fns';

export interface Notification {
  id: string;
  type: 'overdue' | 'due_soon' | 'info';
  title: string;
  message: string;
  bookTitle?: string;
  dueDate?: string;
  memberId?: string;
  memberName?: string;
  transactionId?: string;
  createdAt: Date;
  read: boolean;
}

export function useNotifications() {
  const { transactions, loading } = useTransactions();
  const { isAdmin, user } = useAuth();
  const [readNotifications, setReadNotifications] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('readNotifications');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  const notifications = useMemo(() => {
    const now = new Date();
    const notifs: Notification[] = [];

    transactions.forEach((transaction) => {
      if (transaction.status === 'returned') return;

      const dueDate = parseISO(transaction.due_date);
      const daysUntilDue = differenceInDays(dueDate, now);
      const isOverdue = isAfter(now, dueDate);
      const isDueSoon = !isOverdue && daysUntilDue <= 3 && daysUntilDue >= 0;

      // For admins: show all overdue books
      if (isAdmin && isOverdue) {
        notifs.push({
          id: `overdue-${transaction.id}`,
          type: 'overdue',
          title: 'Overdue Book',
          message: `"${transaction.book?.title}" borrowed by ${transaction.member?.name} is ${Math.abs(daysUntilDue)} days overdue`,
          bookTitle: transaction.book?.title,
          dueDate: transaction.due_date,
          memberId: transaction.member_id,
          memberName: transaction.member?.name,
          transactionId: transaction.id,
          createdAt: new Date(transaction.due_date),
          read: readNotifications.has(`overdue-${transaction.id}`),
        });
      }

      // For admins: also show books due soon as info
      if (isAdmin && isDueSoon) {
        notifs.push({
          id: `due-soon-admin-${transaction.id}`,
          type: 'due_soon',
          title: 'Due Soon',
          message: `"${transaction.book?.title}" borrowed by ${transaction.member?.name} is due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`,
          bookTitle: transaction.book?.title,
          dueDate: transaction.due_date,
          memberId: transaction.member_id,
          memberName: transaction.member?.name,
          transactionId: transaction.id,
          createdAt: new Date(),
          read: readNotifications.has(`due-soon-admin-${transaction.id}`),
        });
      }

      // For users: show their own books that are due soon or overdue
      // Note: In a real app, you'd match transaction.member.user_id with user.id
      // For now, we'll show all due-soon notifications to non-admin users as examples
      if (!isAdmin) {
        if (isOverdue) {
          notifs.push({
            id: `user-overdue-${transaction.id}`,
            type: 'overdue',
            title: 'Book Overdue!',
            message: `"${transaction.book?.title}" is ${Math.abs(daysUntilDue)} days overdue. Please return it soon to avoid additional fines.`,
            bookTitle: transaction.book?.title,
            dueDate: transaction.due_date,
            transactionId: transaction.id,
            createdAt: new Date(transaction.due_date),
            read: readNotifications.has(`user-overdue-${transaction.id}`),
          });
        } else if (isDueSoon) {
          notifs.push({
            id: `user-due-soon-${transaction.id}`,
            type: 'due_soon',
            title: 'Due Date Reminder',
            message: `"${transaction.book?.title}" is due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}. Remember to return it on time!`,
            bookTitle: transaction.book?.title,
            dueDate: transaction.due_date,
            transactionId: transaction.id,
            createdAt: new Date(),
            read: readNotifications.has(`user-due-soon-${transaction.id}`),
          });
        }
      }
    });

    // Sort by type (overdue first) then by date
    return notifs.sort((a, b) => {
      if (a.type === 'overdue' && b.type !== 'overdue') return -1;
      if (a.type !== 'overdue' && b.type === 'overdue') return 1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }, [transactions, isAdmin, readNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const overdueCount = notifications.filter((n) => n.type === 'overdue').length;

  const markAsRead = (notificationId: string) => {
    setReadNotifications((prev) => {
      const next = new Set(prev);
      next.add(notificationId);
      localStorage.setItem('readNotifications', JSON.stringify([...next]));
      return next;
    });
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadNotifications(new Set(allIds));
    localStorage.setItem('readNotifications', JSON.stringify(allIds));
  };

  const clearRead = () => {
    setReadNotifications(new Set());
    localStorage.removeItem('readNotifications');
  };

  return {
    notifications,
    unreadCount,
    overdueCount,
    loading,
    markAsRead,
    markAllAsRead,
    clearRead,
  };
}
