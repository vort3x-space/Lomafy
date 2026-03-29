import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { authFetch } from "@/lib/auth-fetch";
import { z } from "zod";
import type { InsertProduct } from "@shared/schema";

export function useProducts(params?: { categoryId?: string; search?: string; saleType?: string }) {
  return useQuery({
    queryKey: [api.products.list.path, params],
    queryFn: async () => {
      const url = new URL(api.products.list.path, window.location.origin);
      if (params?.categoryId) url.searchParams.append("categoryId", params.categoryId);
      if (params?.search) url.searchParams.append("search", params.search);
      if (params?.saleType && params.saleType !== 'all') url.searchParams.append("saleType", params.saleType);
      
      const res = await authFetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch products");
      return api.products.list.responses[200].parse(await res.json());
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { id });
      const res = await authFetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch product");
      return api.products.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertProduct) => {
      const validated = api.products.create.input.parse(data);
      const res = await authFetch(api.products.create.path, {
        method: api.products.create.method,
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Failed to create product");
      return api.products.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.products.list.path] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertProduct>) => {
      const validated = api.products.update.input.parse(updates);
      const url = buildUrl(api.products.update.path, { id });
      const res = await authFetch(url, {
        method: api.products.update.method,
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Failed to update product");
      return api.products.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.products.get.path, variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.products.delete.path, { id });
      const res = await authFetch(url, { method: api.products.delete.method });
      if (!res.ok) throw new Error("Failed to delete product");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.products.list.path] }),
  });
}
