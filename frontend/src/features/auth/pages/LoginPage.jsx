import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const initialForm = {
  email: "staff@microfinance.local",
  password: "Staff@123",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const redirectTo = location.state?.from || "/dashboard";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to sign in to the staff portal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.2),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-teal-900 to-amber-700 p-8 text-white shadow-2xl lg:p-12">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-200">
            Staff Access
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight lg:text-5xl">
            Secure finance officer workspace
          </h1>
          <p className="mt-5 max-w-2xl text-base text-slate-100 lg:text-lg">
            Review applications, approve loans, manage EMIs, record repayments, and process penalties in one protected operations console.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm font-semibold">Review queue</p>
              <p className="mt-2 text-sm text-slate-200">Manual-review cases stay restricted to signed-in staff.</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm font-semibold">Protected actions</p>
              <p className="mt-2 text-sm text-slate-200">Repayment, approval, and penalty flows require a valid token.</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm font-semibold">Default staff account</p>
              <p className="mt-2 text-sm text-slate-200">A seeded officer login is ready so you can test immediately.</p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-8 shadow-2xl lg:p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-teal-700">Officer Login</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Sign in to continue</h2>
            <p className="mt-3 text-sm text-slate-600">
              Use your staff credentials to open the secured finance operations portal.
            </p>
          </div>

          <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                Staff Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter staff email"
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500"
                required
              />
            </div>

            {errorMessage && (
              <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 rounded-3xl border border-dashed border-amber-300 bg-amber-50 p-5 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Seeded test credentials</p>
            <p className="mt-2">Email: <span className="font-mono">staff@microfinance.local</span></p>
            <p className="mt-1">Password: <span className="font-mono">Staff@123</span></p>
          </div>
        </section>
      </div>
    </div>
  );
}
