import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { img } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  return (
    <AuthShell
      image={img("1509048191080-d2984bad6ae5", 1200)}
      quote="A fresh start, in a few seconds."
    >
      <ResetPasswordForm token={searchParams.token ?? ""} />
    </AuthShell>
  );
}
