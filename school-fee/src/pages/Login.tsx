import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { signIn, formatAuthError } from '../services/authService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
  padding: 16px;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const Logo = styled.div`
  background-color: #2563eb;
  color: white;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  margin: 0 auto 16px auto;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  color: #1e293b;
`;

const Subtitle = styled.p`
  margin: 8px 0 0 0;
  font-size: 16px;
  color: #64748b;
`;

const Form = styled.form`
  margin-top: 24px;
`;

const ErrorAlert = styled.div`
  background-color: #fef2f2;
  color: #b91c1c;
  border: 1px solid #f87171;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 14px;
`;

const Footer = styled.p`
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #64748b;
`;

const SignUpLink = styled(Link)`
  color: #2563eb;
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SuccessAlert = styled.div`
  background-color: #d1fae5;
  color: #047857;
  border: 1px solid #34d399;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 14px;
`;

const ForgotPasswordLink = styled.a`
  display: block;
  font-size: 14px;
  color: #2563eb;
  text-align: right;
  margin-bottom: 16px;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  
  // Check if user just signed up
  useEffect(() => {
    if (location.state && (location.state as any).newUser) {
      setSuccessMessage('Your account has been created successfully. Please sign in.');
    }
  }, [location.state]);
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      setError('Please enter your email address to reset your password');
      return;
    }
    // In a real implementation, you would call a password reset function here
    alert(`Password reset link would be sent to ${email}`);
  };
  
  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <Logo>F</Logo>
          <Title>School Fee Management</Title>
          <Subtitle>Sign in to your account</Subtitle>
        </LoginHeader>
        
        <Form onSubmit={handleSubmit}>
          {successMessage && <SuccessAlert>{successMessage}</SuccessAlert>}
          {error && <ErrorAlert>{error}</ErrorAlert>}
          
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          
          <ForgotPasswordLink onClick={handleForgotPassword}>
            Forgot password?
          </ForgotPasswordLink>
          
          <Button 
            type="submit" 
            fullWidth 
            isLoading={loading} 
            disabled={!email || !password || loading}
          >
            Sign In
          </Button>
        </Form>
        
        <Footer>
          Don't have an account? <SignUpLink to="/signup">Sign up</SignUpLink>
        </Footer>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;