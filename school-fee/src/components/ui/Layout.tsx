import React, { useState, ReactNode } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { signOut } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f1f5f9;
`;

const Sidebar = styled.nav<{ isOpen: boolean }>`
  background-color: #1e293b;
  color: white;
  width: 260px;
  min-width: ${props => props.isOpen ? '260px' : '0'};
  max-width: ${props => props.isOpen ? '260px' : '0'};
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 100;
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  }
`;

const SidebarHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #334155;
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
`;

const LogoIcon = styled.div`
  background-color: #3b82f6;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-weight: 800;
`;

const SidebarContent = styled.div`
  padding: 24px 0;
  flex-grow: 1;
  overflow-y: auto;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 10px 24px;
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    background-color: #334155;
    color: white;
  }
  
  &.active {
    background-color: #2563eb;
    color: white;
  }
  
  .icon {
    margin-right: 12px;
  }
`;

const SidebarFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #334155;
`;

const MainContent = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const Header = styled.header`
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #1e293b;
  font-size: 24px;
  cursor: pointer;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #2563eb;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 10px;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const Dropdown = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: #f1f5f9;
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  min-width: 180px;
  z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const DropdownItem = styled.button`
  display: block;
  width: 100%;
  padding: 8px 16px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  color: #1e293b;
  
  &:hover {
    background-color: #f1f5f9;
  }
`;

const ContentArea = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const Overlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 90;
  display: ${props => props.isVisible ? 'block' : 'none'};
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      await signOut();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  // Close sidebar on mobile when navigating to a new page
  React.useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);
  
  return (
    <LayoutContainer>
      <Sidebar isOpen={sidebarOpen}>
        <SidebarHeader>
          <Logo>
            <LogoIcon>F</LogoIcon>
            Fee Management
          </Logo>
        </SidebarHeader>
        
        <SidebarContent>
          <NavItem to="/dashboard" end>
            <span className="icon">📊</span>
            Dashboard
          </NavItem>
          
          <NavItem to="/students">
            <span className="icon">👨‍🎓</span>
            Students
          </NavItem>
          
          <NavItem to="/students/add">
            <span className="icon">➕</span>
            Add Student
          </NavItem>
          
          <NavItem to="/payments">
            <span className="icon">💰</span>
            Payments
          </NavItem>
          
          <NavItem to="/payments/add">
            <span className="icon">💸</span>
            Add Payment
          </NavItem>
          
          <NavItem to="/fee-structure">
            <span className="icon">📝</span>
            Fee Structure
          </NavItem>
          
          <NavItem to="/reports">
            <span className="icon">📈</span>
            Reports
          </NavItem>
        </SidebarContent>
        
        <SidebarFooter>
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>
            School Fee Management System
          </p>
        </SidebarFooter>
      </Sidebar>
      
      <Overlay 
        isVisible={sidebarOpen && window.innerWidth <= 768} 
        onClick={() => setSidebarOpen(false)} 
      />
      
      <MainContent>
        <Header>
          <MenuButton onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </MenuButton>
          
          <HeaderActions>
            <UserInfo>
              <Dropdown>
                <DropdownButton onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <Avatar>{getInitials(user?.displayName ?? null)}</Avatar>
                </DropdownButton>
                
                <DropdownMenu isOpen={dropdownOpen}>
                  <UserName style={{ display: 'block', padding: '8px 16px', fontWeight: 600 }}>
                    {user?.displayName || 'User'}
                  </UserName>
                  <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </UserInfo>
          </HeaderActions>
        </Header>
        
        <ContentArea>{children}</ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;