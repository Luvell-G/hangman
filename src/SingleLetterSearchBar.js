import React, { useState } from 'react';

function SingleLetterSearchBar({ onSearch }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      onSearch(input.trim().toLowerCase()); 
      setInput(""); 
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        maxLength="1"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a letter"
        style={{ marginRight: "10px" }} 
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SingleLetterSearchBar;
