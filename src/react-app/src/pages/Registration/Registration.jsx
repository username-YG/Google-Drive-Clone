import React, { useState, useRef } from 'react';
import './Registration.css';
// Importing the local logo from your assets folder
import googleLogo from "../../../assets/google_logo.png";

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
        <p className="display-subtitle">Enter your details to continue to Drive</p>
    </div>
);

/**
 * Sub-Component: Step 1 - Name inputs
 */
const NameStep = ({ formData, handleInputChange }) => (
    <div className="input-group-fade">
        <h2 className="step-label">Enter your name</h2>
        <input
            type="text" name="firstName" placeholder="First name"
            className="google-input-field" onChange={handleInputChange} value={formData.firstName}
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
const UsernameStep = ({ formData, handleInputChange }) => (
    <div className="input-group-fade">
        <h2 className="step-label">Choose your username</h2>
        <input
            type="email" name="username" placeholder="Username (@gmail.com)"
            className="google-input-field" onChange={handleInputChange} value={formData.username}
        />
        <p className="field-hint">You can use letters, numbers & periods</p>
    </div>
);

/**
 * Sub-Component: Step 3 - Password inputs
 */
const PasswordStep = ({ handleInputChange }) => (
    <div className="input-group-fade">
        <h2 className="step-label">Create a strong password</h2>
        <input
            type="password" name="password" placeholder="Password"
            className="google-input-field" onChange={handleInputChange}
        />
        <input
            type="password" name="confirmPassword" placeholder="Confirm"
            className="google-input-field" onChange={handleInputChange}
        />
        <p className="field-hint">Use 8 or more characters with a mix of letters and numbers [cite: 77]</p>
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
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        confirmPassword: '',
        profilePic: null
    });

    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, profilePic: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const validateAndNext = () => {
        if (step === 1 && !formData.firstName) return alert("First name is required");
        if (step === 2 && !formData.username) return alert("Username is required");
        if (step === 3) {
            if (formData.password.length < 8) return alert("Password too short");
            if (formData.password !== formData.confirmPassword) return alert("Passwords do not match");
        }
        setStep(step + 1);
    };

    const handleSubmit = () => {
        const displayName = `${formData.firstName} ${formData.lastName}`.trim();
        console.log("Registering...", { ...formData, displayName });
        // integrate with ASP.NET API [cite: 48, 63]
    };

    return (
        <div className="registration-page">
            <div className="google-rectangular-card">
                <BrandingSection />
                <div className="card-inputs">
                    <div className="step-container">
                        {step === 1 && <NameStep formData={formData} handleInputChange={handleInputChange} />}
                        {step === 2 && <UsernameStep formData={formData} handleInputChange={handleInputChange} />}
                        {step === 3 && <PasswordStep handleInputChange={handleInputChange} />}
                        {step === 4 && (
                            <ProfilePicStep
                                profilePic={formData.profilePic}
                                fileInputRef={fileInputRef}
                                handleFileChange={handleFileChange}
                            />
                        )}
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