//zustand is the gloabl state management library

import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

//1st arg -> callback fun which return obj
export const useAuthStore = create((set) => ({
  //initially userAuth state will be null
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  //whenever we refresh our page, we willcheck whether user is authenticated or not
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
    } catch (error) {
      console.log("Error is checkAuth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
