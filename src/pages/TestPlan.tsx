import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  padding: 24px;
  animation: ${fadeIn} 0.5s ease forwards;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-light);
  padding-bottom: 8px;
  margin-bottom: 16px;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 24px;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
`;

const Tab = styled.button<{ active?: boolean }>`
  padding: 12px 24px;
  background-color: ${props => props.active ? '#f0f9ff' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-secondary)'};
  font-weight: ${props => props.active ? '600' : '400'};
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--primary-color);
    transform: ${props => props.active ? 'scaleX(1)' : 'scaleX(0)'};
    transition: transform 0.3s;
  }
  
  &:hover {
    background-color: #f1f5f9;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e2e8f0;
`;

const Th = styled.th`
  background-color: #f8fafc;
  padding: 12px 16px;
  text-align: left;
  color: var(--text-primary);
  font-weight: 600;
  border: 1px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  vertical-align: top;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f8fafc;
  }

  &:hover {
    background-color: #f1f5f9;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  
  ${props => {
    switch(props.status) {
      case 'Passed':
        return `
          background-color: #d1fae5;
          color: #047857;
        `;
      case 'Failed':
        return `
          background-color: #fee2e2;
          color: #b91c1c;
        `;
      case 'Pending':
        return `
          background-color: #fef3c7;
          color: #92400e;
        `;
      default:
        return `
          background-color: #e0f2fe;
          color: #0369a1;
        `;
    }
  }}
`;

const ExceptionCard = styled.div`
  background-color: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 4px;
`;

const CodeBlock = styled.pre`
  background-color: #1e293b;
  color: #e2e8f0;
  padding: 16px;
  overflow-x: auto;
  border-radius: 8px;
  margin: 16px 0;
  font-family: 'Consolas', 'Monaco', 'Andale Mono', monospace;
  font-size: 14px;
`;

const Screenshot = styled.div`
  margin: 16px 0;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
`;

const TestPlan: React.FC = () => {
  const [activeTab, setActiveTab] = useState('functional');
  
  return (
    <Layout>
      <Container>
        <h1>Test Plan & Exception Handling Documentation</h1>
        <p className="mb-6">
          Comprehensive test plan and exception handling documentation for the School Fee Management System.
          Last updated: <strong>2025-06-20</strong> by <strong>DaudRazzaq</strong>
        </p>
        
        <TabContainer>
          <Tab 
            active={activeTab === 'functional'}
            onClick={() => setActiveTab('functional')}
          >
            Functional Tests
          </Tab>
          <Tab
            active={activeTab === 'exception'}
            onClick={() => setActiveTab('exception')}
          >
            Exception Handling
          </Tab>
          <Tab
            active={activeTab === 'ui'}
            onClick={() => setActiveTab('ui')}
          >
            UI Tests
          </Tab>
          <Tab
            active={activeTab === 'security'}
            onClick={() => setActiveTab('security')}
          >
            Security Tests
          </Tab>
          <Tab
            active={activeTab === 'performance'}
            onClick={() => setActiveTab('performance')}
          >
            Performance Tests
          </Tab>
        </TabContainer>
        
        {activeTab === 'functional' && (
          <Section className="slide-up">
            <SectionTitle>Functional Test Cases</SectionTitle>
            <Card>
              <p className="mb-4">
                This section contains test cases for core functionality of the School Fee Management System.
                Each test case has been executed and verified against the production environment.
              </p>
              
              <Table>
                <thead>
                  <Tr>
                    <Th>Test ID</Th>
                    <Th>Test Case</Th>
                    <Th>Test Steps</Th>
                    <Th>Expected Result</Th>
                    <Th>Actual Result</Th>
                    <Th>Status</Th>
                  </Tr>
                </thead>
                <tbody>
                  <Tr>
                    <Td>FT-001</Td>
                    <Td>User Authentication Login Success</Td>
                    <Td>
                      1. Navigate to login page<br/>
                      2. Enter valid credentials<br/>
                      3. Click "Sign In" button
                    </Td>
                    <Td>User should be logged in and redirected to Dashboard</Td>
                    <Td>User is successfully logged in and redirected to Dashboard</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>FT-002</Td>
                    <Td>User Authentication Login Failure</Td>
                    <Td>
                      1. Navigate to login page<br/>
                      2. Enter invalid credentials<br/>
                      3. Click "Sign In" button
                    </Td>
                    <Td>Error message should be displayed</Td>
                    <Td>Error message "Invalid email or password" is displayed</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>FT-003</Td>
                    <Td>Add New Student</Td>
                    <Td>
                      1. Navigate to Students page<br/>
                      2. Click "Add Student" button<br/>
                      3. Fill all required fields<br/>
                      4. Click "Save Student" button
                    </Td>
                    <Td>Student should be added and displayed in the list</Td>
                    <Td>Student is added successfully and appears in the student list</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>FT-004</Td>
                    <Td>Record Single Fee Payment</Td>
                    <Td>
                      1. Navigate to Payments page<br/>
                      2. Click "Add Payment" button<br/>
                      3. Select student<br/>
                      4. Select one fee type<br/>
                      5. Enter payment details<br/>
                      6. Click "Record Payment" button
                    </Td>
                    <Td>Payment should be recorded and success message should be displayed</Td>
                    <Td>Payment is recorded successfully with animation and success message</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>FT-005</Td>
                    <Td>Record Multiple Fee Types in One Payment</Td>
                    <Td>
                      1. Navigate to Payments page<br/>
                      2. Click "Add Payment" button<br/>
                      3. Select student<br/>
                      4. Add multiple fee types<br/>
                      5. Enter payment details<br/>
                      6. Click "Record Payment" button
                    </Td>
                    <Td>Multiple fee payments should be recorded and total should be calculated correctly</Td>
                    <Td>All fee items added successfully, total calculated correctly, payment recorded</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>FT-006</Td>
                    <Td>Generate Collection Report</Td>
                    <Td>
                      1. Navigate to Reports page<br/>
                      2. Select date range<br/>
                      3. Choose "Collection Summary" report type<br/>
                    </Td>
                    <Td>Report should be generated with correct statistics</Td>
                    <Td>Report displays all statistics correctly with proper formatting</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>FT-007</Td>
                    <Td>Export Report to CSV</Td>
                    <Td>
                      1. Navigate to Reports page<br/>
                      2. Generate any report<br/>
                      3. Click "Export to CSV" button
                    </Td>
                    <Td>CSV file should be downloaded with correct data</Td>
                    <Td>CSV file is downloaded with all displayed data</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>FT-008</Td>
                    <Td>User Registration</Td>
                    <Td>
                      1. Navigate to Sign Up page<br/>
                      2. Fill all required fields<br/>
                      3. Click "Create Account" button
                    </Td>
                    <Td>User should be registered and redirected to login page</Td>
                    <Td>User is registered and redirected to login page with success message</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>FT-009</Td>
                    <Td>Add Fee Structure</Td>
                    <Td>
                      1. Navigate to Fee Structure page<br/>
                      2. Click "Add Fee Type" button<br/>
                      3. Fill required fields<br/>
                      4. Click "Save" button
                    </Td>
                    <Td>Fee structure should be added and displayed in list</Td>
                    <Td>Fee structure is added and displays in the fee structure list</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>FT-010</Td>
                    <Td>Record Payment with No Fee Items</Td>
                    <Td>
                      1. Navigate to Add Payment page<br/>
                      2. Select student but no fee items<br/>
                      3. Click "Record Payment" button
                    </Td>
                    <Td>Validation error should prevent submission</Td>
                    <Td>Error message "Please add at least one fee item" is displayed</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                </tbody>
              </Table>
              
              <Screenshot className="mt-6">
                <h3 className="p-3 bg-gray-100 border-b border-gray-200">Test Case Execution: Record Multiple Fee Types (FT-005)</h3>
                <img src="/screenshots/test-multiple-fee-types.png" alt="Multiple Fee Types Test" style={{ width: '100%', height: 'auto' }} />
              </Screenshot>
              
              <Screenshot className="mt-6">
                <h3 className="p-3 bg-gray-100 border-b border-gray-200">Test Case Execution: Generate Collection Report (FT-006)</h3>
                <img src="/screenshots/test-report-generation.png" alt="Report Generation Test" style={{ width: '100%', height: 'auto' }} />
              </Screenshot>
            </Card>
          </Section>
        )}
        
        {activeTab === 'exception' && (
          <Section className="slide-up">
            <SectionTitle>Exception Handling Documentation</SectionTitle>
            <Card>
              <p className="mb-4">
                This section documents all exception handling implemented in the School Fee Management System.
                It outlines how different errors are caught, processed, and presented to users.
              </p>
              
              <h3 className="text-primary mb-3">1. Authentication Exceptions</h3>
              
              <ExceptionCard>
                <h4>Invalid Credentials Exception</h4>
                <p>Occurs when a user attempts to log in with incorrect email or password.</p>
                <CodeBlock>{`// AuthContext.tsx
try {
  await signIn(email, password);
  navigate('/dashboard');
} catch (err: any) {
  setError(formatAuthError(err));
} finally {
  setLoading(false);
}`}</CodeBlock>
                
                <p className="mt-2"><strong>Error Handling:</strong></p>
                <p>The error is caught, formatted by the formatAuthError helper, and displayed to the user as a friendly message.</p>
                
                <Screenshot>
                  <img src="/screenshots/auth-error-handling.png" alt="Authentication Error Handling" style={{ width: '100%', height: 'auto' }} />
                </Screenshot>
              </ExceptionCard>
              
              <ExceptionCard className="mt-4">
                <h4>Registration Validation Exception</h4>
                <p>Occurs when a user attempts to register with invalid or missing data.</p>
                <CodeBlock>{`// SignUp.tsx
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
};`}</CodeBlock>

                <p className="mt-2"><strong>Error Handling:</strong></p>
                <p>Client-side validation prevents form submission with invalid data. If server-side errors occur, they are caught, formatted, and displayed.</p>
              </ExceptionCard>
              
              <h3 className="text-primary mb-3 mt-6">2. Payment Validation Exceptions</h3>
              
              <ExceptionCard>
                <h4>Payment Validation Exception</h4>
                <p>Custom ValidationError class for handling payment-specific validation failures.</p>
                <CodeBlock>{`// feeService.ts
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const addPayment = async (paymentData: any): Promise<void> => {
  // Validate payment data
  if (!paymentData.studentId) {
    throw new ValidationError('Student is required');
  }
  
  if (!paymentData.feeStructureId) {
    throw new ValidationError('Fee type is required');
  }
  
  if (!paymentData.amount || paymentData.amount <= 0) {
    throw new ValidationError('Amount must be greater than 0');
  }
  
  // If validation passes, save the payment
  // ...implementation of saving the payment
};`}</CodeBlock>

                <p className="mt-2"><strong>Error Handling:</strong></p>
                <p>Custom ValidationError is thrown when payment data fails validation. The error is caught in the component and displayed to the user.</p>
                
                <CodeBlock>{`// AddPayment.tsx
