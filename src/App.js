// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import SignUp from './components/Signup';
import Login from './components/Login';
import NoticeBoard from './components/Noticeboard';

function App() {
  return (
    <Router>
      <AuthProvider> {/* AuthProvider wraps around Routes */}
        <div className="App">
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            {/* Other routes */}
            <Route path="/" element={<NoticeBoard />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
