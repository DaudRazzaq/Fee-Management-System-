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
}

const CardContainer = styled.div<{
  fullWidth?: boolean;
  padding?: string;
  animate?: boolean;
}>`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
  margin-bottom: 24px;
  animation: ${(props) => (props.animate ? fadeIn : 'none')} 0.3s ease-out;
  
  padding: ${(props) => {
    switch (props.padding) {
      case 'small': return '12px';
      case 'large': return '32px';
      default: return '24px'; // medium
    }
  }};
`;

const CardTitle = styled.h3`
  font-size: 18px;
  color: #1e40af;
  margin-top: 0;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
`;

const Card: React.FC<CardProps & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  title,
  fullWidth = false,
  padding = 'medium',
  animate = true,
  ...props
}) => {
  return (
    <CardContainer 
      fullWidth={fullWidth} 
      padding={padding} 
      animate={animate}
      {...props}
    >
      {title && <CardTitle>{title}</CardTitle>}
      {children}
    </CardContainer>
  );
};

export default Card;