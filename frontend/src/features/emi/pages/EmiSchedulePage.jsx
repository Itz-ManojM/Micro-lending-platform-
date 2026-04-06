import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { generateEmiSchedule, getEmiScheduleByLoanId } from "../../../api/emiApi";
import { getLoanById } from "../../../api/loanApi";
import EmptyState from "../../../components/common/EmptyState";
import Loader from "../../../components/common/Loader";
import PageHeader from "../../../components/common/PageHeader";
import StatusBadge from "../../../components/common/StatusBadge";
import formatCurrency from "../../../utils/formatCurrency";
import formatDate from "../../../utils/formatDate";

export default function EmiSchedulePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadData = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const [loanResponse, scheduleResponse] = await Promise.all([
        getLoanById(id),
        getEmiScheduleByLoanId(id),
      ]);

      setLoan(loanResponse);
      setSchedule(scheduleResponse);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to load EMI schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleGenerate = async () => {
    setGenerating(true);
    setErrorMessage("");

    try {
      const response = await generateEmiSchedule(id);
      setSchedule(response);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to generate EMI schedule");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="EMI"
        title={loan ? `${loan.customerName || `Customer #${loan.customerProfileId}`} EMI Schedule` : `EMI Schedule For Loan #${id}`}
        subtitle="Generate the repayment plan and review due dates, principal, interest, and remaining balance."
        action={
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate(`/loans/${id}`)}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Loan Details
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generating ? "Generating..." : "Generate Schedule"}
            </button>
          </div>
        }
      />

      {loading && <Loader label="Loading EMI schedule..." />}

      {!loading && errorMessage && (
        <EmptyState
          title="EMI data not available"
          message={errorMessage}
          actionLabel="Back to Loan"
          onAction={() => navigate(`/loans/${id}`)}
        />
      )}

      {!loading && !errorMessage && loan && (
        <div className="space-y-5">
          <div className="grid gap-5 md:grid-cols-4">
            <div className="rounded-3xl bg-white p-5 shadow-xl">
              <p className="text-xs uppercase tracking-wide text-slate-500">Customer</p>
              <p className="mt-3 text-lg font-semibold text-slate-900">
                {loan.customerName || `Customer #${loan.customerProfileId}`}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-xl">
              <p className="text-xs uppercase tracking-wide text-slate-500">Loan Status</p>
              <div className="mt-3">
                <StatusBadge value={loan.status} />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-xl">
              <p className="text-xs uppercase tracking-wide text-slate-500">Loan Amount</p>
              <p className="mt-3 text-xl font-bold text-slate-900">
                {formatCurrency(loan.loanAmount)}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-xl">
              <p className="text-xs uppercase tracking-wide text-slate-500">Tenure</p>
              <p className="mt-3 text-xl font-bold text-slate-900">
                {loan.tenureMonths} months
              </p>
            </div>
          </div>

          {schedule.length === 0 ? (
            <EmptyState
              title="No EMI schedule generated yet"
              message="Generate the schedule to see installment dates, total EMI, principal split, and remaining balance."
              actionLabel="Generate EMI Schedule"
              onAction={handleGenerate}
            />
          ) : (
            <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="px-4 py-4">Installment</th>
                      <th className="px-4 py-4">Due Date</th>
                      <th className="px-4 py-4">Total EMI</th>
                      <th className="px-4 py-4">Principal</th>
                      <th className="px-4 py-4">Interest</th>
                      <th className="px-4 py-4">Balance</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((item, index) => (
                      <tr
                        key={item.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <td className="px-4 py-4 font-semibold text-slate-900">
                          {item.installmentNumber}
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {formatDate(item.dueDate)}
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {formatCurrency(item.totalAmount)}
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {formatCurrency(item.principalAmount)}
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {formatCurrency(item.interestAmount)}
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {formatCurrency(item.remainingBalance)}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge value={item.status} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <Link
                              to={`/repayments?loanId=${id}&emiId=${item.id}`}
                              className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                            >
                              Repay
                            </Link>
                            <Link
                              to={`/penalties?loanId=${id}&emiId=${item.id}`}
                              className="rounded-full bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-amber-400"
                            >
                              Penalties
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
