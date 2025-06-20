import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { registerUser, formatAuthError } from '../services/authService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

const SignUpContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
  padding: 16px;
`;

const SignUpCard = styled(Card)`
  width: 100%;
  max-width: 500px;
`;

const SignUpHeader = styled.div`
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

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const FormCol = styled.div`
  flex: 1;
`;

const Footer = styled.p`
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #64748b;
`;

const LoginLink = styled(Link)`
  color: #2563eb;
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 16px;
  color: #1e293b;
  background-color: #f8fafc;
  margin-bottom: 16px;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
`;

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Redirect if user is already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters');
      setLoading(false);
      return;
    }
    
    try {
      await registerUser(
        formData.email,
        formData.password,
        formData.displayName,
        formData.role
      );
      
      // Registration successful, redirect to login
      navigate('/login', { state: { newUser: true } });
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SignUpContainer>
      <SignUpCard>
        <SignUpHeader>
          <Logo>F</Logo>
          <Title>School Fee Management</Title>
          <Subtitle>Create your account</Subtitle>
        </SignUpHeader>
        
        <Form onSubmit={handleSubmit}>
          {error && <ErrorAlert>{error}</ErrorAlert>}
          
          <Input
            label="Full Name"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            required
            fullWidth
            placeholder="Enter your full name"
          />
          
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            placeholder="Enter your email"
          />
          
          <FormRow>
            <FormCol>
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                placeholder="Create a password"
                helperText="Minimum 6 characters"
              />
            </FormCol>
            
            <FormCol>
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                fullWidth
                placeholder="Confirm your password"
              />
            </FormCol>
          </FormRow>
          
          <div>
            <Label>User Role</Label>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="admin">Administrator</option>
              <option value="staff">Staff</option>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            fullWidth 
            isLoading={loading} 
            disabled={loading}
          >
            Create Account
          </Button>
        </Form>
        
        <Footer>
          Already have an account? <LoginLink to="/login">Sign in</LoginLink>
        </Footer>
      </SignUpCard>
    </SignUpContainer>
  );
};

export default SignUp;