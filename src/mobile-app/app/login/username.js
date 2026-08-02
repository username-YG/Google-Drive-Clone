import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { UserNameStep } from  '../../components/Steps.js';

export default function Username() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const usernameRef = useRef(null);

  const onNext = () => {
    if (!username.trim()) {
      setError('Enter a username');
      usernameRef.current?.focus();
      return;
    }
    setError('');
    router.push({
      pathname: '/login/password',
      params: { username }
    });
  };

  const onBack = () => {
    setError('');
    setUsername('');
    router.replace('/registration/name')
  };

  return (
      <UserNameStep
          title="Sign in"
          subtitle="Use your account"
          buttonTitle="Create Account"
          username={username}
          setUsername={setUsername}
          onNext={onNext}
          onBack={onBack}
          error={error}
          inputRef={usernameRef}
      />
  );
}