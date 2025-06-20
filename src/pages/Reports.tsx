import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

// Animation keyframes
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
  animation: ${fadeIn} 0.4s ease forwards;
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormColumn = styled.div`
  flex: 1;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 16px;
  color: #1e293b;
  background-color: #f8fafc;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus {
    outline: none;
    border-color: #1e40af;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.2);
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
`;

const ReportSection = styled.div`
  margin-top: 32px;
  animation: ${fadeIn} 0.5s ease forwards;
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
`;

const ReportTitle = styled.h2`
  margin: 0;
  color: #1e40af;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
`;

const Th = styled.th`
  background-color: #f8fafc;
  padding: 12px 16px;
  text-align: left;
  color: #1e293b;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f8fafc;
  }

  &:hover {
    background-color: #f1f5f9;
  }
`;

const SummaryCard = styled.div`
  background-color: #f0f9ff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: 8px;
    border-top: 1px dashed #94a3b8;
    font-weight: 600;
  }
`;

const MetadataSection = styled.div`
  margin-bottom: 24px;
  padding: 12px 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
  font-size: 14px;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 8px;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 16px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 0;
  color: #64748b;
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
      case 'pending':
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

const ChartContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  height: 300px;
`;

const Reports: React.FC = () => {
  // Use the provided date/time and user login
  const currentDate = "2025-06-20 13:11:19"; // From user input
  const currentUser = "DaudRazzaq"; // From user input
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [reportType, setReportType] = useState<string>('collection');
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [showReport, setShowReport] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reportData, setReportData] = useState<any>({
    collections: [],
    summary: {
      total: 0,
      paid: 0,
      pending: 0,
      overdue: 0,
    }
  });
  
  // Sample fee types for demo
  const feeTypes = [
    { id: 1, name: 'Tuition Fee', total: 150000, paid: 125000, pending: 20000, overdue: 5000 },
    { id: 2, name: 'Library Fee', total: 25000, paid: 22000, pending: 2000, overdue: 1000 },
    { id: 3, name: 'Computer Lab Fee', total: 35000, paid: 30000, pending: 3000, overdue: 2000 },
    { id: 4, name: 'Sports Fee', total: 15000, paid: 14000, pending: 1000, overdue: 0 },
    { id: 5, name: 'Exam Fee', total: 45000, paid: 40000, pending: 3000, overdue: 2000 }
  ];
  
  // Sample collection data for demo
  const collections = [
    { id: 1, date: '2025-06-15', student: 'Aisha Khan', class: '10A', feeType: 'Tuition Fee', amount: 5000, status: 'paid' },
    { id: 2, date: '2025-06-14', student: 'Mohammad Ali', class: '8B', feeType: 'Library Fee', amount: 1000, status: 'paid' },
    { id: 3, date: '2025-06-12', student: 'Sara Ahmed', class: '9C', feeType: 'Computer Lab Fee', amount: 1500, status: 'paid' },
    { id: 4, date: '2025-06-10', student: 'Hassan Raza', class: '7A', feeType: 'Exam Fee', amount: 2000, status: 'pending' },
    { id: 5, date: '2025-06-08', student: 'Fatima Zaidi', class: '11B', feeType: 'Sports Fee', amount: 800, status: 'paid' },
    { id: 6, date: '2025-06-05', student: 'Ahmed Khan', class: '10A', feeType: 'Tuition Fee', amount: 5000, status: 'overdue' },
    { id: 7, date: '2025-06-03', student: 'Zainab Malik', class: '12C', feeType: 'Computer Lab Fee', amount: 1500, status: 'paid' },
    { id: 8, date: '2025-06-01', student: 'Ibrahim Qureshi', class: '9B', feeType: 'Library Fee', amount: 1000, status: 'paid' },
  ];
  
  const handleReportTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReportType(e.target.value);
    setShowReport(false);
  };
  
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
    setShowReport(false);
  };
  
  const handleGenerateReport = () => {
    setLoading(true);
    setShowReport(false);
    
    // Simulate API request
    setTimeout(() => {
      // Calculate totals
      const total = feeTypes.reduce((sum, fee) => sum + fee.total, 0);
      const paid = feeTypes.reduce((sum, fee) => sum + fee.paid, 0);
      const pending = feeTypes.reduce((sum, fee) => sum + fee.pending, 0);
      const overdue = feeTypes.reduce((sum, fee) => sum + fee.overdue, 0);
      
      setReportData({
        collections,
        feeTypes,
        summary: {
          total,
          paid,
          pending,
          overdue
        }
      });
      
      setShowReport(true);
      setLoading(false);
    }, 1500);
  };
  
  const handleExportCSV = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add header row
    csvContent += "Date,Student,Class,Fee Type,Amount,Status\n";
    
    // Add data rows
    collections.forEach(item => {
      csvContent += `${item.date},${item.student},${item.class},${item.feeType},${item.amount},${item.status}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fee_collections_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportPDF = () => {
    alert('PDF export functionality will be implemented with a PDF library');
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return '₹' + amount.toLocaleString();
  };
  
  return (
    <Layout>
      <Container>
        <h1>Financial Reports</h1>
        
        <Card>
          <FormRow>
            <FormColumn>
              <Label>Report Type</Label>
              <Select 
                value={reportType}
                onChange={handleReportTypeChange}
              >
                <option value="collection">Fee Collection Summary</option>
                <option value="outstanding">Outstanding Fees</option>
                <option value="class">Class-wise Collection</option>
                <option value="student">Student Payment History</option>
              </Select>
            </FormColumn>
            
            <FormColumn>
              <Label>Start Date</Label>
              <Input
                type="date"
                name="start"
                value={dateRange.start}
                onChange={handleDateRangeChange}
                fullWidth
              />
            </FormColumn>
            
            <FormColumn>
              <Label>End Date</Label>
              <Input
                type="date"
                name="end"
                value={dateRange.end}
                onChange={handleDateRangeChange}
                fullWidth
              />
            </FormColumn>
            
            <FormColumn>
              <Label>&nbsp;</Label>
              <Button 
                onClick={handleGenerateReport}
                isLoading={loading}
                disabled={loading}
                fullWidth
              >
                Generate Report
              </Button>
            </FormColumn>
          </FormRow>
        </Card>
        
        {showReport && (
          <ReportSection>
            <MetadataSection>
              <div><strong>Report Generated On:</strong> {currentDate}</div>
              <div><strong>Generated By:</strong> {currentUser}</div>
              <div><strong>Report Type:</strong> {reportType === 'collection' ? 'Fee Collection Summary' : 
                      reportType === 'outstanding' ? 'Outstanding Fees' : 
                      reportType === 'class' ? 'Class-wise Collection' : 'Student Payment History'}</div>
              <div><strong>Period:</strong> {new Date(dateRange.start).toLocaleDateString()} to {new Date(dateRange.end).toLocaleDateString()}</div>
            </MetadataSection>
            
            <Card>
              <ReportHeader>
                <ReportTitle>Fee Collection Summary</ReportTitle>
                <ActionButtons>
                  <Button 
                    variant="secondary" 
                    size="small"
                    onClick={handleExportCSV}
                  >
                    Export to CSV
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="small"
                    onClick={handleExportPDF}
                  >
                    Export to PDF
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="small"
                    onClick={handlePrint}
                  >
                    Print
                  </Button>
                </ActionButtons>
              </ReportHeader>
              
              <div style={{ position: 'relative' }}>
                {loading && (
                  <LoadingOverlay>
                    <Spinner />
                    <div>Generating report...</div>
                  </LoadingOverlay>
                )}
                
                {/* Summary Section */}
                <SummaryCard>
                  <h3 style={{ marginBottom: '16px' }}>Collection Summary</h3>
                  <SummaryRow>
                    <span>Total Expected:</span>
                    <span>{formatCurrency(reportData.summary.total)}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span>Total Collected:</span>
                    <span>{formatCurrency(reportData.summary.paid)}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span>Pending:</span>
                    <span>{formatCurrency(reportData.summary.pending)}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span>Overdue:</span>
                    <span>{formatCurrency(reportData.summary.overdue)}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span>Collection Rate:</span>
                    <span>{((reportData.summary.paid / reportData.summary.total) * 100).toFixed(2)}%</span>
                  </SummaryRow>
                </SummaryCard>
                
                {/* Fee Type Breakdown */}
                <h3>Fee Type Breakdown</h3>
                <Table>
                  <thead>
                    <Tr>
                      <Th>Fee Type</Th>
                      <Th>Total Expected</Th>
                      <Th>Collected</Th>
                      <Th>Pending</Th>
                      <Th>Overdue</Th>
                      <Th>Collection Rate</Th>
                    </Tr>
                  </thead>
                  <tbody>
                    {feeTypes.map(fee => (
                      <Tr key={fee.id}>
                        <Td>{fee.name}</Td>
                        <Td>{formatCurrency(fee.total)}</Td>
                        <Td>{formatCurrency(fee.paid)}</Td>
                        <Td>{formatCurrency(fee.pending)}</Td>
                        <Td>{formatCurrency(fee.overdue)}</Td>
                        <Td>{((fee.paid / fee.total) * 100).toFixed(2)}%</Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
                
                {/* Collection Details */}
                <h3>Recent Collections</h3>
                <Table>
                  <thead>
                    <Tr>
                      <Th>Date</Th>
                      <Th>Student</Th>
                      <Th>Class</Th>
                      <Th>Fee Type</Th>
                      <Th>Amount</Th>
                      <Th>Status</Th>
                    </Tr>
                  </thead>
                  <tbody>
                    {collections.map(item => (
                      <Tr key={item.id}>
                        <Td>{item.date}</Td>
                        <Td>{item.student}</Td>
                        <Td>{item.class}</Td>
                        <Td>{item.feeType}</Td>
                        <Td>{formatCurrency(item.amount)}</Td>
                        <Td>
                          <StatusBadge status={item.status}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </StatusBadge>
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
                
                {/* Visual Representation - would normally use a chart library */}
                <h3>Visual Summary</h3>
                <ChartContainer>
                  <div style={{ textAlign: 'center', paddingTop: '120px' }}>
                    [Chart visualization would be displayed here using Chart.js or similar library]
                  </div>
                </ChartContainer>
                
                {/* Report Footer */}
                <div style={{ textAlign: 'center', marginTop: '40px', color: '#64748b', fontSize: '14px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <p>This is an automatically generated report. For any discrepancies, please contact the system administrator.</p>
                  <p>© 2025 School Fee Management System</p>
                </div>
              </div>
            </Card>
          </ReportSection>
        )}
        
        {!showReport && !loading && (
          <Card style={{ marginTop: '32px' }}>
            <EmptyState>
              <img 
                src="/images/report-icon.png" 
                alt="Reports" 
                style={{ width: '80px', height: '80px', marginBottom: '16px', opacity: 0.6 }}
                onError={(e) => {
                  // Fallback if image doesn't exist
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <h3>No Report Generated</h3>
              <p>Select report parameters above and click "Generate Report" to view data.</p>
            </EmptyState>
          </Card>
        )}
      </Container>
    </Layout>
  );
};

export default Reports;