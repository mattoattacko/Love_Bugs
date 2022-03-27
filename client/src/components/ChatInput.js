import axios from 'axios'
import { useState } from 'react'

// We do this so that when we add a new message, we get the old ones as well.
const ChatInput = ({ user, clickedUser, getUsersMessages, getClickedUsersMessages }) => {

  const [textArea, setTextArea] = useState("")  

  //if the user/clickedUser exists, get their user_id
  const userId = user?.user_id
  const clickUserId = clickedUser?.user_id //changed to clickUserId in video

  //we create a new message to add to our message collections
  const addMessage = async () => {
    const message = {
      timestamp: new Date().toISOString(),
      from_userId: userId, 
      to_userId: clickUserId, //changed in video
      message: textArea
    }

    try {
      await axios.post('http://localhost:8000/message', { message })
      getUsersMessages()
      getClickedUsersMessages()
      setTextArea('')
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <div className="chat-input">
      <textarea value={textArea} onChange={(e) => setTextArea(e.target.value)} />
      <button className='secondary-button' onClick={addMessage}>Send</button>
    </div>
  )
}

export default ChatInput