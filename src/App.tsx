import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardOverview from "./pages/DashboardOverview";
import Builder from "./pages/Builder";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="resumes" element={<div className="text-white p-6">Resumes List (WIP)</div>} />
            <Route path="cover-letters" element={<div className="text-white p-6">Cover Letters (WIP)</div>} />
            <Route path="billing" element={<div className="text-white p-6">Billing (WIP)</div>} />
            <Route path="settings" element={<div className="text-white p-6">Settings (WIP)</div>} />
          </Route>
          
          <Route path="/builder" element={<Builder />} />
        </Routes>
        <Toaster theme="dark" />
      </BrowserRouter>
    </AuthProvider>
  );
}
