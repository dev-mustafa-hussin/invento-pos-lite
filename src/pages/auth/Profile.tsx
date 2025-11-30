import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, Edit, Save, X, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '@/components/PageTransition';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/FadeIn';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    phone: '+20 123 456 7890',
    role: 'Admin',
    avatar: '',
  });
  const [editData, setEditData] = useState(userData);
  const { t, i18n } = useTranslation();

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
    // TODO: Save to backend
    console.log('Saving:', editData);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'default';
      case 'manager': return 'secondary';
      case 'cashier': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <PageTransition>
      <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {i18n.language === 'ar' ? 'الملف الشخصي' : 'User Profile'}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            {i18n.language === 'ar' 
              ? 'إدارة معلومات حسابك الشخصي' 
              : 'Manage your account information'}
          </p>
        </div>

        <StaggerContainer className="grid gap-4 md:gap-6">
          <StaggerItem>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {i18n.language === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
                    </CardTitle>
                    <CardDescription>
                      {i18n.language === 'ar' 
                        ? 'بياناتك الأساسية وصلاحياتك' 
                        : 'Your basic information and role'}
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      {i18n.language === 'ar' ? 'تعديل' : 'Edit'}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={editData.avatar} />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {getInitials(editData.name)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{userData.name}</h3>
                    <Badge variant={getRoleBadgeVariant(userData.role)} className="mt-1">
                      {userData.role}
                    </Badge>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {i18n.language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {i18n.language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      {i18n.language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      {i18n.language === 'ar' ? 'حفظ' : 'Save Changes'}
                    </Button>
                    <Button onClick={handleCancel} variant="outline" className="flex-1">
                      <X className="h-4 w-4 mr-2" />
                      {i18n.language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {i18n.language === 'ar' ? 'الأمان' : 'Security'}
                </CardTitle>
                <CardDescription>
                  {i18n.language === 'ar' 
                    ? 'إدارة كلمة المرور والإعدادات الأمنية' 
                    : 'Manage your password and security settings'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {i18n.language === 'ar' ? 'كلمة المرور' : 'Password'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {i18n.language === 'ar' 
                        ? 'آخر تغيير منذ 3 أشهر' 
                        : 'Last changed 3 months ago'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    {i18n.language === 'ar' ? 'تغيير' : 'Change'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </PageTransition>
  );
}
