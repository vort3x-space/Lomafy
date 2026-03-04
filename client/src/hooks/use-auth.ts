import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { authFetch } from "@/lib/auth-fetch";
import { z } from "zod";

type RegisterInput = z.infer<typeof api.auth.register.input>;
type LoginInput = z.infer<typeof api.auth.login.input>;

export function useUser() {
  return useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const token = localStorage.getItem('lomafy_token');
      if (!token) return null;
      
      const res = await authFetch(api.auth.me.path);
      if (res.status === 401) {
        localStorage.removeItem('lomafy_token');
        return null;
      }
      if (!res.ok) throw new Error("Failed to fetch user");
      
      const data = await res.json();
      return api.auth.me.responses[200].parse(data).user;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const validated = api.auth.login.input.parse(data);
      const res = await authFetch(api.auth.login.path, {
        method: api.auth.login.method,
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }
      
      const result = api.auth.login.responses[200].parse(await res.json());
      localStorage.setItem('lomafy_token', result.token);
      return result.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const validated = api.auth.register.input.parse(data);
      const res = await authFetch(api.auth.register.path, {
        method: api.auth.register.method,
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }
      
      const result = api.auth.register.responses[201].parse(await res.json());
      localStorage.setItem('lomafy_token', result.token);
      return result.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return () => {
    localStorage.removeItem('lomafy_token');
    queryClient.setQueryData([api.auth.me.path], null);
    queryClient.invalidateQueries();
  };
}
