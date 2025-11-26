import React from 'react';
import '../components/Login.css';

export default function Login({ onLogin }) {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">📝</div>
        <h1>Notes Craft</h1>
        <p>Create beautiful, customizable notes with rich styling options</p>
        <button onClick={onLogin} className="login-btn">
          Sign In with Google
        </button>
        
      </div>
    </div>
  );
}