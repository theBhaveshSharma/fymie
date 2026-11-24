import { AuthProvider } from "@/context/AuthContext";
import { AppNav } from "@/components/app/AppNav";
import { RequireAuth } from "@/components/app/RequireAuth";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RequireAuth>
        <div className="flex min-h-full flex-1 flex-col">
          <AppNav />
          <div className="flex-1">{children}</div>
        </div>
      </RequireAuth>
    </AuthProvider>
  );
}
