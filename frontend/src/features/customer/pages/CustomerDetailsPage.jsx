import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCustomerProfileById } from "../../../api/customerApi";
import EmptyState from "../../../components/common/EmptyState";
import Loader from "../../../components/common/Loader";
import PageHeader from "../../../components/common/PageHeader";
import formatCurrency from "../../../utils/formatCurrency";

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await getCustomerProfileById(id);
        setCustomer(response);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Failed to load customer details");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  return (
    <div>
      <PageHeader
        eyebrow="Customer"
        title={customer ? customer.fullName : `Customer Details #${id}`}
        subtitle="Review the customer profile before creating or evaluating a loan application."
        action={
          <button
            type="button"
            onClick={() => navigate(`/loans/apply?customerId=${id}`)}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Apply Loan
          </button>
        }
      />

      {loading && <Loader label="Loading customer details..." />}

      {!loading && errorMessage && (
        <EmptyState
          title="Customer not available"
          message={errorMessage}
          actionLabel="Create Customer"
          onAction={() => navigate("/customers/new")}
        />
      )}

      {!loading && !errorMessage && customer && (
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-xl">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Identity
            </p>
            <div className="mt-5 space-y-4 text-sm text-slate-700">
              <div>
                <p className="text-slate-500">Full Name</p>
                <p className="text-2xl font-bold text-slate-900">{customer.fullName}</p>
              </div>
              <div>
                <p className="text-slate-500">Customer ID</p>
                <p className="font-semibold text-slate-900">{customer.id}</p>
              </div>
              <div>
                <p className="text-slate-500">Phone Number</p>
                <p className="font-semibold text-slate-900">{customer.phoneNumber}</p>
              </div>
              <div>
                <p className="text-slate-500">Address</p>
                <p className="font-semibold text-slate-900">{customer.address}</p>
              </div>
              <div>
                <p className="text-slate-500">Employment Type</p>
                <p className="font-semibold text-slate-900">{customer.employmentType}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Financial Snapshot
            </p>
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl bg-emerald-50 p-5">
                <p className="text-xs uppercase tracking-wide text-emerald-700">
                  Monthly Income
                </p>
                <p className="mt-2 text-2xl font-bold text-emerald-900">
                  {formatCurrency(customer.monthlyIncome)}
                </p>
              </div>

              <div className="rounded-2xl bg-amber-50 p-5">
                <p className="text-xs uppercase tracking-wide text-amber-700">
                  Existing EMI Amount
                </p>
                <p className="mt-2 text-2xl font-bold text-amber-900">
                  {formatCurrency(customer.existingEmiAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
