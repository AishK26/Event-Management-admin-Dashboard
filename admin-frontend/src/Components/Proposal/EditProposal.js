import React, { useEffect, useState } from "react";
import "./Proposal.css";
import InputField from "./../InputField/InputField";
import ButtonBox from "../ButtonBox/ButtonBox";
import { getEnquiryById } from "../../Services/Enquiry";
import { createProposal } from "../../Services/ProposalApi";
import ProposalInput from "./ProposalInput";
import { useParams } from "react-router-dom";
import Sidebar from "../SideBar/SideBar";
import jsPDF from "jspdf";
import "jspdf-autotable";

const EditProposal = () => {
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      fetchEnquiry();
    }
  }, [id]);
  const fetchEnquiry = async () => {
    try {
      const response = await getEnquiryById(id);
      setEnquiry(response?.result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after the fetch
    }
  };
  const [terms, setTerms] = useState([
    "The confirmation of the artist depends on first-come-first-serve basis in terms of booking amounts.",
    // ... (other terms)
  ]);
  const [newTerm, setNewTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState([]);
  const [enquiry, setEnquiry] = useState({});
  const [stock, setStock] = useState({ stock_Name: "", purchaseQuantity: "", rate_per_days: "", days: "" });
  const [transport, setTransport] = useState("");
  const [transportAmount, setTransportAmount] = useState("");
  const [servicesAmount, setServicesAmount] = useState("");
  const [totalStock, setTotalStock] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  const CGST_RATE = 0.09;
  const SGST_RATE = 0.09;

  useEffect(() => {
    if (id) {
      fetchEnquiry();
    }
  }, [id]);


  const handleAddStock = () => {
    if (!stock.stock_Name || !stock.purchaseQuantity || !stock.rate_per_days || !stock.days) {
      alert("Please fill all stock fields.");
    } else {
      const amount = stock.purchaseQuantity * stock.rate_per_days * stock.days;
      if (amount > 0) {
        setRequirements([...requirements, { ...stock, amount }]);
        updateTotals();
        setStock({ stock_Name: "", purchaseQuantity: "", rate_per_days: "", days: "" });
      }
    }
  };

  const updateTotals = () => {
    const stockTotal = requirements.reduce((sum, req) => sum + (parseFloat(req.amount) || 0), 0);
    const cgstAmount = stockTotal * CGST_RATE;
    const sgstAmount = stockTotal * SGST_RATE;
    const validTransportAmount = parseFloat(transportAmount) || 0;
    const validServicesAmount = parseFloat(servicesAmount) || 0;

    const grand_total = stockTotal + validTransportAmount + validServicesAmount + cgstAmount + sgstAmount;

    setTotalStock(stockTotal);
    setCgst(cgstAmount);
    setSgst(sgstAmount);
    setGrandTotal(grand_total.toFixed(2));
  };

  useEffect(() => {
    updateTotals();
  }, [requirements, transportAmount, servicesAmount]);
  const handleSaveProposal = async () => {
    if (!enquiry._id || !requirements.length) {
      alert("Please fill out the proposal correctly before saving.");
      return;
    }
    
    const proposalData = {
      enquiry_id: enquiry._id,
      customerName: enquiry.customer_name,
      requirements,
      transport,
      transport_amount: parseFloat(transportAmount),
      services_amount: parseFloat(servicesAmount),
      sub_total: totalStock,
      cgst,
      sgst,
      grand_total: grandTotal, // Update this line
    };
  
    try {
      await createProposal(proposalData); // Save proposal
      alert("Proposal saved successfully!");
    } catch (error) {
      console.error("Error saving proposal:", error);
      alert("Error saving proposal.");
    }
  };
  
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    // ... (PDF generation logic)
    doc.save("proposal.pdf");
  };

  const handleCharInput = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
  };

  const handleRemoveStock = (indexToRemove) => {
    const updatedRequirements = requirements.filter((_, index) => index !== indexToRemove);
    setRequirements(updatedRequirements);
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="flex proposal">
      <Sidebar />
      <div className="bg-indigo-100 flex-grow-1 items-center mt-14 h-full w-full">
        <div className="min-h-screen flex flex-col justify-start p-4 ">
          <div className="heading-proposal flex justify-between items-center w-full max-w-4xl mb-2">
            <h1 className="text-4xl font-bold text-gray-800">Quotation Form {enquiry.client_id?.full_name || "N/A"}</h1>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-10 p-4">
            <h3 className="text-center md:text-left">Event Name: {enquiry?.event_name}</h3>
            <h3 className="text-center md:text-left">Event Date: {enquiry?.event_date}</h3>
          </div>

          {/* Stock dropdown and input fields */}
          <div className="flex gap-4 mt-3 px-4 py-6 proposal-stock-otheramount">
            <div className="w-full md:w-1/2">
              <div className="mb-4 p-2">
                <InputField
                  onInput={handleCharInput}
                  label="Add Stock"
                  placeholder="e.g: Sound"
                  value={stock.stock_Name}
                  onChange={(e) => setStock({ ...stock, stock_Name: e.target.value })}
                />
              </div>

              {/* Grid for Quantity, Price, Days, and Amount */}
              <div className="grid grid-cols-4 gap-4 p-2">
                <ProposalInput
                  label="Quantity"
                  type="number"
                  value={stock.purchaseQuantity}
                  onChange={(e) => setStock({ ...stock, purchaseQuantity: +e.target.value })}
                />
                <ProposalInput
                  label="Price"
                  type="number"
                  value={stock.rate_per_days}
                  onChange={(e) => setStock({ ...stock, rate_per_days: +e.target.value })}
                />
                <ProposalInput
                  label="Days"
                  type="number"
                  value={stock.days}
                  onChange={(e) => setStock({ ...stock, days: +e.target.value })}
                />
                <ProposalInput
                  label="Amount"
                  value={stock.purchaseQuantity * stock.rate_per_days * stock.days}
                  readOnly
                />
              </div>

              {/* Button for Adding Stock */}
              <div className="mt-5 flex justify-end md:ml-auto">
                <ButtonBox label="Add Stock" className="p-4" onClick={handleAddStock} />
              </div>
            </div>

            {/* Transport and Services Input Section */}
            <div className="w-full md:w-1/2">
              <div className="p-2">
                <InputField
                  onInput={handleCharInput}
                  label="Transport Type"
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                />
              </div>
              <div className="p-2">
                <InputField
                  label="Transport Charges"
                  type="number"
                  value={transportAmount}
                  onChange={(e) => setTransportAmount(e.target.value)}
                />
              </div>
              <div className="p-2">
                <InputField
                  label="Services Amount"
                  type="number"
                  value={servicesAmount}
                  onChange={(e) => setServicesAmount(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Proposal Table */}
          <div className="overflow-x-auto w-full mt-4">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-200 p-2">Stock Name</th>
                  <th className="border border-gray-200 p-2">Quantity</th>
                  <th className="border border-gray-200 p-2">Price</th>
                  <th className="border border-gray-200 p-2">Days</th>
                  <th className="border border-gray-200 p-2">Amount</th>
                  <th className="border border-gray-200 p-2">Remove</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((req, index) => (
                  <tr key={index}>
                    <td className="border border-gray-200 p-2">{req.stock_Name}</td>
                    <td className="border border-gray-200 p-2">{req.purchaseQuantity}</td>
                    <td className="border border-gray-200 p-2">{req.rate_per_days}</td>
                    <td className="border border-gray-200 p-2">{req.days}</td>
                    <td className="border border-gray-200 p-2">{req.amount}</td>
                    <td className="border border-gray-200 p-2 text-center">
                      <button onClick={() => handleRemoveStock(index)} className="text-red-500">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Calculation */}
          <div className="mt-6">
            <h3>Total Stock: {totalStock.toFixed(2)}</h3>
            <h3>CGST: {cgst.toFixed(2)}</h3>
            <h3>SGST: {sgst.toFixed(2)}</h3>
            <h3>Grand Total: {grandTotal}</h3>
          </div>

          {/* Save and Download buttons */}
          <div className="flex justify-between mt-4">
            <ButtonBox label="Save Proposal" onClick={handleSaveProposal} />
            <ButtonBox label="Download PDF" onClick={handleDownloadPDF} />
          </div>

          {/* Terms Section */}
          <div className="mt-6">
            <h3>Terms and Conditions:</h3>
            <ul>
              {terms.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ul>
            <div className="flex items-center">
              <input
                type="text"
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
                placeholder="Add New Term"
              />
              <button onClick={() => { if (newTerm) { setTerms([...terms, newTerm]); setNewTerm(""); }}}>Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProposal;
