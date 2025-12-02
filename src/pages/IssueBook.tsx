import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, BookOpen } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { mockBooks, mockMembers } from '@/lib/mockData';

export default function IssueBook() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [searchError, setSearchError] = useState('');
  const [formData, setFormData] = useState({
    memberId: '',
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    returnDate: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
    remarks: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableBooks = mockBooks.filter(book => 
    book.availableCopies > 0 &&
    (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.serialNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedBookData = mockBooks.find(b => b.id === selectedBook);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchError('Please enter at least one search criterion');
      return;
    }
    setSearchError('');
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedBook) newErrors.book = 'Please select a book';
    if (!formData.memberId) newErrors.memberId = 'Please select a member';
    if (!formData.issueDate) newErrors.issueDate = 'Issue date is required';
    if (!formData.returnDate) newErrors.returnDate = 'Return date is required';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const issueDate = new Date(formData.issueDate);
    const returnDate = new Date(formData.returnDate);
    
    if (issueDate < today) newErrors.issueDate = 'Issue date cannot be before today';
    if (returnDate > addDays(issueDate, 15)) newErrors.returnDate = 'Return date cannot exceed 15 days from issue date';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    toast.success('Book issued successfully!', {
      description: `"${selectedBookData?.title}" has been issued`,
    });
    navigate('/transactions');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <Button variant="ghost" onClick={() => navigate('/transactions')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Transactions
        </Button>

        <div className="neu-card bg-card rounded-2xl p-8">
          <h1 className="font-display text-2xl font-bold text-foreground mb-6">Issue Book</h1>

          {/* Search Section */}
          <div className="mb-8">
            <Label className="text-foreground mb-2 block">Search Books</Label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by title, author, or serial number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
              <Button onClick={handleSearch} className="h-12 px-6 rounded-xl gradient-primary text-primary-foreground">
                Search
              </Button>
            </div>
            {searchError && <p className="text-destructive text-sm mt-2">{searchError}</p>}
          </div>

          {/* Search Results */}
          {searchTerm && availableBooks.length > 0 && (
            <div className="mb-8 space-y-2">
              <Label className="text-foreground">Select a Book</Label>
              <div className="max-h-48 overflow-y-auto space-y-2 rounded-xl border border-border p-2">
                {availableBooks.map((book) => (
                  <label
                    key={book.id}
                    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedBook === book.id ? 'bg-primary/10 border border-primary' : 'hover:bg-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name="book"
                      value={book.id}
                      checked={selectedBook === book.id}
                      onChange={() => setSelectedBook(book.id)}
                      className="sr-only"
                    />
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{book.title}</p>
                      <p className="text-sm text-muted-foreground">{book.author} • {book.serialNo}</p>
                    </div>
                    <span className="text-sm text-accent-foreground bg-accent px-2 py-1 rounded">
                      {book.availableCopies} available
                    </span>
                  </label>
                ))}
              </div>
              {errors.book && <p className="text-destructive text-sm">{errors.book}</p>}
            </div>
          )}

          {/* Issue Form */}
          {selectedBook && (
            <form onSubmit={handleSubmit} className="space-y-6 border-t border-border pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-foreground">Book Title</Label>
                  <Input value={selectedBookData?.title || ''} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Author</Label>
                  <Input value={selectedBookData?.author || ''} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Member *</Label>
                  <Select value={formData.memberId} onValueChange={(value) => setFormData({ ...formData, memberId: value })}>
                    <SelectTrigger className={`h-12 rounded-xl ${errors.memberId ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMembers.filter(m => m.status === 'active').map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.membershipNo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.memberId && <p className="text-destructive text-sm">{errors.memberId}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Issue Date *</Label>
                  <Input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className={`h-12 rounded-xl ${errors.issueDate ? 'border-destructive' : ''}`}
                  />
                  {errors.issueDate && <p className="text-destructive text-sm">{errors.issueDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Return Date *</Label>
                  <Input
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    className={`h-12 rounded-xl ${errors.returnDate ? 'border-destructive' : ''}`}
                  />
                  {errors.returnDate && <p className="text-destructive text-sm">{errors.returnDate}</p>}
                  <p className="text-xs text-muted-foreground">Maximum 15 days from issue date</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-foreground">Remarks (Optional)</Label>
                  <Textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="Any additional notes..."
                    className="rounded-xl resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/transactions')} className="flex-1 h-12 rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground">
                  Issue Book
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
