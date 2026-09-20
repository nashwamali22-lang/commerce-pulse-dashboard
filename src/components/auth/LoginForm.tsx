'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BarChart3,
  Eye,
  EyeOff,
  LineChart,
  Loader2,
  LockKeyhole,
  Mail,
  PackageSearch,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { FirebaseError } from 'firebase/app';

import { loginWithEmail } from '@/lib/firebase/auth';
import {
  setAuthError as setReduxAuthError,
  setAuthLoading,
} from '@/features/auth/authSlice';
import { loginSchema, type LoginFormValues } from '@/lib/validation/authSchema';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

function getFirebaseAuthError(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return 'Unable to sign in. Please try again.';
  }

  switch (error.code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password.';

    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';

    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';

    default:
      return 'Unable to sign in. Please try again.';
  }
}

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const { user, initialized } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (initialized && user) {
      router.replace('/dashboard');
    }
  }, [initialized, user, router]);

  async function onSubmit(values: LoginFormValues) {
    try {
      setAuthError(null);

      await loginWithEmail(values.email.trim(), values.password);

      router.replace('/dashboard');
    } catch (error) {
      console.error('Firebase login error:', error);
      setAuthError(getFirebaseAuthError(error));
    }
  }
  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#18233d]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1d2943] px-4 py-8 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-52 -right-28 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative grid w-full max-w-[1180px] overflow-hidden rounded-[22px] border border-white/20 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.28)] lg:min-h-[710px] lg:grid-cols-[1fr_1.02fr]">
        {/* LEFT PANEL */}
        <section className="relative hidden overflow-hidden bg-[#070d1f] px-12 py-11 text-white lg:flex lg:flex-col">
          <div className="absolute -right-16 top-12 h-60 w-60 rounded-full bg-violet-600/20 blur-3xl" />

          <div className="absolute bottom-20 left-16 h-52 w-52 rounded-full bg-blue-600/10 blur-3xl" />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div className="absolute h-7 w-7 rotate-[-28deg] rounded-[9px] bg-gradient-to-br from-violet-400 to-violet-700" />

              <div className="absolute bottom-0 left-0 h-4 w-7 rotate-[8deg] rounded-[8px] bg-violet-500" />
            </div>

            <div className="text-xl font-bold tracking-tight">
              Stock
              <span className="text-violet-400">Pro</span>
            </div>
          </div>

          {/* Hero text */}
          <div className="relative z-10 mt-16 max-w-[380px]">
            <h1 className="text-[42px] font-bold leading-[1.12] tracking-[-0.03em]">
              Manage Smarter
              <br />
              Grow Faster
            </h1>

            <p className="mt-5 max-w-[330px] text-[15px] leading-7 text-slate-400">
              Your products, sales and profits all in one powerful dashboard.
            </p>
          </div>

          {/* Dashboard visual */}
          <div className="relative z-10 mt-10 flex flex-1 items-center justify-center">
            <div className="relative h-[280px] w-[380px]">
              <div className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-500/20" />

              <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-2xl" />

              <div className="absolute left-[94px] top-[72px] h-[118px] w-[170px] -rotate-6 rounded-2xl border border-white/10 bg-[#101a35]/80 p-5 shadow-2xl backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-3 w-20 rounded bg-white/10" />

                  <Sparkles className="h-4 w-4 text-violet-400" />
                </div>

                <div className="flex items-end gap-2">
                  {[42, 72, 55, 92, 65, 108].map((height, index) => (
                    <div
                      key={index}
                      className="w-4 rounded-t bg-gradient-to-t from-violet-700 to-violet-400"
                      style={{
                        height,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="absolute right-5 top-14 flex h-20 w-20 rotate-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/25 to-blue-500/10 shadow-[0_0_40px_rgba(124,58,237,0.2)]">
                <PackageSearch className="h-9 w-9 text-violet-300" />
              </div>

              <div className="absolute bottom-7 left-8 flex h-20 w-24 -rotate-6 items-center justify-center rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-500/20 to-violet-500/10">
                <LineChart className="h-9 w-9 text-blue-300" />
              </div>

              <div className="absolute bottom-5 right-10 flex h-16 w-16 rotate-6 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <TrendingUp className="h-7 w-7 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="relative z-10 mb-8 grid gap-4">
            <Feature
              icon={<PackageSearch className="h-4 w-4" />}
              text="Track your inventory"
            />

            <Feature
              icon={<BarChart3 className="h-4 w-4" />}
              text="Analyze your sales"
            />

            <Feature
              icon={<TrendingUp className="h-4 w-4" />}
              text="Boost your profits"
            />
          </div>

          <p className="relative z-10 text-xs text-slate-600">
            © 2026 StockPro. All rights reserved.
          </p>
        </section>

        {/* RIGHT LOGIN PANEL */}
        <section className="relative flex min-h-[650px] items-center justify-center bg-[#fbfcff] px-6 py-12 sm:px-12 lg:px-16">
          {/* Theme control */}
          <div className="absolute right-6 top-6 flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400">
              ☼
            </div>

            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6e67b9] text-[12px] text-white">
              ◐
            </div>
          </div>

          <div className="w-full max-w-[480px]">
            {/* Mobile Logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
                <TrendingUp className="h-5 w-5" />
              </div>

              <span className="text-xl font-bold text-slate-950">
                Stock
                <span className="text-violet-600">Pro</span>
              </span>
            </div>

            {/* Heading */}
            <div className="mb-10">
              <h2 className="text-[38px] font-bold tracking-[-0.035em] text-[#101426]">
                Welcome Back 👋
              </h2>

              <p className="mt-2 text-[15px] text-slate-500">
                Sign in to your account to continue
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#171c2f]"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@dashboard.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    {...register('email')}
                    className="h-[54px] w-full rounded-[10px] border border-slate-300 bg-white pl-12 pr-4 text-[14px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                  />
                </div>

                {errors.email && (
                  <p id="email-error" className="mt-2 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#171c2f]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? 'password-error' : undefined
                    }
                    {...register('password')}
                    className="h-[54px] w-full rounded-[10px] border border-slate-300 bg-white pl-12 pr-12 text-[14px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p id="password-error" className="mt-2 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                  <input
                    id="remember-me"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 accent-violet-600"
                  />
                  Remember me
                </label>

                <span className="text-sm font-medium text-violet-600">
                  Forgot password?
                </span>
              </div>

              {/* Auth error */}
              {authError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {authError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-[54px] w-full items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-[#7c4dff] via-[#6958ff] to-[#39b8ff] text-sm font-semibold text-white shadow-[0_12px_30px_rgba(99,102,241,0.28)] transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>

              {/* Separator */}
              <div className="flex items-center gap-4 py-1">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs text-slate-400">or continue with</span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-3 gap-3">
                <SocialButton>
                  <span className="text-base font-bold text-[#4285F4]">G</span>

                  <span>Google</span>
                </SocialButton>

                <SocialButton>
                  <GitHubIcon />

                  <span>GitHub</span>
                </SocialButton>

                <SocialButton>
                  <MicrosoftIcon />

                  <span>Microsoft</span>
                </SocialButton>
              </div>
            </form>

            <p className="mt-24 text-center text-xs text-slate-500">
              Don&apos;t have an account?{' '}
              <span className="font-medium text-violet-600">
                Contact your administrator
              </span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

interface FeatureProps {
  icon: ReactNode;
  text: string;
}

function Feature({ icon, text }: FeatureProps) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-300">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-300">
        {icon}
      </div>

      <span>{text}</span>
    </div>
  );
}

interface SocialButtonProps {
  children: ReactNode;
}

function SocialButton({ children }: SocialButtonProps) {
  return (
    <button
      type="button"
      className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
    >
      {children}
    </button>
  );
}

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[18px] w-[18px] shrink-0 fill-current"
    >
      <path d="M12 .7C5.73.7.65 5.78.65 12.05c0 5.02 3.25 9.28 7.76 10.78.57.1.78-.25.78-.55v-2.16c-3.16.69-3.83-1.34-3.83-1.34-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.74 2.65 1.24 3.3.95.1-.73.4-1.24.72-1.52-2.52-.29-5.17-1.26-5.17-5.61 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.44.11-3 0 0 .95-.3 3.12 1.16A10.8 10.8 0 0 1 12 6.16c.96 0 1.93.13 2.84.38 2.16-1.46 3.11-1.16 3.11-1.16.62 1.56.23 2.71.11 3 .73.79 1.17 1.8 1.17 3.04 0 4.36-2.66 5.31-5.19 5.6.41.35.77 1.04.77 2.1v3.16c0 .3.21.66.79.55a11.36 11.36 0 0 0 7.75-10.78C23.35 5.78 18.27.7 12 .7Z" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <span aria-hidden="true" className="grid shrink-0 grid-cols-2 gap-[1px]">
      <span className="h-[7px] w-[7px] bg-[#f35325]" />
      <span className="h-[7px] w-[7px] bg-[#81bc06]" />
      <span className="h-[7px] w-[7px] bg-[#05a6f0]" />
      <span className="h-[7px] w-[7px] bg-[#ffba08]" />
    </span>
  );
}
