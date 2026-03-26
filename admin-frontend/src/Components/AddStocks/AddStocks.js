import React, { useState, useEffect } from "react";
import "./AddStocks.css";
import ButtonBox from "../ButtonBox/ButtonBox";
import InputField from "../InputField/InputField";
import Dropdown from "../Dropdown/Dropdown";
import { getVendors } from "../../Services/Vendor";
import { createStock } from "../../Services/Stock";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../SideBar/SideBar";

const AddStock = () => {
  const [inputValue, setInputValue] = useState({}); // Initialize as an empty object
  const [selectedValue, setSelectedValue] = useState("");
  const [vendorOptions, setVendorOptions] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await getVendors();
        const vendors = response; // Adjust according to your API response structure
        const options = vendors.map((vendor) => ({
          label: vendor.full_Name, // Display name in dropdown
          value: vendor._id, // Unique ID or value for selection
        }));
        setVendorOptions(options);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDropdownChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createStock({
        product_category: inputValue.name,
        stock_name: inputValue.stockName,
        quantity: inputValue.quantity,
        price: inputValue.pricePerQuantity,
        vendor_id: selectedValue,
      });

      if (!response) {
        return alert("Something went wrong");
      }

      alert("Stock added successfully");
    } catch (error) {
      alert("Something went wrong");
      console.error(error);
    }
  };

  return (
    <>
    <Navbar/>
    <Sidebar/>
    <div className="min-h-screen flex justify-center mt-7">
      <div className="w-full max-w-3xl px-4 m-7 mt-7">
        <h1 className="text-4xl font-bold mb-6 text-center">Add Stocks</h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
            <InputField
              label="Product Category"
              name="name"
              type="text"
              placeholder="Enter product category"
              onChange={handleChange}
              required
            />
            <InputField
              label="Stock Name"
              name="stockName"
              type="text"
              placeholder="Enter stock name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
            <InputField
              label="Quantity"
              name="quantity"
              type="number"
              placeholder="Enter quantity"
              onChange={handleChange}
              required
            />
            <InputField
              label="Price/Quantity"
              name="pricePerQuantity"
              type="text"
              placeholder="Enter price per quantity"
              onChange={handleChange}
              required
            />
          </div>
          <Dropdown
            title="View Vendors"
            options={vendorOptions}
            selectedValue={selectedValue}
            style={{ background: "lightgray" }}
            handleChange={handleDropdownChange}
          />
          <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
            <ButtonBox
              label="Add Stock"
              type={"submit"}
              className="bg-blue-800 hover:bg-blue-1000 text-white font-bold py-3 px-8 rounded-full w-full md:w-auto"
            />
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default AddStock;
