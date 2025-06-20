import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const circleAnimation = keyframes`
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 0;
  }
`;

const checkAnimation = keyframes`
  from {
    stroke-dashoffset: 45;
  }
  to {
    stroke-dashoffset: 0;
  }
`;

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.5s ease forwards;
`;

const Circle = styled.circle`
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: ${circleAnimation} 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: 0.1s;
`;

const Check = styled.path`
  stroke-dasharray: 45;
  stroke-dashoffset: 45;
  animation: ${checkAnimation} 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: 0.8s;
`;

const Message = styled.div`
  margin-top: 16px;
  font-size: 20px;
  font-weight: 600;
  color: #059669;
  opacity: 0;
  animation: ${fadeIn} 0.3s forwards;
  animation-delay: 1.2s;
`;

interface SuccessAnimationProps {
  message?: string;
  onComplete?: () => void;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ 
  message = "Success!", 
  onComplete 
}) => {
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true);
      if (onComplete) onComplete();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Container>
      <svg width="100" height="100" viewBox="0 0 50 50">
        <Circle 
          cx="25" 
          cy="25" 
          r="20" 
          fill="none" 
          stroke="#10b981" 
          strokeWidth="2" 
        />
        <Check 
          d="M16,25 L22,32 L34,18" 
          fill="none" 
          stroke="#10b981" 
          strokeWidth="2" 
        />
      </svg>
      <Message>{message}</Message>
    </Container>
  );
};

export default SuccessAnimation;