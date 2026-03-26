import axios from 'axios';

const LOCALURL = 'https://demo.internsbee.in';
const token = localStorage.getItem('jwtToken');


// create enquriy
export const createEnquiry = async (enquiryData) => {
  try {
    const response = await axios.post(`${LOCALURL}/api/enquiry/add`, enquiryData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Enquiry created successfully', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating enquiry', error);
    throw error;
  }
};


//createEnquiry(enquiryData);

// get enquiry 

export const getEnquiryById = async (id) => {
    try {
      console.log(id)
      const response = await axios.get(`${LOCALURL}/api/enquiry/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Enquiry details', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching enquiry', error);
      throw error;
    }
  };


export const getEnquiries = async () => {
    try {
      const response = await axios.get(`${LOCALURL}/api/enquiry`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Enquiries', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching enquiries', error);
      throw error;
    }
  };

  export const updateEnquiry = async (enquiryId, updateData) => {
    try {
      const response = await axios.patch(
        `${LOCALURL}/api/enquiry/update/${enquiryId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Enquiry updated successfully", response);
      return response;
    } catch (error) {
      console.error("Error updating Enquiry", error);
      throw error;
    }
  };

  // Example usage
 // const enquiryId = 'enquiryIdHere';
  //getEnquiryById(enquiryId);

  
  export const assignManagerToEnquiry = async (enquiryId, managerId) => {
    try {
      const response = await axios.patch(`${LOCALURL}/api/enquiry/${enquiryId}/assign-manager/${managerId}`, {
        assign_manager_id: managerId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Manager assigned successfully', response.data);
      return response.data;
    } catch (error) {
      console.error('Error assigning manager', error);
      throw error;
    }
  };



 
  
 
  
  // Example usage
  //const enquiryId = 'enquiryIdHere';
  //const managerId = 'managerIdHere';
  //assignManagerToEnquiry(enquiryId, managerId);
  