import React, { useState, useEffect } from "react";
import InputField from "../InputField/InputField"; // Adjust the import path as necessary
import ButtonBox from "../ButtonBox/ButtonBox";

const ClientEditModal = ({ isOpen, onClose, clientData, onSave }) => {
    const [formData, setFormData] = useState({});
    const [isChanged, setIsChanged] = useState(false); // Track if any field has changed

    useEffect(() => {
        if (clientData) {
            setFormData(clientData); // Set initial form data from clientData prop
        }
    }, [clientData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setIsChanged(true); // Mark as changed when any input changes
    };

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
        handleChange(e); // Ensure it updates formData
    };
    

    const handleEmailInput = (e) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(e.target.value)) {
            e.target.setCustomValidity("Please enter a valid email address");
        } else {
            e.target.setCustomValidity("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form submission
        const { full_name, email, contact_number, address } = formData;
    
        // Validate required fields only if they are modified
        if (isChanged) {
            if (!full_name) {
                alert("Please fill in the Name field.");
                return;
            }
            if (!email) {
                alert("Please fill in the Email field.");
                return;
            }
            if (!contact_number) {
                alert("Please fill in the Contact Number field.");
                return;
            }
            if (contact_number.length !== 10) {
                alert("Please enter a valid 10-digit contact number.");
                return;
            }
            if (!address) {
                alert("Please fill in the Address field.");
                return;
            }
        }
    
        onSave(formData); // Send the updated client data back to the parent component
    };
    

    return (
        <div className="fixed inset-0 border border-blue-500 rounded-lg bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 shadow-lg ml-12 mt-5">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg">
                <h2 className="text-xl font-bold mb-4 flex justify-center">Edit Client</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <InputField
                            label="Name"
                            type="text"
                            name="full_name"
                            value={formData.full_name || ''}
                            onChange={(e) => {
                                handleCharInput(e);
                                handleChange(e);
                            }}
                            className="modal-input"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <InputField
                            label="Address"
                            type="text"
                            name="address"
                            value={formData.address || ''}
                            onChange={(e) => {
                                handleCharInput(e);
                                handleChange(e);
                            }}
                            className="modal-input"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <InputField
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={(e) => {
                                handleEmailInput(e);
                                handleChange(e);
                            }}
                            className="modal-input"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <InputField
                            label="Contact No"
                            type="text"
                            name="contact_number"
                            value={formData.contact_number || ''}
                            onChange={(e) => {
                                handleContactNumberInput(e);
                                handleChange(e);
                            }}
                            className="modal-input"
                            required
                        />
                    </div>

                    <div className="flex justify-center gap-5">
                        <div>
                            <ButtonBox
                                label="Save"
                                type="submit" // Change to 'submit' to trigger form submission
                                className="button-box bg-blue-600 text-white"
                            />
                        </div>
                        <div>
                            <ButtonBox
                                label="Close"
                                onClick={onClose}
                                className="button-box bg-blue-600 text-white"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientEditModal;
