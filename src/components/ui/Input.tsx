import React, { forwardRef } from 'react';
import styled from 'styled-components';

interface InputProps {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  type?: string;
  required?: boolean;
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  margin-bottom: 16px;
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
`;

const InputLabel = styled.label<{ hasError?: boolean }>`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.hasError ? '#dc2626' : '#475569')};
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid ${(props) => (props.hasError ? '#ef4444' : '#cbd5e1')};
  font-size: 16px;
  color: #1e293b;
  background-color: #f8fafc;
  transition: all 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: ${(props) => (props.hasError ? '#ef4444' : '#2563eb')};
    box-shadow: 0 0 0 3px ${(props) => (props.hasError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(37, 99, 235, 0.2)')};
  }
  
  &:disabled {
    background-color: #e2e8f0;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
  margin-bottom: 0;
`;

const HelperText = styled.p`
  color: #64748b;
  font-size: 12px;
  margin-top: 4px;
  margin-bottom: 0;
`;

const Input = forwardRef<HTMLInputElement, InputProps & React.InputHTMLAttributes<HTMLInputElement>>(
  ({
    label,
    error,
    fullWidth = false,
    helperText,
    type = 'text',
    required,
    id,
    name,
    ...props
  }, ref) => {
    // Generate a random ID if none is provided
    const uniqueId = id || `input-${name || Math.random().toString(36).substring(2, 10)}`;
    
    return (
      <InputContainer fullWidth={fullWidth}>
        {label && (
          <InputLabel htmlFor={uniqueId} hasError={!!error}>
            {label}
            {required && <span style={{ color: '#dc2626', marginLeft: '4px' }}>*</span>}
          </InputLabel>
        )}
        
        <StyledInput
          ref={ref}
          id={uniqueId}
          name={name}
          type={type}
          required={required}
          hasError={!!error}
          {...props}
        />
        
        {error && <ErrorText>{error}</ErrorText>}
        {helperText && !error && <HelperText>{helperText}</HelperText>}
      </InputContainer>
    );
  }
);

Input.displayName = 'Input';

export default Input;