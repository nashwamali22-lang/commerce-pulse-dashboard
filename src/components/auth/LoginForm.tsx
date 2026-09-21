'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import { zodResolver } from '@hookform/resolvers/zod';

import {
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

import { loginWithEmail, registerWithEmail } from '@/lib/firebase/auth';

import { loginSchema, type LoginFormValues } from '@/lib/validation/authSchema';

import { useAppSelector } from '@/store/hooks';

const CHART_BARS = [38, 56, 46, 76, 62, 88, 70];

function getFirebaseAuthError(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return 'Unable to complete authentication. Please try again.';
  }

  switch (error.code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password.';

    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';

    case 'auth/weak-password':
    case 'auth/password-does-not-meet-requirements':
      return 'Password must be at least 6 characters.';

    case 'auth/operation-not-allowed':
      return 'Email and password authentication is not enabled.';

    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';

    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';

    default:
      return 'Unable to complete authentication. Please try again.';
  }
}

function BrandLogo({
  compact = false,
  lightBackground = false,
}: {
  compact?: boolean;
  lightBackground?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden="true"
        className={`relative shrink-0 ${compact ? 'h-9 w-9' : 'h-11 w-11'}`}
      >
        <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 -rotate-[28deg] rounded-[10px] bg-gradient-to-br from-violet-400 via-violet-500 to-indigo-700 shadow-[0_8px_25px_rgba(124,58,237,0.35)]" />

        <div className="absolute bottom-[4%] left-[2%] h-[38%] w-[70%] rotate-[8deg] rounded-[8px] bg-gradient-to-r from-violet-600 to-fuchsia-500" />

        <div className="absolute right-[4%] top-[4%] h-2 w-2 rounded-full bg-cyan-300/80 shadow-[0_0_12px_rgba(103,232,249,0.6)]" />
      </div>

      <div
        className={`font-bold tracking-[-0.03em] ${
          compact ? 'text-xl' : 'text-[22px]'
        } ${lightBackground ? 'text-[#101426]' : 'text-white'}`}
      >
        Stock
        <span className="text-violet-500">Pro</span>
      </div>
    </div>
  );
}

function MiniDashboardCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.05] bg-white/[0.025] p-2">
      <div className="h-1 w-6 rounded bg-white/10" />

      <p className="mt-2 text-[8px] text-slate-500">{title}</p>

      <p className="mt-0.5 text-[10px] font-semibold text-slate-200">{value}</p>
    </div>
  );
}