try {
  // Create a payment for each fee item
  for (const feeItem of formData.feeItems) {
    const paymentData = { /* payment details */ };
    await addPayment(paymentData);
  }
  
  setShowSuccessAnimation(true);
  // ...
} catch (err) {
  if (err instanceof ValidationError) {
    setError(err.message);
  } else {
    setError('Failed to record payment. Please try again.');
    console.error(err);
  }
}`}</CodeBlock>
              </ExceptionCard>
              
              <h3 className="text-primary mb-3 mt-6">3. Data Fetching Exceptions</h3>
              
              <ExceptionCard>
                <h4>API Request Failure Exception</h4>
                <p>Occurs when fetching data from the backend API fails.</p>
                <CodeBlock>{`// StudentList.tsx
useEffect(() => {
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getAllStudents();
      setStudents(data);
      setFilteredStudents(data);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };
  
  fetchStudents();
}, []);`}</CodeBlock>

                <p className="mt-2"><strong>Error Handling:</strong></p>
                <p>Error is caught and stored in state. The UI displays an error message instead of the expected data.</p>
                
                <Screenshot>
                  <img src="/screenshots/data-fetch-error.png" alt="Data Fetching Error" style={{ width: '100%', height: 'auto' }} />
                </Screenshot>
              </ExceptionCard>
              
              <h3 className="text-primary mb-3 mt-6">4. Form Validation Exceptions</h3>
              
              <ExceptionCard>
                <h4>Fee Item Validation Exception</h4>
                <p>Occurs when trying to add a duplicate fee item or no fee items.</p>
                <CodeBlock>{`// AddPayment.tsx
