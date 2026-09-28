import api from "@/lib/api";
import type { PaginatedUsers, User, UserPayload } from "@/types/user";

export const usersService = {
  list: (page: number) =>
    api
      .get<{ users: PaginatedUsers }>("/users", { params: { page } })
      .then((r) => r.data.users),

  create: (payload: UserPayload) =>
    api
      .post<{ message: string; user: User }>("/users", payload)
      .then((r) => r.data.user),

  update: (id: string, payload: UserPayload) =>
    api
      .put<{ message: string; user: User }>(`/users/${id}`, payload)
      .then((r) => r.data.user),

  remove: (id: string) =>
    api.delete<{ message: string }>(`/users/${id}`).then((r) => r.data),
};
