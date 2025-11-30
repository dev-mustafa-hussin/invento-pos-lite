import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '@/components/PageTransition';
import { FadeIn } from '@/components/animations/FadeIn';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { i18n } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Replace with real API call
    setTimeout(() => {
      console.log('Reset password for:', email);
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <PageTransition>
        <FadeIn>
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl md:text-3xl font-bold text-center">
                {i18n.language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
              </CardTitle>
              <CardDescription className="text-center">
                {i18n.language === 'ar' 
                  ? 'سنرسل لك رابط لإعادة تعيين كلمة المرور' 
                  : "We'll send you a link to reset your password"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!sent ? (
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

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <span>{i18n.language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}</span>
                    ) : (
                      <span>{i18n.language === 'ar' ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link'}</span>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4 py-6">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-success/10 p-3">
                      <CheckCircle className="h-12 w-12 text-success" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">
                      {i18n.language === 'ar' ? 'تم الإرسال!' : 'Check Your Email!'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {i18n.language === 'ar' 
                        ? `لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى ${email}`
                        : `We've sent a password reset link to ${email}`}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSent(false)}
                    className="w-full"
                  >
                    {i18n.language === 'ar' ? 'إرسال مرة أخرى' : 'Resend Email'}
                  </Button>
                </div>
              )}

              <div className="text-center">
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {i18n.language === 'ar' ? 'العودة إلى تسجيل الدخول' : 'Back to Login'}
                </Link>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </PageTransition>
    </div>
  );
}
