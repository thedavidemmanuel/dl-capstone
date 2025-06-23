"use client";
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faIdCard, 
  faArrowRight, 
  faArrowLeft, 
  faShieldAlt,
  faSpinner,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { eSignetService, type NationalIdData } from '@/services/eSignetService';

interface NationalIdAuthProps {
  onSuccess: (userData: NationalIdData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function NationalIdAuth({ onSuccess, onBack, isLoading = false }: NationalIdAuthProps) {
  const [step, setStep] = useState<'id-entry' | 'otp-verification'>('id-entry');
  const [nationalId, setNationalId] = useState('');
  const [otp, setOtp] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateNationalId = (id: string): boolean => {
    // Burundi National ID format: 16 digits
    const burundianIdPattern = /^\d{16}$/;
    return burundianIdPattern.test(id);
  };

  const handleIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateNationalId(nationalId)) {
      setError('Please enter a valid 16-digit National ID number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Initiate authentication
      const authResult = await eSignetService.initiateAuth(nationalId);
      
      if (!authResult.success) {
        setError(authResult.message);
        setLoading(false);
        return;
      }

      // Step 2: Send OTP
      const otpResult = await eSignetService.sendOtp({
        nationalId,
        transactionId: authResult.transactionId!
      });

      if (otpResult.success) {
        setTransactionId(otpResult.transactionId!);
        setStep('otp-verification');
        setSuccess('OTP sent to your registered phone number');
      } else {
        setError(otpResult.message);
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const verifyResult = await eSignetService.verifyOtp({
        nationalId,
        otp,
        transactionId
      });

      if (verifyResult.success && verifyResult.userData) {
        setSuccess('Authentication successful!');
        onSuccess(verifyResult.userData);
      } else {
        setError(verifyResult.message);
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.error('OTP verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToId = () => {
    setStep('id-entry');
    setOtp('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg border border-gray-200 p-8">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FontAwesomeIcon icon={faShieldAlt} className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          National ID Verification
        </h2>
        <p className="text-gray-600">
          {step === 'id-entry' 
            ? 'Enter your National ID number to verify your identity'
            : 'Enter the OTP sent to your registered phone number'
          }
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-center space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === 'id-entry' ? 'bg-green-600 text-white' : 'bg-green-600 text-white'
          }`}>
            {step === 'otp-verification' ? <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" /> : '1'}
          </div>
          <div className={`w-16 h-1 ${step === 'otp-verification' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === 'otp-verification' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            2
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>National ID</span>
          <span>OTP Verification</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-red-500 mr-2" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mr-2" />
          <span className="text-green-700 text-sm">{success}</span>
        </div>
      )}

      {/* National ID Entry Form */}
      {step === 'id-entry' && (
        <form onSubmit={handleIdSubmit} className="space-y-4">
          <div>
            <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-2">
              National ID Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faIdCard} className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="nationalId"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value.replace(/\D/g, '').slice(0, 16))}
                placeholder="Enter 16-digit National ID"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                disabled={loading || isLoading}
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Format: 16 digits (e.g., 1234567890123456)
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onBack}
              disabled={loading || isLoading}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium text-gray-700 disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              disabled={!nationalId || loading || isLoading}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Send OTP</span>
                  <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* OTP Verification Form */}
      {step === 'otp-verification' && (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code (OTP)
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-lg font-mono tracking-widest text-gray-900"
              disabled={loading || isLoading}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              For testing, use: <span className="font-mono font-medium">123456</span>
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleBackToId}
              disabled={loading || isLoading}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium text-gray-700 disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              disabled={!otp || loading || isLoading}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Verify</span>
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setSuccess('');
                setError('');
                // Resend OTP logic here
              }}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
              disabled={loading || isLoading}
            >
              Didn&apos;t receive code? Resend OTP
            </button>
          </div>
        </form>
      )}

      {/* Development Note */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Development Mode:</strong> Use any 16-digit number for National ID and 123456 for OTP testing.
        </p>
      </div>
    </div>
  );
}
