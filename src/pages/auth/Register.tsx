import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Eye, EyeOff, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '@/components/PageTransition';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/FadeIn';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert(i18n.language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Call the register endpoint (ASP.NET Core Identity default is /register)
      await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
        email: formData.email,
        password: formData.password,
      });

      alert(i18n.language === 'ar' ? 'تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.' : 'Account created successfully! You can now login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      alert(i18n.language === 'ar' ? 'فشل إنشاء الحساب. قد يكون البريد الإلكتروني مستخدماً بالفعل.' : 'Registration failed. Email might be already in use.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <PageTransition>
        <FadeIn>
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl md:text-3xl font-bold text-center">
                {t('user.register')}
              </CardTitle>
              <CardDescription className="text-center">
                {i18n.language === 'ar' 
                  ? 'أنشئ حسابك الجديد للبدء' 
                  : 'Create your account to get started'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <StaggerContainer>
                  <StaggerItem>
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        {i18n.language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder={i18n.language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {i18n.language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder={i18n.language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {i18n.language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder={i18n.language === 'ar' ? 'أدخل رقم هاتفك' : 'Enter your phone number'}
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="space-y-2">
                      <Label htmlFor="password">
                        {i18n.language === 'ar' ? 'كلمة المرور' : 'Password'}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder={i18n.language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                          value={formData.password}
                          onChange={(e) => handleChange('password', e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        {i18n.language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder={i18n.language === 'ar' ? 'أعد إدخال كلمة المرور' : 'Re-enter your password'}
                          value={formData.confirmPassword}
                          onChange={(e) => handleChange('confirmPassword', e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </StaggerItem>
                </StaggerContainer>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <span>{i18n.language === 'ar' ? 'جاري التسجيل...' : 'Creating account...'}</span>
                  ) : (
                    <span>{t('user.register')}</span>
                  )}
                </Button>
              </form>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  {i18n.language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
                </span>
                <Link to="/login" className="text-primary hover:underline font-medium">
                  {t('user.login')}
                </Link>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </PageTransition>
    </div>
  );
}
