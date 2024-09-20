import React from 'react';

const EditingOptions = ({ onChange, options }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...options, [name]: value });
  };

  return (
    <div>
      <select name="aspectRatio" onChange={handleChange} value={options.aspectRatio || ''}>
        <option value="">Select Aspect Ratio</option>
        <option value="16:9">16:9</option>
        <option value="9:16">9:16</option>
        <option value="1:1">1:1</option>
      </select>
      <input 
        type="text" 
        name="caption" 
        onChange={handleChange} 
        value={options.caption || ''} 
        placeholder="Add Caption"
      />
      <input 
        type="text" 
        name="gameplayUrl" 
        onChange={handleChange} 
        value={options.gameplayUrl || ''} 
        placeholder="Gameplay Video URL"
      />
    </div>
  );
};

export default EditingOptions;