function HeroArtwork() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-[1.22/1] w-full max-w-[430px] max-h-full xl:max-w-[460px]"
    >
      <div className="absolute left-1/2 top-1/2 h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl" />

      <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-500/15" />

      <div className="absolute left-1/2 top-1/2 h-[52%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-400/10" />

      <div className="absolute left-[18%] top-[21%] h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_18px_rgba(167,139,250,0.9)]" />

      <div className="absolute right-[19%] top-[29%] h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.8)]" />

      <div className="absolute bottom-[21%] left-[27%] h-1.5 w-1.5 rounded-full bg-fuchsia-400" />

      <div className="absolute left-[3%] top-[13%] z-20 flex items-center gap-2 rounded-full border border-white/10 bg-[#111933]/80 px-3 py-2 shadow-xl backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>

        <span className="text-[10px] font-medium tracking-wide text-slate-300">
          INVENTORY SYNCED
        </span>
      </div>

      <div className="absolute left-1/2 top-[45%] z-10 w-[72%] -translate-x-1/2 -translate-y-1/2 -rotate-[4deg]">
        <div className="relative aspect-[1.55/1] overflow-hidden rounded-[18px] border border-violet-300/20 bg-[#0d142b] p-3 shadow-[0_30px_70px_rgba(0,0,0,0.55),0_0_45px_rgba(124,58,237,0.18)]">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-400/5" />

          <div className="relative flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400/70" />
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300/70" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
            </div>

            <div className="h-2 w-16 rounded-full bg-white/[0.06]" />
          </div>

          <div className="relative mt-3 grid h-[calc(100%-20px)] grid-cols-[1.35fr_.75fr] gap-2">
            <div className="flex min-h-0 flex-col gap-2">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.035] p-3">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="h-1.5 w-12 rounded-full bg-white/10" />

                    <div className="mt-1.5 h-2.5 w-20 rounded-full bg-white/15" />
                  </div>

                  <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                </div>

                <div className="flex h-16 items-end gap-[5px]">
                  {CHART_BARS.map((height, index) => (
                    <div
                      key={`${height}-${index}`}
                      className="flex-1 rounded-t-[3px] bg-gradient-to-t from-violet-700 via-violet-500 to-fuchsia-400 shadow-[0_0_10px_rgba(139,92,246,0.18)]"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid flex-1 grid-cols-3 gap-2">
                <MiniDashboardCard title="Stock" value="1.2K" />

                <MiniDashboardCard title="Sold" value="876" />

                <MiniDashboardCard title="Margin" value="28%" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-1 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035]">
                <div
                  className="relative flex h-16 w-16 items-center justify-center rounded-full"
                  style={{
                    background:
                      'conic-gradient(#8b5cf6 0deg 210deg, #22d3ee 210deg 285deg, rgba(255,255,255,.07) 285deg 360deg)',
                  }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#10172d]">
                    <span className="text-[11px] font-semibold text-white">
                      72%
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex aspect-square items-center justify-center rounded-xl border border-white/[0.06] bg-violet-500/[0.07]">
                  <PackageSearch className="h-5 w-5 text-violet-300" />
                </div>

                <div className="flex aspect-square items-center justify-center rounded-xl border border-white/[0.06] bg-cyan-400/[0.05]">
                  <TrendingUp className="h-5 w-5 text-cyan-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto h-[23px] w-[91%] origin-top -skew-x-[12deg] rounded-b-[16px] border border-white/[0.07] bg-gradient-to-b from-[#242d49] to-[#0a1022] shadow-[0_18px_30px_rgba(0,0,0,0.45)]">
          <div className="absolute left-1/2 top-1 h-1.5 w-16 -translate-x-1/2 rounded-full bg-white/[0.06]" />
        </div>
      </div>

      <div className="absolute bottom-[23%] left-[2%] z-20 flex h-[72px] w-[92px] -rotate-[8deg] items-center justify-center rounded-2xl border border-blue-400/15 bg-[#13203e]/85 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur">
        <LineChart className="h-8 w-8 text-sky-300" />
      </div>

      <div className="absolute right-[1%] top-[22%] z-20 flex h-[82px] w-[82px] rotate-[10deg] items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-indigo-500/5 shadow-[0_20px_45px_rgba(0,0,0,0.3),0_0_30px_rgba(124,58,237,0.14)] backdrop-blur">
        <PackageSearch className="h-9 w-9 text-violet-300" />
      </div>

      <div className="absolute bottom-[16%] right-[5%] z-20 flex items-center gap-2 rounded-xl border border-emerald-300/10 bg-[#101a2c]/90 px-3 py-2 shadow-xl backdrop-blur">
        <TrendingUp className="h-4 w-4 text-emerald-400" />

        <div>
          <p className="text-[9px] text-slate-500">Growth</p>

          <p className="text-xs font-semibold text-emerald-300">+12.4%</p>
        </div>
      </div>

      <div className="absolute bottom-[4%] left-[28%] z-20 h-[68px] w-[74px] -rotate-[5deg]">
        <div className="absolute inset-0 rounded-xl border border-white/10 bg-gradient-to-br from-[#27314d] to-[#11182c] shadow-[0_20px_35px_rgba(0,0,0,0.4)]" />

        <div className="absolute left-1/2 top-0 h-full w-[14px] -translate-x-1/2 bg-violet-400/10" />

        <div className="absolute left-3 top-3 h-2 w-8 rounded bg-white/[0.07]" />
      </div>

      <div className="absolute bottom-[1%] right-[29%] z-20 h-[82px] w-[46px] rotate-[8deg]">
        <div className="absolute left-1 top-0 h-[48px] w-[40px] rounded-[13px] border border-white/10 bg-gradient-to-br from-[#202945] to-[#0b1021] shadow-[0_18px_30px_rgba(0,0,0,0.4)]">
          <div className="absolute left-1/2 top-3 h-3 w-6 -translate-x-1/2 rounded-full bg-violet-500/60 shadow-[0_0_14px_rgba(139,92,246,0.8)]" />
        </div>

        <div className="absolute bottom-0 left-[16px] h-[42px] w-[18px] -rotate-[8deg] rounded-b-lg bg-[#151d33]" />
      </div>
    </div>
  );
}

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');

  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  const [authError, setAuthError] = useState<string | null>(null);

  const { initialized } = useAppSelector((state) => state.auth);

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

  async function onSubmit(values: LoginFormValues) {
    try {
      setAuthError(null);

      setConfirmPasswordError(null);

      const email = values.email.trim();

      if (isRegisterMode) {
        if (!confirmPassword) {
          setConfirmPasswordError('Confirm password is required.');

          return;
        }

        if (values.password !== confirmPassword) {
          setConfirmPasswordError('Passwords do not match.');

          return;
        }

        await registerWithEmail(email, values.password);
      } else {
        await loginWithEmail(email, values.password);
      }

      router.replace('/dashboard');
    } catch (error) {
      setAuthError(getFirebaseAuthError(error));
    }
  }

  function changeMode() {
    setIsRegisterMode((current) => !current);

    setAuthError(null);

    setConfirmPassword('');

    setConfirmPasswordError(null);

    setShowPassword(false);
  }

  if (!initialized) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#172440]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />

          <span className="text-sm text-slate-400">Preparing StockPro...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-x-hidden bg-[#1d2943] px-4 py-4 sm:px-6 sm:py-6 lg:h-dvh lg:min-h-0 lg:overflow-hidden lg:px-7 lg:py-6 xl:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 10%, rgba(124,58,237,.16), transparent 26%), radial-gradient(circle at 88% 85%, rgba(56,189,248,.09), transparent 24%)',
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative grid w-full max-w-[1200px] overflow-hidden rounded-[22px] border border-white/20 bg-[#fbfcff] shadow-[0_35px_110px_rgba(0,0,0,0.32)] lg:h-full lg:max-h-[760px] lg:min-h-0 lg:grid-cols-[0.98fr_1.02fr]">
        <section className="relative hidden min-h-0 overflow-hidden bg-[#060c1e] px-8 py-6 text-white lg:flex lg:flex-col xl:px-11 xl:py-8">
          <div className="pointer-events-none absolute -left-32 top-36 h-80 w-80 rounded-full bg-indigo-600/[0.08] blur-3xl" />

          <div className="pointer-events-none absolute -right-24 -top-12 h-72 w-72 rounded-full bg-violet-600/[0.16] blur-3xl" />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,.4) 1px, transparent 1px)',
              backgroundSize: '42px 42px',
            }}
          />

          <div className="relative z-10">
            <BrandLogo />
          </div>

          <div className="relative z-10 mt-7 xl:mt-9">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-8 bg-violet-400/50" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-violet-300">
                Smart inventory
              </span>
            </div>

            <h1 className="max-w-[410px] text-[32px] font-bold leading-[1.08] tracking-[-0.035em] xl:text-[39px]">
              Manage Smarter
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-sky-400 bg-clip-text text-transparent">
                Grow Faster
              </span>
            </h1>

            <p className="mt-3 max-w-[360px] text-[13px] leading-6 text-slate-400 xl:text-[14px]">
              Your products, sales and profits all in one powerful dashboard.
            </p>
          </div>

          <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center py-1">
            <HeroArtwork />
          </div>

          <div className="relative z-10 flex shrink-0 items-center justify-between border-t border-white/[0.06] pt-3">
            <p className="text-[10px] text-slate-600">© 2026 StockPro</p>

            <div className="flex items-center gap-2 text-[10px] text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Secure dashboard access
            </div>
          </div>
        </section>

        <section className="relative flex min-h-[560px] items-center justify-center bg-[#fbfcff] px-5 py-8 sm:min-h-[600px] sm:px-10 sm:py-10 lg:min-h-0 lg:px-12 lg:py-8 xl:px-16">
          <div className="w-full max-w-[470px] lg:-translate-y-1">
            <div className="mb-7 lg:hidden">
              <BrandLogo compact lightBackground />
            </div>

            <div className="mb-7 sm:mb-9">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-600 lg:hidden">
                Secure access
              </p>

              <h2 className="text-[30px] font-bold leading-tight tracking-[-0.035em] text-[#101426] sm:text-[36px] xl:text-[38px]">
                {isRegisterMode ? 'Create Account ✨' : 'Welcome Back 👋'}
              </h2>

              <p className="mt-2 text-[14px] text-slate-500 sm:text-[15px]">
                {isRegisterMode
                  ? 'Create your account to get started'
                  : 'Sign in to your account to continue'}
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 sm:space-y-6"
              noValidate
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#171c2f]"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@dashboard.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    {...register('email')}
                    className="h-[52px] w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 sm:h-[54px] sm:text-sm"
                  />
                </div>

                {errors.email && (
                  <p id="email-error" className="mt-2 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#171c2f]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={
                      isRegisterMode ? 'new-password' : 'current-password'
                    }
                    placeholder="Enter your password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? 'password-error' : undefined
                    }
                    {...register('password')}
                    className="h-[52px] w-full rounded-xl border border-slate-300 bg-white pl-12 pr-14 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 sm:h-[54px] sm:text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none"
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

              {isRegisterMode && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-[#171c2f]"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      aria-hidden="true"
                      className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value);

                        setConfirmPasswordError(null);
                      }}
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      aria-invalid={Boolean(confirmPasswordError)}
                      aria-describedby={
                        confirmPasswordError
                          ? 'confirm-password-error'
                          : undefined
                      }
                      className={`h-[52px] w-full rounded-xl border bg-white pl-12 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 sm:h-[54px] sm:text-sm ${
                        confirmPasswordError
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                          : 'border-slate-300 focus:border-violet-500 focus:ring-violet-500/10'
                      }`}
                    />
                  </div>

                  {confirmPasswordError && (
                    <p
                      id="confirm-password-error"
                      className="mt-2 text-sm text-red-600"
                    >
                      {confirmPasswordError}
                    </p>
                  )}
                </div>
              )}

              {authError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600"
                >
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7c4dff] via-[#6958ff] to-[#39b8ff] px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(99,102,241,0.28)] transition duration-200 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_16px_35px_rgba(99,102,241,0.32)] focus:outline-none disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 sm:h-[54px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />

                    {isRegisterMode ? 'Creating account...' : 'Signing in...'}
                  </>
                ) : (
                  <>{isRegisterMode ? 'Create Account' : 'Sign In'}</>
                )}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-sm text-slate-500">
                {isRegisterMode
                  ? 'Already have an account?'
                  : "Don't have an account?"}

                <button
                  type="button"
                  onClick={changeMode}
                  className="relative ml-2 font-semibold text-violet-600 transition hover:text-violet-700 focus:outline-none after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-violet-600 after:transition-all after:duration-200 hover:after:w-full"
                >
                  {isRegisterMode ? 'Sign In' : 'Create Account'}
                </button>
              </p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] text-slate-400">
              <LockKeyhole className="h-3.5 w-3.5" />
              Authentication secured by Firebase
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
