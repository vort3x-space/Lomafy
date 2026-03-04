import { useState } from "react";
import { useLocation } from "wouter";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      loginMutation.mutate(
        { email: formData.email, password: formData.password },
        {
          onSuccess: () => {
            toast({ title: "Welcome back!" });
            setLocation('/');
          },
          onError: (err) => {
            toast({ title: "Login failed", description: err.message, variant: "destructive" });
          }
        }
      );
    } else {
      registerMutation.mutate(
        { email: formData.email, password: formData.password, name: formData.name },
        {
          onSuccess: () => {
            toast({ title: "Account created successfully!" });
            setLocation('/');
          },
          onError: (err) => {
            toast({ title: "Registration failed", description: err.message, variant: "destructive" });
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
          {isLogin ? "Welcome back" : "Create an account"}
        </h1>
        <p className="text-muted-foreground mb-8">
          {isLogin ? "Enter your details to access your account." : "Join us to shop direct from producers."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                required 
                className="mt-1 h-12" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="email">Email address</Label>
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
            <Label htmlFor="password">Password</Label>
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
            {isPending ? "Please wait..." : (isLogin ? "Log In" : "Sign Up")}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-primary font-semibold hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}
