import React from 'react';
import { FaTimes } from 'react-icons/fa';
import ButtonBox from '../ButtonBox/ButtonBox';

const DetailsModal = ({ show, handleClose, details }) => {
  if (!show || !details) return null; // Don't render if the modal is closed or no details provided.

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xs py-6 px-4" style={{marginLeft:"20px",maxWidth:"16rem"}}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-center w-full">Event Details</h2>
          <button onClick={handleClose} className="">
            
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <strong>Client Name:</strong> {details.client_id?.full_name || details.client_name }
          </div>
          <div>
            <strong>Event Name:</strong> {details.event_name || 'N/A'}
          </div>
          <div>
            <strong>Event Date:</strong> {details.event_date ? new Date(details.event_date).toLocaleDateString('en-GB') : 'N/A'}
          </div>
          <div>
            <strong>Venue:</strong> {details.event_venue || 'N/A'}
          </div>
          <div>
            <strong>Budget:</strong> {details.event_budget || 'N/A'}
          </div>
          <div>
            <strong>Guest Quantity:</strong> {details.guest_quantity || 'N/A'}
          </div>
          {/* <div>
            <strong>Status:</strong> {details.status || 'N/A'}
          </div> */}
        </div>
        <div className="flex justify-center mt-2">
          <ButtonBox
          label="Close"
            onClick={handleClose}
            className="button-box bg-gray-600 text-white"
          >
            Close
          </ButtonBox>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
