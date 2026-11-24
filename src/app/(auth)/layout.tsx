import { AuthProvider } from "@/context/AuthContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-full flex-1 flex-col bg-ink">{children}</div>
    </AuthProvider>
  );
}
