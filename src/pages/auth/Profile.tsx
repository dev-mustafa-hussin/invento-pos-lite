import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, Edit, Save, X, Camera, Loader2, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '@/components/PageTransition';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/FadeIn';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    avatar: '',
  });
  const [editData, setEditData] = useState(userData);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, [navigate]);

  const fetchUserInfo = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
      const response = await axios.get(`${apiUrl}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = response.data;
      
      const newData = {
        name: data.fullName || '',
        email: data.email || '',
        phone: data.phoneNumber || '',
        jobTitle: data.jobTitle || 'User',
        avatar: '',
      };
      
      setUserData(newData);
      setEditData(newData);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
      await axios.put(`${apiUrl}/profile`, {
        fullName: editData.name,
        phoneNumber: editData.phone,
        jobTitle: editData.jobTitle
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(editData);
      setIsEditing(false);
      toast.success(i18n.language === 'ar' ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(i18n.language === 'ar' ? 'فشل تحديث الملف الشخصي' : 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      ? name.slice(0, 2).toUpperCase()
      : '??';
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                        ? 'بياناتك الأساسية' 
                        : 'Your basic information'}
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
                        {getInitials(editData.name || editData.email)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{userData.name || userData.email}</h3>
                    <Badge variant="outline" className="mt-1">
                      {userData.jobTitle || 'User'}
                    </Badge>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid gap-4">
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
                        disabled={true}
                        className="pl-10"
                      />
                    </div>
                  </div>

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
                        disabled={!isEditing}
                        className="pl-10"
                        placeholder={i18n.language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">
                      {i18n.language === 'ar' ? 'المسمى الوظيفي' : 'Job Title'}
                    </Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="jobTitle"
                        value={editData.jobTitle}
                        onChange={(e) => setEditData({ ...editData, jobTitle: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                        placeholder={i18n.language === 'ar' ? 'أدخل المسمى الوظيفي' : 'Enter job title'}
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
                        disabled={!isEditing}
                        className="pl-10"
                        placeholder={i18n.language === 'ar' ? 'أدخل رقم الهاتف' : 'Enter phone number'}
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
                    ? 'إدارة كلمة المرور' 
                    : 'Manage your password'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {i18n.language === 'ar' ? 'كلمة المرور' : 'Password'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ********
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/forgot-password')}>
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
