import React from 'react'
import UserIcon from './UserIcon'
import ChatbotIcon from './ChatbotIcon'

function ChatMessage({ chat }) {
  return (
    <div className='usermessage-body'>
        <div className={`message ${chat.role === "model" ? 'bot' : 'user'}-message`}>
        {chat.role === "model" && <ChatbotIcon />}
        <p className='message-text'>{chat.text}</p>
        {chat.role === "user" && <UserIcon />}
        </div>
    </div>
  )
}

export default ChatMessage