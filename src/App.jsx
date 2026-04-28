import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { PageTransition } from './components/motion';
import { ProtectedRoute } from './components/protected-route';
import { PageNotFound } from './pages/not-found';

// Reset scroll to top whenever the route changes — React Router preserves
// the previous page's scroll position by default, which makes new pages
// open mid-screen.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Public — psych-enhanced versions for Landing/Browse/Item Detail (the conversion-critical surfaces)
import { PageLandingPsy, PageBrowsePsy, PageItemDetailPsy } from './pages/psychology-overrides';
import { PageHowItWorks, PageRequests, PageCart, PageCheckout } from './pages/public-extras';
import { PagePostTrip } from './pages/post-trip';
import { PageAuth } from './pages/auth';

// App (signed-in)
import { PageDashboard } from './pages/dashboard';
import { PageOrders, PageOrderDetail, PageMyTrips, PageTripDetail } from './pages/orders-trips';
import { PageMessages, PageWallet, PageProfile, PageSettings, PageMembership } from './pages/app-extras';

export default function App() {
  return (
    <div className="h-app">
      <ScrollToTop />
      <PageTransition>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PageLandingPsy />} />
        <Route path="/browse" element={<PageBrowsePsy />} />
        <Route path="/item/:id" element={<PageItemDetailPsy />} />
        <Route path="/item" element={<PageItemDetailPsy />} />
        <Route path="/how-it-works" element={<PageHowItWorks />} />
        <Route path="/requests" element={<PageRequests />} />
        <Route path="/post-trip" element={<PagePostTrip />} />
        <Route path="/signin" element={<PageAuth mode="signin" />} />
        <Route path="/signup" element={<PageAuth mode="signup" />} />
        <Route path="/cart" element={<PageCart />} />
        <Route path="/checkout" element={<ProtectedRoute><PageCheckout /></ProtectedRoute>} />

        {/* Signed-in */}
        <Route path="/dashboard" element={<ProtectedRoute><PageDashboard initialRole="buyer" /></ProtectedRoute>} />
        <Route path="/dashboard/carrier" element={<ProtectedRoute><PageDashboard initialRole="carrier" /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><PageOrders /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><PageOrderDetail /></ProtectedRoute>} />
        <Route path="/order-detail" element={<ProtectedRoute><PageOrderDetail /></ProtectedRoute>} />
        <Route path="/trips" element={<ProtectedRoute><PageMyTrips /></ProtectedRoute>} />
        <Route path="/trips/:id" element={<ProtectedRoute><PageTripDetail /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><PageMessages /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><PageWallet /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PageProfile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><PageSettings /></ProtectedRoute>} />
        <Route path="/membership" element={<ProtectedRoute><PageMembership /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      </PageTransition>
    </div>
  );
}
