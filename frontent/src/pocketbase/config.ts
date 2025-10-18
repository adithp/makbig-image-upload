import PocketBase from "pocketbase";

// PocketBase configuration
// Use environment variable or fallback to localhost
const POCKETBASE_URL =
  process.env.REACT_APP_POCKETBASE_URL || "http://127.0.0.1:8090";
const pb = new PocketBase(POCKETBASE_URL);

export default pb;

// Helper functions for common operations
export const authHelpers = {
  // Login user
  async login(email: string, password: string) {
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);
      return authData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Register user
  async register(
    name: string,
    email: string,
    password: string,
    domain: string
  ) {
    try {
      const data = {
        name,
        email,
        password,
        passwordConfirm: password,
        role: "student",
        domain,
        email_verified: false, // New users must verify email on first login
      };
      const user = await pb.collection("users").create(data);
      return user;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  // Logout user
  logout() {
    pb.authStore.clear();
  },

  // Get current user
  getCurrentUser() {
    return pb.authStore.model;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return pb.authStore.isValid;
  },
};

// OTP helpers
export const otpHelpers = {
  // Request OTP (generates and sends OTP via email)
  async requestOTP(email: string) {
    try {
      const response = await pb.collection("users").update(
        email,
        {},
        {
          requestKey: "otpRequest",
          email: email,
        }
      );
      return response;
    } catch (error) {
      console.error("Error requesting OTP:", error);
      throw error;
    }
  },

  // Verify OTP code
  async verifyOTP(email: string, otpCode: string) {
    try {
      const response = await fetch(
        `${pb.baseUrl}/api/collections/users/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp: otpCode }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "OTP verification failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  },
};

// Database helpers
export const dbHelpers = {
  // Get all domains
  async getDomains() {
    try {
      const domains = await pb.collection("domains").getFullList();
      return domains;
    } catch (error) {
      console.error("Error fetching domains:", error);
      throw error;
    }
  },

  // Add domain (admin only)
  async addDomain(name: string) {
    try {
      const domain = await pb.collection("domains").create({ name });
      return domain;
    } catch (error) {
      console.error("Error adding domain:", error);
      throw error;
    }
  },

  // Delete domain (admin only)
  async deleteDomain(id: string) {
    try {
      await pb.collection("domains").delete(id);
    } catch (error) {
      console.error("Error deleting domain:", error);
      throw error;
    }
  },

  // Get all students
  async getStudents() {
    try {
      const students = await pb.collection("users").getFullList({
        filter: 'role = "student"',
      });
      return students;
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  },

  // Get user uploads
  async getUserUploads(userId?: string) {
    try {
      const filter = userId ? `student_id = "${userId}"` : "";
      const uploads = await pb.collection("uploads").getFullList({
        filter,
        sort: "-created",
      });
      return uploads;
    } catch (error) {
      console.error("Error fetching uploads:", error);
      throw error;
    }
  },

  // Get all uploads (admin)
  async getAllUploads() {
    try {
      const uploads = await pb.collection("uploads").getFullList({
        sort: "-created",
      });
      return uploads;
    } catch (error) {
      console.error("Error fetching all uploads:", error);
      throw error;
    }
  },

  // Add upload
  async addUpload(
    studentId: string,
    imageUrl: string,
    week: number,
    domain: string
  ) {
    try {
      const upload = await pb.collection("uploads").create({
        student_id: studentId,
        image_url: imageUrl,
        week,
        domain,
      });
      return upload;
    } catch (error) {
      console.error("Error adding upload:", error);
      throw error;
    }
  },

  // Update upload with admin reply
  async updateUploadReply(uploadId: string, adminReply: string) {
    try {
      const upload = await pb.collection("uploads").update(uploadId, {
        admin_reply: adminReply,
      });
      return upload;
    } catch (error) {
      console.error("Error updating upload reply:", error);
      throw error;
    }
  },
};

// File upload helpers
export const fileHelpers = {
  // Upload image
  async uploadImage(
    file: File,
    studentId: string,
    week: number,
    imageNumber: number
  ) {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const record = await pb.collection("uploads").create(formData, {
        student_id: studentId,
        week,
        image_number: imageNumber,
      });

      return record;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },

  // Get image URL
  getImageUrl(record: any, imageField: string = "image") {
    return pb.files.getUrl(record, record[imageField]);
  },
};
