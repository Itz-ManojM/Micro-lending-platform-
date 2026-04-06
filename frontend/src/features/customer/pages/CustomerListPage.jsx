import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCustomerProfiles } from "../../../api/customerApi";
import EmptyState from "../../../components/common/EmptyState";
import Loader from "../../../components/common/Loader";
import PageHeader from "../../../components/common/PageHeader";
import formatCurrency from "../../../utils/formatCurrency";

export default function CustomerListPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [employmentFilter, setEmploymentFilter] = useState("ALL");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getAllCustomerProfiles();
        setCustomers(response);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const employmentTypes = useMemo(
    () => [...new Set(customers.map((customer) => customer.employmentType).filter(Boolean))],
    [customers]
  );

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        !normalizedSearch ||
        customer.fullName?.toLowerCase().includes(normalizedSearch) ||
        customer.phoneNumber?.toLowerCase().includes(normalizedSearch) ||
        customer.address?.toLowerCase().includes(normalizedSearch);

      const matchesEmployment =
        employmentFilter === "ALL" || customer.employmentType === employmentFilter;

      return matchesSearch && matchesEmployment;
    });
  }, [customers, searchTerm, employmentFilter]);

  return (
    <div>
      <PageHeader
        eyebrow="Customer"
        title="Customer Directory"
        subtitle="View all registered customer profiles, income details, and jump directly into loan processing."
        action={
          <button
            type="button"
            onClick={() => navigate("/customers/new")}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            New Customer
          </button>
        }
      />

      {loading && <Loader label="Loading customer profiles..." />}

      {!loading && errorMessage && (
        <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{errorMessage}</div>
      )}

      {!loading && !errorMessage && (
        <div className="mb-5 grid gap-4 rounded-3xl bg-white p-5 shadow-xl md:grid-cols-[1.4fr_0.8fr_0.6fr]">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, phone, or address"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Employment Type</label>
            <select
              value={employmentFilter}
              onChange={(event) => setEmploymentFilter(event.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500"
            >
              <option value="ALL">All</option>
              {employmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Visible Customers</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{filteredCustomers.length}</p>
          </div>
        </div>
      )}

      {!loading && !errorMessage && customers.length === 0 && (
        <EmptyState
          title="No customers available"
          message="Create a customer profile to start the lending workflow."
          actionLabel="Create Customer"
          onAction={() => navigate("/customers/new")}
        />
      )}

      {!loading && !errorMessage && customers.length > 0 && filteredCustomers.length === 0 && (
        <EmptyState
          title="No customers match the current filters"
          message="Adjust the search text or employment filter to find the customer you need."
        />
      )}

      {!loading && !errorMessage && filteredCustomers.length > 0 && (
        <div className="grid gap-5">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="rounded-3xl bg-white p-6 shadow-xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                    Customer #{customer.id}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    {customer.fullName || `Customer #${customer.id}`}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{customer.phoneNumber}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/customers/${customer.id}`)}
                    className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/loans/apply?customerId=${customer.id}`)}
                    className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
                  >
                    Apply Loan
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Address</p>
                  <p className="mt-1 font-semibold text-slate-900">{customer.address}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Employment</p>
                  <p className="mt-1 font-semibold text-slate-900">{customer.employmentType}</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-emerald-700">Monthly Income</p>
                  <p className="mt-1 font-semibold text-emerald-900">{formatCurrency(customer.monthlyIncome)}</p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-amber-700">Existing EMI</p>
                  <p className="mt-1 font-semibold text-amber-900">{formatCurrency(customer.existingEmiAmount)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
