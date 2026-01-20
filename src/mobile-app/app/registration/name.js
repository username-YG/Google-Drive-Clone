import { useRouter } from 'expo-router';
import { NameStep } from  '../../components/Steps.js';
import useRegistration from './RegistrationContext';

export default function Name() {
  const router = useRouter();
  const {
    firstName, setFirstName,
    lastName, setLastName,
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

  return (
    <NameStep
      firstName={firstName}
      setFirstName={setFirstName}
      lastName={lastName}
      setLastName={setLastName}
      onNext={onNext}
      error={error}
      inputRef={firstNameRef}
    />
  );
}