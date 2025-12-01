import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '@/components/PageTransition';
import { FadeIn } from '@/components/animations/FadeIn';

export default function Login() {
  console.log('Login component rendered');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Starting login request...');
      // Call the login endpoint (ASP.NET Core Identity default is /login)
      // Note: We use ?useCookies=true if we want cookies, or default for Bearer tokens.
      // Let's assume Bearer tokens for now as it's standard for SPAs with this setup.
      const apiUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
      console.log(`Login URL: ${apiUrl}/login`);
      
      const response = await axios.post(`${apiUrl}/login`, {
        email,
        password,
      });

      console.log('Login response received:', response.status);

      // Store the token
      const { accessToken, refreshToken } = response.data;
      console.log('Tokens received:', { accessToken: !!accessToken, refreshToken: !!refreshToken });
      
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      console.log('Navigating to dashboard...');
      // Navigate to dashboard
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      alert(i18n.language === 'ar' ? 'فشل تسجيل الدخول. يرجى التحقق من بياناتك.' : 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <PageTransition>
        <FadeIn>
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl md:text-3xl font-bold text-center">
                {t('user.login')}
              </CardTitle>
              <CardDescription className="text-center">
                {i18n.language === 'ar' 
                  ? 'أدخل بياناتك للوصول إلى حسابك' 
                  : 'Enter your credentials to access your account'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="rounded border-border"
                    />
                    <label htmlFor="remember" className="text-sm text-muted-foreground">
                      {i18n.language === 'ar' ? 'تذكرني' : 'Remember me'}
                    </label>
                  </div>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    {t('user.forgotPassword')}
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <span>{i18n.language === 'ar' ? 'جاري تسجيل الدخول...' : 'Signing in...'}</span>
                  ) : (
                    <span>{t('user.login')}</span>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {i18n.language === 'ar' ? 'أو' : 'or'}
                  </span>
                </div>
              </div>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  {i18n.language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
                </span>
                <Link to="/register" className="text-primary hover:underline font-medium">
                  {t('user.register')}
                </Link>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </PageTransition>
    </div>
  );
}
