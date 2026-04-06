import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthProvider";

function getLinkClasses(isActive) {
  return [
    "rounded-full px-4 py-2 text-sm font-semibold transition",
    isActive
      ? "bg-white text-slate-900 shadow"
      : "text-slate-100 hover:bg-white/15 hover:text-white",
  ].join(" ");
}

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const isDashboardActive = pathname === "/dashboard";
  const isCustomersActive = pathname === "/customers";
  const isCreateCustomerActive =
    pathname === "/customers/new" || pathname.startsWith("/customers/");
  const isApplyLoanActive = pathname === "/loans/apply";
  const isViewLoansActive =
    pathname === "/loans" ||
    (pathname.startsWith("/loans/") && !pathname.startsWith("/loans/apply"));
  const isManualReviewActive = pathname.startsWith("/admin/manual-review");
  const isRepaymentActive = pathname.startsWith("/repayments");
  const isPenaltyActive = pathname.startsWith("/penalties");
  const roleLabel = user?.role === "ADMIN" ? "Finance Staff" : (user?.role || "Finance Staff");

  const handleLogout = () => {
    logout();
    navigate("/staff/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-gradient-to-r from-slate-950 via-teal-900 to-amber-700 text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
              Lending Suite
            </p>
            <h1 className="text-2xl font-bold">Micro Lending Platform</h1>
            <p className="mt-1 text-sm text-slate-200">Internal finance officer workspace</p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
              <p className="font-semibold text-white">{user?.fullName || "Staff Member"}</p>
              <p className="text-xs uppercase tracking-wide text-slate-200">{roleLabel}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Sign Out
            </button>
          </div>
        </div>

        <nav className="flex flex-wrap gap-3">
          <Link to="/dashboard" className={getLinkClasses(isDashboardActive)}>
            Dashboard
          </Link>
          <Link to="/customers" className={getLinkClasses(isCustomersActive)}>
            Customers
          </Link>
          <Link to="/customers/new" className={getLinkClasses(isCreateCustomerActive)}>
            Create Customer
          </Link>
          <Link to="/loans/apply" className={getLinkClasses(isApplyLoanActive)}>
            Apply Loan
          </Link>
          <Link to="/loans" className={getLinkClasses(isViewLoansActive)}>
            View Loans
          </Link>
          <Link to="/admin/manual-review" className={getLinkClasses(isManualReviewActive)}>
            Manual Review
          </Link>
          <Link to="/repayments" className={getLinkClasses(isRepaymentActive)}>
            Repayments
          </Link>
          <Link to="/penalties" className={getLinkClasses(isPenaltyActive)}>
            Penalties
          </Link>
        </nav>
      </div>
    </header>
  );
}
