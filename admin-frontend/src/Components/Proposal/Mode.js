import React from 'react';
import ReactDOM from 'react-dom';
import ButtonBox from '../ButtonBox/ButtonBox';

const Modal = ({ isOpen, onClose, quotation }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 border border-blue-500 rounded-lg bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 shadow-lg ml-12 mt-5">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg">
        <h2 className="text-xl font-bold mb-4 flex justify-center">Quotation Details</h2>
        <div>
          <div className='flex gap-6 p-2'>
    

            <p><strong>Client Name:</strong> {quotation.enquiry_id?.client_id?.full_name || "N/A"}</p>
            <p><strong>Event Name:</strong> {quotation.enquiry_id.event_name}</p>

          </div>
          <p className='p-2'><strong>Event Date:</strong> {new Date(quotation.enquiry_id.event_date).toLocaleDateString()}</p>
          <div className='p-2'>
            <p><strong>Requirements:</strong></p>
            <ul>
              {quotation.requirements.map((req) => (
                <li key={req._id}>Days: {req.days}, Price: {req.price}</li>
              ))}
            </ul>
          </div>
          <div className='flex gap-14 p-2'>
            <p><strong>Transport:</strong> {quotation.transport}</p>
            <p><strong>Transport Amount:</strong> {quotation.transport_amount}</p>
          </div>
          <p className='p-2'><strong>Sub Total:</strong> {quotation.sub_total}</p>
          <p className='p-2'><strong>CGST:</strong> {quotation.cgst}</p>
          <p className='p-2'><strong>SGST:</strong> {quotation.sgst}</p>
          <p className='p-2'><strong>Grand Total:</strong> {quotation.grand_total}</p>
        </div>
        <div className="flex justify-center">
          <ButtonBox
            label="Close"
            className="font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Close
          </ButtonBox>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
