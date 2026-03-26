import axios from "axios";
import React, { useState, useEffect } from "react";
import "./ViewVendor.css";
import Sidebar from "../SideBar/SideBar";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import SearchInput from "../SearchInput/SearchInput";
import { styled } from "@mui/material/styles";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const ViewVendor = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [formData, setFormData] = useState({
    full_Name: "",
    email: "",
    phone_Number: "",
    address: "",
  });

  const [emailError, setEmailError] = useState("");

  // Handle name, email, contact, account No., IFSC code input validations
  const handleCharInput = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
  };

  const handleContactNumberInput = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 10) {
      e.target.value = value.slice(0, 10);
    } else {
      e.target.value = value;
    }
  };

  const handleEmailInput = (e) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(e.target.value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError(""); // Reset error when valid
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      email: e.target.value,
    }));
  };

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 6;

  // Fetch vendors from the API
  const fetchVendors = async () => {
    try {
      const response = await axios.get(
        "https://demo.internsbee.in/api/vendors"
      );
      // setData(response.data);
      setData(Array.isArray(response.data) ? response.data.reverse() : response.data.event.reverse() || []);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      alert("Failed to fetch vendors.");
    }
  };

  // Fetch vendors initially when the component mounts
  useEffect(() => {
    fetchVendors();
  }, []);

  // Handle the edit button click
  const handleEdit = (vendor) => {
    setSelectedVendor(vendor);
    setFormData({
      full_Name: vendor.full_Name,
      email: vendor.email,
      phone_Number: vendor.phone_Number,
      address: vendor.address,
    });
    setShowModal(true);
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle saving changes to the vendor with validation
  const handleSaveChanges = async () => {
    // Check if all mandatory fields are filled
    if (!formData.full_Name || !formData.email || !formData.phone_Number) {
      alert("Please fill in all the required fields.");
      return;
    }

    // Validate email before submitting
    if (emailError) {
      alert(emailError);
      return;
    }

    if (!selectedVendor) return;

    try {
      const response = await axios.patch(
        `https://demo.internsbee.in/api/vendors/${selectedVendor._id}`,
        formData
      );
      console.log("Vendor details updated successfully:", response.data);
      setData((prevData) =>
        prevData.map((vendor) =>
          vendor._id === selectedVendor._id ? { ...vendor, ...formData } : vendor
        )
      );
      setShowModal(false);
      alert(response.data.message);
    } catch (error) {
      console.error("Error updating vendor data:", error);
      alert("Failed to update vendor details.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const filteredData = data.filter((vendor) =>
    vendor.full_Name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Paginate the filtered data
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Handle cancelling the edit
  const handleCancel = () => {
    setShowModal(false);
  };

  // Handle deleting a vendor
  const handleDelete = async (vendorId) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        const response = await axios.delete(
          `https://demo.internsbee.in/api/vendors/${vendorId}`
        );
        setData((prevData) =>
          prevData.filter((vendor) => vendor._id !== vendorId)
        );
        alert(response.data.message);
      } catch (error) {
        console.error("Error deleting vendor data:", error);
        alert("Failed to delete vendor.");
      }
    }
  };

  

  return (
    <>
     

      <div className="w-full h-full  px-4 vendor-content">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <h1 className="text-4xl font-bold  text-center ">View Vendors</h1>
          <div className="w-full md:w-1/2 lg:w-1/3">
            <SearchInput
              placeholder="Search By Name"
              onChange={handleSearchChange}
              style={{ width: "100%" }}
              className="border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="">
          <div className="overflow-x-auto w-full mt-4">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="rounded-2xl">
                <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">
                  <th className="px-6  w-12 py-2 text-left textbold text-black uppercase tracking-wider">
                    Sr.No
                  </th>
                  <th className="px-6  w-36 py-2 text-left text-4xs font-bold text-black uppercase tracking-wider">
                    Vendor Name
                  </th>
                  <th className="px-6  w-36 py-2 text-left text-4xs font-bold text-black uppercase tracking-wider">
                    Email ID
                  </th>
                  <th className="px-6  w-20 py-2 text-left text-4xs font-bold text-black uppercase tracking-wider">
                    Contact No.
                  </th>
                  <th className="px-6  w-36 py-2 text-left text-4xs font-bold text-black uppercase tracking-wider ">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="relative">
                {data.length <= 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      LOADING...
                    </td>
                  </tr>
                ) : (
                  currentEntries.map((vendor, index) => (
                    <tr
                      key={vendor._id}
                      className="flex relative justify-between w-full border border-gray-300 rounded-lg mb-1 bg-white hover:bg-blue-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-blue-400 transition-all duration-300"
                    >
                      <td className="px-6  w-12 py-2     text-left text-2xs font-medium text-black uppercase tracking-wider">
                        {(currentPage - 1) * entriesPerPage + index + 1}
                      </td>
                      <td className="px-6  w-36 py-2     text-left text-2xs font-medium text-black tracking-wider">
                        {vendor.full_Name}
                      </td>
                      <td className="px-6  w-36 py-2     text-left text-2xs font-medium text-black tracking-wider">
                        {vendor.email}
                      </td>
                      <td className="px-6  w-20 py-2     text-left text-2xs font-medium text-black tracking-wider">
                        {vendor.phone_Number}
                      </td>
                      <td className="px-6  w-36 py-4 text-sm font-medium flex gap-2">
                        <button
                          onClick={() => handleEdit(vendor)}
                          // className="text-blue-500 hover:text-blue-700"
                          className="flex items-center justify-center bg-blue-800 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                        >
                          <MdOutlineModeEditOutline size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(vendor._id)}
                          // className="text-red-500 hover:text-red-700"
                          className="flex items-center justify-center bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-3 rounded"
                        >
                          <RiDeleteBin6Line size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="pagination  flex justify-center items-center mt-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            <FaChevronLeft />
          </button>
          <span className="pagination-info mx-2">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
      {/* </div>
      </div> */}

      {showModal && (
        <div className="model">
          <div className="model-content">
            <h2>Edit Vendor Details</h2>
            <div className="model-body">
              <label>
                Vendor Name<span>*</span>:
                <input
                  type="text"
                  name="full_Name"
                  value={formData.full_Name}
                  onChange={handleInputChange}
                  onInput={handleCharInput}
                  required
                />
                
              </label>
              <label>
                Email<span>*</span>:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onInput={handleEmailInput}
                  required
                />
                 {emailError && (
                    <p className="text-red-500 text-xs italic">{emailError}</p>
                  )}
              </label>
              <label>
                Contact No.<span>*</span>:
                <input
                  type="text"
                  name="phone_Number"
                  value={formData.phone_Number}
                  onChange={handleInputChange}
                  onInput={handleContactNumberInput}
                  required
                /> 
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div className="model-footer">
              <button className="save-button" onClick={handleSaveChanges}>
                Save
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewVendor;
