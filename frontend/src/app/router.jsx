import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import LoginPage from "../features/auth/pages/LoginPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import CustomerCreatePage from "../features/customer/pages/CustomerCreatePage";
import CustomerDetailsPage from "../features/customer/pages/CustomerDetailsPage";
import CustomerListPage from "../features/customer/pages/CustomerListPage";
import LoanApplyPage from "../features/loan/pages/LoanApplyPage";
import LoanDetailsPage from "../features/loan/pages/LoanDetailsPage";
import LoanListPage from "../features/loan/pages/LoanListPage";
import EmiSchedulePage from "../features/emi/pages/EmiSchedulePage";
import ManualReviewPage from "../features/admin/pages/ManualReviewPage";
import RepaymentPage from "../features/repayment/pages/RepaymentPage";
import PenaltyPage from "../features/penalty/pages/PenaltyPage";

const router = createBrowserRouter([
  {
    path: "/staff/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "customers",
        element: <CustomerListPage />,
      },
      {
        path: "customers/new",
        element: <CustomerCreatePage />,
      },
      {
        path: "customers/:id",
        element: <CustomerDetailsPage />,
      },
      {
        path: "loans/apply",
        element: <LoanApplyPage />,
      },
      {
        path: "loans",
        element: <LoanListPage />,
      },
      {
        path: "loans/:id",
        element: <LoanDetailsPage />,
      },
      {
        path: "loans/:id/emi-schedule",
        element: <EmiSchedulePage />,
      },
      {
        path: "admin/manual-review",
        element: <ManualReviewPage />,
      },
      {
        path: "repayments",
        element: <RepaymentPage />,
      },
      {
        path: "penalties",
        element: <PenaltyPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;
