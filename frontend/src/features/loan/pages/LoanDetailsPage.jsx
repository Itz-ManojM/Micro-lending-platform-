import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLoanById } from "../../../api/loanApi";
import EmptyState from "../../../components/common/EmptyState";
import Loader from "../../../components/common/Loader";
import PageHeader from "../../../components/common/PageHeader";
import StatusBadge from "../../../components/common/StatusBadge";
import formatCurrency from "../../../utils/formatCurrency";
import formatDate from "../../../utils/formatDate";

export default function LoanDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const response = await getLoanById(id);
        setLoan(response);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Failed to load loan details");
      } finally {
        setLoading(false);
      }
    };

    fetchLoan();
  }, [id]);

  return (
    <div>
      <PageHeader
        eyebrow="Loan"
        title={loan ? `${loan.customerName || `Customer #${loan.customerProfileId}`} Loan` : `Loan Details #${id}`}
        subtitle="Inspect the full decision summary and move directly into EMI schedule review."
        action={
          <button
            type="button"
            onClick={() => navigate(`/loans/${id}/emi-schedule`)}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            EMI Schedule
          </button>
        }
      />

      {loading && <Loader label="Loading loan details..." />}

      {!loading && errorMessage && (
        <EmptyState
          title="Loan not available"
          message={errorMessage}
          actionLabel="Back to Loans"
          onAction={() => navigate("/loans")}
        />
      )}

      {!loading && !errorMessage && loan && (
        <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex flex-wrap gap-3">
              <StatusBadge value={loan.status} />
              <StatusBadge value={loan.riskLevel} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">Customer</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {loan.customerName || `Customer #${loan.customerProfileId}`}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">Loan Amount</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(loan.loanAmount)}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">Tenure</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {loan.tenureMonths} months
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">Purpose</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {loan.loanPurpose}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 md:col-span-2">
                <p className="text-xs uppercase tracking-wide text-slate-500">Applied On</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {formatDate(loan.applicationDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Quick Actions
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate(`/customers/${loan.customerProfileId}`)}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-left text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                View {loan.customerName || `Customer #${loan.customerProfileId}`}
              </button>

              <button
                type="button"
                onClick={() => navigate(`/loans/${id}/emi-schedule`)}
                className="rounded-2xl bg-teal-700 px-5 py-3 text-left text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Open EMI Schedule
              </button>

              <button
                type="button"
                onClick={() => navigate("/loans")}
                className="rounded-2xl bg-amber-500 px-5 py-3 text-left text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
              >
                Back To Loans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
