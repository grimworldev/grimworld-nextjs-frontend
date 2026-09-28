import api from "@/lib/api";
import type { PaginatedUsers, User, UserPayload } from "@/types/user";

type UserResponse = { message: string; user: User };
type MessageResponse = { message: string };

export const usersService = {
  list: (page: number) =>
    api
      .get<{ users: PaginatedUsers }>("/users", { params: { page } })
      .then((r) => r.data.users),

  create: (payload: UserPayload) =>
    api.post<UserResponse>("/users", payload).then((r) => r.data),

  update: (id: string, payload: UserPayload) =>
    api.put<UserResponse>(`/users/${id}`, payload).then((r) => r.data),

  remove: (id: string) =>
    api.delete<MessageResponse>(`/users/${id}`).then((r) => r.data),
};
