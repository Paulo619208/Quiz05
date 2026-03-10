import React from 'react'

function ChatForm({ onSubmit }) {
  const handleFormSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const userMessage = formData.get('message')
    onSubmit(userMessage)
  }

  return (
    <form className='chat-form' onSubmit={handleFormSubmit}>
      <input type='text' className='chat-input' placeholder='Type your message...' />
      <button type='submit' className='chat-submit-btn'>Send</button>
    </form>
  )
}

export default ChatForm