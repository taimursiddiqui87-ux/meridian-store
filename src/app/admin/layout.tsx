import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Admin · MERIDIAN" },
  robots: { index: false, follow: false },
};

// Passthrough: the login page renders on its own; the (panel) group adds the
// authenticated admin shell.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
