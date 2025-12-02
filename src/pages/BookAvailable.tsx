import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, BookOpen, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBooks } from '@/hooks/useBooks';

export default function BookAvailable() {
  const navigate = useNavigate();
  const { books, loading, availableBooks } = useBooks();
  const [bookName, setBookName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [searchError, setSearchError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Get unique authors for dropdown
  const uniqueAuthors = [...new Set(books.map(b => b.author))];

  const handleSearch = () => {
    // Validation: At least one field must be filled
    if (!bookName.trim() && !authorName) {
      setSearchError('Please enter at least one search criterion (Book Name or Author)');
      setHasSearched(false);
      return;
    }
    setSearchError('');
    setHasSearched(true);
    setSelectedBook(null);
  };

  // Filter available books based on search criteria
  const searchResults = hasSearched
    ? availableBooks.filter(book => {
        const matchesTitle = !bookName.trim() || book.title.toLowerCase().includes(bookName.toLowerCase());
        const matchesAuthor = !authorName || book.author === authorName;
        return matchesTitle && matchesAuthor;
      })
    : [];

  const handleIssue = () => {
    if (!selectedBook) {
      setSearchError('Please select a book to issue');
      return;
    }
    // Navigate to issue page with selected book
    navigate('/transactions/issue', { state: { bookId: selectedBook } });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <Button variant="ghost" onClick={() => navigate('/transactions')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Transactions
        </Button>

        <div className="neu-card bg-card rounded-2xl p-8">
          <h1 className="font-display text-2xl font-bold text-foreground mb-6">Book Available - Search</h1>

          {/* Search Form */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bookName" className="text-foreground">Book Name</Label>
                <Input
                  id="bookName"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                  placeholder="Enter book name..."
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorName" className="text-foreground">Author Name</Label>
                <Select value={authorName} onValueChange={setAuthorName}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Select author" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Authors</SelectItem>
                    {uniqueAuthors.map((author) => (
                      <SelectItem key={author} value={author}>{author}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSearch} className="h-12 px-8 rounded-xl gradient-primary text-primary-foreground">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setBookName('');
                  setAuthorName('');
                  setHasSearched(false);
                  setSelectedBook(null);
                  setSearchError('');
                }}
                className="h-12 rounded-xl"
              >
                Clear
              </Button>
            </div>

            {searchError && <p className="text-destructive text-sm">{searchError}</p>}
          </div>

          {/* Search Results Table */}
          {hasSearched && (
            <div className="border-t border-border pt-6">
              <Label className="text-foreground mb-4 block">
                Search Results ({searchResults.length} books found)
              </Label>

              {searchResults.length > 0 ? (
                <>
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Serial No</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Title</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Author</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Genre</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Available</th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Select</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResults.map((book) => (
                          <tr 
                            key={book.id} 
                            className={`border-t border-border/50 hover:bg-muted/50 transition-colors ${
                              selectedBook === book.id ? 'bg-primary/10' : ''
                            }`}
                          >
                            <td className="py-3 px-4 font-mono text-foreground">{book.serial_no}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-primary" />
                                <span className="font-medium text-foreground">{book.title}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">{book.author}</td>
                            <td className="py-3 px-4 text-muted-foreground">{book.genre}</td>
                            <td className="py-3 px-4">
                              <span className="bg-accent text-accent-foreground px-2 py-1 rounded text-sm">
                                {book.available_copies} / {book.copies}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <input
                                type="radio"
                                name="selectedBook"
                                value={book.id}
                                checked={selectedBook === book.id}
                                onChange={() => setSelectedBook(book.id)}
                                className="w-4 h-4 text-primary border-border focus:ring-primary"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/transactions')} 
                      className="flex-1 h-12 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleIssue}
                      disabled={!selectedBook}
                      className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground disabled:opacity-50"
                    >
                      Issue Selected Book
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No available books found matching your criteria</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
