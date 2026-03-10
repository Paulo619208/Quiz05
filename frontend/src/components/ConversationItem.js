import React from "react";

function ConversationItem({ conversation, isActive, onClick }) {
  const { title, updated_at } = conversation;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <button
      className={`conversation-item ${isActive ? "conversation-item-active" : ""}`}
      onClick={onClick}
      title={title}
    >
      <svg
        className="conversation-icon"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
      <div className="conversation-info">
        <span className="conversation-title">
          {title || "New Conversation"}
        </span>
        <span className="conversation-date">{formatDate(updated_at)}</span>
      </div>
    </button>
  );
}

export default ConversationItem;
