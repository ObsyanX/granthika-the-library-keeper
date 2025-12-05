import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Auth />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/user" element={<UserHome />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/add" element={<AddBook />} />
              <Route path="/books/edit/:serialNo" element={<AddBook />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transactions/search" element={<BookAvailable />} />
              <Route path="/transactions/issue" element={<IssueBook />} />
              <Route path="/transactions/return" element={<ReturnBook />} />
              <Route path="/transactions/fine" element={<PayFine />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/membership/add" element={<AddMembership />} />
              <Route path="/membership/update" element={<UpdateMembership />} />
              <Route path="/membership/edit/:membershipNo" element={<AddMembership />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
