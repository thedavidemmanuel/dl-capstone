"use client";
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide } from '@fortawesome/free-solid-svg-icons';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { user, isLoading } = useAuth();
  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C8E5D] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-inter">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, let ConditionalLayout handle the redirect
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#2C8E5D] to-[#1f6a44] rounded-xl shadow-lg">
              <FontAwesomeIcon icon={faCarSide} className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-inter font-bold text-gray-900">DLV Burundi</h1>
          <p className="text-sm text-gray-600 font-inter mt-1">Digital License Verification</p>
        </div>

        {/* Auth form card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {isSignUp ? (
            <SignUp onSwitchToSignIn={() => setIsSignUp(false)} />
          ) : (
            <SignIn onSwitchToSignUp={() => setIsSignUp(true)} />
          )}
        </div>

        {/* Footer text */}
        <div className="text-center">
          <p className="text-xs text-gray-500 font-inter">
            © 2025 DLV Burundi. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 font-inter mt-1">
            Secure digital license verification for Burundi
          </p>
        </div>
      </div>
    </div>
  );
}