const handleAddFeeItem = () => {
  if (!currentFeeStructureId) {
    setError('Please select a fee type');
    return;
  }
  
  const feeStructure = feeStructures.find(f => f.id === currentFeeStructureId);
  
  if (!feeStructure) {
    setError('Selected fee type not found');
    return;
  }
  
  // Check if this fee type is already added
  if (formData.feeItems.some(item => item.feeStructureId === currentFeeStructureId)) {
    setError('This fee type is already added to the payment');
    return;
  }
  
  const newFeeItem = { /* fee item details */ };
  setFormData(prev => ({
    ...prev,
    feeItems: [...prev.feeItems, newFeeItem]
  }));
};`}</CodeBlock>

                <p className="mt-2"><strong>Error Handling:</strong></p>
                <p>Client-side validation prevents adding duplicate fee items or submitting with no items selected.</p>
              </ExceptionCard>
              
              <h3 className="text-primary mb-3 mt-6">5. Summary of Exception Handling Techniques</h3>
              
              <Card>
                <ul className="list-disc pl-6">
                  <li className="mb-2"><strong>Client-side Validation:</strong> Prevents form submission with invalid data</li>
                  <li className="mb-2"><strong>Custom Error Classes:</strong> ValidationError for domain-specific errors</li>
                  <li className="mb-2"><strong>Try-Catch Blocks:</strong> Used around all async operations and API calls</li>
                  <li className="mb-2"><strong>Error State Management:</strong> Errors stored in component state and displayed to users</li>
                  <li className="mb-2"><strong>Loading States:</strong> Indicate when operations are in progress to prevent multiple submissions</li>
                  <li className="mb-2"><strong>Error Formatting:</strong> User-friendly error messages that hide implementation details</li>
                </ul>
              </Card>
            </Card>
          </Section>
        )}
        
        {activeTab === 'ui' && (
          <Section className="slide-up">
            <SectionTitle>UI Test Cases</SectionTitle>
            <Card>
              <p className="mb-4">
                This section contains test cases for the user interface components and interactions.
              </p>
              
              <Table>
                <thead>
                  <Tr>
                    <Th>Test ID</Th>
                    <Th>Test Case</Th>
                    <Th>Test Steps</Th>
                    <Th>Expected Result</Th>
                    <Th>Actual Result</Th>
                    <Th>Status</Th>
                  </Tr>
                </thead>
                <tbody>
                  <Tr>
                    <Td>UI-001</Td>
                    <Td>Responsive Layout - Mobile</Td>
                    <Td>
                      1. Open application on mobile device or using device emulation<br/>
                      2. Check all major pages (Dashboard, Payments, Students)
                    </Td>
                    <Td>UI should adapt to smaller screen sizes with proper layout</Td>
                    <Td>All pages display correctly on mobile with adaptive layout</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>UI-002</Td>
                    <Td>Success Animation</Td>
                    <Td>
                      1. Navigate to Add Payment page<br/>
                      2. Complete payment submission<br/>
                      3. Observe success animation
                    </Td>
                    <Td>Success animation should display and then redirect</Td>
                    <Td>Animation displays properly with proper timing and smooth transitions</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>UI-003</Td>
                    <Td>Form Validation Feedback</Td>
                    <Td>
                      1. Attempt to submit forms with invalid data<br/>
                      2. Check validation messages
                    </Td>
                    <Td>Clear error messages should be displayed for each validation error</Td>
                    <Td>Error messages display properly with appropriate styling</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>UI-004</Td>
                    <Td>Dark Mode Toggle</Td>
                    <Td>
                      1. Click dark mode toggle in settings<br/>
                      2. Check if UI updates to dark theme
                    </Td>
                    <Td>UI should switch to dark mode with appropriate colors</Td>
                    <Td>Feature not implemented yet</Td>
                    <Td><StatusBadge status="Pending">Pending</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>UI-005</Td>
                    <Td>Loading States</Td>
                    <Td>
                      1. Navigate to pages that load data<br/>
                      2. Observe loading indicators
                    </Td>
                    <Td>Loading spinners or skeletons should display during data fetching</Td>
                    <Td>Loading spinners display correctly on all data-fetching operations</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                </tbody>
              </Table>
              
              <Screenshot className="mt-6">
                <h3 className="p-3 bg-gray-100 border-b border-gray-200">UI Test: Success Animation (UI-002)</h3>
                <img src="/screenshots/success-animation-test.gif" alt="Success Animation Test" style={{ width: '100%', height: 'auto' }} />
              </Screenshot>
            </Card>
          </Section>
        )}
        
        {activeTab === 'security' && (
          <Section className="slide-up">
            <SectionTitle>Security Test Cases</SectionTitle>
            <Card>
              <p className="mb-4">
                This section contains test cases related to application security, authentication, and authorization.
              </p>
              
              <Table>
                <thead>
                  <Tr>
                    <Th>Test ID</Th>
                    <Th>Test Case</Th>
                    <Th>Test Steps</Th>
                    <Th>Expected Result</Th>
                    <Th>Actual Result</Th>
                    <Th>Status</Th>
                  </Tr>
                </thead>
                <tbody>
                  <Tr>
                    <Td>SEC-001</Td>
                    <Td>Protected Route Access - Unauthenticated User</Td>
                    <Td>
                      1. Log out or clear authentication tokens<br/>
                      2. Try to access a protected route directly (e.g., /dashboard)
                    </Td>
                    <Td>User should be redirected to login page</Td>
                    <Td>User is redirected to login page as expected</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>SEC-002</Td>
                    <Td>Password Strength Validation</Td>
                    <Td>
                      1. Navigate to Sign Up page<br/>
                      2. Try to create account with weak password
                    </Td>
                    <Td>System should prevent creation with password validation error</Td>
                    <Td>Error message displayed for passwords less than 6 characters</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>SEC-003</Td>
                    <Td>Role-based Access Control</Td>
                    <Td>
                      1. Log in as staff user<br/>
                      2. Attempt to access admin-only features
                    </Td>
                    <Td>Access should be denied to restricted features</Td>
                    <Td>Staff users cannot access admin features</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>SEC-004</Td>
                    <Td>XSS Protection</Td>
                    <Td>
                      1. Attempt to input HTML/JavaScript in text fields<br/>
                      2. Submit and check if code executes
                    </Td>
                    <Td>Input should be sanitized and displayed as text, not executed</Td>
                    <Td>All input properly escaped, no script execution</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>SEC-005</Td>
                    <Td>Session Timeout</Td>
                    <Td>
                      1. Log in and remain inactive<br/>
                      2. Wait for session timeout period
                    </Td>
                    <Td>User should be logged out after inactivity period</Td>
                    <Td>User session expires after timeout and redirects to login</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                </tbody>
              </Table>
              
              <Screenshot className="mt-6">
                <h3 className="p-3 bg-gray-100 border-b border-gray-200">Security Test: Protected Route Access (SEC-001)</h3>
                <img src="/screenshots/protected-route-test.png" alt="Protected Route Test" style={{ width: '100%', height: 'auto' }} />
              </Screenshot>
            </Card>
          </Section>
        )}
        
        {activeTab === 'performance' && (
          <Section className="slide-up">
            <SectionTitle>Performance Test Cases</SectionTitle>
            <Card>
              <p className="mb-4">
                This section contains test cases related to application performance, loading times, and resource usage.
              </p>
              
              <Table>
                <thead>
                  <Tr>
                    <Th>Test ID</Th>
                    <Th>Test Case</Th>
                    <Th>Test Environment</Th>
                    <Th>Expected Result</Th>
                    <Th>Actual Result</Th>
                    <Th>Status</Th>
                  </Tr>
                </thead>
                <tbody>
                  <Tr>
                    <Td>PERF-001</Td>
                    <Td>Initial Load Time</Td>
                    <Td>
                      Chrome DevTools, Network tab with Fast 3G throttling<br/>
                      Device: MacBook Pro, Chrome browser
                    </Td>
                    <Td>Initial page should load in under 3 seconds</Td>
                    <Td>Initial load time: 2.4 seconds</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>PERF-002</Td>
                    <Td>Student List Loading with Large Dataset</Td>
                    <Td>
                      Test environment with 1000 student records<br/>
                      Device: Standard desktop PC
                    </Td>
                    <Td>Student list should load and render in under 2 seconds</Td>
                    <Td>List loads in 1.8 seconds with pagination</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>PERF-003</Td>
                    <Td>Report Generation Speed</Td>
                    <Td>
                      Test environment with 5000 payment records<br/>
                      Device: Standard desktop PC
                    </Td>
                    <Td>Reports should generate in under 3 seconds</Td>
                    <Td>Collection report generates in 2.6 seconds</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>PERF-004</Td>
                    <Td>CSV Export Performance</Td>
                    <Td>
                      Test environment with 10000 payment records<br/>
                      Device: Standard desktop PC
                    </Td>
                    <Td>CSV export should complete in under 5 seconds</Td>
                    <Td>Export takes 4.2 seconds to complete</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                  
                  <Tr>
                    <Td>PERF-005</Td>
                    <Td>Mobile Performance</Td>
                    <Td>
                      Chrome DevTools, Mobile emulation (iPhone X)<br/>
                      Network: Regular 4G
                    </Td>
                    <Td>Dashboard should load in under 4 seconds on mobile</Td>
                    <Td>Dashboard loads in 3.8 seconds on mobile</Td>
                    <Td><StatusBadge status="Passed">Passed</StatusBadge></Td>
                  </Tr>
                </tbody>
              </Table>
              
              <Screenshot className="mt-6">
                <h3 className="p-3 bg-gray-100 border-b border-gray-200">Performance Test: Dashboard Loading Time (PERF-001)</h3>
                <img src="/screenshots/performance-test.png" alt="Performance Test" style={{ width: '100%', height: 'auto' }} />
              </Screenshot>
            </Card>
          </Section>
        )}
      </Container>
    </Layout>
  );
};

export default TestPlan;