import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Book, User, ArrowLeftRight, Loader2 } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { useBooks } from '@/hooks/useBooks';
import { useMembers } from '@/hooks/useMembers';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO } from 'date-fns';

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const { books, loading: booksLoading } = useBooks();
  const { members, loading: membersLoading } = useMembers();
  const { transactions, loading: transactionsLoading } = useTransactions();

  const isLoading = booksLoading || membersLoading || transactionsLoading;

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Filter results based on query
  const filteredBooks = query.length > 0
    ? books.filter(
        (book) =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()) ||
          book.serial_no.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const filteredMembers = query.length > 0 && isAdmin
    ? members.filter(
        (member) =>
          member.name.toLowerCase().includes(query.toLowerCase()) ||
          member.email.toLowerCase().includes(query.toLowerCase()) ||
          member.membership_no.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const filteredTransactions = query.length > 0
    ? transactions.filter(
        (transaction) =>
          transaction.book?.title?.toLowerCase().includes(query.toLowerCase()) ||
          transaction.member?.name?.toLowerCase().includes(query.toLowerCase()) ||
          transaction.book?.serial_no?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSelect = useCallback((type: string, id: string) => {
    setOpen(false);
    setQuery('');
    
    switch (type) {
      case 'book':
        navigate('/books');
        break;
      case 'member':
        navigate('/membership');
        break;
      case 'transaction':
        navigate('/transactions');
        break;
    }
  }, [navigate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'issued':
        return <Badge variant="secondary">Issued</Badge>;
      case 'returned':
        return <Badge variant="outline" className="border-primary/30 text-primary">Returned</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return null;
    }
  };

  const getAvailabilityBadge = (available: number, total: number) => {
    if (available === 0) {
      return <Badge variant="destructive">Unavailable</Badge>;
    }
    if (available < total) {
      return <Badge variant="secondary">{available}/{total} Available</Badge>;
    }
    return <Badge variant="outline" className="border-primary/30 text-primary">Available</Badge>;
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Search books, members, transactions..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <CommandEmpty>
              {query.length === 0 
                ? "Start typing to search..." 
                : "No results found."}
            </CommandEmpty>

            {filteredBooks.length > 0 && (
              <CommandGroup heading="Books">
                {filteredBooks.map((book) => (
                  <CommandItem
                    key={book.id}
                    value={`book-${book.id}`}
                    onSelect={() => handleSelect('book', book.id)}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Book className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{book.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {book.author} • {book.serial_no}
                      </p>
                    </div>
                    {getAvailabilityBadge(book.available_copies, book.copies)}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filteredMembers.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Members">
                  {filteredMembers.map((member) => (
                    <CommandItem
                      key={member.id}
                      value={`member-${member.id}`}
                      onSelect={() => handleSelect('member', member.id)}
                      className="flex items-center gap-3 py-3"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                        <User className="h-4 w-4 text-secondary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.email} • {member.membership_no}
                        </p>
                      </div>
                      <Badge 
                        variant={member.status === 'active' ? 'outline' : 'secondary'}
                        className={member.status === 'active' ? 'border-primary/30 text-primary' : ''}
                      >
                        {member.status}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {filteredTransactions.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Transactions">
                  {filteredTransactions.map((transaction) => (
                    <CommandItem
                      key={transaction.id}
                      value={`transaction-${transaction.id}`}
                      onSelect={() => handleSelect('transaction', transaction.id)}
                      className="flex items-center gap-3 py-3"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {transaction.book?.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {transaction.member?.name} • Due: {format(parseISO(transaction.due_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      {getStatusBadge(transaction.status)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
