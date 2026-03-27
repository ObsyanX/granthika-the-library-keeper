import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PageLoadingSpinner } from '@/components/LoadingSpinner';
import { PageTransition } from '@/components/PageTransition';

// Lazy load all page components
const Index = lazy(() => import("@/pages/Index"));
const Auth = lazy(() => import("@/pages/Auth"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const AdminHome = lazy(() => import("@/pages/AdminHome"));
const UserHome = lazy(() => import("@/pages/UserHome"));
const Books = lazy(() => import("@/pages/Books"));
const AddBook = lazy(() => import("@/pages/AddBook"));
const Transactions = lazy(() => import("@/pages/Transactions"));
const IssueBook = lazy(() => import("@/pages/IssueBook"));
const ReturnBook = lazy(() => import("@/pages/ReturnBook"));
const PayFine = lazy(() => import("@/pages/PayFine"));
const Membership = lazy(() => import("@/pages/Membership"));
const AddMembership = lazy(() => import("@/pages/AddMembership"));
const UpdateMembership = lazy(() => import("@/pages/UpdateMembership"));
const BookAvailable = lazy(() => import("@/pages/BookAvailable"));
const Reports = lazy(() => import("@/pages/Reports"));
const UserManagement = lazy(() => import("@/pages/UserManagement"));
const AdminSettings = lazy(() => import("@/pages/AdminSettings"));
const Profile = lazy(() => import("@/pages/Profile"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Helper to wrap with PageTransition + ProtectedRoute
function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requireAdmin><PageTransition>{children}</PageTransition></ProtectedRoute>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute><PageTransition>{children}</PageTransition></ProtectedRoute>;
}

export const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoadingSpinner />}>
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
          
          {/* ===== ADMIN ROUTES (/admin/*) ===== */}
          <Route path="/admin" element={<AdminRoute><AdminHome /></AdminRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
          <Route path="/admin/books" element={<AdminRoute><Books /></AdminRoute>} />
          <Route path="/admin/books/add" element={<AdminRoute><AddBook /></AdminRoute>} />
          <Route path="/admin/books/edit/:serialNo" element={<AdminRoute><AddBook /></AdminRoute>} />
          <Route path="/admin/transactions" element={<AdminRoute><Transactions /></AdminRoute>} />
          <Route path="/admin/transactions/search" element={<AdminRoute><BookAvailable /></AdminRoute>} />
          <Route path="/admin/transactions/issue" element={<AdminRoute><IssueBook /></AdminRoute>} />
          <Route path="/admin/transactions/return" element={<AdminRoute><ReturnBook /></AdminRoute>} />
          <Route path="/admin/transactions/fine" element={<AdminRoute><PayFine /></AdminRoute>} />
          <Route path="/admin/membership" element={<AdminRoute><Membership /></AdminRoute>} />
          <Route path="/admin/membership/add" element={<AdminRoute><AddMembership /></AdminRoute>} />
          <Route path="/admin/membership/update" element={<AdminRoute><UpdateMembership /></AdminRoute>} />
          <Route path="/admin/membership/edit/:membershipNo" element={<AdminRoute><AddMembership /></AdminRoute>} />
          <Route path="/admin/reports" element={<AdminRoute><Reports /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
          <Route path="/admin/profile" element={<AdminRoute><Profile /></AdminRoute>} />

          {/* ===== USER ROUTES (/user/*) ===== */}
          <Route path="/user" element={<AuthRoute><UserHome /></AuthRoute>} />
          <Route path="/user/dashboard" element={<AuthRoute><Dashboard /></AuthRoute>} />
          <Route path="/user/books" element={<AuthRoute><Books /></AuthRoute>} />
          <Route path="/user/transactions" element={<AuthRoute><Transactions /></AuthRoute>} />
          <Route path="/user/transactions/search" element={<AuthRoute><BookAvailable /></AuthRoute>} />
          <Route path="/user/transactions/issue" element={<AuthRoute><IssueBook /></AuthRoute>} />
          <Route path="/user/transactions/return" element={<AuthRoute><ReturnBook /></AuthRoute>} />
          <Route path="/user/transactions/fine" element={<AuthRoute><PayFine /></AuthRoute>} />
          <Route path="/user/reports" element={<AuthRoute><Reports /></AuthRoute>} />
          <Route path="/user/profile" element={<AuthRoute><Profile /></AuthRoute>} />

          {/* Legacy fallback routes - redirect to role-based paths */}
          <Route path="/dashboard" element={<AuthRoute><Dashboard /></AuthRoute>} />
          <Route path="/books" element={<AuthRoute><Books /></AuthRoute>} />
          <Route path="/transactions" element={<AuthRoute><Transactions /></AuthRoute>} />
          <Route path="/transactions/issue" element={<AuthRoute><IssueBook /></AuthRoute>} />
          <Route path="/transactions/return" element={<AuthRoute><ReturnBook /></AuthRoute>} />
          <Route path="/transactions/fine" element={<AuthRoute><PayFine /></AuthRoute>} />
          <Route path="/reports" element={<AuthRoute><Reports /></AuthRoute>} />
          <Route path="/profile" element={<AuthRoute><Profile /></AuthRoute>} />
          <Route path="/membership" element={<AdminRoute><Membership /></AdminRoute>} />
          <Route path="/membership/add" element={<AdminRoute><AddMembership /></AdminRoute>} />
          <Route path="/membership/update" element={<AdminRoute><UpdateMembership /></AdminRoute>} />
          <Route path="/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
          <Route path="/books/add" element={<AdminRoute><AddBook /></AdminRoute>} />
          <Route path="/books/edit/:serialNo" element={<AdminRoute><AddBook /></AdminRoute>} />

          {/* 404 */}
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};
