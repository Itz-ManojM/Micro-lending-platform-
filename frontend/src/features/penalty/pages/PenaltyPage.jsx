import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getEmiScheduleByLoanId } from "../../../api/emiApi";
import { getAllLoans } from "../../../api/loanApi";
import { getPenaltiesByEmiId, processOverduePenalties } from "../../../api/penaltyApi";
import EmptyState from "../../../components/common/EmptyState";
import Loader from "../../../components/common/Loader";
import PageHeader from "../../../components/common/PageHeader";
import StatusBadge from "../../../components/common/StatusBadge";
import formatCurrency from "../../../utils/formatCurrency";
import formatDate from "../../../utils/formatDate";

export default function PenaltyPage() {
  const [searchParams] = useSearchParams();
  const [loans, setLoans] = useState([]);
  const [loanId, setLoanId] = useState(searchParams.get("loanId") || "");
  const [selectedEmiId, setSelectedEmiId] = useState(searchParams.get("emiId") || "");
  const [schedule, setSchedule] = useState([]);
  const [penalties, setPenalties] = useState([]);
  const [processedPenalties, setProcessedPenalties] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchLoans = async () => {
      setLoadingLoans(true);
      try {
        const response = await getAllLoans();
        setLoans(response);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Failed to load loans for penalties");
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
      setPenalties([]);
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
      setPenalties([]);
      return;
    }

    const fetchPenalties = async () => {
      try {
        const response = await getPenaltiesByEmiId(selectedEmiId);
        setPenalties(response);
      } catch (error) {
        setPenalties([]);
      }
    };

    fetchPenalties();
  }, [selectedEmiId]);

  const selectedLoan = useMemo(
    () => loans.find((loan) => String(loan.applicationId) === String(loanId)),
    [loans, loanId]
  );

  const selectedEmi = useMemo(
    () => schedule.find((item) => String(item.id) === String(selectedEmiId)),
    [schedule, selectedEmiId]
  );

  const handleProcessOverdue = async () => {
    setProcessing(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await processOverduePenalties();
      setProcessedPenalties(response);
      setSuccessMessage(
        response.length === 0
          ? "No new overdue penalties were generated."
          : `${response.length} penalty records generated successfully.`
      );

      if (selectedEmiId) {
        const penaltyResponse = await getPenaltiesByEmiId(selectedEmiId);
        setPenalties(penaltyResponse);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to process overdue penalties");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Penalty Console"
        subtitle="Process overdue EMI penalties and inspect penalty history for any installment."
        action={
          <button
            type="button"
            onClick={handleProcessOverdue}
            disabled={processing}
            className="rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:opacity-60"
          >
            {processing ? "Processing..." : "Process Overdue Penalties"}
          </button>
        }
      />

      {loadingLoans && <Loader label="Loading loans for penalty lookup..." />}

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
                  <p className="text-xs uppercase tracking-wide text-slate-500">Loan Status</p>
                  <div className="mt-1"><StatusBadge value={selectedLoan.status} /></div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Loan Amount</p>
                  <p className="mt-1 font-semibold text-slate-900">{formatCurrency(selectedLoan.loanAmount)}</p>
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

          {processedPenalties.length > 0 && (
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900">Recently Generated Penalties</h3>
              <div className="mt-4 grid gap-3">
                {processedPenalties.map((item) => (
                  <div key={item.penaltyId} className="rounded-2xl bg-amber-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold text-amber-900">EMI #{item.emiScheduleId}</p>
                      <StatusBadge value={item.status} />
                    </div>
                    <p className="mt-1 text-sm text-amber-900">{formatCurrency(item.penaltyAmount)} applied on {formatDate(item.appliedDate)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedEmi && (
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl bg-white p-6 shadow-xl">
                <h3 className="text-lg font-bold text-slate-900">Selected EMI</h3>
                <div className="mt-4 space-y-4 text-sm text-slate-700">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Installment</p>
                    <p className="mt-1 font-semibold text-slate-900">EMI #{selectedEmi.installmentNumber}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Due Date</p>
                    <p className="mt-1 font-semibold text-slate-900">{formatDate(selectedEmi.dueDate)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">EMI Amount</p>
                    <p className="mt-1 font-semibold text-slate-900">{formatCurrency(selectedEmi.totalAmount)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
                    <div className="mt-1"><StatusBadge value={selectedEmi.status} /></div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-xl">
                <h3 className="text-lg font-bold text-slate-900">Penalty History</h3>
                {penalties.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-600">No penalties recorded for this EMI yet.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {penalties.map((item) => (
                      <div key={item.penaltyId} className="rounded-2xl bg-amber-50 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="font-semibold text-amber-900">{formatCurrency(item.penaltyAmount)}</p>
                          <StatusBadge value={item.status} />
                        </div>
                        <p className="mt-2 text-sm text-amber-900">Applied on {formatDate(item.appliedDate)}</p>
                        <p className="text-sm text-amber-900">Reason: {item.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {!loanId && !loadingLoans && (
            <EmptyState
              title="Select a loan to inspect penalties"
              message="Choose a loan and EMI installment, or use the process button to generate overdue penalties globally."
            />
          )}
        </div>
      )}
    </div>
  );
}
