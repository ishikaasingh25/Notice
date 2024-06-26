import React, { useState } from 'react';
import { firestore } from '../firebaseConfig';

export default function AddNotice() {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await firestore.collection('notices').add({
        text,
        timestamp: new Date() // Example: Adding a timestamp field
      });
      setText(''); // Clear input field on successful submission
      alert('Notice posted successfully!');
    } catch (error) {
      console.error('Error adding notice:', error);
      alert('Failed to post notice. Please try again.');
    }
  };

  return (
    <div>
      <h2>Add Notice</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your notice here"
          required
        />
        <br />
        <button type="submit">Post Notice</button>
      </form>
    </div>
  );
}
