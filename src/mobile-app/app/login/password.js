import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { PasswordStep } from  '../../components/Steps.js';
import Constants from 'expo-constants';


export default function Password() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const passwordRef = useRef(null);

  const { username } = useLocalSearchParams();

  const handleSubmit = async () => {
    if (!password) {
      setError('Enter a password');
      passwordRef.current?.focus();
      return;
    }
    setError('');
    
    try {
        // Send details to server
        const hostIp = Constants.expoConfig.hostUri?.split(':')[0];
        const port = Constants.expoConfig.extra?.VITE_WEB_PORT || 3000;
        const response = await fetch(`http://${hostIp}:${port}/api/tokens`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            username: username.trim(), 
            password: password.trim()
          }),
        });

        // On success, save id and token to stoage and go to home screen
        // sessionStorage means data holds only for this tab, so another user can login in another 
        if (response.status === 201 || response.status === 200) {
            const data = await response.json();
            //sessionStorage.setItem("token", data.token)
            const locationHeader = response.headers.get('Location'); 
            //sessionStorage.setItem("id", locationHeader.split('/').pop())
            router.replace('/home');
        } else {
            setError('User does not exist'); // Wrong password error (same error if user doesn't exist)
        }
      } catch (err) {}
  };

  return (
    <PasswordStep
      title="Welcome"
      subtitle=""
      password={password}
      setPassword={setPassword}
      onNext={handleSubmit}
      onBack={() => router.back()}
      error={error}
      inputRef={passwordRef}
    />
  );
}