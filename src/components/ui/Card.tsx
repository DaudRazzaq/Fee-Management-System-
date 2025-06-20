import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface CardProps {
  title?: string;
  fullWidth?: boolean;
  padding?: 'small' | 'medium' | 'large';
  animate?: boolean;
  elevation?: 'low' | 'medium' | 'high';
}

const CardContainer = styled.div<{
  fullWidth?: boolean;
  padding?: string;
  animate?: boolean;
  elevation?: string;
}>`
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
  margin-bottom: 24px;
  animation: ${(props) => (props.animate ? fadeIn : 'none')} 0.4s ease-out;
  
  box-shadow: ${props => {
    switch (props.elevation) {
      case 'low':
        return '0 1px 3px rgba(0, 0, 0, 0.1)';
      case 'high':
        return '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
      default:
        return '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
  }};
  
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  
  &:hover {
    box-shadow: ${(props) => props.elevation === 'high' ? 
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : 
      props.elevation === 'low' ? 
        '0 2px 4px rgba(0, 0, 0, 0.1)' : 
        '0 6px 8px rgba(0, 0, 0, 0.1)'
    };
  }
  
  padding: ${(props) => {
    switch (props.padding) {
      case 'small': return '12px';
      case 'large': return '32px';
      default: return '24px'; // medium
    }
  }};
  
  @media (max-width: 576px) {
    padding: ${(props) => {
      switch (props.padding) {
        case 'small': return '10px';
        case 'large': return '20px';
        default: return '16px';
      }
    }};
    border-radius: 8px;
  }
`;

const CardTitle = styled.h3`
  font-size: 18px;
  color: #1e40af;
  margin-top: 0;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
  
  @media (max-width: 576px) {
    font-size: 16px;
    margin-bottom: 12px;
    padding-bottom: 6px;
  }
`;

const Card: React.FC<CardProps & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  title,
  fullWidth = false,
  padding = 'medium',
  animate = true,
  elevation = 'medium',
  ...props
}) => {
  return (
    <CardContainer 
      fullWidth={fullWidth} 
      padding={padding} 
      animate={animate}
      elevation={elevation}
      {...props}
    >
      {title && <CardTitle>{title}</CardTitle>}
      {children}
    </CardContainer>
  );
};

export default Card;