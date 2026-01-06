import React, { useState, useRef } from 'react';
import './Registration.css';
// Importing the local logo from your assets folder
import googleLogo from "../../../assets/google_logo.png";
import {useNavigate} from "react-router-dom";

/**
 * Sub-Component: Visual error message with red icon
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
 * Sub-Component: The left branding panel
 */
const BrandingSection = () => (
    <div className="card-branding">
        {/* Using only the local asset logo as requested */}
        <img
            src={googleLogo}
            alt="Google Drive"
            className="google-custom-logo"
        />
        <h1 className="display-title">Create a Google Account</h1>
        <p className="display-subtitle">Please enter your details to sign up to Drive</p>
    </div>
);

/**
 * Sub-Component: Step 1 - Name inputs
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
 * Sub-Component: Step 2 - Username input
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
 * Sub-Component: Step 3 - Password inputs
 */
const PasswordStep = ({ handleInputChange, hasError }) => (
    <div className="input-group-fade">
        <h2 className="step-label">Create a strong password</h2>
        <input
            type="password" name="password" placeholder="Password"
            className={`google-input-field ${hasError ? 'input-error' : ''}`}
            onChange={handleInputChange}
        />
        <input
            type="password" name="confirmPassword" placeholder="Confirm"
            className={`google-input-field ${hasError ? 'input-error' : ''}`}
            onChange={handleInputChange}
        />
        <p className="field-hint">Use 8 or more characters with a mix of letters and numbers</p>
    </div>
);

/**
 * Sub-Component: Step 4 - Profile Picture
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
    const navigate = useNavigate(); // Initialize the navigate function
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', username: '',
        password: '', confirmPassword: '', profilePic: null
    });

    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (error) setError(""); // Clear error when user types
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, profilePic: reader.result });
            };
            reader.readAsDataURL(file); // [cite: 80, 81]
        }
    };

    const validateAndNext = () => {
        setError(""); // Clear previous errors

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

    const handleSubmit = () => {
        if (!formData.profilePic) return setError("Please upload a profile picture");
        const displayName = `${formData.firstName} ${formData.lastName}`.trim();
        console.log("User Registered Successfully:", { ...formData, displayName });
        // Redirect to login page
        navigate('/login');
    };

    return (
        <div className="registration-page">
            <div className="google-rectangular-card">
                <BrandingSection />
                <div className="card-inputs">
                    <div className="step-container">
                        {step === 1 && <NameStep formData={formData} handleInputChange={handleInputChange} hasError={!!error} />}
                        {step === 2 && <UsernameStep formData={formData} handleInputChange={handleInputChange} hasError={!!error} />}
                        {step === 3 && <PasswordStep handleInputChange={handleInputChange} hasError={!!error} />}
                        {step === 4 && (
                            <ProfilePicStep
                                profilePic={formData.profilePic}
                                fileInputRef={fileInputRef}
                                handleFileChange={handleFileChange}
                            />
                        )}
                        <ErrorDisplay error={error} />
                    </div>

                    <div className="card-navigation">
                        {step > 1 && (
                            <button className="secondary-action" onClick={() => setStep(step - 1)}>Back</button>
                        )}
                        <div className="flex-grow"></div>
                        <button
                            className="primary-action"
                            onClick={step === 4 ? handleSubmit : validateAndNext}
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