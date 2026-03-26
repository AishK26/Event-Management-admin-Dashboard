import axios from "axios";

const LOCALURL = "https://demo.internsbee.in";

export const createClient = async (inputValue) => {
  try {
    const response = await axios.post(`${LOCALURL}/api/clients`, inputValue);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error details:", error.response?.data || error.message);
    throw error; // Re-throw the error if you need to handle it further
  }
};
