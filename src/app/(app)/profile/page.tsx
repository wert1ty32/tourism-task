import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProfileData } from "@/lib/data/profile";
import { ProfileView } from "@/components/profile/ProfileView";

export default async function MyProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const data = await getProfileData(session.user.id);
  if (!data) {
    redirect("/login");
  }

  return <ProfileView {...data} isSelf />;
}
