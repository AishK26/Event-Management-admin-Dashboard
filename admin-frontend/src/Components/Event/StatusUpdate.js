import React, { useState, useEffect } from "react";
import { FaSearch, FaCalendarAlt, FaEye } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchInput from "../SearchInput/SearchInput";
import ButtonBox from "../ButtonBox/ButtonBox";
import { getEnquiries, updateEnquiry } from "../../Services/Enquiry";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../SideBar/SideBar";

const StatusUpdate = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterEnquiries = () => {
    let filtered = enquiries;

    if (searchTerm) {
      filtered = filtered.filter(
        (enquiry) =>
          enquiry.client_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          enquiry.event_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        (enquiry) => new Date(enquiry.event_date) >= startDate
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (enquiry) => new Date(enquiry.event_date) <= endDate
      );
    }

    setFilteredEnquiries(filtered);
  };

  const fetchEnquiries = async () => {
    try {
      const response = await getEnquiries();
      console.log("result", response.result);
      setEnquiries(response.result);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  useEffect(() => {
    filterEnquiries();
  }, [searchTerm, startDate, endDate, enquiries]);

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      const updatedEnquiry = await updateEnquiry(enquiryId, {
        status: newStatus,
      });
      setEnquiries((prevEnquiries) =>
        prevEnquiries.map((enquiry) =>
          enquiry._id === enquiryId
            ? { ...enquiry, status: newStatus }
            : enquiry
        )
      );
    } catch (error) {
      console.error("Error updating enquiry status:", error);
    }
  };

  return (
    <div className="felx">
      <Sidebar />
      <div className="h-screen w-full bg-indigo-100 flex justify-center">
        <div className="flex justify-center">
          <div>
            <div className="flex justify-between items-center w-full max-w-4xl mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Proposal Status Update
              </h1>
            </div>

            <SearchInput
              placeholder="Search By Event or Customer Name"
              onChange={handleSearchChange}
            />

            <div className="mt-6 flex justify-between w-full max-w-4xl gap-5">
              <div className="w-full max-w-xs">
                <label className="block text-lg font-medium text-gray-800 mb-2">
                  From
                </label>
                <div className="relative w-full max-w-md">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="DD-MM-YYYY"
                    className="w-full py-2 pl-10 pr-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bg-blue-800"
                  />
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div className="w-full max-w-xs">
                <label className="block text-lg font-medium text-gray-800 mb-2">
                  To
                </label>
                <div className="relative w-full">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="DD-MM-YYYY"
                    className="w-full py-2 pl-10 pr-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bg-blue-800"
                  />
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex justify-end w-full max-w-4xl mt-6 space-x-4">
              {/*<ButtonBox
              label="Apply"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full"
              onClick={filterEnquiries}
            />*/}
              <ButtonBox
                label="Clear"
                className="bg-blue-800 hover:bg-blue-400 hover:text-black text-white font-bold py-3 px-8 rounded-full"
                onClick={() => {
                  setSearchTerm("");
                  setStartDate(null);
                  setEndDate(null);
                }}
              />
            </div>
          </div>
        </div>
        {loading ? (
          <div className="mt-6 text-center">Loading...</div>
        ) : (
          <div className="mt-6 px-4 sm:px-6 lg:px-8 p-1 ml-7">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[550px] table-auto border-collapse border border-gray-300 left-10 bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">
                      Client Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Contact
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Email</th>

                    <th className="border border-gray-300 px-4 py-2">
                      Event Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Event Date
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Event Budget
                    </th>

                    <th className="border border-gray-300 px-4 py-2">Status</th>
                    <th className="border border-gray-300 px-4 py-2">View</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnquiries.length > 0 ? (
                    filteredEnquiries.map((enquiry) => (
                      <tr key={enquiry._id}>
                        <td className="border border-gray-300 px-4 py-2">
                          {enquiry.client_name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {enquiry.contact}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {enquiry.email}
                        </td>

                        <td className="border border-gray-300 px-4 py-2">
                          {enquiry.event_name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {enquiry.event_date
                            ? new Date(enquiry.event_date).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {enquiry.event_budget}
                        </td>

                        <td className="border border-gray-300 px-4 py-2">
                          <select
                            value={enquiry.status ?? "Pending"}
                            onChange={(e) =>
                              handleStatusChange(enquiry._id, e.target.value)
                            }
                            className="bg-white border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Closed">Closed</option>
                            <option value="Confirmed">Confirmed</option>
                          </select>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button className="flex items-center justify-center bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            <FaEye className="text-lg" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="11"
                        className="border border-gray-300 px-4 py-2 text-center"
                      >
                        No enquiries found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusUpdate;
