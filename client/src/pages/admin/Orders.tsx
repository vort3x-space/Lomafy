import { AdminLayout } from "./Layout";
import { useOrders, useUpdateOrderStatus } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrders() {
  const { data: orders, isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const { toast } = useToast();

  const handleStatusChange = (id: number, newStatus: string) => {
    updateStatus.mutate({ id, status: newStatus }, {
      onSuccess: () => toast({ title: `Order #${id} marked as ${newStatus}` })
    });
  };

  const statuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Orders</h1>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Customer / Address</th>
              <th className="px-6 py-4 font-medium text-right">Amount</th>
              <th className="px-6 py-4 font-medium">Status & Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders?.map((order) => (
              <tr key={order.id} className="hover:bg-secondary/20">
                <td className="px-6 py-4 font-medium">#{order.id}</td>
                <td className="px-6 py-4">{order.createdAt ? format(new Date(order.createdAt), "MMM d, yyyy") : '-'}</td>
                <td className="px-6 py-4">
                  <div className="text-xs text-muted-foreground mb-1">{order.guestEmail || 'Registered User'}</div>
                  <div className="truncate max-w-[200px]">{order.shippingAddress}</div>
                </td>
                <td className="px-6 py-4 text-right font-medium">${Number(order.totalAmount).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <select
                      className={`text-xs font-semibold px-2 py-1.5 rounded-md border-0 bg-secondary/50 focus:ring-2 focus:ring-primary ${
                        order.status === 'PENDING' ? 'text-amber-700' :
                        order.status === 'SHIPPED' ? 'text-blue-700' :
                        order.status === 'DELIVERED' ? 'text-green-700' : ''
                      }`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updateStatus.isPending}
                    >
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && !isLoading && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
