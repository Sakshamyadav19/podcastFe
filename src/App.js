import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import Landing from "./components/landing";
import SignInPage from "./components/signin";
import Home from "./components/home";
import SignUpPage from "./components/signup";

const ProtectedHome = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/signin");
    }
  }, [isSignedIn, navigate]);

  if (!isSignedIn) {
    return null;
  }

  return <Home />;
};

const App = () => {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route
        path="/home"
        element={
          <>
            <SignedIn>
              <ProtectedHome />
            </SignedIn>
            <SignedOut>
              <ProtectedHome />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
};

export default App;