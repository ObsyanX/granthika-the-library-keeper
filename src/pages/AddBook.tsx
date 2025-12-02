import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Film } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { genres, mockBooks } from '@/lib/mockData';

export default function AddBook() {
  const navigate = useNavigate();
  const { serialNo: editSerialNo } = useParams();
  const isEditMode = Boolean(editSerialNo);

  const [type, setType] = useState<'book' | 'movie'>('book');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    serialNo: '',
    copies: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-populate form when editing
  useEffect(() => {
    if (isEditMode && editSerialNo) {
      const book = mockBooks.find(b => b.serialNo === editSerialNo);
      if (book) {
        setType(book.type);
        setFormData({
          title: book.title,
          author: book.author,
          genre: book.genre,
          serialNo: book.serialNo,
          copies: book.copies.toString(),
        });
      }
    }
  }, [isEditMode, editSerialNo]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = type === 'book' ? 'Author is required' : 'Director is required';
    if (!formData.genre) newErrors.genre = 'Genre is required';
    if (!formData.serialNo.trim()) newErrors.serialNo = 'Serial number is required';
    if (!formData.copies.trim()) newErrors.copies = 'Number of copies is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditMode) {
      toast.success(`${type === 'book' ? 'Book' : 'Movie'} updated successfully!`, {
        description: `"${formData.title}" has been updated`,
      });
    } else {
      toast.success(`${type === 'book' ? 'Book' : 'Movie'} added successfully!`, {
        description: `"${formData.title}" has been added to the catalog`,
      });
    }
    navigate('/books');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <Button variant="ghost" onClick={() => navigate('/books')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Catalog
        </Button>

        <div className="neu-card bg-card rounded-2xl p-8">
          <h1 className="font-display text-2xl font-bold text-foreground mb-6">
            {isEditMode ? 'Update Item' : 'Add New Item'}
          </h1>

          {/* Type Toggle */}
          <div className="flex rounded-xl p-1 bg-muted mb-8">
            <button
              type="button"
              onClick={() => setType('book')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                type === 'book'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Book
            </button>
            <button
              type="button"
              onClick={() => setType('movie')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                type === 'movie'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Film className="w-4 h-4" />
              Movie
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title" className="text-foreground">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={`Enter ${type} title`}
                  className={`h-12 rounded-xl ${errors.title ? 'border-destructive' : ''}`}
                />
                {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="author" className="text-foreground">{type === 'book' ? 'Author' : 'Director'} *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder={`Enter ${type === 'book' ? 'author' : 'director'} name`}
                  className={`h-12 rounded-xl ${errors.author ? 'border-destructive' : ''}`}
                />
                {errors.author && <p className="text-destructive text-sm">{errors.author}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre" className="text-foreground">Genre *</Label>
                <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                  <SelectTrigger className={`h-12 rounded-xl ${errors.genre ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.genre && <p className="text-destructive text-sm">{errors.genre}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="serialNo" className="text-foreground">Serial Number *</Label>
                <Input
                  id="serialNo"
                  value={formData.serialNo}
                  onChange={(e) => setFormData({ ...formData, serialNo: e.target.value })}
                  placeholder="e.g., BK007"
                  className={`h-12 rounded-xl ${errors.serialNo ? 'border-destructive' : ''}`}
                />
                {errors.serialNo && <p className="text-destructive text-sm">{errors.serialNo}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="copies" className="text-foreground">Number of Copies *</Label>
                <Input
                  id="copies"
                  type="number"
                  min="1"
                  value={formData.copies}
                  onChange={(e) => setFormData({ ...formData, copies: e.target.value })}
                  placeholder="Enter number of copies"
                  className={`h-12 rounded-xl ${errors.copies ? 'border-destructive' : ''}`}
                />
                {errors.copies && <p className="text-destructive text-sm">{errors.copies}</p>}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/books')} className="flex-1 h-12 rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground">
                {isEditMode ? 'Update' : 'Add'} {type === 'book' ? 'Book' : 'Movie'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
