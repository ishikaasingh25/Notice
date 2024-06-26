import React, { useEffect, useState } from 'react';
import { firestore } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const snapshot = await firestore.collection('notices').orderBy('timestamp', 'desc').get();
        const noticesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotices(noticesData);
      } catch (error) {
        console.error('Error fetching notices:', error);
      }
    };
    fetchNotices();
  }, []);

  return (
    <div>
      <h2>Notice Board</h2>
      {/* {currentUser && currentUser.role === 'faculty' && <AddNotice />} */}
      <AddNotice />
      <ul>
        {notices.map((notice) => (
          <li key={notice.timestamp}>{notice.text}</li>
        ))}
      </ul>
    </div>
  );
}

function AddNotice() {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await firestore.collection('notices').add({
        text,
        timestamp: new Date()
      });
      setText('');
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
