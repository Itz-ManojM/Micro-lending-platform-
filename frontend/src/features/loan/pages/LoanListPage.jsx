import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLoans } from "../../../api/loanApi";
import EmptyState from "../../../components/common/EmptyState";
import Loader from "../../../components/common/Loader";
import PageHeader from "../../../components/common/PageHeader";
import StatusBadge from "../../../components/common/StatusBadge";
import formatCurrency from "../../../utils/formatCurrency";
import formatDate from "../../../utils/formatDate";

export default function LoanListPage() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await getAllLoans();
        setLoans(response);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Failed to load loans");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const filteredLoans = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return loans.filter((loan) => {
      const matchesSearch =
        !normalizedSearch ||
        String(loan.applicationId).includes(normalizedSearch) ||
        loan.customerName?.toLowerCase().includes(normalizedSearch) ||
        loan.loanPurpose?.toLowerCase().includes(normalizedSearch);

      const matchesStatus = statusFilter === "ALL" || loan.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [loans, searchTerm, statusFilter]);

  return (
    <div>
      <PageHeader
        eyebrow="Portfolio"
        title="Loan Applications"
        subtitle="Review approved, rejected, and manual-review applications with customer names, not just IDs."
        action={
          <button
            type="button"
            onClick={() => navigate("/loans/apply")}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            New Loan
          </button>
        }
      />

      {loading && <Loader label="Fetching loan applications..." />}

      {!loading && errorMessage && (
        <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
          {errorMessage}
        </div>
      )}

      {!loading && !errorMessage && (
        <div className="mb-5 grid gap-4 rounded-3xl bg-white p-5 shadow-xl md:grid-cols-[1.4fr_0.8fr_0.6fr]">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by loan ID, customer, or purpose"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Status</label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500"
            >
              <option value="ALL">All</option>
              <option value="APPROVED">APPROVED</option>
              <option value="MANUAL_REVIEW">MANUAL_REVIEW</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Visible Loans</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{filteredLoans.length}</p>
          </div>
        </div>
      )}

      {!loading && !errorMessage && loans.length === 0 && (
        <EmptyState
          title="No loans found"
          message="Create a customer and submit a loan application to populate this dashboard."
          actionLabel="Apply Loan"
          onAction={() => navigate("/loans/apply")}
        />
      )}

      {!loading && !errorMessage && loans.length > 0 && filteredLoans.length === 0 && (
        <EmptyState
          title="No loans match the current filters"
          message="Adjust the search text or selected status to find the application you need."
        />
      )}

      {!loading && !errorMessage && filteredLoans.length > 0 && (
        <div className="grid gap-5">
          {filteredLoans.map((loan) => (
            <div
              key={loan.applicationId}
              className="rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                    Loan #{loan.applicationId}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    {formatCurrency(loan.loanAmount)}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {loan.customerName || `Customer #${loan.customerProfileId}`}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge value={loan.status} />
                  <StatusBadge value={loan.riskLevel} />
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm text-slate-700 md:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Customer</p>
                  <p className="mt-1 font-semibold">{loan.customerName || `Customer #${loan.customerProfileId}`}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Purpose</p>
                  <p className="mt-1 font-semibold">{loan.loanPurpose}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Tenure</p>
                  <p className="mt-1 font-semibold">{loan.tenureMonths} months</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Applied On</p>
                  <p className="mt-1 font-semibold">{formatDate(loan.applicationDate)}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/loans/${loan.applicationId}`)}
                  className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  View Details
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/customers/${loan.customerProfileId}`)}
                  className="rounded-full bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-300"
                >
                  View Customer
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/loans/${loan.applicationId}/emi-schedule`)}
                  className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
                >
                  EMI Schedule
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
