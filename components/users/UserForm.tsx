"use client";

import { useState } from "react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import type { User, UserPayload } from "@/types/user";

type UserFormProps = {
    user: User | null;
    onSubmit: (payload: UserPayload) => Promise<void>;
    onCancel: () => void;
};

type FormValues = {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

type FormErrors = Record<string, string[]>;

function getFormErrors(error: unknown): FormErrors {
    if (typeof error !== "object" || error === null || !("errors" in error)) {
        return {
            general: [
                typeof error === "object" &&
                error !== null &&
                "message" in error &&
                typeof error.message === "string"
                    ? error.message
                    : "Could not save this user. Please try again.",
            ],
        };
    }

    const errors = error.errors;
    if (typeof errors !== "object" || errors === null || Array.isArray(errors)) {
        return { general: ["Could not save this user. Please try again."] };
    }

    const fieldErrors: FormErrors = {};
    for (const [key, value] of Object.entries(errors)) {
        if (Array.isArray(value)) {
            fieldErrors[key] = value.filter((message): message is string => typeof message === "string");
        } else if (typeof value === "string") {
            fieldErrors[key] = [value];
        }
    }

    const hasFieldErrors = Object.values(fieldErrors).some((messages) => messages.length > 0);
    if (hasFieldErrors) return fieldErrors;

    const message =
        "message" in error && typeof error.message === "string" && error.message.trim()
            ? error.message
            : "Could not save this user. Please try again.";
    return {
        general: [message],
    };
}

export default function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
    const [values, setValues] = useState<FormValues>({
        username: user?.username ?? "",
        first_name: user?.first_name ?? "",
        last_name: user?.last_name ?? "",
        email: user?.email ?? "",
        password: "",
        password_confirmation: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setValues((current) => ({ ...current, [name]: value }));
        setErrors((current) => {
            const next = { ...current };
            delete next[name];
            delete next.general;
            return next;
        });
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrors({});
        setSubmitting(true);

        const payload: UserPayload = {
            username: values.username,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
        };

        if (values.password) {
            payload.password = values.password;
            payload.password_confirmation = values.password_confirmation;
        }

        try {
            await onSubmit(payload);
        } catch (error: unknown) {
            setErrors(getFormErrors(error));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Alert>{errors.general?.[0]}</Alert>

            <FormField
                label="Username"
                name="username"
                autoComplete="username"
                value={values.username}
                onChange={handleChange}
                error={errors.username}
                required
            />

            <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                    label="First name"
                    name="first_name"
                    autoComplete="given-name"
                    value={values.first_name}
                    onChange={handleChange}
                    error={errors.first_name}
                    required
                />
                <FormField
                    label="Last name"
                    name="last_name"
                    autoComplete="family-name"
                    value={values.last_name}
                    onChange={handleChange}
                    error={errors.last_name}
                    required
                />
            </div>

            <FormField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
                required
            />

            <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                    label={user ? "New password (optional)" : "Password"}
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={values.password}
                    onChange={handleChange}
                    error={errors.password}
                    required={!user}
                />
                <FormField
                    label="Confirm password"
                    name="password_confirmation"
                    type="password"
                    autoComplete="new-password"
                    value={values.password_confirmation}
                    onChange={handleChange}
                    error={errors.password_confirmation}
                    disabled={Boolean(user) && values.password.length === 0}
                    required={!user || values.password.length > 0}
                />
            </div>

            {user && (
                <p className="-mt-2 text-xs text-muted-foreground">
                    Leave both password fields blank to keep the current password.
                </p>
            )}

            <div className="flex justify-end gap-2 border-t border-border pt-4">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
                    Cancel
                </Button>
                <Button type="submit" loading={submitting}>
                    {user ? "Save changes" : "Create user"}
                </Button>
            </div>
        </form>
    );
}
