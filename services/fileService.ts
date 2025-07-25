import { DataService } from "./axiosInstance";

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
      const response = await DataService.post(
        "/File/UploadFile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.status || (response.status !== 200 && response.status !== 201)) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const result = response.data;

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
