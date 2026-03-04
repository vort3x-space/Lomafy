import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useLogin, useRegister, useUser } from "@/hooks/use-auth";
import { useLanguage } from "@/store/language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const { data: user } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'USER' as 'USER' | 'PRODUCER',
    brandName: ''
  });

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  if (user) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      loginMutation.mutate(
        { email: formData.email, password: formData.password },
        {
          onSuccess: () => {
            toast({ title: t('auth.login_success') || "Welcome back!" });
            setLocation('/');
          },
          onError: (err) => {
            toast({ title: t('auth.login_failed') || "Login failed", description: err.message, variant: "destructive" });
          }
        }
      );
    } else {
      registerMutation.mutate(
        { 
          email: formData.email, 
          password: formData.password, 
          name: formData.name,
          role: formData.role,
          brandName: formData.role === 'PRODUCER' ? formData.brandName : undefined
        },
        {
          onSuccess: (user) => {
            if (user.role === 'PRODUCER' && !user.isApproved) {
              toast({ 
                title: t('auth.pending_approval_title') || "Registration Received", 
                description: t('auth.pending_approval_desc') || "Your producer account is pending admin approval. You will be able to log in once approved.",
                variant: "default"
              });
              setIsLogin(true); // Switch to login tab
            } else {
              toast({ title: t('auth.register_success') || "Account created successfully!" });
              setLocation('/');
            }
          },
          onError: (err) => {
            toast({ title: t('auth.register_failed') || "Registration failed", description: err.message, variant: "destructive" });
          }
        }
      );
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <Link href="/" className="absolute top-8 left-8 font-display font-bold text-2xl tracking-tight text-primary">
        LOMAFY.
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-border">
        <h1 className="font-display text-3xl font-bold mb-2">
          {isLogin ? t('auth.login') : t('auth.register')}
        </h1>
        <p className="text-muted-foreground mb-8">
          {isLogin ? t('auth.login_subtitle') || "Enter your details to access your account." : t('auth.register_subtitle') || "Join us to shop direct from producers."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <Label htmlFor="name">{t('auth.name')}</Label>
                <Input 
                  id="name" 
                  required 
                  className="mt-1 h-12" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <Label>{t('auth.role') || "Account Type"}</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: 'USER' | 'PRODUCER') => setFormData({...formData, role: value})}
                >
                  <SelectTrigger className="mt-1 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">{t('auth.role_user') || "Buyer"}</SelectItem>
                    <SelectItem value="PRODUCER">{t('auth.role_producer') || "Producer"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.role === 'PRODUCER' && (
                <div>
                  <Label htmlFor="brandName">{t('auth.brand_name')}</Label>
                  <Input 
                    id="brandName" 
                    required 
                    className="mt-1 h-12" 
                    value={formData.brandName}
                    onChange={e => setFormData({...formData, brandName: e.target.value})}
                  />
                </div>
              )}
            </>
          )}
          
          <div>
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              className="mt-1 h-12" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              className="mt-1 h-12" 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <Button type="submit" className="w-full h-12 text-lg rounded-xl mt-6" disabled={isPending}>
            {isPending ? "..." : (isLogin ? t('auth.login') : t('auth.register'))}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          {isLogin ? t('auth.no_account') || "Don't have an account? " : t('auth.has_account') || "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-primary font-semibold hover:underline"
          >
            {isLogin ? t('auth.register') : t('auth.login')}
          </button>
        </div>
      </div>
    </div>
  );
}
