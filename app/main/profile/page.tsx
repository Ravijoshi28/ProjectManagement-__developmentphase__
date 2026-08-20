"use client";
import { getUploadErrorMessage, uploadProfileImage } from "@/app/frontendLib/upload/upload";
import React, { useState } from "react";
import { useUserState } from "@/app/zustand/userState";
import { User, Mail, Shield, Building, LayoutGrid, BellRing, Check, Save, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { changeProfile } from "@/app/frontendLib/profile/profile";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user ,setData,logout} = useUserState();
  const queryMutation=useMutation({
    mutationFn:changeProfile
  })

   
    const router = useRouter()
  
    const handleLogout = async () => {
      await logout()
      router.refresh()
      router.push("/auth")
    }
  // Local state for profile inputs
  const [formData, setFormData] = useState({
    name: user?.username || "Alex Workspace",
    email: user?.email || "alex@projectworkspace.com",
    organization: "DevStudio Enterprise",
    role: "Project Manager",
    emailNotifications: true,
    realtimeUpdates: true,
    image:user?.image ??null,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveChanges = async(e: React.FormEvent) => {
    e.preventDefault();
      setIsSaving(true);
      
    try{
         
       setData({
         username: formData.name,
         image: formData.image,
         email: formData.email
       })
       await  queryMutation.mutateAsync({
       name: formData.name,
        image:formData.image ??null,
       })
       toast.success("Changes saved successfully");
    }catch(error){
      toast.error("Changes failed try again later")
    }finally{
      setIsSaving(false);
    }
  
    
    // api call to save changes in server...

  };

  const userInitials = formData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();



 const handleFileChange = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const data = await uploadProfileImage(file);
    setFormData((prev) => ({
      ...prev,
      image: data.url,
    }));
    toast.success("Profile image uploaded");
  } catch (error: unknown) {
    toast.error(getUploadErrorMessage(error, "Failed to upload profile image"));
  }
};

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-8 font-sans">
      {/* Header Context */}
      <div className="mb-6 md:mb-8 max-w-5xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Manage your identity profiles, credentials, and notification behaviors.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Profile Card Hero Block */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-5">
          <div className="h-16 w-16 shrink-0 rounded-full bg-slate-900 flex items-center justify-center text-white text-xl font-bold ring-4 ring-slate-100 shadow-inner">
            <input
  id="profile-image"
  type="file"
  accept="image/*"
  className="hidden"
  onChange={handleFileChange}
/>

<label
  htmlFor="profile-image"
  className="cursor-pointer px-4 py-2 bg-transparent text-white rounded"
>
  {formData.image?(<img
  src={formData.image}
  alt="Profile"
  className="w-full h-full rounded-full object-cover"
/>):(userInitials)}
</label>
          </div>
          <div className="text-center sm:text-left space-y-1 flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">{formData.name}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-medium text-slate-400">
              <span className="text-slate-500 truncate">{formData.email}</span>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1 text-blue-600 bg-blue-50 border border-blue-100/70 px-2 py-0.5 rounded-md font-bold tracking-wide text-[10px] uppercase">
                <Shield size={11} />
                <span>Workspace Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Controls Structure Grid */}
        <form onSubmit={handleSaveChanges} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Column 1 & 2: Account Parameter Forms */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <User size={16} className="text-slate-400" />
                <h3 className="text-sm font-bold text-slate-800">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-4 py-2 text-xs md:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-4 py-2 text-xs md:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-colors"
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Organization</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full pl-9 pr-4 py-2 text-xs md:text-sm font-medium text-slate-700 bg-slate-50/50 border border-slate-200 text-slate-500 cursor-not-allowed rounded-xl"
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Workspace Position</label>
                  <div className="relative">
                    <LayoutGrid className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full pl-9 pr-4 py-2 text-xs md:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Communication & Push Preferences Panel */}

          <div className="space-y-6">
            <h2 className="text-shadow-blue-300 font-bold ">This section is currently under development so not working</h2>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <BellRing size={16} className="text-slate-400" />
                <h3 className="text-sm font-bold text-slate-800">Preferences</h3>
              </div>

              <div className="space-y-4 pt-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-800">Email Digest Notifications</p>
                    <p className="text-[10px] text-slate-400 leading-normal font-medium">Receive an aggregated morning wrap-up of deadline overviews.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.emailNotifications}
                    onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer mt-0.5"
                  />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-800">Socket Realtime Push Updates</p>
                    <p className="text-[10px] text-slate-400 leading-normal font-medium">Allow server streaming socket connections to sync mutations live.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.realtimeUpdates}
                    onChange={(e) => setFormData({ ...formData, realtimeUpdates: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer mt-0.5"
                  />
                </div>
              </div>
            </div>

            {/* Form Operation Submit Buttons Area */}
            <div className="flex items-center justify-end gap-3">
              {savedSuccess && (
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl animate-fade-in">
                  <Check size={12} />
                  <span>Changes Configured Successfully</span>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 focus:ring-2 focus:ring-slate-900/10 transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Save size={13} />
                <span>{isSaving ? "Updating Workspace..." : "Save Settings"}</span>
              </button>
            </div>
          </div>

        </form>

  

  {/* Full-Width Destructive System Session Escape Hatch */}
  <button
    type="button"
    onClick={() => handleLogout()}
    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 border border-red-200 hover:bg-red-100/70 active:bg-red-100 text-red-600 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/10"
  >
    <LogOutIcon size={14} className="shrink-0" />
    <span>Sign Out of Account</span>
  </button>
</div>
      </div>
    
  );
}
