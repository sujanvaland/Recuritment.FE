import { DataService } from "./axiosInstance";

const authService = {
  register: async (userData: any) => {
    try {
      const response = await DataService.post("/auth/register", {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        company: userData.company || "",
        title: userData.title || "",
      });
      console.log(response);
      return response.data;
      
    } catch (error: any) {
      console.log(error);
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default authService;
