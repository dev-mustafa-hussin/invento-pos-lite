import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService, SystemSettings } from '@/services/settingsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Store, CreditCard, Bell, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { PageTransition } from '@/components/PageTransition';

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, setValue, watch } = useForm<SystemSettings>();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.getSettings,
  });

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const mutation = useMutation({
    mutationFn: settingsService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: "Settings saved",
        description: "Your changes have been successfully saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SystemSettings) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your store settings</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Store Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input id="storeName" {...register('storeName')} placeholder="ShopFlow POS" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeAddress">Address</Label>
                <Input id="storeAddress" {...register('storeAddress')} placeholder="123 Main St" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storePhone">Phone</Label>
                <Input id="storePhone" {...register('storePhone')} placeholder="+1 234 567 8900" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input id="taxRate" type="number" {...register('taxRate')} placeholder="10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" {...register('currency')} placeholder="USD" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Low Stock Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when products are low</p>
                </div>
                <Button 
                  type="button" 
                  variant={watch('lowStockAlerts') === 'true' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setValue('lowStockAlerts', watch('lowStockAlerts') === 'true' ? 'false' : 'true')}
                >
                  {watch('lowStockAlerts') === 'true' ? 'Enabled' : 'Enable'}
                </Button>
                <input type="hidden" {...register('lowStockAlerts')} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Reports</p>
                  <p className="text-sm text-muted-foreground">Receive daily sales summaries</p>
                </div>
                <Button 
                  type="button" 
                  variant={watch('dailyReports') === 'true' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setValue('dailyReports', watch('dailyReports') === 'true' ? 'false' : 'true')}
                >
                  {watch('dailyReports') === 'true' ? 'Enabled' : 'Enable'}
                </Button>
                <input type="hidden" {...register('dailyReports')} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Backend API URL</Label>
                <Input {...register('backendUrl')} placeholder="https://api.yourstore.com" />
                <p className="text-xs text-muted-foreground">
                  Configure your ASP.NET Core API endpoint
                </p>
              </div>
              <div className="pt-4">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </PageTransition>
  );
}
