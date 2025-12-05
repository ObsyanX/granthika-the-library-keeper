import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Setting {
  id: string;
  key: string;
  value: string;
  description: string | null;
}

export function useSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('settings')
      .select('*');
    
    if (!error && data) {
      setSettings(data as Setting[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const getSetting = (key: string): string | null => {
    const setting = settings.find(s => s.key === key);
    return setting?.value || null;
  };

  const getDailyFineRate = (): number => {
    const rate = getSetting('daily_fine_rate');
    return rate ? parseInt(rate, 10) : 10; // Default to 10 if not set
  };

  const updateSetting = async (key: string, value: string) => {
    const { error } = await supabase
      .from('settings')
      .update({ value })
      .eq('key', key);
    
    if (!error) {
      await fetchSettings();
      return true;
    }
    return false;
  };

  return {
    settings,
    loading,
    getSetting,
    getDailyFineRate,
    updateSetting,
    refetch: fetchSettings,
  };
}
