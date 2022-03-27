import lovebugsOG from '../images/lovebugsOG.png'
import lovebugsWhite from '../images/lovebugsWhite.png'


const Nav = ({ authToken, minimal, setShowModal, showModal, setIsSignUp }) => {

  const handleClick = () => {
    setShowModal(true); //if you click on it, the modal will show
    setIsSignUp(false); // false because we are logging in
  }

  
  return (
    <nav>
      <div className="logo-container">
        <img className='logo' src={minimal ? lovebugsOG : lovebugsWhite } alt="logo"  />
      </div>

      {!authToken && !minimal && 
        <button 
          className="nav-button"
          onClick={handleClick}
          disabled={showModal} //This will kinda gray out the button if the modal is open
        >
          Log-In
        </button>}
    </nav>
    
  )
}

export default Nav