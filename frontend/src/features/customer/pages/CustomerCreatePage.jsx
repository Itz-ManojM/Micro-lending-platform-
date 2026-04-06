import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import NumberInput from "../../../components/forms/NumberInput";
import TextInput from "../../../components/forms/TextInput";
import { createCustomerProfile } from "../../../api/customerApi";

const initialForm = {
  fullName: "",
  phoneNumber: "",
  address: "",
  employmentType: "",
  monthlyIncome: "",
  existingEmiAmount: "",
};

export default function CustomerCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

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
      const response = await createCustomerProfile({
        ...form,
        monthlyIncome: Number(form.monthlyIncome),
        existingEmiAmount: Number(form.existingEmiAmount),
      });

      setResult(response);
      setForm(initialForm);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to create customer profile");
      setFieldErrors(error.response?.data?.validationErrors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Customer"
        title="Create Customer Profile"
        subtitle="Register the customer once with name, contact, income, and current obligations. Then the loan flow can use real customer records instead of manual IDs."
      />

      <div className="rounded-3xl bg-white p-6 shadow-xl">
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <TextInput
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter customer full name"
            error={fieldErrors.fullName}
            required
          />

          <TextInput
            label="Phone Number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="Enter phone number"
            error={fieldErrors.phoneNumber}
            required
          />

          <TextInput
            label="Employment Type"
            name="employmentType"
            value={form.employmentType}
            onChange={handleChange}
            placeholder="SALARIED / SELF_EMPLOYED"
            error={fieldErrors.employmentType}
            required
          />

          <TextInput
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter address"
            error={fieldErrors.address}
            required
          />

          <NumberInput
            label="Monthly Income"
            name="monthlyIncome"
            value={form.monthlyIncome}
            onChange={handleChange}
            placeholder="Enter monthly income"
            error={fieldErrors.monthlyIncome}
            min={0}
            required
          />

          <NumberInput
            label="Existing EMI Amount"
            name="existingEmiAmount"
            value={form.existingEmiAmount}
            onChange={handleChange}
            placeholder="Enter existing EMI amount"
            error={fieldErrors.existingEmiAmount}
            min={0}
            required
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Customer"}
            </button>
          </div>
        </form>

        {errorMessage && (
          <div className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
            {errorMessage}
          </div>
        )}

        {result && (
          <div className="mt-6 rounded-2xl bg-emerald-50 p-5 text-emerald-900">
            <p className="font-semibold">Customer profile created successfully for {result.fullName}.</p>
            <p className="mt-2 text-sm">Customer ID: {result.id}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate(`/customers/${result.id}`)}
                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                View Customer Details
              </button>

              <button
                type="button"
                onClick={() => navigate(`/loans/apply?customerId=${result.id}`)}
                className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Apply Loan For {result.fullName}
              </button>
            </div>
            <pre className="mt-3 overflow-auto rounded-xl bg-white p-4 text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
