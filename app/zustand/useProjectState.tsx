import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UseProject {
  projectId: string | null;
  projectMember: string | null; // or whatever type you need

  setProjectId: (projectId: string) => void;
}

export const useProjectState = create<UseProject>()(
  persist(
    (set) => ({
      projectId: null,
      projectMember: null,

      setProjectId: (projectId) => {
        set({ projectId });
      },
    }),
    {
      name: "project-storage",
    }
  )
);