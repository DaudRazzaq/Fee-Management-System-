import React from 'react';
import styled, { keyframes } from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const ButtonContainer = styled.button<{
  variant: string;
  size: string;
  fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  outline: none;
  border: none;
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
  
  /* Size styles */
  ${(props) => {
    switch (props.size) {
      case 'small':
        return `
          padding: 8px 16px;
          font-size: 14px;
        `;
      case 'large':
        return `
          padding: 16px 32px;
          font-size: 18px;
        `;
      default:
        return `
          padding: 12px 24px;
          font-size: 16px;
        `;
    }
  }}
  
  /* Variant styles */
  ${(props) => {
    switch (props.variant) {
      case 'secondary':
        return `
          background-color: #f3f4f6;
          color: #1e293b;
          &:hover:not(:disabled) {
            background-color: #e2e8f0;
          }
          &:active:not(:disabled) {
            background-color: #cbd5e1;
          }
        `;
      case 'danger':
        return `
          background-color: #ef4444;
          color: #ffffff;
          &:hover:not(:disabled) {
            background-color: #dc2626;
          }
          &:active:not(:disabled) {
            background-color: #b91c1c;
          }
        `;
      case 'success':
        return `
          background-color: #10b981;
          color: #ffffff;
          &:hover:not(:disabled) {
            background-color: #059669;
          }
          &:active:not(:disabled) {
            background-color: #047857;
          }
        `;
      default:
        return `
          background-color: #2563eb;
          color: #ffffff;
          &:hover:not(:disabled) {
            background-color: #1d4ed8;
          }
          &:active:not(:disabled) {
            background-color: #1e40af;
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoaderSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: ${spin} 0.8s linear infinite;
  margin-right: 8px;
`;

const Button: React.FC<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  children,
  ...props
}) => {
  return (
    <ButtonContainer
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && <LoaderSpinner />}
      {children}
    </ButtonContainer>
  );
};

export default Button;