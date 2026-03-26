import React, { useState, useEffect } from 'react';
import Modal from 'react-modal'; // Ensure you have react-modal installed
import ButtonBox from '../ButtonBox/ButtonBox';

const SendProposalModal = ({ isOpen, onClose, quotation }) => {
    const [file, setFile] = useState(null);
    const [email, setEmail] = useState(''); // Initialize empty, will set with useEffect
    const [error, setError] = useState(null);

    // Log the quotation object for debugging
    useEffect(() => {
        if (quotation) {
            console.log("Quotation object:", quotation);
            if (quotation.enquiry_id && quotation.enquiry_id.client_id && quotation.enquiry_id.client_id.email) {
                setEmail(quotation.enquiry_id.client_id.email);
            } else {
                console.warn("Client email not found in the quotation object");
            }
        }
    }, [quotation]); // Re-run whenever the quotation prop changes

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            setError('Please upload a valid PDF file.');
        }
    };

    const handleSendEmail = async () => {
        if (!email) {
            setError('Email is required.');
            return;
        }
        if (!file) {
            setError('Please upload a PDF file.');
            return;
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('pdfFile', file);

        try {
            const response = await fetch('https://demo.internsbee.in/api/client-proposal-email', {
                method: 'POST',
                body: formData,
            });

            // Check if the response content-type is JSON or text
            const contentType = response.headers.get('content-type');
            let result;

            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                result = await response.text(); // For plain text responses
            }

            console.log("Response status:", response.status);
            console.log("Response result:", result);

            if (response.ok) {
                alert('Proposal email sent successfully!');
                onClose();
            } else {
                setError(result.error || 'Failed to send proposal email.');
            }
        } catch (err) {
            console.error("Error during API request:", err);
            setError('Failed to send proposal email.');
        }
    };


    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} ariaHideApp={false}>
            <div className="fixed inset-0 border border-blue-500 rounded-lg bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 shadow-lg ml-12 mt-5">
                <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg">
                    <h2 className="text-xl font-bold mb-4 items-center flex justify-center">Send Proposal Email</h2>
                    <div className='flex justify-between p-4'>
                        <div>
                            <p><strong>Client Name:</strong> {quotation?.enquiry_id?.client_id?.full_name}</p>
                        </div>
                        <div>
                            <p><strong>Email:</strong> {quotation?.enquiry_id?.client_id?.email}</p>
                        </div>
                    </div>
                    <div className='flex justify-between p-4'>
                        <div>
                            <p><strong>Event Name:</strong> {quotation?.enquiry_id?.event_name}</p>
                        </div>
                        <div>
                            <p><strong>Event Date:</strong> {new Date(quotation?.enquiry_id?.event_date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <label className="block mt-4 p-4">
                        Attach PDF:
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="w-full mt-2 p-2 border rounded"
                        />
                    </label>

                    {error && <p className="text-red-500 mt-2">{error}</p>}

                    <div className="mt-4 flex justify-end">
                        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Close</button>
                        <ButtonBox
                        onClick={handleSendEmail} label="Send Email" />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SendProposalModal;
