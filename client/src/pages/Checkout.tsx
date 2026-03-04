import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/store/cart";
import { useUser } from "@/hooks/use-auth";
import { useCreateOrder } from "@/hooks/use-orders";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";

const checkoutSchema = z.object({
  email: z.string().email("Valid email is required"),
  fullName: z.string().min(2, "Full name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(3, "Postal code is required"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { data: user } = useUser();
  const createOrder = useCreateOrder();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || "",
      fullName: user?.name || "",
    }
  });

  if (items.length === 0 && !isSuccess) {
    setLocation('/cart');
    return null;
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md p-8">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="font-display text-4xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Thank you for your purchase. Your order is being processed and will ship soon.
            </p>
            <Button size="lg" className="rounded-full px-8" onClick={() => setLocation('/')}>
              Continue Shopping
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const onSubmit = (data: CheckoutForm) => {
    const fullAddress = `${data.fullName}, ${data.address}, ${data.city}, ${data.postalCode}`;
    
    createOrder.mutate({
      shippingAddress: fullAddress,
      guestEmail: user ? undefined : data.email,
      items: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      }))
    }, {
      onSuccess: () => {
        clearCart();
        setIsSuccess(true);
      },
      onError: (err) => {
        toast({
          title: "Order Failed",
          description: err.message,
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
        <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
                <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} className="mt-1" disabled={!!user} />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" {...register("fullName")} className="mt-1" />
                    {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Textarea id="address" {...register("address")} className="mt-1 resize-none" />
                    {errors.address && <p className="text-sm text-destructive mt-1">{errors.address.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" {...register("city")} className="mt-1" />
                      {errors.city && <p className="text-sm text-destructive mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input id="postalCode" {...register("postalCode")} className="mt-1" />
                      {errors.postalCode && <p className="text-sm text-destructive mt-1">{errors.postalCode.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full rounded-xl h-14 text-lg"
                disabled={createOrder.isPending}
              >
                {createOrder.isPending ? "Processing..." : `Pay $${total().toFixed(2)}`}
              </Button>
            </form>
          </div>
          
          {/* Summary */}
          <div>
            <div className="bg-secondary/30 p-6 rounded-2xl border border-border sticky top-24">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-border shrink-0 relative">
                      <img src={item.product.imageUrl || ''} alt={item.product.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs flex items-center justify-center rounded-full font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-muted-foreground text-sm">${Number(item.product.price).toFixed(2)}</p>
                    </div>
                    <p className="font-semibold text-sm">
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${total().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              
              <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
