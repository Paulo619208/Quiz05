import React from "react";

const EXAMPLE_PROMPTS = [
  { label: "Email validator", value: "^[\\w.-]+@[\\w.-]+\\.\\w{2,}$" },
  {
    label: "URL pattern",
    value: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\\.[a-z]{2,6}",
  },
  { label: "Phone number", value: "^\\+?[1-9]\\d{1,14}$" },
  {
    label: "Date format",
    value: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$",
  },
];

function EmptyState({ onPromptSelect }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <svg
          width="48"
          height="48"
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

      <h1 className="empty-state-title">Regex Explainer</h1>
      <p className="empty-state-subtitle">
        Paste any Regular Expression and I will translate it into plain,
        human-readable English.
      </p>

      <div className="empty-state-features">
        <div className="feature-item">
          <span className="feature-icon">&#10003;</span>
          <span>Breaks down each regex component step by step</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">&#10003;</span>
          <span>
            Explains character classes, quantifiers, anchors and flags
          </span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">&#10003;</span>
          <span>Provides matching examples for clarity</span>
        </div>
        <div className="feature-item feature-item-no">
          <span className="feature-icon-no">&#10007;</span>
          <span>Will not write or debug regex patterns</span>
        </div>
      </div>

      <div className="example-prompts">
        <p className="example-prompts-label">Try an example:</p>
        <div className="example-prompts-grid">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt.label}
              className="example-prompt-btn"
              onClick={() => onPromptSelect(prompt.value)}
            >
              <span className="example-prompt-label">{prompt.label}</span>
              <code className="example-prompt-code">{prompt.value}</code>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmptyState;
