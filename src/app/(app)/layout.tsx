import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getExchangeRate } from "@/lib/data/exchange-rate";
import { CurrencyProvider } from "@/components/currency/CurrencyProvider";
import { Topbar } from "@/components/shell/Topbar";
import styles from "@/styles/app.module.css";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.mustChangePassword) {
    redirect("/change-password");
  }

  const [user, eurToUah] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, position: true, role: true, preferredCurrency: true },
    }),
    getExchangeRate(),
  ]);

  if (!user) {
    redirect("/login");
  }

  return (
    <CurrencyProvider initialCurrency={user.preferredCurrency} eurToUah={eurToUah}>
      <Topbar user={user} />
      {children}
      <footer className={styles.footer}>
        © 2026 Tourism Department · Внутрішня система управління поїздками
      </footer>
    </CurrencyProvider>
  );
}
