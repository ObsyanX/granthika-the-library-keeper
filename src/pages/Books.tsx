import { useState } from 'react';
import { Plus, Search, Edit, BookOpen, Film, Loader2, Filter, X, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBooks } from '@/hooks/useBooks';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type FilterType = 'all' | 'book' | 'movie';
type AvailabilityFilter = 'all' | 'available' | 'unavailable';

export default function Books() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('all');
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { books, loading } = useBooks();

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.serial_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || book.type === typeFilter;
    
    const matchesAvailability = 
      availabilityFilter === 'all' ||
      (availabilityFilter === 'available' && book.available_copies > 0) ||
      (availabilityFilter === 'unavailable' && book.available_copies === 0);
    
    return matchesSearch && matchesType && matchesAvailability;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setAvailabilityFilter('all');
  };

  const hasActiveFilters = searchTerm || typeFilter !== 'all' || availabilityFilter !== 'all';

  const availableCount = books.filter(b => b.available_copies > 0).length;
  const bookCount = books.filter(b => b.type === 'book').length;
  const movieCount = books.filter(b => b.type === 'movie').length;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Library Catalog</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Browse and search our collection of {books.length} items
              </p>
            </div>
            {isAdmin && (
              <Button onClick={() => navigate('/books/add')} className="gradient-primary text-primary-foreground rounded-xl shrink-0">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="px-3 py-1.5 text-sm font-normal">
              <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-primary" />
              {availableCount} Available
            </Badge>
            <Badge variant="outline" className="px-3 py-1.5 text-sm font-normal">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              {bookCount} Books
            </Badge>
            <Badge variant="outline" className="px-3 py-1.5 text-sm font-normal">
              <Film className="w-3.5 h-3.5 mr-1.5" />
              {movieCount} Movies
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, author, serial, or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-11 rounded-xl"
              aria-label="Search catalog"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as FilterType)}>
              <SelectTrigger className="w-[130px] h-11 rounded-xl">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="book">Books</SelectItem>
                <SelectItem value="movie">Movies</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={availabilityFilter} onValueChange={(v) => setAvailabilityFilter(v as AvailabilityFilter)}>
              <SelectTrigger className="w-[140px] h-11 rounded-xl">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} className="h-11 px-3 rounded-xl">
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading catalog...</p>
          </div>
        )}

        {/* Books Grid */}
        {!loading && filteredBooks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBooks.map((book) => (
              <article 
                key={book.id} 
                className="group bg-card rounded-2xl border border-border p-5 hover:border-primary/50 hover:shadow-md transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    book.type === 'book' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {book.type === 'book' ? <BookOpen className="w-5 h-5" /> : <Film className="w-5 h-5" />}
                  </div>
                  
                  {/* Availability Badge */}
                  <Badge 
                    variant={book.available_copies > 0 ? "default" : "destructive"}
                    className={`text-xs font-medium shrink-0 ${
                      book.available_copies > 0 
                        ? 'bg-accent text-accent-foreground' 
                        : 'bg-destructive/10 text-destructive border-destructive/20'
                    }`}
                  >
                    {book.available_copies > 0 ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {book.available_copies} left
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Unavailable
                      </>
                    )}
                  </Badge>
                </div>
                
                {/* Content */}
                <div className="space-y-2 mb-4">
                  <h3 className="font-display font-semibold text-foreground line-clamp-2 leading-tight">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {book.author}
                  </p>
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-mono">{book.serial_no}</span>
                  <Badge variant="outline" className="text-xs font-normal">
                    {book.genre}
                  </Badge>
                </div>

                {/* Admin Actions */}
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/books/edit/${book.serial_no}`)}
                    className="w-full mt-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Details
                  </Button>
                )}

                {/* User Borrow Action */}
                {!isAdmin && book.available_copies > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/transactions/issue')}
                    className="w-full mt-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Borrow This Item
                  </Button>
                )}
              </article>
            ))}
          </div>
        )}

        {/* Empty States */}
        {!loading && filteredBooks.length === 0 && hasActiveFilters && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground text-sm mb-4 max-w-sm">
              We couldn't find any items matching your search criteria. Try adjusting your filters.
            </p>
            <Button variant="outline" onClick={clearFilters} className="rounded-xl">
              Clear all filters
            </Button>
          </div>
        )}

        {!loading && books.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No items in catalog</h3>
            <p className="text-muted-foreground text-sm mb-4">
              The library catalog is empty. {isAdmin && 'Add your first book or movie to get started.'}
            </p>
            {isAdmin && (
              <Button onClick={() => navigate('/books/add')} className="gradient-primary text-primary-foreground rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Add First Item
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
