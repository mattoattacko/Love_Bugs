import React from 'react'
import {RiLogoutBoxLine} from 'react-icons/ri'



const ChatHeader = () => {
  return (
    <div className='chat-container-header'>
      <div className='profile' >
        <div className='img-container' >
          <img src='' />
        </div>
        <h3>UserName</h3>
      </div>
      {/* <i className='log-out-icon'>{RiLogoutBoxLine}</i> */}
      <RiLogoutBoxLine className='log-out-icon'/>
    </div>
  )
}

export default ChatHeader