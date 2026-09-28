"use client";

import { useEffect, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Mail,
    Pencil,
    Plus,
    RotateCw,
    Search,
    Trash2,
    Users,
    X,
} from "lucide-react";
import AppPage from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import UserForm from "@/components/users/UserForm";
import {
    useCreateUser,
    useDeleteUser,
    useUpdateUser,
    useUsers,
} from "@/hooks/useUsers";
import type { BreadcrumbItem } from "@/types/breadcrumb";
import type { User, UserPayload } from "@/types/user";

const breadcrumbs: BreadcrumbItem[] = [{ title: "Users", href: "/users" }];

function getErrorMessage(error: unknown, fallback: string) {
    if (typeof error === "object" && error !== null && "message" in error) {
        const { message } = error;
        if (typeof message === "string" && message.trim()) return message;
    }

    return fallback;
}

export default function UsersPage() {
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<User | null>(null);
    const [deleting, setDeleting] = useState<User | null>(null);
    const [deleteError, setDeleteError] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const { data: users, isLoading, isError, refetch } = useUsers(page);
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();
    const deleteUser = useDeleteUser();

    useEffect(() => {
        if (users && page > users.last_page) setPage(users.last_page);
    }, [page, users]);

    const currentUsers = users?.data ?? [];
    const normalizedSearch = search.trim().toLowerCase();
    const filteredUsers = currentUsers.filter((user) =>
        [user.first_name, user.last_name, user.username, user.email]
            .join(" ")
            .toLowerCase()
            .includes(normalizedSearch),
    );

    function openCreate() {
        setEditing(null);
        setFormOpen(true);
    }

    function openEdit(user: User) {
        setEditing(user);
        setFormOpen(true);
    }

    function closeForm() {
        setFormOpen(false);
        setEditing(null);
    }

    async function handleSubmit(payload: UserPayload) {
        if (editing) {
            await updateUser.mutateAsync({ id: editing.id, payload });
        } else {
            await createUser.mutateAsync(payload);
        }
        closeForm();
    }

    async function confirmDelete() {
        if (!deleting) return;
        setDeleteError("");
        try {
            await deleteUser.mutateAsync(deleting.id);
            setDeleting(null);
        } catch (error: unknown) {
            setDeleteError(getErrorMessage(error, "Could not delete this user."));
        }
    }

    return (
        <AppPage breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage the accounts and contact details in your workspace.
                        </p>
                    </div>
                    <Button onClick={openCreate} className="shrink-0">
                        <Plus size={16} className="mr-2" />
                        New user
                    </Button>
                </div>

                <Card className="overflow-hidden p-0">
                    <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <div>
                            <h2 className="font-semibold">All users</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {users?.total ?? 0} {(users?.total ?? 0) === 1 ? "account" : "accounts"}
                            </p>
                        </div>
                        <div className="relative w-full sm:max-w-xs">
                            <Search
                                aria-hidden="true"
                                size={16}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search this page..."
                                aria-label="Search users"
                                className="input pl-9 pr-9"
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setPage(1);
                                }}
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    aria-label="Clear search"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {isError ? (
                        <div className="flex flex-col items-center px-4 py-12 text-center">
                            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-danger/10 text-danger">
                                <RotateCw size={20} />
                            </div>
                            <h3 className="font-medium">Could not load users</h3>
                            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                Please check your connection and try again.
                            </p>
                            <Button
                                variant="secondary"
                                className="mt-4"
                                onClick={() => void refetch()}
                            >
                                <RotateCw size={15} className="mr-2" />
                                Try again
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-160 text-left text-sm">
                                <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                                    <tr>
                                        <th scope="col" className="px-5 py-3 font-medium">Name</th>
                                        <th scope="col" className="px-5 py-3 font-medium">Username</th>
                                        <th scope="col" className="px-5 py-3 font-medium">Email</th>
                                        <th scope="col" className="px-5 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {isLoading &&
                                        Array.from({ length: 5 }, (_, index) => (
                                            <tr key={`loading-${index}`} aria-hidden="true">
                                                <td colSpan={4} className="px-5 py-4">
                                                    <div className="h-4 animate-pulse rounded bg-muted" />
                                                </td>
                                            </tr>
                                        ))}

                                    {!isLoading && currentUsers.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-5 py-14 text-center">
                                                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                                    <Users size={20} />
                                                </div>
                                                <h3 className="mt-3 font-medium">No users yet</h3>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Create a user to get started.
                                                </p>
                                                <Button className="mt-4" onClick={openCreate}>
                                                    <Plus size={15} className="mr-2" />
                                                    New user
                                                </Button>
                                            </td>
                                        </tr>
                                    )}

                                    {!isLoading && currentUsers.length > 0 && filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-5 py-14 text-center">
                                                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                                    <Search size={20} />
                                                </div>
                                                <h3 className="mt-3 font-medium">No matching users</h3>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Try another name, username, or email address.
                                                </p>
                                            </td>
                                        </tr>
                                    )}

                                    {!isLoading && filteredUsers.map((user) => {
                                        const initials =
                                            `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase();

                                        return (
                                            <tr key={user.id} className="transition-colors hover:bg-muted/40">
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                                            {initials || <Users size={15} />}
                                                        </span>
                                                        <span className="min-w-0 font-medium">
                                                            {user.first_name} {user.last_name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-muted-foreground">
                                                    @{user.username}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="flex items-center gap-2 text-muted-foreground">
                                                        <Mail size={15} className="shrink-0" />
                                                        <span className="truncate">{user.email}</span>
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex justify-end gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEdit(user)}
                                                            aria-label={`Edit ${user.username}`}
                                                            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setDeleteError("");
                                                                setDeleting(user);
                                                            }}
                                                            aria-label={`Delete ${user.username}`}
                                                            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!isLoading && !isError && users && users.total > 0 && (
                        <div className="flex flex-col gap-3 border-t border-border px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-muted-foreground">
                                {normalizedSearch
                                    ? `Showing ${filteredUsers.length} of ${currentUsers.length} users on this page`
                                    : `Showing ${users.from ?? 0}-${users.to ?? 0} of ${users.total} users`}
                            </p>
                            <div className="flex items-center justify-between gap-3 sm:justify-end">
                                <span className="text-xs text-muted-foreground">
                                    Page {users.current_page} of {users.last_page}
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        disabled={page <= 1 || isLoading}
                                        onClick={() => setPage((currentPage) => currentPage - 1)}
                                        aria-label="Previous page"
                                    >
                                        <ChevronLeft size={16} />
                                        <span className="sr-only">Previous</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        disabled={page >= users.last_page || isLoading}
                                        onClick={() => setPage((currentPage) => currentPage + 1)}
                                        aria-label="Next page"
                                    >
                                        <ChevronRight size={16} />
                                        <span className="sr-only">Next</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            <Modal
                open={formOpen}
                onClose={closeForm}
                title={editing ? "Edit user" : "Create user"}
                description={editing
                    ? "Update this account's details."
                    : "Add a new account to your workspace."}
            >
                <UserForm
                    key={editing?.id ?? "new"}
                    user={editing}
                    onSubmit={handleSubmit}
                    onCancel={closeForm}
                />
            </Modal>

            <Modal
                open={!!deleting}
                onClose={() => {
                    if (!deleteUser.isPending) setDeleting(null);
                }}
                title="Delete user?"
                description="This action cannot be undone."
            >
                <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-foreground">@{deleting?.username}</span>?
                </p>
                {deleteError && <p role="alert" className="alert-danger mt-3">{deleteError}</p>}
                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        disabled={deleteUser.isPending}
                        onClick={() => setDeleting(null)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="danger"
                        loading={deleteUser.isPending}
                        onClick={confirmDelete}
                    >
                        Delete user
                    </Button>
                </div>
            </Modal>
        </AppPage>
    );
}