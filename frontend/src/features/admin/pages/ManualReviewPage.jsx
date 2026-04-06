import { useEffect, useMemo, useState } from "react";
import { approveLoan, getManualReviewLoans, rejectLoan } from "../../../api/adminApi";
import EmptyState from "../../../components/common/EmptyState";
import Loader from "../../../components/common/Loader";
import PageHeader from "../../../components/common/PageHeader";
import StatusBadge from "../../../components/common/StatusBadge";
import formatCurrency from "../../../utils/formatCurrency";
import formatDate from "../../../utils/formatDate";

export default function ManualReviewPage() {
  const [loans, setLoans] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadManualReviewLoans = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await getManualReviewLoans();
      setLoans(response);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to load manual review loans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManualReviewLoans();
  }, []);

  const pendingCount = useMemo(() => loans.length, [loans]);

  const handleDecision = async (loanId, action) => {
    const remarksValue = remarks[loanId]?.trim();

    if (!remarksValue) {
      setErrorMessage("Please enter remarks before approving or rejecting a loan.");
      return;
    }

    setSubmittingId(loanId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (action === "approve") {
        await approveLoan(loanId, { remarks: remarksValue });
        setSuccessMessage(`Loan #${loanId} approved successfully.`);
      } else {
        await rejectLoan(loanId, { remarks: remarksValue });
        setSuccessMessage(`Loan #${loanId} rejected successfully.`);
      }

      setLoans((prev) => prev.filter((loan) => loan.applicationId !== loanId));
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to update loan decision");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Manual Review Queue"
        subtitle="Review medium-risk loans, add officer remarks, and approve or reject them from one place."
      />

      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-5 shadow-xl">
          <p className="text-xs uppercase tracking-wide text-slate-500">Pending Reviews</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{pendingCount}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-xl">
          <p className="text-xs uppercase tracking-wide text-slate-500">Review Rule</p>
          <p className="mt-3 text-sm font-semibold text-slate-900">Only MANUAL_REVIEW loans can be actioned here.</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-xl">
          <button
            type="button"
            onClick={loadManualReviewLoans}
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Refresh Queue
          </button>
        </div>
      </div>

      {loading && <Loader label="Loading manual review queue..." />}

      {!loading && errorMessage && (
        <div className="mb-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{errorMessage}</div>
      )}

      {!loading && successMessage && (
        <div className="mb-5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{successMessage}</div>
      )}

      {!loading && !errorMessage && loans.length === 0 ? (
        <EmptyState
          title="Manual review queue is clear"
          message="There are no manual-review loans waiting for an officer decision right now."
        />
      ) : null}

      {!loading && loans.length > 0 && (
        <div className="grid gap-5">
          {loans.map((loan) => (
            <div key={loan.applicationId} className="rounded-3xl bg-white p-6 shadow-xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                    Application #{loan.applicationId}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    {loan.customerName || `Customer #${loan.customerProfileId}`}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{loan.loanPurpose}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge value={loan.status} />
                  <StatusBadge value={loan.riskLevel} />
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Loan Amount</p>
                  <p className="mt-1 font-semibold text-slate-900">{formatCurrency(loan.loanAmount)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Tenure</p>
                  <p className="mt-1 font-semibold text-slate-900">{loan.tenureMonths} months</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Applied On</p>
                  <p className="mt-1 font-semibold text-slate-900">{formatDate(loan.applicationDate)}</p>
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Officer Remarks
                </label>
                <textarea
                  rows="4"
                  value={remarks[loan.applicationId] || ""}
                  onChange={(event) =>
                    setRemarks((prev) => ({ ...prev, [loan.applicationId]: event.target.value }))
                  }
                  placeholder="Enter approval or rejection remarks"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500"
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={submittingId === loan.applicationId}
                  onClick={() => handleDecision(loan.applicationId, "approve")}
                  className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  {submittingId === loan.applicationId ? "Saving..." : "Approve Loan"}
                </button>

                <button
                  type="button"
                  disabled={submittingId === loan.applicationId}
                  onClick={() => handleDecision(loan.applicationId, "reject")}
                  className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
                >
                  {submittingId === loan.applicationId ? "Saving..." : "Reject Loan"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
