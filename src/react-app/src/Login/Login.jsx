import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import googlelogo from "../../assets/googleLogo.png"

import "./Login.css"

const githubLink = "https://github.com/username-YG/Google-Drive-Project-ASP"

function UsernameInput({ username, setUsername, error, translations, language }) {
  return (
    <div className="input-and-error">
      <div className={`floating-input ${error ? "error" : ""}`}>
        <input
          id="usernameInput"
          type="text"
          placeholder=" "
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="usernameInput">{translations[language].username}</label>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">!</span>
          {translations[language].enterUsernameError}
        </div>
      )}
    </div>
  )
}

function PasswordInput({ 
  password, 
  setPassword, 
  error, 
  showPassword, 
  setShowPassword,
  translations,
  language,
  userNotExistFlag
}) {
  return (
    <div className="input-and-error">
      <div className={`floating-input ${(error || userNotExistFlag) ? "error" : ""}`}>
        <input
          id="passwordInput"
          type={showPassword ? "text" : "password"}
          placeholder=" "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="passwordInput">{translations[language].password}</label>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">!</span>
          {translations[language].enterPasswordError}
        </div>
      )}

      {userNotExistFlag && (
        <div className="error-message">
          <span className="error-icon">!</span>
          {translations[language].userNotExist}
        </div>
      )}

      <label className="show-box">
        <input
          id="showPasswordInput"
          type="checkbox"
          checked={showPassword}
          onChange={(e) => setShowPassword(e.target.checked)}
        />
        <span>{translations[language].showPassword}</span>
      </label>
    </div>
  )
}

function LoginActions({ 
  step,
  onNext, 
  onBack, 
  navigate,
  translations,
  language
}) {
  return (
    <div className="login-actions">
      {step === "username" && (
        <button
          type="button"
          className="create-button"
          onClick={() => navigate("/register")}
        >
          {translations[language].createAccount}
        </button>
      )}

      {step === "password" && (
        <button
          type="button"
          className="create-button"
          onClick={onBack}
        >
          {translations[language].back}
        </button>
      )}

      <button
        type="button"
        className="next-button"
        onClick={onNext}
      >
        {translations[language].next}
      </button>
    </div>
  )
}

function LoginRight({
  step,
  username,
  setUsername,
  password,
  setPassword,
  error,
  showPassword,
  setShowPassword,
  navigate,
  onNext,
  onBack,
  translations,
  language,
  userNotExistFlag
}) {
  return (
    <form 
      className="login-right"
      onSubmit={(e) => { e.preventDefault(); onNext(); }}
    >
      <div className="login-input">
        {step === "username" && (
          <UsernameInput
            username={username}
            setUsername={setUsername}
            error={error}
            translations={translations}
            language={language}
          />
        )}

        {step === "password" && (
          <PasswordInput
            password={password}
            setPassword={setPassword}
            error={error}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            translations={translations}
            language={language}
            userNotExistFlag = {userNotExistFlag}
          />
        )}
      </div>

      <LoginActions
        step={step}
        onNext={onNext}
        onBack={onBack}
        navigate={navigate}
        translations={translations}
        language={language}
      />
    </form>
  )
}

function LoginLeft({ step, translations, language }) {
  return (
    <div className="login-left">
      <img className="google-logo" alt="Logo" src={googlelogo} />
      {step === "username" && (
        <div>
          <h1>{translations[language].signIn}</h1>
          <p>{translations[language].continue}</p>
        </div>
      )}
      {step === "password" && (
        <h1>{translations[language].welcome}</h1>
      )}
    </div>
  )
}

function LoginCard({ children }) {
  return (
    <div className="login-page">
      <div className="login-card">{children}</div>
    </div>
  )
}

function Language({ language, setLanguage }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const langs = {
    en: "English (United States)",
    he: "עברית",
  }

  return (
    <div className="language-selector" ref={menuRef}>
      <button
        className={`language-button ${open ? "open" : ""}`}
        onClick={() => setOpen(prev => !prev)}
        type="button"
      >
        <span className="language-label">
          {langs[language]}
        </span>

        <span className="dropdown-icon" aria-hidden />
      </button>

      {open && (
        <ul className="language-menu">
          <li onClick={() => { setLanguage("en"); setOpen(false); }}>
              English (United States)
          </li>

          <li onClick={() => { setLanguage("he"); setOpen(false); }}>
              עברית
          </li>
        </ul>
      )}
    </div>
  )
}

function Login() {
  const navigate = useNavigate()

  const [step, setStep] = useState("username")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [language, setLanguage] = useState("en")
  const [userNotExistFlag, setUserNotExistFlag] = useState(false)

const translations = {
  en: {
    signIn: "Sign in",
    continue: "to continue to the app",
    username: "Username",
    password: "Enter your password",
    next: "Next",
    createAccount: "Create account",
    back: "Back",
    showPassword: "Show password",
    enterUsernameError: "Enter a username",
    enterPasswordError: "Enter a password",
    userNotExist: "Wrong password. Try again.",
    welcome: "Welcome",
    help: "Help",
    privacy: "Privacy",
    terms: "Terms",
  },
  he: {
    signIn: "כניסה",
    continue: "המשך אל האפליקציה",
    username: "שם משתמש",
    password: "צריך להזין את הסיסמה",
    next: "הבא",
    createAccount: "יצירת חשבון חדש",
    back: "חזרה",
    showPassword: "הצגת הסיסמה",
    enterUsernameError: "הזן שם משתמש",
    enterPasswordError: "יש להזין סיסמה",
    userNotExist: "הסיסמה שגויה. אפשר לנסות שוב.",
    welcome: "ברוך הבא",
    help: "עזרה",
    privacy: "פרטיות",
    terms: "תנאים",
  },
}


  const isRTL = language === "he";

  // When the user clicks next, validate fields and then move or submit
  const handleNext = async () => {
    if (step === "username") {
      if (!username.trim()) { // Error when username empty 
        setError(true)
        return
      }
      setError(false)
      setUsername(username.trim())
      setStep("password")
    } else {
      if (!password.trim()) { // Error when password empty 
        setError(true)
        return
      }

      setError(false)

      try {
        // Send details to server
        const port = import.meta.env.VITE_WEB_PORT || 3000;
        const response = await fetch(`http://localhost:${port}/api/tokens`, {
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
            sessionStorage.setItem("token", data.token)
            const locationHeader = response.headers.get('Location'); 
            sessionStorage.setItem("id", locationHeader.split('/').pop())
            navigate('/home');
        } else {
            setUserNotExistFlag(true); // Wrong password error (same error if user doesn't exist)
        }
      } catch (err) {}
    };
  }

  // When the user click on going back
  const handleBack = () => {
    setPassword("")
    setStep("username")
    setError(false)
    setShowPassword(false)
  }

  return (
    <div className="login-wrapper" dir={isRTL ? "rtl" : "ltr"}>
      <LoginCard>
        <LoginLeft
          step={step}
          translations={translations}
          language={language}
        />

        <LoginRight
          step={step}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          error={error}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          navigate={navigate}
          onNext={handleNext}
          onBack={handleBack}
          translations={translations}
          language={language}
          userNotExistFlag = {userNotExistFlag}
        />
      </LoginCard>

      <footer className="login-footer">
        <Language 
          language={language}
          setLanguage={setLanguage} 
        />

        <div className="footer-links">
          <a onClick={() => window.open(githubLink) }>{translations[language].help}</a>
          <a href="#">{translations[language].privacy}</a>
          <a href="#">{translations[language].terms}</a>
        </div>
      </footer>
    </div>
  )
}

export default Login