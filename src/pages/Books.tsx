import { useState } from 'react';
import { Plus, Search, Edit, BookOpen, Film, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBooks } from '@/hooks/useBooks';

export default function Books() {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const { books, loading } = useBooks();

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.serial_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Books Catalog</h1>
            <p className="text-muted-foreground">Manage your library collection • Real-time updates enabled</p>
          </div>
          {isAdmin && (
            <Button onClick={() => navigate('/books/add')} className="gradient-primary text-primary-foreground rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add Book
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by title, author, or serial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 rounded-xl"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Books Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBooks.map((book) => (
              <div key={book.id} className="neu-card bg-card rounded-2xl p-5 group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    book.type === 'book' ? 'bg-primary/10 text-primary' : 'bg-secondary/20 text-secondary-foreground'
                  }`}>
                    {book.type === 'book' ? <BookOpen className="w-6 h-6" /> : <Film className="w-6 h-6" />}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    book.available_copies > 0 ? 'bg-accent text-accent-foreground' : 'bg-destructive/10 text-destructive'
                  }`}>
                    {book.available_copies > 0 ? `${book.available_copies} available` : 'Not available'}
                  </span>
                </div>
                
                <h3 className="font-display font-semibold text-foreground line-clamp-1">{book.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{book.serial_no}</span>
                  <span className="px-2 py-0.5 rounded bg-muted text-foreground">{book.genre}</span>
                </div>

                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/books/edit/${book.serial_no}`)}
                    className="w-full mt-4 rounded-lg"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No books found matching your search</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
