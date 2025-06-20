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

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.6;
  }
  100% {
    transform: scale(2);
    opacity: 0;
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
  position: relative;
  overflow: hidden;
  
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
            transform: translateY(1px);
          }
        `;
      case 'danger':
        return `
          background-color: #ef4444;
          color: #ffffff;
          &:hover:not(:disabled) {
            background-color: #dc2626;
            box-shadow: 0 4px 6px rgba(239, 68, 68, 0.25);
          }
          &:active:not(:disabled) {
            background-color: #b91c1c;
            transform: translateY(1px);
            box-shadow: none;
          }
        `;
      case 'success':
        return `
          background-color: #10b981;
          color: #ffffff;
          &:hover:not(:disabled) {
            background-color: #059669;
            box-shadow: 0 4px 6px rgba(16, 185, 129, 0.25);
          }
          &:active:not(:disabled) {
            background-color: #047857;
            transform: translateY(1px);
            box-shadow: none;
          }
        `;
      default:
        return `
          background-color: #1e40af;
          color: #ffffff;
          &:hover:not(:disabled) {
            background-color: #1e3a8a;
            box-shadow: 0 4px 6px rgba(37, 99, 235, 0.25);
          }
          &:active:not(:disabled) {
            background-color: #1e3a8a;
            transform: translateY(1px);
            box-shadow: none;
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.4);
    width: 100px;
    height: 100px;
    margin-top: -50px;
    margin-left: -50px;
    top: 50%;
    left: 50%;
    transform: scale(0);
    opacity: 0;
  }
  
  &:not(:disabled):active::after {
    animation: ${ripple} 0.4s ease-out;
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

const ButtonContent = styled.span`
  transition: all 0.2s ease-in-out;
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
      <ButtonContent>
        {children}
      </ButtonContent>
    </ButtonContainer>
  );
};

export default Button;