import { useState, useEffect } from 'react'
import axios from 'axios'

import Chat from './Chat'
import ChatInput from './ChatInput'


const ChatDisplay = ({ user, clickedUser }) => {

  const [usersMessages, setUsersMessages] = useState(null)
  const [clickedUsersMessages, setClickedUsersMessages] = useState(null)

  const userId = user?.user_id
  const clickedUserId = clickedUser?.user_id

  //gets messages from logged in user first
  //params are logged in user and the corresponding user as the clicked user
  const getUsersMessages = async () => {

    try {
      const response = await axios.get('http://localhost:8000/messages', {
        params: { userId: userId, correspondingUserId: clickedUserId }
      })    
      
      setUsersMessages(response.data)

    } catch (error) {
      console.log(error)
    }
  } 

  const getClickedUsersMessages = async () => {

    try {
      const response = await axios.get('http://localhost:8000/messages', {
        params: { userId: clickedUserId, correspondingUserId: userId }
      })    
      
      setClickedUsersMessages(response.data)

    } catch (error) {
      console.log(error)
    }
  } 
  
  //gets messages anytime they've changed. We call it twice so we can show the messages either way.
  useEffect(() => {
    getUsersMessages()
    getClickedUsersMessages()
  }, [usersMessages, clickedUsersMessages])

  // Formats messages
  const messages = []

  usersMessages?.forEach(message => {
    const formattedMessage = {}
    formattedMessage['name'] = user?.first_name   
    formattedMessage['img'] = user?.url
    formattedMessage['message'] = message.message
    formattedMessage['timestamp'] = message.timestamp
 
    messages.push(formattedMessage)
  })

  clickedUsersMessages?.forEach(message => {
    const formattedMessage = {}
    formattedMessage['name'] = clickedUser?.first_name   
    formattedMessage['img'] = clickedUser?.url
    formattedMessage['message'] = message.message
    formattedMessage['timestamp'] = message.timestamp
 
    messages.push(formattedMessage)
  })

  //sorts messages in descending order
  const descendingOrderMessages = messages?.sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  return (
    <>
      <Chat descendingOrderMessages={descendingOrderMessages} />
      <ChatInput />
    </>
  )
}

export default ChatDisplay