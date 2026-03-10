import React from "react";
import Loader from "./Loader";

function Message({ message }) {
  const { role, content } = message;

  if (role === "__thinking__") {
    return (
      <div className="message-row message-row-assistant">
        <div className="message-avatar message-avatar-bot">
          <svg
            width="16"
            height="16"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="40" height="40" rx="8" fill="#10a37f" />
            <text
              x="8"
              y="28"
              fontFamily="monospace"
              fontSize="18"
              fontWeight="bold"
              fill="white"
            >
              .*
            </text>
          </svg>
        </div>
        <div className="message-bubble message-bubble-assistant">
          <Loader size="small" />
        </div>
      </div>
    );
  }

  const isUser = role === "user";

  const formatContent = (text) => {
    if (!text) return "";
    return text
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />");
  };

  return (
    <div
      className={`message-row ${isUser ? "message-row-user" : "message-row-assistant"}`}
    >
      {!isUser && (
        <div className="message-avatar message-avatar-bot">
          <svg
            width="16"
            height="16"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="40" height="40" rx="8" fill="#10a37f" />
            <text
              x="8"
              y="28"
              fontFamily="monospace"
              fontSize="18"
              fontWeight="bold"
              fill="white"
            >
              .*
            </text>
          </svg>
        </div>
      )}
      <div
        className={`message-bubble ${isUser ? "message-bubble-user" : "message-bubble-assistant"}`}
        dangerouslySetInnerHTML={{ __html: formatContent(content) }}
      />
      {isUser && <div className="message-avatar message-avatar-user">U</div>}
    </div>
  );
}

export default Message;
