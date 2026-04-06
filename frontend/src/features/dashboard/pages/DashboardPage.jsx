import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getManualReviewLoans } from "../../../api/adminApi";
import { getAllCustomerProfiles } from "../../../api/customerApi";
import { getAllLoans } from "../../../api/loanApi";
import EmptyState from "../../../components/common/EmptyState";
import Loader from "../../../components/common/Loader";
import PageHeader from "../../../components/common/PageHeader";
import StatusBadge from "../../../components/common/StatusBadge";
import formatCurrency from "../../../utils/formatCurrency";
import formatDate from "../../../utils/formatDate";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [manualReviewLoans, setManualReviewLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const [customerResponse, loanResponse, manualReviewResponse] = await Promise.all([
          getAllCustomerProfiles(),
          getAllLoans(),
          getManualReviewLoans(),
        ]);

        setCustomers(customerResponse);
        setLoans(loanResponse);
        setManualReviewLoans(manualReviewResponse);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const summary = useMemo(() => {
    const approved = loans.filter((loan) => loan.status === "APPROVED").length;
    const rejected = loans.filter((loan) => loan.status === "REJECTED").length;
    const manualReview = loans.filter((loan) => loan.status === "MANUAL_REVIEW").length;

    return {
      customers: customers.length,
      loans: loans.length,
      approved,
      rejected,
      manualReview,
    };
  }, [customers, loans]);

  const recentCustomers = useMemo(
    () => [...customers].sort((a, b) => b.id - a.id).slice(0, 5),
    [customers]
  );

  const recentLoans = useMemo(
    () => [...loans].sort((a, b) => b.applicationId - a.applicationId).slice(0, 5),
    [loans]
  );

  return (
    <div>
      <PageHeader
        eyebrow="Dashboard"
        title="Officer Control Center"
        subtitle="Track customers, loans, manual reviews, and recent activity from one internal operations screen."
        action={
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/customers/new")}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              New Customer
            </button>
            <button
              type="button"
              onClick={() => navigate("/loans/apply")}
              className="rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
            >
              New Loan
            </button>
          </div>
        }
      />

      {loading && <Loader label="Loading officer dashboard..." />}

      {!loading && errorMessage && (
        <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{errorMessage}</div>
      )}

      {!loading && !errorMessage && (
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-3xl bg-white p-5 shadow-xl">
              <p className="text-xs uppercase tracking-wide text-slate-500">Customers</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{summary.customers}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-xl">
              <p className="text-xs uppercase tracking-wide text-slate-500">Loans</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{summary.loans}</p>
            </div>
            <div className="rounded-3xl bg-emerald-50 p-5 shadow-xl">
              <p className="text-xs uppercase tracking-wide text-emerald-700">Approved</p>
              <p className="mt-3 text-3xl font-bold text-emerald-900">{summary.approved}</p>
            </div>
            <div className="rounded-3xl bg-amber-50 p-5 shadow-xl">
              <p className="text-xs uppercase tracking-wide text-amber-700">Manual Review</p>
              <p className="mt-3 text-3xl font-bold text-amber-900">{summary.manualReview}</p>
            </div>
            <div className="rounded-3xl bg-rose-50 p-5 shadow-xl">
              <p className="text-xs uppercase tracking-wide text-rose-700">Rejected</p>
              <p className="mt-3 text-3xl font-bold text-rose-900">{summary.rejected}</p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-900">Manual Review Queue</h3>
                <button
                  type="button"
                  onClick={() => navigate("/admin/manual-review")}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Open Queue
                </button>
              </div>

              {manualReviewLoans.length === 0 ? (
                <p className="mt-4 text-sm text-slate-600">No loans are waiting for manual review right now.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {manualReviewLoans.slice(0, 4).map((loan) => (
                    <div key={loan.applicationId} className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{loan.customerName || `Customer #${loan.customerProfileId}`}</p>
                          <p className="text-sm text-slate-600">{loan.loanPurpose}</p>
                        </div>
                        <StatusBadge value={loan.status} />
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{formatCurrency(loan.loanAmount)} • {loan.tenureMonths} months</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <button type="button" onClick={() => navigate("/customers")} className="rounded-2xl bg-slate-900 px-5 py-4 text-left text-sm font-semibold text-white transition hover:bg-slate-800">Open Customer Directory</button>
                <button type="button" onClick={() => navigate("/loans")} className="rounded-2xl bg-teal-700 px-5 py-4 text-left text-sm font-semibold text-white transition hover:bg-teal-800">Open Loan Portfolio</button>
                <button type="button" onClick={() => navigate("/repayments")} className="rounded-2xl bg-amber-500 px-5 py-4 text-left text-sm font-semibold text-slate-950 transition hover:bg-amber-400">Go To Repayments</button>
                <button type="button" onClick={() => navigate("/penalties")} className="rounded-2xl bg-rose-600 px-5 py-4 text-left text-sm font-semibold text-white transition hover:bg-rose-700">Open Penalty Console</button>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-900">Recent Customers</h3>
                <button
                  type="button"
                  onClick={() => navigate("/customers")}
                  className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-300"
                >
                  View All
                </button>
              </div>

              {recentCustomers.length === 0 ? (
                <p className="mt-4 text-sm text-slate-600">No customer records available yet.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {recentCustomers.map((customer) => (
                    <div key={customer.id} className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{customer.fullName || `Customer #${customer.id}`}</p>
                          <p className="text-sm text-slate-600">{customer.phoneNumber}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate(`/customers/${customer.id}`)}
                          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-900">Recent Loans</h3>
                <button
                  type="button"
                  onClick={() => navigate("/loans")}
                  className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-300"
                >
                  View All
                </button>
              </div>

              {recentLoans.length === 0 ? (
                <p className="mt-4 text-sm text-slate-600">No loan applications available yet.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {recentLoans.map((loan) => (
                    <div key={loan.applicationId} className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{loan.customerName || `Customer #${loan.customerProfileId}`}</p>
                          <p className="text-sm text-slate-600">{formatCurrency(loan.loanAmount)} • {formatDate(loan.applicationDate)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge value={loan.status} />
                          <button
                            type="button"
                            onClick={() => navigate(`/loans/${loan.applicationId}`)}
                            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                          >
                            Open
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {!loading && !errorMessage && customers.length === 0 && loans.length === 0 && (
            <EmptyState
              title="System is ready for first use"
              message="Create a customer profile and submit the first loan to start the internal workflow."
              actionLabel="Create Customer"
              onAction={() => navigate("/customers/new")}
            />
          )}
        </div>
      )}
    </div>
  );
}
