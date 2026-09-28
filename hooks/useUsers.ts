import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { usersService } from "@/services/users";
import { useToast } from "@/providers/ToastProvider";
import type { UserPayload } from "@/types/user";

export function useUsers(page: number) {
  return useQuery({
    queryKey: ["users", page],
    queryFn: () => usersService.list(page),
    placeholderData: keepPreviousData, // keeps the old page visible while the next loads
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: UserPayload) => usersService.create(payload),
    onSuccess: (data) => {
      toast.success(data.message);
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserPayload }) =>
      usersService.update(id, payload),
    onSuccess: (data) => {
      toast.success(data.message);
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["auth", "user"] }); // refresh the topbar if you edited yourself
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: string) => usersService.remove(id),
    onSuccess: (data) => {
      toast.success(data.message);
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
