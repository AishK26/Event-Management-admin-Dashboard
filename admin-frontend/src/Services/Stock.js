
import axios from "axios";

const LOCALURL = "https://demo.internsbee.in/api";


const axiosClient = axios.create({
  baseURL: LOCALURL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});



export const getStock = async () => {
    try {
        const response = await axiosClient.get("/stock");
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const createStock = async (data) => {
    try {
        const response = await axiosClient.post("/stock/add", data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

