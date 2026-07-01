import { forbidden, notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProfileData } from "@/lib/data/profile";
import { ProfileView } from "@/components/profile/ProfileView";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.id === userId) {
    redirect("/profile");
  }

  if (session.user.role !== "admin") {
    forbidden();
  }

  const data = await getProfileData(userId);
  if (!data) {
    notFound();
  }

  return <ProfileView {...data} isSelf={false} />;
}
