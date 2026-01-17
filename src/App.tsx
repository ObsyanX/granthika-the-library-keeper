import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GlobalSearch } from "@/components/GlobalSearch";
import { PageLoadingSpinner } from "@/components/LoadingSpinner";

// Lazy load all page components for better performance
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminHome = lazy(() => import("./pages/AdminHome"));
const UserHome = lazy(() => import("./pages/UserHome"));
const Books = lazy(() => import("./pages/Books"));
const AddBook = lazy(() => import("./pages/AddBook"));
const Transactions = lazy(() => import("./pages/Transactions"));
const IssueBook = lazy(() => import("./pages/IssueBook"));
const ReturnBook = lazy(() => import("./pages/ReturnBook"));
const PayFine = lazy(() => import("./pages/PayFine"));
const Membership = lazy(() => import("./pages/Membership"));
const AddMembership = lazy(() => import("./pages/AddMembership"));
const UpdateMembership = lazy(() => import("./pages/UpdateMembership"));
const BookAvailable = lazy(() => import("./pages/BookAvailable"));
const Reports = lazy(() => import("./pages/Reports"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <GlobalSearch />
            <Suspense fallback={<PageLoadingSpinner />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Legacy Dashboard Route */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                
                {/* Admin Dashboard */}
                <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminHome /></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminSettings /></ProtectedRoute>} />
                
                {/* User Dashboard */}
                <Route path="/user" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                
                {/* Books Module */}
                <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
                <Route path="/books/add" element={<ProtectedRoute requireAdmin><AddBook /></ProtectedRoute>} />
                <Route path="/books/edit/:serialNo" element={<ProtectedRoute requireAdmin><AddBook /></ProtectedRoute>} />
                
                {/* Transactions Module */}
                <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
                <Route path="/transactions/search" element={<ProtectedRoute><BookAvailable /></ProtectedRoute>} />
                <Route path="/transactions/issue" element={<ProtectedRoute><IssueBook /></ProtectedRoute>} />
                <Route path="/transactions/return" element={<ProtectedRoute><ReturnBook /></ProtectedRoute>} />
                <Route path="/transactions/fine" element={<ProtectedRoute><PayFine /></ProtectedRoute>} />
                
                {/* Membership Module (Admin Only) */}
                <Route path="/membership" element={<ProtectedRoute requireAdmin><Membership /></ProtectedRoute>} />
                <Route path="/membership/add" element={<ProtectedRoute requireAdmin><AddMembership /></ProtectedRoute>} />
                <Route path="/membership/update" element={<ProtectedRoute requireAdmin><UpdateMembership /></ProtectedRoute>} />
                <Route path="/membership/edit/:membershipNo" element={<ProtectedRoute requireAdmin><AddMembership /></ProtectedRoute>} />
                
                {/* Reports Module */}
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                
                {/* User Management (Admin Only) */}
                <Route path="/users" element={<ProtectedRoute requireAdmin><UserManagement /></ProtectedRoute>} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
