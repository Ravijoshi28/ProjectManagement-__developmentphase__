import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";

interface Formdata {
  email: string;
  password: string;
}

interface SignupData {
  username: string;
  email: string;
  password:string;
}

interface User {
  username: string;
  email: string;
  id: string;
  image: string | null;
}

interface UserData {
  username: string;
  email: string;
  image: string | null;
}

interface ZustandState {
  loggedin: boolean;
  user: User | null;

  signup: (formdata: SignupData) => Promise<void>;
  login: (formdata: Formdata) => Promise<void>;
  logout: () => Promise<void>;

  setData: (data: UserData) => void;
}

export const useUserState = create<ZustandState>()(
  persist(
    (set) => ({
      user: null,
      loggedin: false,

      login: async (formdata) => {
        const response = await axiosInstance.post("/auth/login", formdata);

        set({
          loggedin: true,
          user: response.data.user,
        });
        console.log(response.data.user.image);
      },

      signup: async (formData:SignupData) => {
        await axiosInstance.post("/auth/signup",formData)

      },

      logout: async () => {
        await axiosInstance.post("/auth/logout");

        set({
          loggedin: false,
          user: null,
        });
      },

      setData: (data) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                ...data,
              }
            : null,
        })),
    }),
    {
      name: "user-storage",
    }
  )
);