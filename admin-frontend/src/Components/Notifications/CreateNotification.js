import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const CreateNotification = () => {
    const [emails, setEmails] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const emailArray = emails.split(',').map(email => email.trim());
    
        try {
            const response = await fetch('https://demo.internsbee.in/api/send-emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emails: emailArray,
                    subject,
                    message,
                }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error:', error.message);
        }
    };
    
    

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Emails (comma-separated)"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                fullWidth
                required
            />
            <TextField
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                fullWidth
                required
            />
            <TextField
                label="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                multiline
                rows={4}
                fullWidth
                required
            />
            <Button type="submit" variant="contained" color="primary">
                Send Notification
            </Button>
        </form>
    );
};

export default CreateNotification;
