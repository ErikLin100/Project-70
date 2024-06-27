import React from 'react';

const InputField = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Enter YouTube video link"
      className="border border-gray-300 rounded-3xl px-4 py-2 mb-4 w-full max-w-md"
      value={value}
      onChange={onChange}
    />
  );
};

export default InputField;