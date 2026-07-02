import { forbidden, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAllUsers } from "@/lib/data/admin-users";
import { AdminUsersView } from "@/components/admin/AdminUsersView";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    forbidden();
  }

  const users = await getAllUsers();

  return <AdminUsersView users={users} currentUserId={session.user.id} />;
}
