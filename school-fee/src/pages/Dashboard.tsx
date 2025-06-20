import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import { getAllStudents, getAllPayments, getAllFeeStructures, Student, Payment, FeeStructure } from '../services/feeService';

// Dashboard components
const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  display: flex;
  align-items: center;
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const StatIcon = styled.div<{ bgColor: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.bgColor};
  color: white;
  font-size: 24px;
  margin-right: 16px;
`;

const StatContent = styled.div`
  flex-grow: 1;
`;

const StatTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
`;

const StatValue = styled.p`
  margin: 4px 0 0 0;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f1f5f9;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8fafc;
  }
  
  &:hover {
    background-color: #f1f5f9;
  }
`;

const TableHeader = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 500;
  color: #1e293b;
`;

const TableCell = styled.td`
  padding: 12px 16px;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'paid':
        return `
          background-color: #d1fae5;
          color: #047857;
        `;
      case 'overdue':
        return `
          background-color: #fee2e2;
          color: #b91c1c;
        `;
      default:
        return `
          background-color: #fef3c7;
          color: #92400e;
        `;
    }
  }}
`;

const Dashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsData = await getAllStudents();
        const paymentsData = await getAllPayments();
        const feeStructuresData = await getAllFeeStructures();
        
        setStudents(studentsData);
        setPayments(paymentsData);
        setFeeStructures(feeStructuresData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate total collected amount
  const totalCollected = payments
    .filter(payment => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  // Calculate pending payments
  const pendingPayments = payments
    .filter(payment => payment.status === 'pending')
    .length;
  
  // Get recent payments
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .slice(0, 5);
  
  return (
    <Layout>
      <div style={{ padding: '24px' }}>
        <h1>Dashboard</h1>
        
        <DashboardGrid>
          <StatCard>
            <StatIcon bgColor="#3b82f6">👨‍🎓</StatIcon>
            <StatContent>
              <StatTitle>Total Students</StatTitle>
              <StatValue>{students.length}</StatValue>
            </StatContent>
          </StatCard>
          
          <StatCard>
            <StatIcon bgColor="#10b981">💰</StatIcon>
            <StatContent>
              <StatTitle>Total Collected</StatTitle>
              <StatValue>₹{totalCollected.toLocaleString()}</StatValue>
            </StatContent>
          </StatCard>
          
          <StatCard>
            <StatIcon bgColor="#f59e0b">⏳</StatIcon>
            <StatContent>
              <StatTitle>Pending Payments</StatTitle>
              <StatValue>{pendingPayments}</StatValue>
            </StatContent>
          </StatCard>
          
          <StatCard>
            <StatIcon bgColor="#6366f1">📝</StatIcon>
            <StatContent>
              <StatTitle>Fee Structures</StatTitle>
              <StatValue>{feeStructures.length}</StatValue>
            </StatContent>
          </StatCard>
        </DashboardGrid>
        
        <Card title="Recent Payments">
          <TableContainer>
            <Table>
              <TableHead>
                <tr>
                  <TableHeader>Student</TableHeader>
                  <TableHeader>Receipt No</TableHeader>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Amount</TableHeader>
                  <TableHeader>Status</TableHeader>
                </tr>
              </TableHead>
              <tbody>
                {recentPayments.length > 0 ? (
                  recentPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.studentName}</TableCell>
                      <TableCell>{payment.receiptNumber}</TableCell>
                      <TableCell>
                        {payment.paymentDate instanceof Date 
                          ? payment.paymentDate.toLocaleDateString() 
                          : new Date(payment.paymentDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <StatusBadge status={payment.status}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </StatusBadge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} style={{ textAlign: 'center' }}>No recent payments</TableCell>
                  </TableRow>
                )}
              </tbody>
            </Table>
          </TableContainer>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;