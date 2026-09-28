"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";

export default function RegisterPage() {
  const { user, loading, register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      await register(form);
    } catch (err: any) {
      setErrors(err.errors ?? { general: [err.message ?? "Registration failed"] });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-2xl font-semibold">Create account</h1>

          <Alert>{errors.general?.[0]}</Alert>

          <FormField
            label="Username"
            name="username"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="First name"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              error={errors.first_name}
              required
            />
            <FormField
              label="Last name"
              name="last_name"
              value={form.last_name}
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
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <FormField
            label="Confirm password"
            name="password_confirmation"
            type="password"
            autoComplete="new-password"
            value={form.password_confirmation}
            onChange={handleChange}
            error={errors.password_confirmation}
            required
          />

          <Button type="submit" loading={submitting} className="w-full">
            {submitting ? "Creating account..." : "Register"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </form>
      </Card>
    </main>
  );
}