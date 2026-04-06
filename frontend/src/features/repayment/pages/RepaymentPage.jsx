import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getEmiScheduleByLoanId } from "../../../api/emiApi";
import { getAllLoans } from "../../../api/loanApi";
import { createRepayment, getRepaymentsByEmiId } from "../../../api/repaymentApi";
import EmptyState from "../../../components/common/EmptyState";
import Loader from "../../../components/common/Loader";
import PageHeader from "../../../components/common/PageHeader";
import StatusBadge from "../../../components/common/StatusBadge";
import formatCurrency from "../../../utils/formatCurrency";
import formatDate from "../../../utils/formatDate";

export default function RepaymentPage() {
  const [searchParams] = useSearchParams();
  const [loans, setLoans] = useState([]);
  const [loanId, setLoanId] = useState(searchParams.get("loanId") || "");
  const [selectedEmiId, setSelectedEmiId] = useState(searchParams.get("emiId") || "");
  const [schedule, setSchedule] = useState([]);
  const [history, setHistory] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [amountPaid, setAmountPaid] = useState("");
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchLoans = async () => {
      setLoadingLoans(true);
      try {
        const response = await getAllLoans();
        setLoans(response);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Failed to load loans for repayment");
      } finally {
        setLoadingLoans(false);
      }
    };

    fetchLoans();
  }, []);

  useEffect(() => {
    if (!loanId) {
      setSchedule([]);
      setSelectedEmiId("");
      setHistory([]);
      return;
    }

    const fetchSchedule = async () => {
      setLoadingSchedule(true);
      setErrorMessage("");

      try {
        const response = await getEmiScheduleByLoanId(loanId);
        setSchedule(response);

        if (response.length > 0) {
          const queryEmiId = searchParams.get("emiId");
          const preferredId = queryEmiId || response[0].id;
          setSelectedEmiId(String(preferredId));
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Failed to load EMI schedule");
        setSchedule([]);
      } finally {
        setLoadingSchedule(false);
      }
    };

    fetchSchedule();
  }, [loanId, searchParams]);

  useEffect(() => {
    if (!selectedEmiId) {
      setHistory([]);
      setAmountPaid("");
      return;
    }

    const selected = schedule.find((item) => String(item.id) === String(selectedEmiId));
    if (selected) {
      setAmountPaid(String(selected.totalAmount));
    }

    const fetchHistory = async () => {
      try {
        const response = await getRepaymentsByEmiId(selectedEmiId);
        setHistory(response);
      } catch (error) {
        setHistory([]);
      }
    };

    fetchHistory();
  }, [selectedEmiId, schedule]);

  const selectedLoan = useMemo(
    () => loans.find((loan) => String(loan.applicationId) === String(loanId)),
    [loans, loanId]
  );

  const selectedEmi = useMemo(
    () => schedule.find((item) => String(item.id) === String(selectedEmiId)),
    [schedule, selectedEmiId]
  );

  const handleRepayment = async (event) => {
    event.preventDefault();

    if (!selectedEmiId) {
      setErrorMessage("Please choose an EMI before recording repayment.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createRepayment({
        emiScheduleId: Number(selectedEmiId),
        amountPaid: Number(amountPaid),
        paymentMethod,
      });

      setSuccessMessage("Repayment recorded successfully.");
      const [updatedSchedule, updatedHistory] = await Promise.all([
        getEmiScheduleByLoanId(loanId),
        getRepaymentsByEmiId(selectedEmiId),
      ]);
      setSchedule(updatedSchedule);
      setHistory(updatedHistory);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to record repayment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Repayment Desk"
        subtitle="Select a loan, choose an EMI installment, and record repayments with immediate schedule refresh."
      />

      {loadingLoans && <Loader label="Loading loans for repayment..." />}

      {!loadingLoans && (
        <div className="space-y-5">
          <div className="rounded-3xl bg-white p-6 shadow-xl">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Loan</label>
                <select
                  value={loanId}
                  onChange={(event) => setLoanId(event.target.value)}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500"
                >
                  <option value="">Select loan</option>
                  {loans.map((loan) => (
                    <option key={loan.applicationId} value={loan.applicationId}>
                      Loan #{loan.applicationId} - {loan.customerName || `Customer #${loan.customerProfileId}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">EMI Installment</label>
                <select
                  value={selectedEmiId}
                  onChange={(event) => setSelectedEmiId(event.target.value)}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500"
                  disabled={!loanId || schedule.length === 0}
                >
                  <option value="">Select EMI</option>
                  {schedule.map((item) => (
                    <option key={item.id} value={item.id}>
                      EMI #{item.installmentNumber} - {formatCurrency(item.totalAmount)} - {item.status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedLoan && (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Customer</p>
                  <p className="mt-1 font-semibold text-slate-900">{selectedLoan.customerName || `Customer #${selectedLoan.customerProfileId}`}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Loan Amount</p>
                  <p className="mt-1 font-semibold text-slate-900">{formatCurrency(selectedLoan.loanAmount)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
                  <div className="mt-1"><StatusBadge value={selectedLoan.status} /></div>
                </div>
              </div>
            )}
          </div>

          {loadingSchedule && <Loader label="Loading EMI schedule..." />}

          {errorMessage && (
            <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{errorMessage}</div>
          )}

          {successMessage && (
            <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{successMessage}</div>
          )}

          {loanId && !loadingSchedule && schedule.length === 0 && (
            <EmptyState
              title="No EMI schedule found"
              message="Generate the EMI schedule from the loan page before recording repayments."
            />
          )}

          {selectedEmi && (
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl bg-white p-6 shadow-xl">
                <h3 className="text-lg font-bold text-slate-900">Record Repayment</h3>
                <p className="mt-1 text-sm text-slate-600">
                  EMI #{selectedEmi.installmentNumber} due on {formatDate(selectedEmi.dueDate)}
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
                    <div className="mt-1"><StatusBadge value={selectedEmi.status} /></div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">EMI Amount</p>
                    <p className="mt-1 font-semibold text-slate-900">{formatCurrency(selectedEmi.totalAmount)}</p>
                  </div>
                </div>

                <form className="mt-5 space-y-4" onSubmit={handleRepayment}>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Amount Paid</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={amountPaid}
                      onChange={(event) => setAmountPaid(event.target.value)}
                      className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                      className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500"
                    >
                      <option value="UPI">UPI</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="CASH">Cash</option>
                      <option value="CARD">Card</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
                  >
                    {submitting ? "Saving..." : "Record Repayment"}
                  </button>
                </form>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-xl">
                <h3 className="text-lg font-bold text-slate-900">Repayment History</h3>
                {history.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-600">No repayments recorded for this EMI yet.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {history.map((item) => (
                      <div key={item.repaymentId} className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="font-semibold text-slate-900">{formatCurrency(item.amountPaid)}</p>
                          <StatusBadge value={item.status} />
                        </div>
                        <p className="mt-2 text-sm text-slate-600">Paid on {formatDate(item.paymentDate)}</p>
                        <p className="text-sm text-slate-600">Method: {item.paymentMethod}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
