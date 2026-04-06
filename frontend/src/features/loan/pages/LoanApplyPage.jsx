import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllCustomerProfiles } from "../../../api/customerApi";
import { applyForLoan } from "../../../api/loanApi";
import EmptyState from "../../../components/common/EmptyState";
import Loader from "../../../components/common/Loader";
import PageHeader from "../../../components/common/PageHeader";
import StatusBadge from "../../../components/common/StatusBadge";
import NumberInput from "../../../components/forms/NumberInput";
import TextInput from "../../../components/forms/TextInput";
import formatCurrency from "../../../utils/formatCurrency";

const initialForm = {
  customerProfileId: "",
  loanAmount: "",
  tenureMonths: "",
  loanPurpose: "",
};

export default function LoanApplyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(initialForm);
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customerLoadError, setCustomerLoadError] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const customerId = searchParams.get("customerId");

    if (customerId) {
      setForm((prev) => ({
        ...prev,
        customerProfileId: customerId,
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCustomers = async () => {
      setCustomersLoading(true);
      setCustomerLoadError("");

      try {
        const response = await getAllCustomerProfiles();
        setCustomers(response);
      } catch (error) {
        setCustomerLoadError(error.response?.data?.message || "Failed to load customers");
      } finally {
        setCustomersLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const selectedCustomer = useMemo(
    () => customers.find((customer) => String(customer.id) === String(form.customerProfileId)),
    [customers, form.customerProfileId]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setFieldErrors({});
    setResult(null);

    try {
      const response = await applyForLoan({
        customerProfileId: Number(form.customerProfileId),
        loanAmount: Number(form.loanAmount),
        tenureMonths: Number(form.tenureMonths),
        loanPurpose: form.loanPurpose,
      });

      setResult(response);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to apply for loan");
      setFieldErrors(error.response?.data?.validationErrors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Loan"
        title="Apply For A Loan"
        subtitle="Choose a real customer profile, enter the loan request, and let the backend calculate the risk and status automatically."
      />

      {customersLoading && <Loader label="Loading customers for loan application..." />}

      {!customersLoading && customerLoadError && (
        <div className="mb-6 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
          {customerLoadError}
        </div>
      )}

      {!customersLoading && customers.length === 0 ? (
        <EmptyState
          title="No customers available yet"
          message="Create at least one customer profile before applying for a loan."
          actionLabel="Create Customer"
          onAction={() => navigate("/customers/new")}
        />
      ) : (
        <div className="space-y-5">
          <div className="rounded-3xl bg-white p-6 shadow-xl">
            <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="customerProfileId" className="text-sm font-semibold text-slate-700">
                  Customer
                </label>
                <select
                  id="customerProfileId"
                  name="customerProfileId"
                  value={form.customerProfileId}
                  onChange={handleChange}
                  className={`rounded-2xl border px-4 py-3 text-slate-900 outline-none transition ${
                    fieldErrors.customerProfileId
                      ? "border-rose-400 bg-rose-50 focus:border-rose-500"
                      : "border-slate-300 bg-white focus:border-teal-500"
                  }`}
                  required
                >
                  <option value="">Select customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.fullName} (ID: {customer.id})
                    </option>
                  ))}
                </select>
                {fieldErrors.customerProfileId && (
                  <p className="text-sm text-rose-600">{fieldErrors.customerProfileId}</p>
                )}
              </div>

              <NumberInput
                label="Loan Amount"
                name="loanAmount"
                value={form.loanAmount}
                onChange={handleChange}
                placeholder="Enter loan amount"
                error={fieldErrors.loanAmount}
                min={1}
                required
              />

              <NumberInput
                label="Tenure (Months)"
                name="tenureMonths"
                value={form.tenureMonths}
                onChange={handleChange}
                placeholder="Enter loan tenure"
                error={fieldErrors.tenureMonths}
                min={1}
                required
              />

              <TextInput
                label="Loan Purpose"
                name="loanPurpose"
                value={form.loanPurpose}
                onChange={handleChange}
                placeholder="Bike purchase / education / laptop"
                error={fieldErrors.loanPurpose}
                required
              />

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Apply Loan"}
                </button>
              </div>
            </form>

            {selectedCustomer && (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Customer Name</p>
                  <p className="mt-1 font-semibold text-slate-900">{selectedCustomer.fullName}</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-emerald-700">Monthly Income</p>
                  <p className="mt-1 font-semibold text-emerald-900">
                    {formatCurrency(selectedCustomer.monthlyIncome)}
                  </p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-amber-700">Existing EMI</p>
                  <p className="mt-1 font-semibold text-amber-900">
                    {formatCurrency(selectedCustomer.existingEmiAmount)}
                  </p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
                {errorMessage}
              </div>
            )}

            {result && (
              <div className="mt-6 rounded-2xl bg-sky-50 p-5 text-slate-900">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <p className="font-semibold">
                    Loan processed successfully for {result.customerName || `Customer #${result.customerProfileId}` }.
                  </p>
                  <StatusBadge value={result.status} />
                  <StatusBadge value={result.riskLevel} />
                </div>

                <div className="mb-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/loans/${result.applicationId}`)}
                    className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Open Loan Details
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/loans/${result.applicationId}/emi-schedule`)}
                    className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
                  >
                    Open EMI Schedule
                  </button>
                </div>

                <pre className="overflow-auto rounded-xl bg-white p-4 text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
