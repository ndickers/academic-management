"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );

  useEffect(() => {
    const verifyToken = async () => {
      console.log(token);

      if (!token || typeof token !== "string") return setStatus("error");

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/verification`,
          { token }
        );
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };
    verifyToken();
  }, [searchParams, token]);

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      {status === "verifying" && <p>Verifying your email...</p>}
      {status === "success" && (
        <p>✅ Email verified successfully. You can now log in.</p>
      )}
      {status === "error" && <p>❌ Verification link is invalid or expired.</p>}

      {status === "success" && (
        <Link className="mt-12 text-blue-600 underline" href="/auth/login">
          Sign in here
        </Link>
      )}
      {status === "error" && (
        <Link className="mt-12 text-blue-600 underline" href="/auth/register">
          Go back to registration
        </Link>
      )}
    </div>
  );
}
