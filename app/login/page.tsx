"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      await login(username, password);
    } catch (err: any) {
      setErrors(err.errors ?? { general: [err.message ?? "Login failed"] });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-2xl font-semibold">Login</h1>

          <Alert>{errors.general?.[0]}</Alert>

          <FormField
            label="Username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
            required
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
          />

          <Button type="submit" loading={submitting} className="w-full">
            {submitting ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </form>
      </Card>
    </main>
  );
}