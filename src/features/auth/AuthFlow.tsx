import { ArrowLeft, Eye, EyeOff, Loader2, Mail, Shield } from "lucide-react";
import { useState } from "react";
import type React from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { signIn, signUp, resetPassword } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

type AuthMode = "sign-up" | "sign-in" | "forgot";

interface AuthFlowProps {
  onBack: () => void;
  onGuest: () => void;
  /** called after successful sign-in (existing user) */
  onSignedIn: () => void;
  /** called after successful sign-up (new user — needs onboarding) */
  onSignedUp: () => void;
}

export function AuthFlow({ onBack, onGuest, onSignedIn, onSignedUp }: AuthFlowProps) {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [info, setInfo]         = useState<string | null>(null);

  const { refreshProfile } = useAuth();

  function clearMessages() { setError(null); setInfo(null); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      if (mode === "sign-up") {
        if (!fullName.trim()) throw new Error("Please enter your full name.");
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");

        // Sign up — Supabase returns a session immediately if email confirm is OFF
        const result = await signUp(email, password, fullName);

        if (result.session) {
          // Email confirm is disabled → session exists → go to onboarding questions
          await refreshProfile();
          onSignedUp();
        } else {
          // Email confirm is enabled → ask them to verify first
          setInfo("Check your email for a confirmation link, then sign in.");
          setMode("sign-in");
        }

      } else if (mode === "sign-in") {
        await signIn(email, password);
        await refreshProfile();
        onSignedIn();

      } else {
        await resetPassword(email);
        setInfo("Password reset link sent! Check your inbox.");
      }
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : "Something went wrong.";
      // Make Supabase error messages friendlier
      const friendly: Record<string, string> = {
        "Invalid login credentials":    "Wrong email or password. Try again.",
        "Email not confirmed":           "Please confirm your email first, then sign in.",
        "User already registered":       "An account with this email already exists. Sign in instead.",
        "Password should be at least 6 characters": "Password must be at least 6 characters.",
      };
      setError(friendly[raw] ?? raw);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <Logo />
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </header>

      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        {/* left panel */}
        <section className="rounded-2xl border bg-card p-6">
          <Shield className="h-10 w-10 text-primary" aria-hidden />
          <h1 className="mt-4 text-3xl font-black">
            {mode === "sign-up"
              ? "Create your Solo English account."
              : mode === "sign-in"
              ? "Welcome back."
              : "Reset your password."}
          </h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            Your progress, streak, and XP are saved to your account so you can learn from any device.
          </p>
          <Button variant="outline" className="mt-6 w-full" onClick={onGuest}>
            Continue as Guest
          </Button>
        </section>

        {/* right panel */}
        <Card>
          <CardContent className="p-6">
            {/* tabs */}
            <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted p-1" role="tablist">
              {(["sign-up", "sign-in", "forgot"] as AuthMode[]).map((id) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={mode === id}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-black transition",
                    mode === id
                      ? "bg-card shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() => { setMode(id); clearMessages(); }}
                >
                  {id === "sign-up" ? "Sign Up" : id === "sign-in" ? "Sign In" : "Forgot"}
                </button>
              ))}
            </div>

            {/* feedback banners */}
            {error && (
              <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive animate-fade-in">
                {error}
              </div>
            )}
            {info && (
              <div className="mt-4 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary animate-fade-in">
                {info}
              </div>
            )}

            <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
              {mode === "sign-up" && (
                <Field
                  label="Full name"
                  placeholder="Sara Bekele"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                />
              )}

              {mode === "forgot" && (
                <p className="text-sm leading-6 text-muted-foreground">
                  Enter your email and we'll send you a link to reset your password.
                </p>
              )}

              <Field
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete={mode === "sign-up" ? "email" : "username"}
              />

              {mode !== "forgot" && (
                <div className="grid gap-2">
                  <label className="text-sm font-bold">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder={mode === "sign-up" ? "At least 6 characters" : "Enter password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                      className="h-12 w-full rounded-md border bg-background px-3 pr-10 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPass((p) => !p)}
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              <Button className="mt-2 h-12 text-base" size="lg" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : mode === "sign-up" ? (
                  "Create Account & Continue"
                ) : mode === "sign-in" ? (
                  "Sign In"
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> Or <div className="h-px flex-1 bg-border" />
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                clearMessages();
                const { supabase: sb } = await import("@/lib/supabase");
                await sb.auth.signInWithOAuth({
                  provider: "google",
                  options: { redirectTo: window.location.origin },
                });
              }}
            >
              <Mail className="h-4 w-4" /> Continue with Google
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold">
      {label}
      <input
        className="h-12 rounded-md border bg-background px-3 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        {...props}
      />
    </label>
  );
}
