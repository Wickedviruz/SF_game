import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Auth.css'; // Vi skapar en CSS-fil för styling

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const toggleAuthMode = () => {
      setIsLogin(!isLogin);
      setError('');
    };
  
    // Registreringsfunktion
    const handleRegister = async () => {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
  
      try {
        const response = await axios.post('http://localhost:5000/register', {
          username,
          email,
          password,
        });
        console.log('Registration successful:', response.data);
        localStorage.setItem('token', response.data.token);
        navigate('/land');
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred');
      }
    };
  
    // Inloggningsfunktion
    const handleLogin = async () => {
      try {
        const response = await axios.post('http://localhost:5000/login', {
          email,
          password,
        });
        console.log('Login successful:', response.data);
        localStorage.setItem('token', response.data.token);
        navigate('/land');
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred');
      }
    };
  
    return (
      <div className="auth-container">
        <div className="auth-box">
          {isLogin ? (
            <div className="login-form">
              <h2>Login</h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="auth-button" onClick={handleLogin}>
                Login
              </button>
              {error && <p className="error-message">{error}</p>}
              <p onClick={toggleAuthMode} className="toggle-link">
                Don't have an account? Register
              </p>
            </div>
          ) : (
            <div className="register-form">
              <h2>Register</h2>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button className="auth-button" onClick={handleRegister}>
                Register
              </button>
              {error && <p className="error-message">{error}</p>}
              <p onClick={toggleAuthMode} className="toggle-link">
                Already have an account? Login
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default Auth;