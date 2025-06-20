import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { 
  getAllPayments, 
  getAllStudents, 
  getAllFeeStructures, 
  getPaymentsByDateRange, 
  Payment, 
  Student, 
  FeeStructure 
} from '../services/feeService';

// Styled Components
const ReportControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ControlGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const ReportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const StatTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
`;

const StatValue = styled.p<{ color?: string }>`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.color || '#1e293b'};
`;

const StatChange = styled.span<{ positive?: boolean }>`
  font-size: 14px;
  color: ${props => props.positive ? '#059669' : '#dc2626'};
  margin-top: 4px;
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  overflow-x: auto;
  margin-bottom: 24px;
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
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 16px;
  color: #1e293b;
  background-color: #f8fafc;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }
`;

const DownloadButton = styled(Button)`
  margin-left: auto;
`;

const ChartContainer = styled.div`
  height: 300px;
  margin: 20px 0;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChartPlaceholder = styled.div`
  text-align: center;
  color: #64748b;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px 0;
  color: #64748b;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 48px 0;
  color: #64748b;
`;

// Main Component
const Reports: React.FC = () => {
  const [reportType, setReportType] = useState('collection-summary');
  const [startDate, setStartDate] = useState(() => {
    // Set default start date to first day of current month
    const date = new Date();
    date.setDate(1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    // Set default end date to today
    return new Date().toISOString().split('T')[0];
  });
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  
  // Stats
  const [stats, setStats] = useState({
    totalCollected: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    paymentCount: 0,
    averagePayment: 0,
    uniqueStudentsPaid: 0,
    collectionByClass: {} as Record<string, number>,
    collectionByMethod: {} as Record<string, number>,
    collectionByType: {} as Record<string, number>
  });
  
  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [paymentsData, studentsData, feeStructuresData] = await Promise.all([
          getAllPayments(),
          getAllStudents(),
          getAllFeeStructures()
        ]);
        
        setPayments(paymentsData);
        setStudents(studentsData);
        setFeeStructures(feeStructuresData);
        
        // Apply initial filters
        applyFilters(paymentsData, startDate, endDate, classFilter, statusFilter);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch report data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Apply filters when filter parameters change
  useEffect(() => {
    applyFilters(payments, startDate, endDate, classFilter, statusFilter);
  }, [startDate, endDate, classFilter, statusFilter, payments]);
  
  // Calculate statistics when filtered payments change
  useEffect(() => {
    calculateStats();
  }, [filteredPayments, students]);
  
  const applyFilters = (
    allPayments: Payment[], 
    start: string, 
    end: string, 
    classFilter: string, 
    statusFilter: string
  ) => {
    let filtered = [...allPayments];
    
    // Date range filter
    if (start && end) {
      const startDateObj = new Date(start);
      const endDateObj = new Date(end);
      endDateObj.setHours(23, 59, 59); // Set to end of day
      
      filtered = filtered.filter(payment => {
        const paymentDate = payment.paymentDate instanceof Date 
          ? payment.paymentDate 
          : new Date(payment.paymentDate);
        return paymentDate >= startDateObj && paymentDate <= endDateObj;
      });
    }
    
    // Class filter
    if (classFilter) {
      // We need to find students in the specified class
      const studentIdsInClass = students
        .filter(student => student.class === classFilter)
        .map(student => student.id);
      
      filtered = filtered.filter(payment => 
        studentIdsInClass.includes(payment.studentId)
      );
    }
    
    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }
    
    setFilteredPayments(filtered);
  };
  
  const calculateStats = () => {
    // Calculate basic stats
    const totalCollected = filteredPayments
      .filter(payment => payment.status === 'paid')
      .reduce((sum, payment) => sum + payment.amount, 0);
      
    const pendingAmount = filteredPayments
      .filter(payment => payment.status === 'pending')
      .reduce((sum, payment) => sum + payment.amount, 0);
      
    const overdueAmount = filteredPayments
      .filter(payment => payment.status === 'overdue')
      .reduce((sum, payment) => sum + payment.amount, 0);
      
    const paymentCount = filteredPayments.length;
    
    const averagePayment = paymentCount > 0 
      ? totalCollected / filteredPayments.filter(p => p.status === 'paid').length 
      : 0;
    
    // Count unique students who made payments
    const uniqueStudentIds = new Set(filteredPayments.map(payment => payment.studentId));
    const uniqueStudentsPaid = uniqueStudentIds.size;
    
    // Collection by class
    const collectionByClass: Record<string, number> = {};
    for (const payment of filteredPayments) {
      if (payment.status !== 'paid') continue;
      
      const student = students.find(s => s.id === payment.studentId);
      if (student) {
        const className = student.class;
        collectionByClass[className] = (collectionByClass[className] || 0) + payment.amount;
      }
    }
    
    // Collection by payment method
    const collectionByMethod: Record<string, number> = {};
    for (const payment of filteredPayments) {
      if (payment.status !== 'paid') continue;
      collectionByMethod[payment.paymentMethod] = (collectionByMethod[payment.paymentMethod] || 0) + payment.amount;
    }
    
    // Collection by fee type
    const collectionByType: Record<string, number> = {};
    for (const payment of filteredPayments) {
      if (payment.status !== 'paid') continue;
      collectionByType[payment.feeName] = (collectionByType[payment.feeName] || 0) + payment.amount;
    }
    
    setStats({
      totalCollected,
      pendingAmount,
      overdueAmount,
      paymentCount,
      averagePayment,
      uniqueStudentsPaid,
      collectionByClass,
      collectionByMethod,
      collectionByType
    });
  };
  
  // Function to export data as CSV
  const exportCSV = () => {
    if (filteredPayments.length === 0) {
      alert('No data to export');
      return;
    }
    
    let csvContent = '';
    const headers = ['Receipt No', 'Student Name', 'Roll Number', 'Fee Type', 'Amount', 'Date', 'Method', 'Status'];
    csvContent += headers.join(',') + '\n';
    
    filteredPayments.forEach(payment => {
      const row = [
        payment.receiptNumber,
        `"${payment.studentName}"`, // Add quotes to handle names with commas
        payment.rollNumber,
        `"${payment.feeName}"`,
        payment.amount,
        payment.paymentDate instanceof Date 
          ? payment.paymentDate.toLocaleDateString() 
          : new Date(payment.paymentDate).toLocaleDateString(),
        payment.paymentMethod,
        payment.status
      ];
      csvContent += row.join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `fee-report-${startDate}-to-${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const renderReportContent = () => {
    if (loading) {
      return <LoadingContainer>Loading report data...</LoadingContainer>;
    }
    
    if (error) {
      return <div style={{ color: '#dc2626', padding: '16px' }}>{error}</div>;
    }
    
    if (filteredPayments.length === 0) {
      return <NoDataMessage>No payment data found for the selected filters.</NoDataMessage>;
    }
    
    // Render based on report type
    switch (reportType) {
      case 'collection-summary':
        return renderCollectionSummary();
      case 'class-wise':
        return renderClassWiseReport();
      case 'payment-method':
        return renderPaymentMethodReport();
      case 'fee-type':
        return renderFeeTypeReport();
      case 'student-payments':
        return renderStudentPaymentsReport();
      default:
        return <div>Select a report type</div>;
    }
  };
  
  // Render collection summary report
  const renderCollectionSummary = () => {
    return (
      <>
        <ReportGrid>
          <StatCard>
            <StatTitle>Total Collection</StatTitle>
            <StatValue color="#2563eb">₹{stats.totalCollected.toLocaleString()}</StatValue>
          </StatCard>
          
          <StatCard>
            <StatTitle>Pending Amount</StatTitle>
            <StatValue color="#f59e0b">₹{stats.pendingAmount.toLocaleString()}</StatValue>
          </StatCard>
          
          <StatCard>
            <StatTitle>Overdue Amount</StatTitle>
            <StatValue color="#dc2626">₹{stats.overdueAmount.toLocaleString()}</StatValue>
          </StatCard>
          
          <StatCard>
            <StatTitle>Number of Payments</StatTitle>
            <StatValue>{stats.paymentCount.toLocaleString()}</StatValue>
          </StatCard>
          
          <StatCard>
            <StatTitle>Average Payment</StatTitle>
            <StatValue>₹{stats.averagePayment.toFixed(2)}</StatValue>
          </StatCard>
          
          <StatCard>
            <StatTitle>Students Paid</StatTitle>
            <StatValue>{stats.uniqueStudentsPaid.toLocaleString()}</StatValue>
          </StatCard>
        </ReportGrid>
        
        <ChartContainer>
          <ChartPlaceholder>
            <p>Chart visualization would be displayed here.</p>
            <p>Use chart libraries like Chart.js or Recharts for implementation.</p>
          </ChartPlaceholder>
        </ChartContainer>
        
        {renderRecentPaymentsTable()}
      </>
    );
  };
  
  // Render class-wise report
  const renderClassWiseReport = () => {
    const classData = Object.entries(stats.collectionByClass).sort((a, b) => 
      a[0].localeCompare(b[0])
    );
    
    return (
      <>
        <Card title="Class-wise Collection">
          <TableContainer>
            <Table>
              <TableHead>
                <tr>
                  <TableHeader>Class</TableHeader>
                  <TableHeader>Total Collection</TableHeader>
                  <TableHeader>Number of Students</TableHeader>
                  <TableHeader>Average per Student</TableHeader>
                </tr>
              </TableHead>
              <tbody>
                {classData.length > 0 ? (
                  classData.map(([className, amount]) => {
                    const studentsInClass = students.filter(s => s.class === className);
                    const avgPerStudent = studentsInClass.length > 0 
                      ? amount / studentsInClass.length 
                      : 0;
                    
                    return (
                      <TableRow key={className}>
                        <TableCell>{className}</TableCell>
                        <TableCell>₹{amount.toLocaleString()}</TableCell>
                        <TableCell>{studentsInClass.length}</TableCell>
                        <TableCell>₹{avgPerStudent.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} style={{ textAlign: 'center' }}>No class data available</TableCell>
                  </TableRow>
                )}
              </tbody>
            </Table>
          </TableContainer>
        </Card>
        
        <ChartContainer>
          <ChartPlaceholder>
            <p>Class-wise collection chart would be displayed here.</p>
          </ChartPlaceholder>
        </ChartContainer>
      </>
    );
  };
  
  // Render payment method report
  const renderPaymentMethodReport = () => {
    const methodData = Object.entries(stats.collectionByMethod).sort((a, b) => b[1] - a[1]);
    
    const formatMethodName = (method: string): string => {
      switch(method) {
        case 'cash': return 'Cash';
        case 'check': return 'Check';
        case 'bank_transfer': return 'Bank Transfer';
        case 'online': return 'Online Payment';
        default: return method;
      }
    };
    
    return (
      <>
        <Card title="Collection by Payment Method">
          <TableContainer>
            <Table>
              <TableHead>
                <tr>
                  <TableHeader>Payment Method</TableHeader>
                  <TableHeader>Amount Collected</TableHeader>
                  <TableHeader>Percentage</TableHeader>
                </tr>
              </TableHead>
              <tbody>
                {methodData.length > 0 ? (
                  methodData.map(([method, amount]) => {
                    const percentage = stats.totalCollected > 0 
                      ? (amount / stats.totalCollected * 100).toFixed(2) 
                      : '0.00';
                    
                    return (
                      <TableRow key={method}>
                        <TableCell>{formatMethodName(method)}</TableCell>
                        <TableCell>₹{amount.toLocaleString()}</TableCell>
                        <TableCell>{percentage}%</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} style={{ textAlign: 'center' }}>No payment method data available</TableCell>
                  </TableRow>
                )}
              </tbody>
            </Table>
          </TableContainer>
        </Card>
        
        <ChartContainer>
          <ChartPlaceholder>
            <p>Payment method distribution pie chart would be displayed here.</p>
          </ChartPlaceholder>
        </ChartContainer>
      </>
    );
  };
  
  // Render fee type report
  const renderFeeTypeReport = () => {
    const feeTypeData = Object.entries(stats.collectionByType).sort((a, b) => b[1] - a[1]);
    
    return (
      <>
        <Card title="Collection by Fee Type">
          <TableContainer>
            <Table>
              <TableHead>
                <tr>
                  <TableHeader>Fee Type</TableHeader>
                  <TableHeader>Amount Collected</TableHeader>
                  <TableHeader>Percentage</TableHeader>
                  <TableHeader>Count</TableHeader>
                </tr>
              </TableHead>
              <tbody>
                {feeTypeData.length > 0 ? (
                  feeTypeData.map(([feeType, amount]) => {
                    const percentage = stats.totalCollected > 0 
                      ? (amount / stats.totalCollected * 100).toFixed(2) 
                      : '0.00';
                    
                    const count = filteredPayments.filter(p => 
                      p.feeName === feeType && p.status === 'paid'
                    ).length;
                    
                    return (
                      <TableRow key={feeType}>
                        <TableCell>{feeType}</TableCell>
                        <TableCell>₹{amount.toLocaleString()}</TableCell>
                        <TableCell>{percentage}%</TableCell>
                        <TableCell>{count}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} style={{ textAlign: 'center' }}>No fee type data available</TableCell>
                  </TableRow>
                )}
              </tbody>
            </Table>
          </TableContainer>
        </Card>
        
        <ChartContainer>
          <ChartPlaceholder>
            <p>Fee type distribution chart would be displayed here.</p>
          </ChartPlaceholder>
        </ChartContainer>
      </>
    );
  };
  
  // Render student payments report
  const renderStudentPaymentsReport = () => {
    // Group payments by student
    const studentPayments: Record<string, Payment[]> = {};
    
    filteredPayments.forEach(payment => {
      if (!studentPayments[payment.studentId]) {
        studentPayments[payment.studentId] = [];
      }
      studentPayments[payment.studentId].push(payment);
    });
    
    // Calculate totals by student
    const studentTotals = Object.entries(studentPayments).map(([studentId, payments]) => {
      const student = students.find(s => s.id === studentId);
      const totalPaid = payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);
      const totalPending = payments
        .filter(p => p.status === 'pending' || p.status === 'overdue')
        .reduce((sum, p) => sum + p.amount, 0);
        
      return {
        studentId,
        name: student?.name || 'Unknown',
        rollNumber: student?.rollNumber || 'Unknown',
        class: student?.class || 'Unknown',
        totalPaid,
        totalPending,
        totalPayments: payments.length
      };
    });
    
    // Sort by total paid (highest first)
    studentTotals.sort((a, b) => b.totalPaid - a.totalPaid);
    
    return (
      <Card title="Student Payment Summary">
        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <TableHeader>Student Name</TableHeader>
                <TableHeader>Roll Number</TableHeader>
                <TableHeader>Class</TableHeader>
                <TableHeader>Total Paid</TableHeader>
                <TableHeader>Pending/Overdue</TableHeader>
                <TableHeader>No. of Payments</TableHeader>
              </tr>
            </TableHead>
            <tbody>
              {studentTotals.length > 0 ? (
                studentTotals.map(student => (
                  <TableRow key={student.studentId}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>₹{student.totalPaid.toLocaleString()}</TableCell>
                    <TableCell>₹{student.totalPending.toLocaleString()}</TableCell>
                    <TableCell>{student.totalPayments}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: 'center' }}>No student payment data available</TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </TableContainer>
      </Card>
    );
  };
  
  // Render recent payments table (common for most reports)
  const renderRecentPaymentsTable = () => {
    // Get up to 10 most recent payments
    const recentPayments = [...filteredPayments]
      .sort((a, b) => {
        const dateA = a.paymentDate instanceof Date ? a.paymentDate : new Date(a.paymentDate);
        const dateB = b.paymentDate instanceof Date ? b.paymentDate : new Date(b.paymentDate);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 10);
    
    return (
      <Card title="Recent Payments">
        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <TableHeader>Receipt No</TableHeader>
                <TableHeader>Student</TableHeader>
                <TableHeader>Fee Type</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Status</TableHeader>
              </tr>
            </TableHead>
            <tbody>
              {recentPayments.map(payment => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.receiptNumber}</TableCell>
                  <TableCell>{payment.studentName}</TableCell>
                  <TableCell>{payment.feeName}</TableCell>
                  <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    {payment.paymentDate instanceof Date 
                      ? payment.paymentDate.toLocaleDateString() 
                      : new Date(payment.paymentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 500,
                      backgroundColor: payment.status === 'paid' ? '#d1fae5' : 
                                      payment.status === 'overdue' ? '#fee2e2' : '#fef3c7',
                      color: payment.status === 'paid' ? '#047857' : 
                              payment.status === 'overdue' ? '#b91c1c' : '#92400e',
                    }}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </Card>
    );
  };
  
  return (
    <Layout>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1>Financial Reports</h1>
          <DownloadButton onClick={exportCSV} disabled={filteredPayments.length === 0}>
            Export to CSV
          </DownloadButton>
        </div>
        
        <Card title="Report Options">
          <ReportControls>
            <ControlGroup>
              <Label>Report Type</Label>
              <Select 
                value={reportType} 
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="collection-summary">Collection Summary</option>
                <option value="class-wise">Class-wise Collection</option>
                <option value="payment-method">Payment Method Analysis</option>
                <option value="fee-type">Fee Type Analysis</option>
                <option value="student-payments">Student Payments</option>
              </Select>
            </ControlGroup>
            
            <ControlGroup>
              <Label>Start Date</Label>
              <Input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
              />
            </ControlGroup>
            
            <ControlGroup>
              <Label>End Date</Label>
              <Input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
              />
            </ControlGroup>
            
            <ControlGroup>
              <Label>Class Filter</Label>
              <Select 
                value={classFilter} 
                onChange={(e) => setClassFilter(e.target.value)}
              >
                <option value="">All Classes</option>
                {/* Get unique classes from students array */}
                {Array.from(new Set(students.map(s => s.class))).sort().map(className => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </Select>
            </ControlGroup>
            
            <ControlGroup>
              <Label>Status Filter</Label>
              <Select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </Select>
            </ControlGroup>
          </ReportControls>
        </Card>
        
        {/* Report content based on selected type */}
        {renderReportContent()}
      </div>
    </Layout>
  );
};

export default Reports;