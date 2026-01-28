import { useRouter } from 'expo-router';
import { NameStep } from  '../../components/Steps.js';
import useRegistration from '../../components/RegistrationContext.js';

export default function Name() {
  const router = useRouter();
  const {
    firstName, setFirstName,
    lastName, setLastName,
    setUsername,
    setPassword,
    setProfilePic,
    errors, setStepError, clearStepError,
    firstNameRef
  } = useRegistration();

  const error = errors.name;

  const onNext = () => {
    if (!firstName.trim()) {
      setStepError('name', 'First name is required');
      firstNameRef.current?.focus();
      return;
    }
    clearStepError('name');
    router.push('/registration/username');
  };

  const onBack = () => {
    setFirstName('');
    setLastName('');
    setUsername('');
    setPassword('');
    setProfilePic(null);
    clearStepError('name');
    clearStepError('username');
    clearStepError('password');
    clearStepError('profilePic');
    router.replace('/login/username');
  };

  return (
      <NameStep
          buttonTitle="Sign in"
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          onBack={onBack}
          onNext={onNext}
          error={error}
          inputRef={firstNameRef}
      />
  );
}