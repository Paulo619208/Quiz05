import React from "react";

function FormComponent({ children, onSubmit }) {
  return (
    <form className="form-component" onSubmit={onSubmit} noValidate>
      {children}
    </form>
  );
}

export default FormComponent;
