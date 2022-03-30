import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import {RiLogoutBoxLine} from 'react-icons/ri'



const ChatHeader = ({ user }) => {
  const navigate = useNavigate()
  const [cookies, setCookie, removeCookie] = useCookies(['user'])

  const logout = () => {
    removeCookie('UserId', cookies.UserId)
    removeCookie('AuthToken', cookies.AuthToken)
    navigate('/')
  }

  return (
    <div className='chat-container-header'>
      <div className='profile' >
        <div className='img-container' >
          <img src={user.url} alt={'photo of ' + user.url} />
        </div>
        <h3>{user.first_name}</h3>
      </div>
      {/* <i className='log-out-icon'>{RiLogoutBoxLine}</i> */}
      <RiLogoutBoxLine className='log-out-icon' onClick={logout}/>
    </div>
  )
}

export default ChatHeader