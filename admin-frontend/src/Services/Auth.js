import axios from "axios";

const LOCALURL = "https://demo.internsbee.in"

const token = localStorage.getItem("jwtToken");

// Login function
export const login = async (data) => {
  try {
    const response = await axios.post(`${LOCALURL}/api/admin/login`, data);
    console.log("Login Success", response.data);
    return response.data;
  } catch (err) {
    console.log("Error occurred while running login function", err);
    throw new Error("Login failed: " + (err.response ? err.response.data.message : err.message));
  }
};


export const getAdminById = async (id) => {
  const token = localStorage.getItem("token"); // Get the token from local storage
  try {
    const response = await axios.get(`${LOCALURL}/api/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Admin fetched successfully", response.data);
    return response.data;
  } catch (error) {
    console.log("Error occurred while fetching admin", error);
    throw new Error("Error fetching admin: " + (error.response ? error.response.data.message : error.message));
  }
};

// Create a new admin
export const createAdmin = async (adminData) => {
  try {
    const response = await axios.post(`${LOCALURL}/api/admin/register`, adminData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Admin created successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error occurred while creating admin", error);
    throw new Error("Error creating admin: " + (error.response ? error.response.data.message : error.message));
  }
};

// Update an existing admin by ID
export const updateAdmin = async (id, adminData) => {
  try {
    const response = await axios.patch(`${LOCALURL}/api/admin/${id}`, adminData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log("Admin updated successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error occurred while updating admin", error);
    throw new Error("Error updating admin: " + (error.response ? error.response.data.message : error.message));
  }
};

// Delete an admin by ID
export const deleteAdmin = async (id) => {
  try {
    const response = await axios.delete(`${LOCALURL}/api/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Admin deleted successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error occurred while deleting admin", error);
    throw new Error("Error deleting admin: " + (error.response ? error.response.data.message : error.message));
  }
};


// Manager API operations

// Function to fetch all managers
export const getManagers = async () => {
  try {
    const response = await axios.get(`${LOCALURL}/api/manager`, {
      headers: {
        Authorization: `Bearer ${token}`, // Adding the authorization header
      },
    });
    console.log("Managers fetched successfully", response.data); // Logging the success message
    return response.data; // Ensure this is an array
  } catch (error) {
    console.log("Error occurs while fetching managers", error); // Logging the error message
    throw new Error(
      "Error fetching managers: " + (error.response ? error.response.data.message : error.message)
    );
  }
};

// Function to fetch a manager by ID
export const getManagerById = async (id) => {
  try {
    const response = await axios.get(`${LOCALURL}/api/manager/${id}`, {
      
    });
    console.log("Manager fetched successfully", response.data); // Logging the success message
    return response.data; // Assuming this returns a single manager object
  } catch (error) {
    console.log("Error occurs while fetching manager", error); // Logging the error message
    throw new Error(
      "Error fetching manager: " + (error.response ? error.response.data.message : error.message)
    );
  }
};



// Function to create a new manager
export const createManager = async (managerData) => {
  try {
    console.log(token);
    const response = await axios.post(
      `${LOCALURL}/api/manager/register`,  // Endpoint for creating a manager
      managerData,  // Manager data passed in the request body
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Adding the Authorization header with the token
        },
      }
    );
    return response.data;  // Returning the response data
  } catch (error) {
    console.error(
      "Error in createManager:", 
      error.response ? error.response.data : error.message
    );
    throw new Error(
      "Error creating manager: " + (error.response ? error.response.data.message : error.message)
    );
  }
};

// Function to update an existing manager by ID
export const updateManager = async (id, managerData) => {
  try {
    const response = await axios.patch(`${LOCALURL}/api/manager/update/${id}`, managerData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Manager updated successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error occurs while updating manager by ID", error);
    throw new Error(
      "Error updating manager: " + (error.response ? error.response.data.message : error.message)
    );
  }
};



// Function to delete a manager by ID
export const deleteManager = async (id) => {
  try {
    const response = await axios.delete(`${LOCALURL}/api/manager/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Ensure token is correctly set
      },
    });
    console.log("Manager deleted successfully", response.data); // Log the success message
    return true; // Return true on successful deletion
  } catch (error) {
    console.log("Error occurred while deleting manager by ID:", error); // Log the full error object
    throw new Error(
      "Error deleting manager: " + (error.response ? error.response.data.message : error.message)
    );
  }
};




// Executive API operations

// Function to fetch all executives
export const getExecutives = async () => {
  try {
    const response = await axios.get(`${LOCALURL}/api/executive`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Executives fetched successfully", response.data);
    return response.data;
  } catch (error) {
    console.log("Error occurs while fetching executives", error);
    throw new Error(
      "Error fetching executives: " + (error.response ? error.response.data.message : error.message)
    );
  }
};

// Function to fetch  executive
export const getExecutiveById = async (id) => {
  try {
    const response = await axios.get(`${LOCALURL}/api/executive/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Executive fetched successfully", response.data);
    return response.data;
  } catch (error) {
    console.log("Error occurs while fetching executive", error);
    throw new Error(
      "Error fetching executive: " + (error.response ? error.response.data.message : error.message)
    );
  }
};

// Function to create a new executive
// export const createExecutive = async (executiveData) => {
//   try {
//     // const token = localStorage.getItem('token'); // or however you are retrieving the JWT
//     // if (!token) throw new Error("Authentication token is missing");

//     const response = await axios.post(
//       `${LOCALURL}/api/executive/register`,
//       executiveData,
     
//     );
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error in createExecutive:", 
//       error.response ? error.response.data : error.message
//     );
//     throw new Error(
//       "Error creating executive: " + (error.response ? error.response.data.message : error.message)
//     );
//   }
// };


export const createExecutive = async (executive) => {
  try {
    console.log(token);
    const response = await axios.post(
      `${LOCALURL}/api/executive/register`,  // Endpoint for creating a manager
      executive,  // Manager data passed in the request body
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Adding the Authorization header with the token
        },
      }
    );
    return response.data;  // Returning the response data
  } catch (error) {
    console.error(
      "Error in createManager:", 
      error.response ? error.response.data : error.message
    );
    throw new Error(
      "Error creating manager: " + (error.response ? error.response.data.message : error.message)
    );
  }
};


// Function to update an existing executive by ID
export const updateExecutive = async (id, executiveData) => {
  try {
    const response = await axios.patch(`${LOCALURL}/api/executive/update/${id}`, executiveData, {
      headers: {
        Authorization: `Bearer ${token}`, // Adding the authorization header
      },
    });
    console.log("Executive updated successfully", response.data); // Logging the success message
    return response.data;
  } catch (error) {
    console.log("Error occurs while updating executive by ID", error); // Logging the error message
    throw new Error(
      "Error updating executive: " + (error.response ? error.response.data.message : error.message)
    );
  }
};


// Function to delete an executive by ID
export const deleteExecutive = async (id) => {
  try {
    const response = await axios.delete(`${LOCALURL}/api/executive/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Ensure this token is valid
      },
    });
    console.log("Executive deleted successfully", response.data); // Confirm successful deletion
    return response.data;
  } catch (error) {
    console.error("Error occurs while deleting executive by ID", error.response ? error.response.data : error.message);
    throw new Error(
      "Error deleting executive: " + (error.response ? error.response.data.message : error.message)
    );
  }
};
