import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from "axios";

const AuthModal = ({ setShowModal, isSignUp }) => {

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  let navigate = useNavigate();
  // console.log(email, password, confirmPassword)

  const handleClick = () => {
    setShowModal(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if ( isSignUp && (password !== confirmPassword )) {
        setError("Passwords do not match")
        return
      }
      
      // we save the API response
      // we also need to pass through the email and password to the backend
      // `if its signup, return signup. Else return login`
      // we are saving the response because we want to store the email, userId, and token as cookies
      const response = await axios.post(`http://localhost:8000/${isSignUp ? 'signup' : 'login'}`, { email, password })

      // we set the cookie AuthToken to be whatever the response.data.token is, which is returned sanitized from a function in 'index.js'
      setCookie('AuthToken', response.data.token)
      setCookie('UserId', response.data.userId)

      // if the status is 201, we know the user was created successfully
      const success = response.status === 201

      // if it is successful, we take them to the onboarding page
      if (success && isSignUp) navigate('/onboarding')

      // if its not signup, send them to the dashboard
      if (success && !isSignUp) navigate('/dashboard')

      // this is necessary for the logout function to work. The auth token gets read by /onboarding and /dashboard as well. 
      window.location.reload()


    } catch (error) {
      console.log(error)
    }
  }



  return (
    <div className='auth-modal'>
      <div className='close-icon' onClick={handleClick}>ⓧ</div>
      <h2>{isSignUp ? 'CREATE ACCOUNT' : 'LOG-IN'}</h2>
      <p>Terms of Service go here</p>

      <form onSubmit={handleSubmit}>
        <input 
          type='email' 
          id='email'
          name='email'
          placeholder='email' 
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type='password' 
          id='password'
          name='password'
          placeholder='password' 
          required={true}
          onChange={(e) => setPassword(e.target.value)}
        />    
        {isSignUp && 
          <input // only show this if isSignUp is true
            type='password' 
            id='password-check'
            name='password-check'
            placeholder='confirm password' 
            required={true}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        }
        <input className='secondary-button' type='submit' />
        <p>{error}</p>
      </form>
      <hr />
      <h2>DOWNLOAD NOW!</h2>
    </div>
  )
}

export default AuthModal