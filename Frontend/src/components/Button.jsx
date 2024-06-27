import React from 'react';
import '../App.css'; // Adjust the path based on your project structure

const Button = ({ children, onClick }) => {
  return (
    <div className="button-container">
      <button className="button" onClick={onClick}>
        {children}
      </button>
    </div>
  );
};

export default Button;