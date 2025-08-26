import { DataService,base_url } from "./axiosInstance";

const fileService = {
  uploadfile: async (file: any, fileType: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", fileType);

    try {
      const response = await fetch(base_url+"/api/File/UploadFile",     
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Do NOT set Content-Type for FormData; browser will set it automatically
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      console.log("Resume upload response:", result);

      // Extract URL from actualUrl field based on API response structure
      return result[0]?.actualUrl || "";
    } catch (error) {
      console.error("Error uploading resume:", error);
      throw new Error("Failed to upload resume file");
    }
  }
};

export default fileService;
