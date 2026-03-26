import React, { useEffect, useState } from "react";
import "./Proposal.css";
import InputField from "./../InputField/InputField";
import ButtonBox from "../ButtonBox/ButtonBox";
import { getEnquiryById } from "../../Services/Enquiry";
import { createProposal } from "../../Services/ProposalApi";
import ProposalInput from "./ProposalInput";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useParams } from "react-router-dom";
import Sidebar from "../SideBar/SideBar";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Proposal = ({ }) => {
  const { id } = useParams();
  const [terms, setTerms] = useState([
    "The confirmation of the artist depends on first-come-first-serve basis in terms of booking amounts.",
    "Amount once paid are non-refundable with any other date or event.",
    "100% Guarantee cannot be given on technical equipment.",
    "There would be use of Artificial Flowers unless mentioned separately.",
    "All Cheques / DD to be paid favoring 'Tutons Events LLP'.",
    "All necessary Permissions/Clearances required for the event & work at the Site/Venue.",
    "Payment: 50% Before the event & 50% after delivery, within 30 Days.",
    "The above Quote is valid for 60 Days from the date of Quote.",
    "18% GST is applicable on Total Billing.",
  ]);
  const [newTerm, setNewTerm] = useState("");

  const handleAddTerm = () => {
    if (newTerm.trim()) {
      setTerms([...terms, newTerm.trim()]);
      setNewTerm("");
    }
  };

  const [requirements, setRequirements] = useState([]);
  const [enquiry, setEnquiry] = useState({});
  const [stock, setStock] = useState({
    stock_Name: "",
    purchaseQuantity: "",
    rate_per_days: "",
    days: "",
  });
  const [transport, settransport] = useState("");
  const [transport_amount, settransport_amount] = useState("");
  const [services_amount, setservices_amount] = useState("");
  const [totalStock, setTotalStock] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [grand_total, setGrandTotal] = useState(0);

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
    }
  };
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


  const handleAddTransport = () => {
    // Update totals and other calculations with transport charges
    updateTotals();
  };

  const updateTotals = () => {
    // Ensure all values used in calculations are numbers
    const stockTotal = requirements.reduce((sum, req) => sum + (parseFloat(req.amount) || 0), 0);

    // Calculate CGST and SGST (assuming 9% each)
    const cgstAmount = stockTotal * 0.09;
    const sgstAmount = stockTotal * 0.09;

    // Ensure transport_amount is a valid number or default to 0
    const validtransport_amount = parseFloat(transport_amount) || 0;

    // Ensure services_amount is a valid number or default to 0
    const validServicesAmount = parseFloat(services_amount) || 0;

    // Grand total calculation ensuring all values are numbers
    const grand_total =
      stockTotal +
      validtransport_amount +
      validServicesAmount +
      cgstAmount +
      sgstAmount;

    // Set state values
    setTotalStock(stockTotal);
    setCgst(cgstAmount);
    setSgst(sgstAmount);
    setGrandTotal(grand_total.toFixed(2));

  };


  useEffect(() => {
    updateTotals();
  }, [requirements, transport_amount, services_amount]);



  const handleSaveProposal = async () => {
    const proposalData = {
      enquiry_id: enquiry._id,
      customerName: enquiry.customer_name,
      requirements: requirements,
      transport,
      transport_amount,
      services_amount : parseFloat(services_amount),
      sub_total: totalStock,
      cgst,
      sgst,
      grand_total,
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
    const margin = 15;
    const padding = 10;
    const smallFontSize = 10;

    // Set Font Size for Title
    doc.setFontSize(16);
    const title = "Quotation";
    const titleWidth = doc.getStringUnitWidth(title) * doc.internal.scaleFactor;
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
    doc.text(title, titleX, margin + padding + 10);

    // Add horizontal line after the title
    const lineY = margin + padding + 15;
    doc.line(margin, lineY, doc.internal.pageSize.width - margin, lineY);

    // Set Font Size for Date and Time
    doc.setFontSize(12);

    const pageWidth = doc.internal.pageSize.width;
    const leftMargin = margin + padding;
    const rightMargin = pageWidth - margin - padding;
    const topMargin = margin + padding;

    const date = new Date();
    const currentDate = date.toLocaleDateString();
    const currentTime = date.toLocaleTimeString();

    doc.text(`Date: ${currentDate}`, rightMargin, topMargin + 25, { align: "right" });
    doc.text(`Time: ${currentTime}`, rightMargin, topMargin + 35, { align: "right" });

    const clientRows = [
      ["Customer Name", enquiry?.client_id?.full_name || "N/A"],
      ["Event Date", enquiry?.event_date || "N/A"],
      ["Event Venue", enquiry?.event_venue || "N/A"]
    ];

    const additionalTopMargin = 20;

    // Generate the client details table
    doc.autoTable({
      body: clientRows,
      startY: margin + padding + additionalTopMargin,
      margin: { left: leftMargin },
      theme: 'grid',
      tableWidth: 'wrap',
    });

    // Add Stock Table
    const stockColumns = ["Stock", "Quantity", "Price", "Days", "Amount"];
    const stockRows = requirements.map((req) => [
      req.stock_Name,
      req.purchaseQuantity,
      req.rate_per_days,
      req.days,
      req.amount,
    ]);

    const yAfterEnquiryTable = doc.lastAutoTable.finalY + 10;

    doc.autoTable({
      head: [stockColumns],
      body: stockRows,
      startY: yAfterEnquiryTable,
      margin: { left: leftMargin, right: margin },
    });

    // Add Totals and Other Info in Table Format
    const yAfterStockTable = doc.lastAutoTable.finalY + 10;
    const pointsMargin = 30; // 40px converted to points (approximately)

    const totalsRows = [
      ["Transport Type", transport],
      ["Services", services_amount],
      ["Transport Charges", transport_amount],
      ["Stock Total", totalStock],
      ["CGST (9%)", cgst],
      ["SGST (9%)", sgst],
      ["Grand Total", grand_total]
    ];

    doc.autoTable({
      body: totalsRows,
      startY: yAfterStockTable,
      margin: { left: pointsMargin, right: pointsMargin }, // Apply 40px margin in points
      theme: 'grid',
      tableWidth: 'auto',
    });

    // Add Terms and Conditions Section
    const termsY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(smallFontSize);
    doc.text("Terms and Conditions", leftMargin, termsY);

    // Numbering and adding Terms
    const termsWithNumbers = terms.map((term, index) => `${index + 1}. ${term}`);

    let currentY = termsY + 10;
    const lineHeight = 5; // Adjust line height for minimal spacing

    termsWithNumbers.forEach((term) => {
      const termLines = doc.splitTextToSize(term, pageWidth - 2 * leftMargin);
      termLines.forEach((line) => {
        doc.text(line, leftMargin, currentY);
        currentY += lineHeight; // Adjust the line height as needed
      });
    });

    // Draw Border
    doc.rect(margin, margin, pageWidth - 2 * margin, doc.internal.pageSize.height - 2 * margin);

    // Save the PDF
    doc.save("proposal.pdf");
  };



  // Handle name, email, contact, Account No.,ifsc code input validations
  const handleCharInput = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
  };
  const handleRemoveStock = (indexToRemove) => {
    const updatedRequirements = requirements.filter((_, index) => index !== indexToRemove);
    setRequirements(updatedRequirements); // Assuming you're using state for `requirements`
  };
  

  return (
    <div className="flex proposal">
      <Sidebar />
      <div className=" bg-indigo-100 flex-grow-1 items-center mt-14 h-full w-full">
        <div className="min-h-screen flex flex-col justify-start p-4 ">
          <div className="heading-proposal flex justify-between items-center w-full max-w-4xl mb-2">
            <h1 className="text-4xl font-bold text-gray-800"> Quotation Form {enquiry.client_id?.full_name || "N/A"}</h1>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-10 p-4">
            <h3 className="text-center md:text-left">Event Name: {enquiry?.event_name}</h3>

            <h3 className="text-center md:text-left">Event Date: {enquiry?.event_date}</h3>
          </div>

          {/* Stock dropdown and input fields */}
          <div className="flex gap-4 mt-3 px-4 py-6 proposal-stock-otheramount">
            {/* Stock Input Section */}
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
                <div className="col-span-4 md:col-span-1">
                  <ProposalInput
                    label="Quantity"
                    type="number"
                    value={stock.purchaseQuantity}
                    onChange={(e) =>
                      setStock({ ...stock, purchaseQuantity: +e.target.value })
                    }
                  />
                </div>
                <div className="col-span-4 md:col-span-1">
                  <ProposalInput
                    label="Price"
                    type="number"
                    value={stock.rate_per_days}
                    onChange={(e) =>
                      setStock({ ...stock, rate_per_days: +e.target.value })
                    }
                  />
                </div>
                <div className="col-span-4 md:col-span-1">
                  <ProposalInput
                    label="Days"
                    type="number"
                    value={stock.days}
                    onChange={(e) => setStock({ ...stock, days: +e.target.value })}
                  />
                </div>
                <div className="col-span-4 md:col-span-1">
                  <ProposalInput
                    label="Amount"
                    value={stock.purchaseQuantity * stock.rate_per_days * stock.days}
                    readOnly
                  />
                </div>
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
                  onChange={(e) => settransport(e.target.value)}
                />
              </div>
              <div className="p-2">
                <InputField
                  label="Transport Charges"
                  type="number"
                  value={transport_amount}
                  onChange={(e) => settransport_amount(e.target.value)}
                />
              </div>
              <div className="p-2">
                <InputField
                  label="Services Amount"
                  type="number"
                  value={services_amount}
                  onChange={(e) => setservices_amount(e.target.value)}
                />
              </div>
            </div>
          </div>


          {/* Proposal Table */}
          <div className="overflow-x-auto w-full mt-4">
          <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="rounded-2xl">
            <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">
              <th className="px-6 py-2 text-left text-4xs font-bold text-black uppercase tracking-wider">Sr. No</th>
              <th className="px-6 py-2 text-left text-4xs font-bold text-black uppercase tracking-wider">Stock</th>
              <th className="px-6 py-2 text-left text-4xs font-bold text-black uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-2 text-left text-4xs font-bold text-black uppercase tracking-wider">Price</th>
              <th className="px-6 py-2 text-left text-4xs font-bold text-black uppercase tracking-wider">Days</th>
              <th className="px-6 py-2 text-left text-4xs font-bold text-black uppercase tracking-wider">Amount</th>
              <th className="px-6 py-2 text-left text-4xs font-bold text-black uppercase tracking-wider">Remove</th>
            </tr>
          </thead>
          <tbody>
            {requirements.map((req, index) => (
              <tr key={index} className="flex relative justify-between w-full border border-gray-300 rounded-lg mb-1 bg-white hover:bg-blue-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-blue-400 transition-all duration-300">
                <td className="px-6 py-2 text-left text-2xs font-medium text-black tracking-wider">{index + 1}</td>
                <td className="px-6 py-2 text-left text-2xs font-medium text-black tracking-wider">{req.stock_Name}</td>
                <td className="px-6 py-2 text-left text-2xs font-medium text-black tracking-wider">{req.purchaseQuantity}</td>
                <td className="px-6 py-2 text-left text-2xs font-medium text-black tracking-wider">{req.rate_per_days}</td>
                <td className="px-6 py-2 text-left text-2xs font-medium text-black tracking-wider">{req.days}</td>
                <td className="px-6 py-2 text-left text-2xs font-medium text-black tracking-wider">{req.amount}</td>
                <td className="px-6 py-2 text-left text-2xs font-medium text-black tracking-wider">
       
                  <button
                  onClick={() => handleRemoveStock(index)}
                  // className="text-red-500 hover:text-red-700"
                  className="flex items-center justify-center bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-3 rounded"
                >
                  <RiDeleteBin6Line size={20} />
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        

          </div>
          <div className="flex gap-10 mt-7 flex-col md:flex-row justify-center p-4">
            <div className="w-full">
              <div>
                <table className="min-w-full border border-gray-300 rounded-lg">
                  <tbody className="rounded-2xl">
                    <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">

                      <td className="px-6  py-2   text-left text-2xs font-medium text-black  tracking-wider">
                        <strong>Transport Type: </strong>
                      </td>
                      <td className="px-6  py-2   text-left text-2xs font-medium text-black  tracking-wider">{transport}</td>
                    </tr>
                    <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">

                      <td className="px-6  py-2   text-left text-2xs font-medium text-black  tracking-wider">
                        <strong>Transport Charges: </strong>
                      </td>
                      <td className="px-6  py-2   text-left text-2xs font-medium text-black  tracking-wider">{transport_amount}</td>
                    </tr>
                    <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">

                      <td className="px-6  py-2   text-left text-2xs font-medium text-black  tracking-wider">
                        <strong>Services amount: </strong>
                      </td>
                      <td className="px-6  py-2   text-left text-2xs font-medium text-black  tracking-wider">{services_amount}</td>
                    </tr>
                    <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">

                      <td className="px-6  py-2   text-left text-2xs font-medium text-black  tracking-wider">
                        <strong>Stock Total: </strong>
                      </td>
                      <td className="px-6  py-2   text-left text-2xs font-medium text-black  tracking-wider">{totalStock}</td>
                    </tr>
                    <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">

                      <td className="px-6  py-2   text-left text-2xs font-medium text-black  tracking-wider">
                        <strong>CGST (9%): </strong>
                      </td>
                      <td className="px-6  py-2   text-left text-2xs font-medium text-black  tracking-wider">{cgst}</td>
                    </tr>
                    <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">

                      <td className="px-6  py-2   text-left text-2xs font-medium text-black  tracking-wider">
                        <strong>SGST (9%): </strong>
                      </td>
                      <td className="px-6  py-2   text-left text-2xs font-medium text-black  tracking-wider">{sgst}</td>
                    </tr>
                    <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">

                      <td className="px-6  py-2   text-left text-2xs font-medium text-black  tracking-wider">
                        <strong>Grand Total: </strong>
                      </td>
                      <td className="px-6  py-2   text-left text-2xs font-medium text-black  tracking-wider">{grand_total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="overflow-x-auto w-full">

              <div className="proposal-container w-full md:w-auto">
                <div
                  className="terms-box p-4 mb-4 border border-blue-800 rounded-lg bg-white"
                  style={{ width: "100%", maxWidth: "40rem" }}
                >
                  <h2 className="text-xl font-bold mb-2">
                    Terms and Conditions
                  </h2>
                  <div className="max-h-40 overflow-y-auto border border-blue-800 p-2">
                    <ul className="list-disc list-inside">
                      {terms.map((term, index) => (
                        <li key={index}>{term}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="add-term-container mt-4 flex gap-10">
                    <div className="p-1">
                      <InputField
                        label="Add New Term"
                        placeholder="Enter a new term..."
                        value={newTerm}
                        onChange={(e) => setNewTerm(e.target.value)}
                      />
                    </div>
                    <ButtonBox
                      label="Add Term"
                      className="mt-2 p-2"
                      onClick={handleAddTerm}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-10 p-4">
            <ButtonBox
              label="Save"
              className="p-4"
              onClick={handleSaveProposal}
            />

            <ButtonBox label="Download PDF" className="p-4" onClick={handleDownloadPDF} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proposal;
