import React from 'react'
import ChatbotIcon from '../components/ChatbotIcon'
import ChatForm from '../components/ChatForm'
import ChatMessage from '../components/ChatMessage'

function HomeScreen() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [chatHistory, setChatHistory] = React.useState([])
    const chatBodyRef = React.useRef(null)
    const logoutHandler = () => {
        localStorage.removeItem('userInfo')
        window.location.href = '/login'
    }
    const generateBotResponse = (userMessage) => {}
  return (
        <>
      <div className='home-topbar'>
        <button type='button' className='logout-btn' onClick={logoutHandler}>
          Logout
        </button>
      </div>

      <div className='chatbot-container'>
      {isOpen ? (
        <div className='chatbot-popup'>
          <div className='chatbot-header'>
            <div className='header-info'>
              <ChatbotIcon />
              <h2 className='logo-text'>Cutie</h2>
            </div>
            <button
              type='button'
              className='close-btn material-symbols-outlined'
              onClick={() => setIsOpen(false)}
              aria-label='Close chat'
              title='Close chat'
            >
              keyboard_arrow_down
            </button>
          </div>

          <div className='chat-body' ref={chatBodyRef}>
            <div className='message bot-message'>
              <ChatbotIcon />
              <p className='message-text'>Hello! How can I assist you today?</p>
            </div>

            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>

          <div className="chat-footer">
            <ChatForm chatHistory={chatHistory}  setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
          </div>
        </div>
      ) : (
        <button className='chatbot-toggle-btn' onClick={() => setIsOpen(true)} title="Open Chat">
          <ChatbotIcon />
        </button>
      )}
      </div>
    </>
  )
}

export default HomeScreen