import { useState } from 'react'

import ChatDisplay from './ChatDisplay'
import ChatHeader from './ChatHeader'
import MatchesDisplay from './MatchesDisplay'

const ChatContainer = ({ user }) => {

  const [clickedUser, setClickedUser] = useState(null)

  console.log('=====', user)

  return (
    <div className='chat-container'>
      <ChatHeader user={user} />

      <div>
        {/* Matches onClick will setClickedUser*/}
        <button className='option' onClick={() => setClickedUser(null)}>Matches</button>
        <button className='option' disabled={!clickedUser} >Chat</button>
      </div>

      {/* If theres no clicked user, we show the matches display */}
      {!clickedUser && <MatchesDisplay matches={user.matches} setClickedUser={setClickedUser} />}

      {/* If theres a clicked user, we show the chat display */}
      {clickedUser && <ChatDisplay user={user} clickedUser={clickedUser} />}

    </div>
  )
}

export default ChatContainer