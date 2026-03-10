import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";
import {
  fetchConversations,
  fetchConversationDetail,
  sendMessage,
  clearActiveConversation,
  addOptimisticMessage,
} from "../slices/conversationSlice";
import ConversationItem from "../components/ConversationItem";
import Message from "../components/Message";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";

function HomeScreen() {
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { list, activeConversation, messages, loading, sendingMessage, error } =
    useSelector((state) => state.conversations);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchConversations());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSelectConversation = (id) => {
    dispatch(fetchConversationDetail(id));
  };

  const handleNewChat = () => {
    dispatch(clearActiveConversation());
    setInput("");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sendingMessage) return;

    const conversationId = activeConversation?._id || null;

    dispatch(
      addOptimisticMessage({
        role: "user",
        content: trimmed,
        id: `opt-${Date.now()}`,
      }),
    );
    dispatch(
      addOptimisticMessage({
        role: "__thinking__",
        content: "",
        id: `think-${Date.now()}`,
      }),
    );

    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    dispatch(sendMessage({ message: trimmed, conversationId })).then(
      (result) => {
        if (
          result.meta.requestStatus === "fulfilled" &&
          result.payload.is_new_conversation
        ) {
          dispatch(fetchConversations());
        }
      },
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="home-layout">
      <aside
        className={`sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      >
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={handleNewChat}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New chat
          </button>
          <button
            className="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(false)}
            title="Close sidebar"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>

        <div className="sidebar-conversations">
          {loading && list.length === 0 ? (
            <div className="sidebar-loader">
              <Loader size="small" />
            </div>
          ) : list.length === 0 ? (
            <p className="no-conversations">No conversations yet</p>
          ) : (
            list.map((convo) => (
              <ConversationItem
                key={convo._id}
                conversation={convo}
                isActive={activeConversation?._id === convo._id}
                onClick={() => handleSelectConversation(convo._id)}
              />
            ))
          )}
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {userInfo?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="user-name">{userInfo?.username}</span>
          </div>
          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Sign out"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </aside>

      <main className="chat-main">
        {!sidebarOpen && (
          <button
            className="sidebar-open-btn"
            onClick={() => setSidebarOpen(true)}
            title="Open sidebar"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        )}

        <div className="chat-content">
          {!hasMessages ? (
            <EmptyState onPromptSelect={(prompt) => setInput(prompt)} />
          ) : (
            <div className="messages-container">
              {loading && messages.length === 0 ? (
                <div className="messages-loader">
                  <Loader />
                </div>
              ) : (
                messages.map((msg, index) => (
                  <Message key={msg.id || index} message={msg} />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {error && (
            <div className="chat-error">
              <span>{error}</span>
            </div>
          )}

          <div className="input-area">
            <div className="input-wrapper">
              <form className="input-form" onSubmit={handleSubmit}>
                <textarea
                  ref={textareaRef}
                  className="chat-input"
                  placeholder="Paste a regex pattern to explain, e.g. ^[a-zA-Z0-9]+$"
                  value={input}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  className={`send-btn ${input.trim() && !sendingMessage ? "send-btn-active" : ""}`}
                  disabled={!input.trim() || sendingMessage}
                  title="Send message"
                >
                  {sendingMessage ? (
                    <Loader size="small" light />
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  )}
                </button>
              </form>
              <p className="input-hint">
                Regex Explainer only explains regex patterns. It will not write
                or debug regex.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomeScreen;
