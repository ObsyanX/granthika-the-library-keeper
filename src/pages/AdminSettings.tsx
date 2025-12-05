import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Save, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useSettings } from '@/hooks/useSettings';

export default function AdminSettings() {
  const navigate = useNavigate();
  const { getDailyFineRate, updateSetting, loading } = useSettings();
  const [fineRate, setFineRate] = useState(getDailyFineRate().toString());
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const rate = parseInt(fineRate, 10);
    if (isNaN(rate) || rate < 0) {
      toast.error('Invalid fine rate', { description: 'Please enter a valid positive number' });
      return;
    }

    setSaving(true);
    const success = await updateSetting('daily_fine_rate', rate.toString());
    setSaving(false);

    if (success) {
      toast.success('Settings saved', { description: `Daily fine rate set to ₹${rate}` });
    } else {
      toast.error('Failed to save settings');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin
        </Button>

        <div className="neu-card bg-card rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
              <Settings className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Library Settings</h1>
              <p className="text-muted-foreground">Configure library system settings</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Fine Rate Setting */}
            <div className="p-6 rounded-2xl bg-muted/50 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Fine Configuration</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Daily Fine Rate (₹)</Label>
                  <div className="flex gap-4 items-center">
                    <Input
                      type="number"
                      min="0"
                      value={fineRate}
                      onChange={(e) => setFineRate(e.target.value)}
                      className="h-12 rounded-xl max-w-[200px]"
                      placeholder="10"
                    />
                    <span className="text-muted-foreground">per day overdue</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This amount will be charged for each day a book is overdue.
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSave} 
                disabled={saving || loading}
                className="h-12 px-8 rounded-xl gradient-primary text-primary-foreground"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
