import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GlobalSearch } from "@/components/GlobalSearch";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminHome from "./pages/AdminHome";
import UserHome from "./pages/UserHome";
import Books from "./pages/Books";
import AddBook from "./pages/AddBook";
import Transactions from "./pages/Transactions";
import IssueBook from "./pages/IssueBook";
import ReturnBook from "./pages/ReturnBook";
import PayFine from "./pages/PayFine";
import Membership from "./pages/Membership";
import AddMembership from "./pages/AddMembership";
import UpdateMembership from "./pages/UpdateMembership";
import BookAvailable from "./pages/BookAvailable";
import Reports from "./pages/Reports";
import UserManagement from "./pages/UserManagement";
import AdminSettings from "./pages/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <GlobalSearch />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminHome /></ProtectedRoute>} />
              <Route path="/user" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
              <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
              <Route path="/books/add" element={<ProtectedRoute requireAdmin><AddBook /></ProtectedRoute>} />
              <Route path="/books/edit/:serialNo" element={<ProtectedRoute requireAdmin><AddBook /></ProtectedRoute>} />
              <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
              <Route path="/transactions/search" element={<ProtectedRoute><BookAvailable /></ProtectedRoute>} />
              <Route path="/transactions/issue" element={<ProtectedRoute><IssueBook /></ProtectedRoute>} />
              <Route path="/transactions/return" element={<ProtectedRoute><ReturnBook /></ProtectedRoute>} />
              <Route path="/transactions/fine" element={<ProtectedRoute><PayFine /></ProtectedRoute>} />
              <Route path="/membership" element={<ProtectedRoute requireAdmin><Membership /></ProtectedRoute>} />
              <Route path="/membership/add" element={<ProtectedRoute requireAdmin><AddMembership /></ProtectedRoute>} />
              <Route path="/membership/update" element={<ProtectedRoute requireAdmin><UpdateMembership /></ProtectedRoute>} />
              <Route path="/membership/edit/:membershipNo" element={<ProtectedRoute requireAdmin><AddMembership /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute requireAdmin><UserManagement /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminSettings /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
