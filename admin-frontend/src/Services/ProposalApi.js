import axios from "axios";

const LOCALURL = "https://demo.internsbee.in";

// Create a new proposal (quotation)
export const createProposal = async (proposalData) => {
  try {
    console.log("Sending proposal data:", proposalData); // Log the payload
    const response = await axios.post(`${LOCALURL}/api/quotation/add`, proposalData);
    console.log("Response from server:", response.data); // Log the response
    return response.data;
  } catch (error) {
    console.error("Error in create proposal:", error.response || error.message); // Log detailed error
    throw new Error('Error creating proposal: ' + (error.response?.data?.message || error.message));
  }
};

// Get a quotation by ID
export const getQuotationById = async (id) => {
  try {
    const response = await axios.get(`${LOCALURL}/api/quotation/${id}`);  // GET request to fetch quotation by ID
    return response.data.quotation;  // Returning the quotation object from the response
  } catch (error) {
    console.error(
      "Error in get quotation by ID:", 
      error.response ? error.response.data : error.message
    );
    throw new Error(
      "Error fetching quotation: " + (error.response ? error.response.data.message : error.message)
    );
  }
};

// Get all quotations
export const getAllQuotations = async () => {
  try {
    const response = await axios.get(`${LOCALURL}/api/quotation/`);
    console.log("Response from server:", response.data); // Log the response
    return response.data;  // Adjust based on the actual structure of the response
  } catch (error) {
    console.error("Error in get all quotations:", error.response || error.message); // Log detailed error
    throw new Error('Error fetching all quotations: ' + (error.response?.data?.message || error.message));
  }
};
