"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, CheckCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.push("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleResendVerification = async () => {
    if (!email) return;

    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) throw error;
      setResent(true);
    } catch (error) {
      console.error("Error resending verification:", error);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-white mb-2">Nexscholar</h1>
          </Link>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Check your email
          </h2>

          <p className="text-gray-600 mb-6">
            We&apos;ve sent a verification link to{" "}
            {email && (
              <span className="font-medium text-gray-900">{email}</span>
            )}
            {!email && "your email address"}. Click the link in the email to
            verify your account.
          </p>

          <div className="space-y-4">
            {/* Success Message */}
            {resent && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-600">
                  Verification email sent!
                </p>
              </div>
            )}

            {/* Resend Button */}
            <button
              onClick={handleResendVerification}
              disabled={resending || !email}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-primary-600 rounded-lg text-sm font-medium text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {resending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Resend verification email
                </>
              )}
            </button>

            {/* Back to Login */}
            <Link
              href="/auth/login"
              className="w-full inline-flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Back to login
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Didn&apos;t receive the email? Check your spam folder or try
              resending. If you continue to have issues, contact our support
              team.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-primary-100">
            Need help?{" "}
            <Link
              href="/contact"
              className="underline hover:text-white transition-colors"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
