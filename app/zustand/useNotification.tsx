import { create } from "zustand";

interface Noti {
  type: string;
  projectId: string;
  message: string;
}

interface NotificationStore {
  notifications: Noti[];

  addNotification: (notification: Noti) => void;
}

export const useNotification =
  create<NotificationStore>((set) => ({
    notifications: [],

    addNotification: (notification) =>
      set((state) => ({
        notifications: [
          notification,
          ...state.notifications,
        ],
      })),
  }));