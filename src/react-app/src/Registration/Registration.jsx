import React, { useState, useRef } from 'react';
import googleLogo from "../../assets/google_logo.png";
import { useNavigate } from "react-router-dom";

import './Registration.css';

/**
 * Sub-Component: Displays validation errors with a red icon
 */
const ErrorDisplay = ({ error }) => {
    if (!error) return null;
    return (
        <div className="error-container">
            <span className="error-icon-circle">!</span>
            <span className="error-text">{error}</span>
        </div>
    );
};

/**
 * Sub-Component: Branding section with the logo and main titles
 */
const BrandingSection = () => (
    <div className="card-branding">
        <img src={googleLogo} alt="Google Drive" className="google-custom-logo" />
        <h1 className="display-title">Create a Google Account</h1>
        <p className="display-subtitle">Please enter your details to sign up to Drive</p>
    </div>
);

/**
 * Step 1: User's first and last name input fields
 */
const NameStep = ({ formData, handleInputChange, hasError }) => (
    <div className="input-group-fade">
        <h2 className="step-label">Enter your name</h2>
        <input
            type="text" name="firstName" placeholder="First name"
            className={`google-input-field ${hasError ? 'input-error' : ''}`}
            onChange={handleInputChange} value={formData.firstName}
        />
        <input
            type="text" name="lastName" placeholder="Last name (Optional)"
            className="google-input-field" onChange={handleInputChange} value={formData.lastName}
        />
    </div>
);

/**
 * Step 2: Username selection field
 */
const UsernameStep = ({ formData, handleInputChange, hasError }) => (
    <div className="input-group-fade">
        <h2 className="step-label">Choose your username</h2>
        <input
            type="text" name="username" placeholder="Username"
            className={`google-input-field ${hasError ? 'input-error' : ''}`}
            onChange={handleInputChange} value={formData.username}
        />
        <p className="field-hint">You can use letters, numbers and periods</p>
    </div>
);

/**
 * Step 3: Password creation and confirmation
 */
const PasswordStep = ({ handleInputChange, hasError }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="input-group-fade">
            <h2 className="step-label">Create a strong password</h2>
            <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className={`google-input-field ${hasError ? 'input-error' : ''}`}
                onChange={handleInputChange}
            />
            <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm"
                className={`google-input-field ${hasError ? 'input-error' : ''}`}
                onChange={handleInputChange}
            />
            <label className="show-password-checkbox">
                <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                />
                <span>Show password</span>
            </label>
            <p className="field-hint">Use 8 or more characters with a mix of letters and numbers</p>
        </div>
    );
};

/**
 * Step 4: Profile picture selection and preview
 */
const ProfilePicStep = ({ profilePic, fileInputRef, handleFileChange }) => (
    <div className="input-group-fade profile-center">
        <h2 className="step-label">Add a profile picture</h2>
        <div className="profile-upload-circle" onClick={() => fileInputRef.current.click()}>
            {profilePic ? (
                <img src={profilePic} alt="Preview" className="preview-image" />
            ) : (
                <span className="upload-plus">+</span>
            )}
        </div>
        <input
            type="file" ref={fileInputRef} onChange={handleFileChange}
            style={{ display: 'none' }} accept="image/*"
        />
    </div>
);

const Registration = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', username: '',
        password: '', confirmPassword: '', profilePic: null
    });

    const fileInputRef = useRef(null);

    /**
     * Updates form data state and clears validation errors
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (error) setError("");
    };

    /**
     * Compresses the uploaded image using Canvas and WebP format
     */
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target.result;
                if (typeof result === 'string') {
                    const img = new Image();
                    img.src = result;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const MAX_WIDTH = 400;
                        const scaleSize = MAX_WIDTH / img.width;
                        canvas.width = MAX_WIDTH;
                        canvas.height = img.height * scaleSize;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        const compressedDataUrl = canvas.toDataURL('image/webp', 0.7);
                        setFormData({ ...formData, profilePic: compressedDataUrl });
                    };
                }
            };
            reader.readAsDataURL(file);
        }
    };

    /**
     * Validates input data for the current step
     */
    const validateAndNext = () => {
        setError("");
        if (step === 1) {
            if (!formData.firstName) return setError("First name is required");
            setStep(2);
        } else if (step === 2) {
            const usernameRegex = /^[a-z0-9.]+$/i;
            if (!formData.username) return setError("Username is required");
            if (!usernameRegex.test(formData.username)) {
                return setError("Sorry, only letters (a-z), numbers (0-9), and periods (.) are allowed.");
            }
            setStep(3);
        } else if (step === 3) {
            if (formData.password.length < 8) return setError("Use 8 characters or more for your password");
            if (formData.password !== formData.confirmPassword) return setError("Those passwords didn't match. Try again.");
            setStep(4);
        }
    };

    /**
     * Submits the final registration payload to the server
     */
    const handleSubmit = async () => {
        if (!formData.profilePic) return setError("Please upload a profile picture");

        const displayName = `${formData.firstName} ${formData.lastName}`.trim();
        const userToRegister = {
            username: formData.username,
            password: formData.password,
            displayName: displayName,
            profilePic: formData.profilePic
        };

        try {
            const response = await fetch("http://localhost:3000/api/users", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userToRegister)
            });

            if (response.status === 201 || response.status === 200) {
                navigate('/login');
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Registration failed.");
            }
        } catch (err) {
            setError("Cannot connect to server.");
        }
    };

    /**
     * Handles form submission to support 'Enter' key navigation
     */
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (step === 4) {
            await handleSubmit();
        } else {
            validateAndNext();
        }
    };

    return (
        <div className="registration-page">
            <div className="google-rectangular-card">
                <BrandingSection />
                <div className="card-inputs">
                    {/* Wrapped in a form to intercept Enter key press */}
                    <form onSubmit={handleFormSubmit} className="step-container">
                        {step === 1 && <NameStep formData={formData} handleInputChange={handleInputChange} hasError={!!error} />}
                        {step === 2 && <UsernameStep formData={formData} handleInputChange={handleInputChange} hasError={!!error} />}
                        {step === 3 && <PasswordStep handleInputChange={handleInputChange} hasError={!!error} />}
                        {step === 4 && <ProfilePicStep profilePic={formData.profilePic} fileInputRef={fileInputRef} handleFileChange={handleFileChange} />}

                        <ErrorDisplay error={error} />

                        {/* Hidden submit button required for browser form submission on Enter */}
                        <button type="submit" style={{ display: 'none' }} />
                    </form>

                    <div className="card-navigation">
                        {step > 1 && (
                            <button type="button" className="secondary-action" onClick={() => setStep(step - 1)}>Back</button>
                        )}
                        <div className="flex-grow"></div>
                        <button
                            type="button"
                            className="primary-action"
                            onClick={async () => {
                                if (step === 4) await handleSubmit();
                                else validateAndNext();
                            }}
                        >
                            {step === 4 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;