import { useState } from 'react';

import Nav from '../components/Nav';
import AuthModal from '../components/AuthModal';
import { useCookies } from 'react-cookie';




const Home = () => {

  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  const authToken = cookies.AuthToken

  const handleClick = () => {

    if (authToken) {
      removeCookie('UserId', cookies.UserId);
      removeCookie('AuthToken', cookies.AuthToken);
      window.location.reload();
      return;
    }


    setShowModal(true) //if you click on it, the modal will show
    setIsSignUp(true)

  }

  return (
    <div className="overlay">

      <Nav
        authToken={authToken}
        minimal={false}
        setShowModal={setShowModal}
        showModal={showModal}
        setIsSignUp={setIsSignUp} //we pass through the option to change that into the navbar. So that when we click on the button it goes into 'Nav.js' and changes the state (and setIsSignUp to false)
      />

      <div className="home">
        <h1 className="primary-title">Love Bugs</h1>
        <button className="primary-button" onClick={handleClick}>
          {authToken ? 'Logout' : 'Create Account'}
        </button>

        {showModal && (
          <AuthModal setShowModal={setShowModal} isSignUp={isSignUp} />
        )}

      </div>
    </div>
  )
}

export default Home