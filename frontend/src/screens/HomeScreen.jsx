import React from 'react'
import ChatbotIcon from '../components/ChatbotIcon'
import ChatForm from '../components/ChatForm'
import ChatMessage from '../components/ChatMessage'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

function HomeScreen() {
    const [isOpen, setIsOpen] = useState(false)
    const [chatHistory, setChatHistory] = useState([])
    const chatBodyRef = useRef(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
    if (!userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (!isOpen || !chatBodyRef.current) return;
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [chatHistory, isOpen]);

  const generateBotResponse = async (history) => {
    console.log('Generating bot response for history:', history);
    const userMessage = history[history.length - 1].text;
    history = history.map(({role, text}) => ({role, parts: [{text}]}));
    
    // Replace the temporary thinking message with the final bot response.
    const updateHistory = (text) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."), {role: "model", text}]);
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', requestOptions);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message || 'Failed to generate bot response');
      console.log('Bot response data:', data);
      const apiResponseText = (data.reply || '').trim();
      updateHistory(apiResponseText);
    } catch (error) {
      console.error('Error generating bot response:', error);
    }
  };

    const logoutHandler = () => {
        localStorage.removeItem('userInfo')
        window.location.href = '/login'
    }
    
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
              <h2 className='logo-text'>Regex Assistant</h2>
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
              <p className='message-text'>Hello! I am the Regex Assistant. How can I assist you today?</p>
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