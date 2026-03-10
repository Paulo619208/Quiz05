import React from "react";

function Loader({ size = "medium", light = false }) {
  const sizeClass =
    size === "small"
      ? "loader-small"
      : size === "large"
        ? "loader-large"
        : "loader-medium";
  const colorClass = light ? "loader-light" : "loader-dark";

  return (
    <span
      className={`loader ${sizeClass} ${colorClass}`}
      role="status"
      aria-label="Loading"
    >
      <span className="loader-dot" />
      <span className="loader-dot" />
      <span className="loader-dot" />
    </span>
  );
}

export default Loader;
