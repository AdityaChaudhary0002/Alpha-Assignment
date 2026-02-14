import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import LandingPage from './pages/LandingPage';
import RoleSelection from './pages/RoleSelection';
import InterviewScreen from './pages/InterviewScreen';
import FeedbackScreen from './pages/FeedbackScreen';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/role-selection"
          element={
            <>
              <SignedIn>
                <RoleSelection />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/interview"
          element={
            <>
              <SignedIn>
                <InterviewScreen />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
