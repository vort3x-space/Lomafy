import { AdminLayout } from "./Layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "@/lib/auth-fetch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import type { User } from "@shared/schema";

export default function AdminUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const res = await authFetch("/api/admin/users");
      return res.json();
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await authFetch(`/api/admin/users/${id}/approve`, { method: "PATCH" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Kullanıcı onaylandı" });
    }
  });

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-display font-bold mb-8">Kullanıcı Yönetimi</h1>
      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-4">Ad Soyad / Marka</th>
              <th className="px-6 py-4">E-posta</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4">Durum</th>
              <th className="px-6 py-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users?.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-4">
                  <div className="font-medium">{u.name}</div>
                  {u.brandName && <div className="text-xs text-muted-foreground">{u.brandName}</div>}
                </td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">{u.role}</td>
                <td className="px-6 py-4">
                  {u.isApproved ? (
                    <span className="flex items-center text-green-600"><CheckCircle className="w-4 h-4 mr-1" /> Onaylı</span>
                  ) : (
                    <span className="flex items-center text-amber-600"><XCircle className="w-4 h-4 mr-1" /> Bekliyor</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {!u.isApproved && (
                    <Button size="sm" onClick={() => approveMutation.mutate(u.id)} disabled={approveMutation.isPending}>
                      Onayla
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
