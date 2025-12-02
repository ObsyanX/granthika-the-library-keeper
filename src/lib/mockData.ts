// Mock data for the Library Management System

export interface Book {
  id: string;
  serialNo: string;
  title: string;
  author: string;
  genre: string;
  type: 'book' | 'movie';
  copies: number;
  availableCopies: number;
  coverUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  membershipNo?: string;
  membershipStatus?: 'active' | 'expired' | 'pending';
}

export interface Member {
  id: string;
  membershipNo: string;
  name: string;
  email: string;
  startDate: string;
  duration: '6months' | '1year' | '2years';
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
}

export interface Transaction {
  id: string;
  bookId: string;
  bookTitle: string;
  author: string;
  serialNo: string;
  memberName: string;
  memberId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'issued' | 'returned' | 'overdue';
  fine?: number;
  finePaid?: boolean;
}

export const mockBooks: Book[] = [
  { id: '1', serialNo: 'BK001', title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fiction', type: 'book', copies: 5, availableCopies: 3 },
  { id: '2', serialNo: 'BK002', title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'Non-Fiction', type: 'book', copies: 3, availableCopies: 1 },
  { id: '3', serialNo: 'BK003', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', type: 'book', copies: 4, availableCopies: 4 },
  { id: '4', serialNo: 'BK004', title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Classic', type: 'book', copies: 6, availableCopies: 2 },
  { id: '5', serialNo: 'MV001', title: 'Inception', author: 'Christopher Nolan', genre: 'Sci-Fi', type: 'movie', copies: 2, availableCopies: 2 },
  { id: '6', serialNo: 'BK005', title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance', type: 'book', copies: 3, availableCopies: 0 },
  { id: '7', serialNo: 'BK006', title: '1984', author: 'George Orwell', genre: 'Dystopian', type: 'book', copies: 4, availableCopies: 3 },
  { id: '8', serialNo: 'MV002', title: 'The Shawshank Redemption', author: 'Frank Darabont', genre: 'Drama', type: 'movie', copies: 3, availableCopies: 1 },
];

export const mockMembers: Member[] = [
  { id: '1', membershipNo: 'MEM001', name: 'Arjun Sharma', email: 'arjun@email.com', startDate: '2024-01-15', duration: '1year', endDate: '2025-01-15', status: 'active' },
  { id: '2', membershipNo: 'MEM002', name: 'Priya Patel', email: 'priya@email.com', startDate: '2024-06-01', duration: '6months', endDate: '2024-12-01', status: 'expired' },
  { id: '3', membershipNo: 'MEM003', name: 'Rahul Gupta', email: 'rahul@email.com', startDate: '2024-09-01', duration: '2years', endDate: '2026-09-01', status: 'active' },
  { id: '4', membershipNo: 'MEM004', name: 'Ananya Singh', email: 'ananya@email.com', startDate: '2024-11-01', duration: '1year', endDate: '2025-11-01', status: 'active' },
];

export const mockTransactions: Transaction[] = [
  { id: '1', bookId: '1', bookTitle: 'The Alchemist', author: 'Paulo Coelho', serialNo: 'BK001', memberName: 'Arjun Sharma', memberId: '1', issueDate: '2024-11-15', dueDate: '2024-11-30', status: 'issued' },
  { id: '2', bookId: '2', bookTitle: 'Sapiens', author: 'Yuval Noah Harari', serialNo: 'BK002', memberName: 'Priya Patel', memberId: '2', issueDate: '2024-11-01', dueDate: '2024-11-16', status: 'overdue', fine: 50 },
  { id: '3', bookId: '4', bookTitle: 'To Kill a Mockingbird', author: 'Harper Lee', serialNo: 'BK004', memberName: 'Rahul Gupta', memberId: '3', issueDate: '2024-11-20', dueDate: '2024-12-05', status: 'issued' },
  { id: '4', bookId: '6', bookTitle: 'Pride and Prejudice', author: 'Jane Austen', serialNo: 'BK005', memberName: 'Ananya Singh', memberId: '4', issueDate: '2024-10-01', dueDate: '2024-10-16', returnDate: '2024-10-15', status: 'returned' },
];

export const genres = ['Fiction', 'Non-Fiction', 'Classic', 'Romance', 'Sci-Fi', 'Drama', 'Dystopian', 'Mystery', 'Biography', 'Self-Help'];
