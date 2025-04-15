import { AppSidebar } from "@/components/app-sidebar";
import { ProfileForm } from "@/components/profile-form";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ProfilePage() {
  return (
    <div className="h-screen flex bg-black">
      <SidebarProvider>
        <div className="relative h-full">
          <div className="absolute inset-0 w-1 bg-gradient-to-b from-orange-500 via-purple-500 to-blue-500 right-0"></div>
          <AppSidebar />
        </div>
        <main className="flex-1 p-6 bg-black text-white overflow-y-auto">
          <ProfileForm />
        </main>
      </SidebarProvider>
    </div>
  );
}
