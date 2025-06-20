import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../context/AuthContext';

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

// Styled components
const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  background-color: #1e293b;
  color: #e2e8f0;
  width: 250px;
  min-width: 250px;
  transition: transform 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 50;
  
  @media (max-width: 768px) {
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${props => props.isOpen ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'};
    width: 85%;
    max-width: 300px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  height: 64px;
  border-bottom: 1px solid #334155;
`;

const Logo = styled.div`
  background-color: #2563eb;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  margin-right: 12px;
`;

const LogoText = styled.div`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #f8fafc;
`;

const NavigationContainer = styled.nav`
  padding: 16px 0;
  overflow-y: auto;
  max-height: calc(100vh - 64px - 80px); // Subtract header and user profile height
`;

const NavItem = styled(Link)<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: ${props => props.active ? '#f8fafc' : '#94a3b8'};
  text-decoration: none;
  transition: all 0.2s;
  margin: 4px 8px;
  border-radius: 6px;
  background-color: ${props => props.active ? '#334155' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.active ? '#334155' : '#1e3a8a22'};
    color: #f8fafc;
  }
  
  svg {
    margin-right: 12px;
    font-size: 20px;
  }
`;

const UserProfileContainer = styled.div`
  padding: 16px;
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #334155;
  background-color: #1e293b;
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 12px;
`;

const UserInfo = styled.div`
  flex: 1;
  overflow: hidden;
`;

const UserName = styled.div`
  font-weight: 500;
  color: #f8fafc;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRole = styled.div`
  color: #94a3b8;
  font-size: 12px;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    color: #f8fafc;
    background-color: #334155;
  }
  
  svg {
    font-size: 20px;
  }
`;

const MainContainer = styled.div`
  flex: 1;
  margin-left: 250px;
  width: calc(100% - 250px);
  
  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

const HeaderContainer = styled.header`
  height: 64px;
  background-color: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 40;
  animation: ${fadeIn} 0.5s ease-out;
  
  @media (max-width: 576px) {
    padding: 0 16px;
  }
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 8px;
  display: none;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
  margin-right: 8px;
  
  &:hover {
    background-color: #f1f5f9;
    color: #1e293b;
  }
  
  svg {
    font-size: 24px;
  }
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const PageTitle = styled.h1`
  font-size: 18px;
  color: #1e293b;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderAction = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 8px;
  margin-left: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f1f5f9;
    color: #1e293b;
  }
  
  svg {
    font-size: 20px;
  }
  
  @media (max-width: 576px) {
    padding: 6px;
    margin-left: 4px;
  }
`;

const ContentContainer = styled.main`
  padding: 0;
  background-color: #f1f5f9;
  min-height: calc(100vh - 64px); // Subtract header height
  animation: ${fadeIn} 0.3s ease-out;
`;

const Overlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 45;
  display: ${props => props.isVisible ? 'block' : 'none'};
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

// Icon components
const Icon = ({ name }: { name: string }) => {
  switch(name) {
    case 'dashboard':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z"/>
        </svg>
      );
    case 'people':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85-.85-.37-1.79-.58-2.78-.58-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/>
        </svg>
      );
    case 'payments':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-9-1c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-6v11c0 1.1-.9 2-2 2H4v-2h17V7h2z"/>
        </svg>
      );
    case 'receipt_long':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.5 3.5 18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2v14H3v3c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V2l-1.5 1.5zM19 19c0 .55-.45 1-1 1s-1-.45-1-1v-3H8V5h11v14z"/>
          <path d="M9 7h6v2H9zm7 0h2v2h-2zm-7 3h6v2H9zm7 0h2v2h-2z"/>
        </svg>
      );
    case 'bar_chart':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
        </svg>
      );
    case 'checklist':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 7h-9v2h9V7zm0 8h-9v2h9v-2zM5.54 11 2 7.46l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41L5.54 11zm0 8L2 15.46l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41L5.54 19z"/>
        </svg>
      );
    case 'menu':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      );
    case 'logout':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
        </svg>
      );
    case 'notification':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
        </svg>
      );
    case 'settings':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
        </svg>
      );
    case 'search':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      );
    default:
      return null;
  }
};

// Define navigation items
const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { name: 'Students', path: '/students', icon: 'people' },
  { name: 'Payments', path: '/payments', icon: 'payments' },
  { name: 'Fee Structure', path: '/fee-structure', icon: 'receipt_long' },
  { name: 'Reports', path: '/reports', icon: 'bar_chart' },
  { name: 'Test Plan', path: '/test-plan', icon: 'checklist' }
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Update page title based on current path
  useEffect(() => {
    const currentNav = navigationItems.find(item => 
      location.pathname.startsWith(item.path)
    );
    if (currentNav) {
      setPageTitle(currentNav.name);
    } else if (location.pathname === '/') {
      setPageTitle('Dashboard');
    }
  }, [location]);

  // Close sidebar if screen width changes to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.displayName) return 'U';
    return user.displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  return (
    <LayoutContainer>
      {/* Sidebar */}
      <SidebarContainer isOpen={sidebarOpen}>
        <LogoContainer>
          <Logo>F</Logo>
          <LogoText>Fee Manager</LogoText>
        </LogoContainer>
        
        <NavigationContainer>
          {navigationItems.map(item => (
            <NavItem 
              to={item.path} 
              key={item.path}
              active={location.pathname.startsWith(item.path)}
              onClick={closeSidebar}
            >
              <Icon name={item.icon} />
              {item.name}
            </NavItem>
          ))}
        </NavigationContainer>
        
        <UserProfileContainer>
          <Avatar>{getUserInitials()}</Avatar>
          <UserInfo>
            <UserName>{user?.displayName || 'User'}</UserName>
            <UserRole>{(user as any)?.role === 'admin' ? 'Administrator' : 'Staff'}</UserRole>
          </UserInfo>
          <LogoutButton onClick={handleLogout}>
            <Icon name="logout" />
          </LogoutButton>
        </UserProfileContainer>
      </SidebarContainer>
      
      {/* Overlay for mobile */}
      <Overlay isVisible={sidebarOpen} onClick={closeSidebar} />
      
      {/* Main Content */}
      <MainContainer>
        <HeaderContainer>
          <HeaderTitle>
            <MenuButton onClick={toggleSidebar}>
              <Icon name="menu" />
            </MenuButton>
            <PageTitle>{pageTitle}</PageTitle>
          </HeaderTitle>
          
          <HeaderActions>
            <HeaderAction>
              <Icon name="notification" />
            </HeaderAction>
            <HeaderAction>
              <Icon name="settings" />
            </HeaderAction>
          </HeaderActions>
        </HeaderContainer>
        
        <ContentContainer>
          {children}
        </ContentContainer>
      </MainContainer>
    </LayoutContainer>
  );
};

export default Layout;