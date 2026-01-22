import { createContext, useContext, useState, useRef } from 'react';

const RegistrationContext = createContext(null);

export function RegistrationProvider({ children }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', username: '', password: '', profilePic: '' });
  const [profilePic, setProfilePic] = useState(null);

  const firstNameRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const setStepError = (step, message) => {
    setErrors(prev => ({
      ...prev,
      [step]: message,
    }));
  };

  const clearStepError = (step) => {
    setErrors(prev => ({
      ...prev,
      [step]: '',
    }));
  };


  return (
    <RegistrationContext.Provider
      value={{
        firstName, setFirstName,
        lastName, setLastName,
        username, setUsername,
        password, setPassword,
        profilePic, setProfilePic,
        errors, setStepError, clearStepError,
        firstNameRef,
        usernameRef,
        passwordRef
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

export const useRegistration = () => useContext(RegistrationContext);