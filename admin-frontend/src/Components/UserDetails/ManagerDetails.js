import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchInput from "../SearchInput/SearchInput";
import ButtonBox from "../ButtonBox/ButtonBox";
import { getManagers } from "../../Services/Auth"; // Adjust the import according to your file structure
import "./ManagerDetails.css";
import Sidebar from "../SideBar/SideBar";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Ensure you have react-icons installed

const ManagerDetails = () => {
  const [managers, setManagers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredManagers, setFilteredManagers] = useState([]); // State for filtered managers
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 6; // Number of entries per page

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await getManagers();
        console.log("API Response:", response);
        const managersArray = response.result || [];
        if (Array.isArray(managersArray)) {
          setManagers(managersArray);
          setFilteredManagers(managersArray); // Initialize filteredManagers with the full list
        } else {
          console.error("API did not return an array:", managersArray);
          setManagers([]);
          setFilteredManagers([]); // Ensure filteredManagers is also set to an empty array if the response is not as expected
        }
      } catch (error) {
        console.error("Failed to fetch managers", error);
        setManagers([]);
        setFilteredManagers([]); // Ensure filteredManagers is set to an empty array in case of error
      }
    };

    fetchManagers();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = managers.filter(
      (manager) =>
        manager.fullname.toLowerCase().includes(lowercasedQuery) ||
        (manager.contact &&
          manager.contact.toLowerCase().includes(lowercasedQuery))
    );
    setFilteredManagers(filtered);
  }, [searchQuery, managers]);

  const handleViewProfile = (managerId) => {
    navigate(`/manager-profile/${managerId}`);
  };

  // Pagination logic
  const indexOfLastManager = currentPage * entriesPerPage;
  const indexOfFirstManager = indexOfLastManager - entriesPerPage;
  const currentManagers = filteredManagers.slice(
    indexOfFirstManager,
    indexOfLastManager
  );
  const totalPages = Math.ceil(filteredManagers.length / entriesPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center flex-wrap mx-4">
        <h2 className=" sm:text-3xl lg:text-4xl font-bold text-black mx-3 mb-4">Manager Details</h2>

        {/* Search Input */}
       
        <div className="mt-3 w-full md:w-96 ">
          <SearchInput
           placeholder="Search by name,contact"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
        </div>
      </div>

      <div className="flex flex-wrap -m-2 mx-1">
        {currentManagers.length === 0 ? (
          <p>No managers available</p>
        ) : (
          currentManagers.map((manager, index) => (
            <div
              key={index}
              className="p-2 w-full sm:w-1/2 md:w-1/3 px-4 py-4 "
            >
              <motion.div
                className="p-4 rounded-lg border-b-4 translate-x-1 border-r-4 border-white shadow-2xl"
                style={{
                  backgroundImage: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: 3,
                  backgroundImage: "linear-gradient(135deg, #60a5fa, #1e3a8a)",
                  transition: { duration: 0.5 },
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <p className="card-text text-white mb-2">
                  <strong>Manager Name:</strong> {manager.fullname}
                </p>
                <p className="card-text text-gray-100 mb-2">
                  <strong>Email:</strong> {manager.email}
                </p>
                {manager.contact && (
                  <p className="card-text text-white mb-2">
                    <strong>Contact:</strong> {manager.contact}
                  </p>
                )}
                <ButtonBox
                  label="View Profile"
                  style={{ height: "auto" }}
                  className="text-white font-bold py-1 px-8 rounded"
                  onClick={() => handleViewProfile(manager._id)}
                />
              </motion.div>
            </div>
          ))
        )}
      </div>

      {filteredManagers.length > 0 && (
        <div className="pagination flex justify-center items-center py-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button px-4 py-2 bg-gray-200 text-gray-600 rounded-l hover:bg-blue-500 disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          <span className="pagination-info mx-2">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button px-4 py-2 bg-gray-200 text-gray-600 rounded-r hover:bg-blue-500 disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default ManagerDetails;
