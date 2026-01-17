import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PageLoadingSpinner } from '@/components/LoadingSpinner';
import { PageTransition } from '@/components/PageTransition';

// Lazy load all page components for better performance
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

export const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoadingSpinner />}>
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
          
          {/* Legacy Dashboard Route */}
          <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
          
          {/* Admin Dashboard */}
          <Route path="/admin" element={<ProtectedRoute requireAdmin><PageTransition><AdminHome /></PageTransition></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><PageTransition><AdminSettings /></PageTransition></ProtectedRoute>} />
          
          {/* User Dashboard */}
          <Route path="/user" element={<ProtectedRoute><PageTransition><UserHome /></PageTransition></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
          
          {/* Books Module */}
          <Route path="/books" element={<ProtectedRoute><PageTransition><Books /></PageTransition></ProtectedRoute>} />
          <Route path="/books/add" element={<ProtectedRoute requireAdmin><PageTransition><AddBook /></PageTransition></ProtectedRoute>} />
          <Route path="/books/edit/:serialNo" element={<ProtectedRoute requireAdmin><PageTransition><AddBook /></PageTransition></ProtectedRoute>} />
          
          {/* Transactions Module */}
          <Route path="/transactions" element={<ProtectedRoute><PageTransition><Transactions /></PageTransition></ProtectedRoute>} />
          <Route path="/transactions/search" element={<ProtectedRoute><PageTransition><BookAvailable /></PageTransition></ProtectedRoute>} />
          <Route path="/transactions/issue" element={<ProtectedRoute><PageTransition><IssueBook /></PageTransition></ProtectedRoute>} />
          <Route path="/transactions/return" element={<ProtectedRoute><PageTransition><ReturnBook /></PageTransition></ProtectedRoute>} />
          <Route path="/transactions/fine" element={<ProtectedRoute><PageTransition><PayFine /></PageTransition></ProtectedRoute>} />
          
          {/* Membership Module (Admin Only) */}
          <Route path="/membership" element={<ProtectedRoute requireAdmin><PageTransition><Membership /></PageTransition></ProtectedRoute>} />
          <Route path="/membership/add" element={<ProtectedRoute requireAdmin><PageTransition><AddMembership /></PageTransition></ProtectedRoute>} />
          <Route path="/membership/update" element={<ProtectedRoute requireAdmin><PageTransition><UpdateMembership /></PageTransition></ProtectedRoute>} />
          <Route path="/membership/edit/:membershipNo" element={<ProtectedRoute requireAdmin><PageTransition><AddMembership /></PageTransition></ProtectedRoute>} />
          
          {/* Reports Module */}
          <Route path="/reports" element={<ProtectedRoute><PageTransition><Reports /></PageTransition></ProtectedRoute>} />
          
          {/* User Management (Admin Only) */}
          <Route path="/users" element={<ProtectedRoute requireAdmin><PageTransition><UserManagement /></PageTransition></ProtectedRoute>} />
          
          {/* 404 */}
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};
