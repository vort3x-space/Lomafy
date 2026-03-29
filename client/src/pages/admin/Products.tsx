import { useState } from "react";
import { AdminLayout } from "./Layout";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2 } from "lucide-react";
import type { Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().min(0),
  categoryId: z.coerce.number().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

type ProductForm = z.infer<typeof productSchema>;

export default function AdminProducts() {
  const { data: products, isLoading } = useProducts({ myProducts: true });
  const { data: categories } = useCategories();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "", slug: "", description: "", price: 0, stock: 0, imageUrl: "", categoryId: undefined
    }
  });

  const openDialog = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      form.reset({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: Number(product.price),
        stock: product.stock,
        categoryId: product.categoryId || undefined,
        imageUrl: product.imageUrl || "",
      });
    } else {
      setEditingId(null);
      form.reset({ name: "", slug: "", description: "", price: 0, stock: 0, imageUrl: "", categoryId: categories?.[0]?.id });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: ProductForm) => {
    const payload = {
      ...data,
      imageUrl: data.imageUrl || null,
      categoryId: data.categoryId || null,
      isActive: true,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          toast({ title: "Product updated" });
        }
      });
    } else {
      createMutation.mutate(payload as any, {
        onSuccess: () => {
          setIsDialogOpen(false);
          toast({ title: "Product created" });
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast({ title: "Product deleted" })
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold">Products</h1>
        <Button onClick={() => openDialog()} className="rounded-full">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Image</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Stock</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products?.map((product) => (
              <tr key={product.id} className="hover:bg-secondary/20">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 rounded bg-secondary overflow-hidden">
                    {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-foreground">{product.name}</td>
                <td className="px-6 py-4">${Number(product.price).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openDialog(product)}>
                    <Edit className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Product' : 'Create Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input {...form.register("name")} />
              </div>
              <div>
                <Label>Slug (URL friendly)</Label>
                <Input {...form.register("slug")} />
              </div>
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea {...form.register("description")} className="h-32" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Price</Label>
                <Input type="number" step="0.01" {...form.register("price")} />
              </div>
              <div>
                <Label>Stock</Label>
                <Input type="number" {...form.register("stock")} />
              </div>
              <div>
                <Label>Category</Label>
                <select 
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  {...form.register("categoryId")}
                >
                  <option value="">Select...</option>
                  {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <Label>Image URL</Label>
              <Input type="url" {...form.register("imageUrl")} placeholder="https://..." />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
