import { AuthForm } from "@/components/form/auth-form";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <AuthForm type="signup" />
    </div>
  );
}
