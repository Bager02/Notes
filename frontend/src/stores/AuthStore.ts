import { defineStore } from "pinia";
import axios from "axios";
import { User } from "@/Classes/User";


export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null as User | null,
        isAuthenticated: false as boolean,
    }),

    actions: {
        async login(email: string, password: string) {
            try {
                const response = await axios.post("/api/login", { email, password }, { withCredentials: true });

                this.user = response.data.user;
                this.isAuthenticated = true;
                return response.data;
            } catch (error: any) {
                throw new Error(error.response?.data?.message || "Login failed");
            }
        },

        async logout() {
            try {
                await axios.get("/api/logout", {});
                this.user = null;
                this.isAuthenticated = false;
            } catch (error: any) {
                console.error("Logout failed:", error);
            }
        },

        async signup(name: string, lastName: string, email: string, password: string) {
            try {
                const response = await axios.post("/api/signup", { name, lastName, email, password });

                this.user = response.data;
                this.isAuthenticated = true;

                return response.data;
            } catch (error: any) {
                throw new Error(error.response?.data?.message || "Signup failed");
            }
        },

        async isAuth() {
            try {
                const response = await axios.get("/api/me", { withCredentials: true });
                this.isAuthenticated = true;
                return true;
            } catch (error: any) {
                this.isAuthenticated = false;
                return false;
            }
        }
    }
});
