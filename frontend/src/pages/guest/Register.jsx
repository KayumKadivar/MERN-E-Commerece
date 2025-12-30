import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useRegisterUserMutation,
  useResendOtpMutation
} from '../../redux/api/authApi';
import {
  setRegistrationStep,
  setRegistrationData,
  setCredentials,
  clearError,
  resetRegistration
} from '../../redux/slices/authSlice';

// ============================================
// VALIDATION SCHEMAS
// ============================================

// Step 1: Basic Info Schema
const step1Schema = yup.object({
  firstName: yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
});

// Step 2: OTP Schema
const step2Schema = yup.object({
  otp: yup.string()
    .required('OTP is required')
    .matches(/^[0-9]{6}$/, 'OTP must be 6 digits'),
});

// Step 3: Password Schema
const step3Schema = yup.object({
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: yup.string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { registrationStep, registrationData } = useSelector((state) => state.auth);

  // RTK Query mutations
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();
  const [resendOtp, { isLoading: isResendingOtp }] = useResendOtpMutation();

  // Local state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [step1Data, setStep1Data] = useState(null);

  // Get current schema based on step
  const getSchema = () => {
    switch (registrationStep) {
      case 1: return step1Schema;
      case 2: return step2Schema;
      case 3: return step3Schema;
      default: return step1Schema;
    }
  };

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(getSchema()),
    mode: 'onBlur'
  });

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(resetRegistration());
    };
  }, [dispatch]);

  // ============================================
  // STEP HANDLERS
  // ============================================

  // Step 1: Send OTP
  const handleStep1 = async (data) => {
    setApiError('');
    setSuccessMessage('');

    try {
      const result = await sendOtp({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone
      }).unwrap();

      // Store data for later steps
      setStep1Data(data);
      dispatch(setRegistrationData({ phone: data.phone }));
      dispatch(setRegistrationStep(2));
      setSuccessMessage('OTP sent successfully!');
      setResendTimer(60);
      reset();
    } catch (err) {
      setApiError(err.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  // Step 2: Verify OTP
  const handleStep2 = async (data) => {
    setApiError('');
    setSuccessMessage('');

    try {
      const result = await verifyOtp({
        phone: registrationData.phone,
        otp: data.otp
      }).unwrap();

      dispatch(setRegistrationData({ tempToken: result.tempToken }));
      dispatch(setRegistrationStep(3));
      setSuccessMessage('OTP verified successfully!');
      reset();
    } catch (err) {
      setApiError(err.data?.message || 'Invalid OTP. Please try again.');
    }
  };

  // Step 3: Register
  const handleStep3 = async (data) => {
    setApiError('');
    setSuccessMessage('');

    try {
      const result = await registerUser({
        tempToken: registrationData.tempToken,
        password: data.password,
        confirmPassword: data.confirmPassword
      }).unwrap();

      dispatch(setCredentials({
        user: result.user,
        token: result.token
      }));
      dispatch(resetRegistration());
      setSuccessMessage('Registration successful!');

      // Redirect to home after short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setApiError(err.data?.message || 'Registration failed. Please try again.');
    }
  };

  // Handle form submit based on current step
  const onSubmit = (data) => {
    switch (registrationStep) {
      case 1: handleStep1(data); break;
      case 2: handleStep2(data); break;
      case 3: handleStep3(data); break;
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setApiError('');
    try {
      await resendOtp({ phone: registrationData.phone }).unwrap();
      setSuccessMessage('OTP resent successfully!');
      setResendTimer(60);
    } catch (err) {
      setApiError(err.data?.message || 'Failed to resend OTP.');
    }
  };

  // Go back to previous step
  const handleBack = () => {
    if (registrationStep > 1) {
      dispatch(setRegistrationStep(registrationStep - 1));
      reset();
      setApiError('');
      setSuccessMessage('');
    }
  };

  // ============================================
  // RENDER HELPERS
  // ============================================

  // Progress indicator
  const ProgressIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${step < registrationStep
                ? 'bg-green-500 text-white'
                : step === registrationStep
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-700 text-slate-400'
                }`}
            >
              {step < registrationStep ? '✓' : step}
            </div>
            {step < 3 && (
              <div className={`h-0.5 w-8 mx-1 transition-all ${step < registrationStep ? 'bg-green-500' : 'bg-slate-700'
                }`} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-6 text-xs text-slate-400">
        <span className={registrationStep === 1 ? 'text-amber-400' : ''}>Info</span>
        <span className={registrationStep === 2 ? 'text-amber-400' : ''}>Verify</span>
        <span className={registrationStep === 3 ? 'text-amber-400' : ''}>Password</span>
      </div>
    </div>
  );

  // Error message component
  const InputError = ({ message }) => message ? (
    <p className="mt-1 text-xs text-red-400">{message}</p>
  ) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Background gradient + glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-slate-900 to-orange-500/10" />
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 sm:px-6 lg:px-8">
        {/* Form Section */}
        <div className="flex-1">
          <div className="mx-auto w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <h1 className="text-2xl font-semibold text-slate-50">
                Shop<span className="text-amber-400">Wise</span>
              </h1>
              <Link
                to="/login"
                className="text-xs font-medium text-slate-400 underline-offset-4 hover:text-amber-300 hover:underline"
              >
                Already a member?
              </Link>
            </div>

            {/* Glass card */}
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-8 shadow-2xl shadow-amber-500/10 backdrop-blur">

              {/* Progress Indicator */}
              <ProgressIndicator />

              <div className="mb-6 space-y-1 text-center">
                <h2 className="text-xl font-semibold text-slate-50">
                  {registrationStep === 1 && 'Create your account'}
                  {registrationStep === 2 && 'Verify your phone'}
                  {registrationStep === 3 && 'Set your password'}
                </h2>
                <p className="text-xs text-slate-400">
                  {registrationStep === 1 && 'It only takes a minute to get started.'}
                  {registrationStep === 2 && `Enter the 6-digit code sent to ${registrationData.phone}`}
                  {registrationStep === 3 && 'Create a strong password for your account.'}
                </p>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/30 p-3 text-center text-sm text-green-400">
                  {successMessage}
                </div>
              )}

              {/* Error Message */}
              {apiError && (
                <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-center text-sm text-red-400">
                  {apiError}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

                {/* ============================================ */}
                {/* STEP 1: Basic Info */}
                {/* ============================================ */}
                {registrationStep === 1 && (
                  <>
                    {/* First Name */}
                    <div className="flex gap-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-300">
                          First Name
                        </label>
                        <div className="relative">
                          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </span>
                          <input
                            type="text"
                            placeholder="John"
                            {...register('firstName')}
                            className={`w-full rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-slate-700'} bg-slate-900/60 px-9 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none ring-0 transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40`}
                          />
                        </div>
                        <InputError message={errors.firstName?.message} />
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-300">
                          Last Name
                        </label>
                        <div className="relative">
                          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </span>
                          <input
                            type="text"
                            placeholder="Doe"
                            {...register('lastName')}
                            className={`w-full rounded-lg border ${errors.lastName ? 'border-red-500' : 'border-slate-700'} bg-slate-900/60 px-9 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none ring-0 transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40`}
                          />
                        </div>
                        <InputError message={errors.lastName?.message} />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-300">
                        Email address
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </span>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          {...register('email')}
                          className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-slate-700'} bg-slate-900/60 px-9 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none ring-0 transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40`}
                        />
                      </div>
                      <InputError message={errors.email?.message} />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-300">
                        Phone Number
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </span>
                        <input
                          type="tel"
                          placeholder="9876543210"
                          {...register('phone')}
                          className={`w-full rounded-lg border ${errors.phone ? 'border-red-500' : 'border-slate-700'} bg-slate-900/60 px-9 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none ring-0 transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40`}
                        />
                      </div>
                      <InputError message={errors.phone?.message} />
                    </div>
                  </>
                )}

                {/* ============================================ */}
                {/* STEP 2: OTP Verification */}
                {/* ============================================ */}
                {registrationStep === 2 && (
                  <>
                    {/* OTP Input */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-300">
                        Enter OTP
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </span>
                        <input
                          type="text"
                          placeholder="123456"
                          maxLength={6}
                          {...register('otp')}
                          className={`w-full rounded-lg border ${errors.otp ? 'border-red-500' : 'border-slate-700'} bg-slate-900/60 px-9 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none ring-0 transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40 tracking-[0.5em] text-center font-mono`}
                        />
                      </div>
                      <InputError message={errors.otp?.message} />
                    </div>

                    {/* Resend OTP */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendTimer > 0 || isResendingOtp}
                        className={`text-xs ${resendTimer > 0 ? 'text-slate-500 cursor-not-allowed' : 'text-amber-400 hover:text-amber-300'}`}
                      >
                        {isResendingOtp ? 'Sending...' : resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                      </button>
                    </div>

                    {/* Back Button */}
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-full text-center text-xs text-slate-400 hover:text-slate-300"
                    >
                      ← Back to previous step
                    </button>
                  </>
                )}

                {/* ============================================ */}
                {/* STEP 3: Password Setup */}
                {/* ============================================ */}
                {registrationStep === 3 && (
                  <>
                    {/* Password */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-300">
                        Password
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...register('password')}
                          className={`w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-slate-700'} bg-slate-900/60 px-9 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none ring-0 transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-300"
                        >
                          {showPassword ? (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <InputError message={errors.password?.message} />
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-300">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        </span>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...register('confirmPassword')}
                          className={`w-full rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-700'} bg-slate-900/60 px-9 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none ring-0 transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-300"
                        >
                          {showConfirmPassword ? (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <InputError message={errors.confirmPassword?.message} />
                    </div>

                    {/* Password Requirements */}
                    <div className="text-xs text-slate-500 space-y-1">
                      <p>Password must contain:</p>
                      <ul className="list-disc list-inside ml-2">
                        <li>At least 6 characters</li>
                        <li>One uppercase letter</li>
                        <li>One number</li>
                      </ul>
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSendingOtp || isVerifyingOtp || isRegistering}
                  className="mt-1 w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/30 transition hover:from-amber-400 hover:to-orange-400 hover:shadow-amber-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {(isSendingOtp || isVerifyingOtp || isRegistering) ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {registrationStep === 1 && 'Sending OTP...'}
                      {registrationStep === 2 && 'Verifying...'}
                      {registrationStep === 3 && 'Creating Account...'}
                    </span>
                  ) : (
                    <>
                      {registrationStep === 1 && 'Send OTP'}
                      {registrationStep === 2 && 'Verify OTP'}
                      {registrationStep === 3 && 'Create Account'}
                    </>
                  )}
                </button>
              </form>
              <p className="mt-5 text-center text-xs text-slate-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-amber-300 hover:text-amber-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
