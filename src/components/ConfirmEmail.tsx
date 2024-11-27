import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserService } from '../services/UserService';
import { toast } from 'react-toastify';

const ConfirmEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    //const userSvc = new UserService();
// Provide an error handler function for UserService
const errorHandler = (error: any) => {
    console.error('An error occurred:', error);
    toast.error('An unexpected error occurred.');
};
    const userSvc = new UserService(errorHandler);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmationMessage, setConfirmationMessage] = useState('');

    // Helper function to extract query parameters from the URL
    const getQueryParams = (param: string) => {
        return new URLSearchParams(location.search).get(param);
    };

    useEffect(() => {
        // Extract userId and token from the query parameters in the URL
        const userId = getQueryParams('userId');
        const token = getQueryParams('token');

        if (!userId || !token) {
            setConfirmationMessage('Invalid email confirmation link.');
            setIsLoading(false);
            return;
        }

        // Call the API to confirm the email
        userSvc.confirmEmail(userId, token)
            .then((response) => {
                if (response) {
                    setConfirmationMessage('Email confirmed successfully.');
                    toast.success('Email confirmed successfully.');
                    // Optionally, redirect the user to the login page after confirmation
                    navigate('/login');
                } else {
                    setConfirmationMessage('Email confirmation failed.');
                    toast.error('Email confirmation failed.');
                }
            })
            .catch((error) => {
                console.error('Email confirmation error:', error);
                setConfirmationMessage('An error occurred during email confirmation.');
                toast.error('An error occurred during email confirmation.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [location.search, navigate, userSvc]);

    // Show loading spinner or confirmation message
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Email Confirmation</h2>
            <p>{confirmationMessage}</p>
        </div>
    );
};

export default ConfirmEmail;
