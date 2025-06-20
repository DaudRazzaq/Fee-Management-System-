import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { getAllPayments, getAllStudents, deletePayment, Payment, Student } from '../services/feeService';

const SearchBox = styled.div`
  display: flex;
  margin-bottom: 24px;
  max-width: 400px;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px 0 0 6px;
  font-size: 16px;
  outline: none;
  
  &:focus {
    border-color: #2563eb;
  }
`;

const SearchButton = styled.button`
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0 6px 6px 0;
  padding: 0 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #1d4ed8;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const FilterContainer = styled.div`
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  overflow-x: auto;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  
  &:hover {
    background-color: #f1f5f9;
  }
  
  &.view {
    color: #2563eb;
  }
  
  &.delete {
    color: #dc2626;
  }
  
  &.print {
    color: #0891b2;
  }
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

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px;
  gap: 8px;
`;

const PaginationButton = styled.button<{ active?: boolean }>`
  background-color: ${props => props.active ? '#2563eb' : '#f8fafc'};
  color: ${props => props.active ? 'white' : '#475569'};
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.active ? '#2563eb' : '#f1f5f9'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaymentList: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  
  // Filters
  const [studentFilter, setStudentFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(10);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const paymentsData = await getAllPayments();
        const studentsData = await getAllStudents();
        
        setPayments(paymentsData);
        setFilteredPayments(paymentsData);
        setStudents(studentsData);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  useEffect(() => {
    // Apply filters
    let filtered = [...payments];
    
    // Search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        payment => 
          payment.studentName.toLowerCase().includes(term) ||
          payment.receiptNumber.toLowerCase().includes(term) ||
          payment.feeName.toLowerCase().includes(term)
      );
    }
    
    // Student filter
    if (studentFilter) {
      filtered = filtered.filter(payment => payment.studentId === studentFilter);
    }
    
    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }
    
    // Date range filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59); // Set to end of day
      
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate >= start && paymentDate <= end;
      });
    } else if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate >= start;
      });
    } else if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59);
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate <= end;
      });
    }
    
    setFilteredPayments(filtered);
    setCurrentPage(1); // Reset to first page on new filter
  }, [searchTerm, payments, studentFilter, statusFilter, startDate, endDate]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled in the useEffect
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await deletePayment(id);
        setPayments(payments.filter(payment => payment.id !== id));
        setFilteredPayments(filteredPayments.filter(payment => payment.id !== id));
      } catch (error: any) {
        alert(error.message || 'Failed to delete payment');
      }
    }
  };
  
  const handlePrintReceipt = (payment: Payment) => {
    // Create a printable receipt window
    const printWindow = window.open('', '', 'height=600,width=800');
    
    if (!printWindow) {
      alert('Please allow popups to print receipts');
      return;
    }
    
    const paymentDate = payment.paymentDate instanceof Date 
      ? payment.paymentDate.toLocaleDateString() 
      : new Date(payment.paymentDate).toLocaleDateString();
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Payment Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #333;
            }
            .receipt {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #ccc;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .school-name {
              font-size: 24px;
              font-weight: bold;
              margin: 0;
            }
            .receipt-title {
              font-size: 18px;
              margin: 10px 0;
            }
            .receipt-no {
              font-weight: bold;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .info-block {
              width: 48%;
            }
            .label {
              font-weight: bold;
              margin-right: 5px;
            }
            .payment-details {
              margin-top: 30px;
              border-top: 1px solid #ccc;
              padding-top: 10px;
            }
            .amount-row {
              display: flex;
              justify-content: space-between;
              font-size: 18px;
              font-weight: bold;
              margin-top: 20px;
              border-top: 1px solid #ccc;
              padding-top: 10px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 14px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h1 class="school-name">School Fee Management System</h1>
              <p class="receipt-title">PAYMENT RECEIPT</p>
              <p class="receipt-no">Receipt No: ${payment.receiptNumber}</p>
            </div>
            
            <div class="info-row">
              <div class="info-block">
                <p><span class="label">Student Name:</span> ${payment.studentName}</p>
                <p><span class="label">Roll Number:</span> ${payment.rollNumber}</p>
                <p><span class="label">Payment Date:</span> ${paymentDate}</p>
              </div>
              <div class="info-block">
                <p><span class="label">Fee Type:</span> ${payment.feeName}</p>
                <p><span class="label">Payment Method:</span> ${payment.paymentMethod.replace('_', ' ').toUpperCase()}</p>
                <p><span class="label">Status:</span> ${payment.status.toUpperCase()}</p>
              </div>
            </div>
            
            <div class="payment-details">
              <h3>Payment Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f1f1f1;">
                    <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Description</th>
                    <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${payment.feeName}</td>
                    <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">₹${payment.amount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
              
              <div class="amount-row">
                <span>Total Amount Paid:</span>
                <span>₹${payment.amount.toLocaleString()}</span>
              </div>
            </div>
            
            <div class="footer">
              <p>This is a computer-generated receipt and does not require a signature.</p>
              <p>Thank you for your payment!</p>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
  };
  
  // Pagination logic
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  return (
    <Layout>
      <div style={{ padding: '24px' }}>
        <h1>Payment Management</h1>
        
        <ActionBar>
          <form onSubmit={handleSearch}>
            <SearchBox>
              <SearchInput 
                type="text" 
                placeholder="Search by name, receipt number" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchButton type="submit">Search</SearchButton>
            </SearchBox>
          </form>
          
          <Link to="/payments/add">
            <Button>Add New Payment</Button>
          </Link>
        </ActionBar>
        
        <Card title="Filter Payments">
          <FilterContainer>
            <FilterGroup>
              <Label>By Student</Label>
              <Select
                value={studentFilter}
                onChange={(e) => setStudentFilter(e.target.value)}
              >
                <option value="">All Students</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.rollNumber})
                  </option>
                ))}
              </Select>
            </FilterGroup>
            
            <FilterGroup>
              <Label>By Status</Label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </Select>
            </FilterGroup>
            
            <FilterGroup>
              <Label>From Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
              />
            </FilterGroup>
            
            <FilterGroup>
              <Label>To Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
              />
            </FilterGroup>
          </FilterContainer>
        </Card>
        
        {error && (
          <Card>
            <div style={{ 
              padding: '12px',
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              borderRadius: '8px'
            }}>
              {error}
            </div>
          </Card>
        )}
        
        <Card>
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
                  <TableHeader>Actions</TableHeader>
                </tr>
              </TableHead>
              <tbody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} style={{ textAlign: 'center', padding: '24px' }}>
                      Loading payments...
                    </TableCell>
                  </TableRow>
                ) : currentPayments.length > 0 ? (
                  currentPayments.map(payment => (
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
                        <StatusBadge status={payment.status}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <ActionButtons>
                          <ActionButton 
                            className="print" 
                            onClick={() => handlePrintReceipt(payment)}
                            title="Print Receipt"
                          >
                            Print
                          </ActionButton>
                          <ActionButton 
                            className="delete" 
                            onClick={() => handleDelete(payment.id)}
                            title="Delete Payment"
                          >
                            Delete
                          </ActionButton>
                        </ActionButtons>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} style={{ textAlign: 'center', padding: '24px' }}>
                      {searchTerm || studentFilter || statusFilter || startDate || endDate ?
                        'No payments found matching your filters.' :
                        'No payments have been recorded yet.'}
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </Table>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationButton 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                >
                  Previous
                </PaginationButton>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === totalPages || 
                    Math.abs(page - currentPage) <= 2
                  )
                  .map((page, index, array) => {
                    if (index > 0 && array[index - 1] !== page - 1) {
                      return (
                        <React.Fragment key={`ellipsis-${page}`}>
                          <span>...</span>
                          <PaginationButton 
                            active={currentPage === page} 
                            onClick={() => paginate(page)}
                          >
                            {page}
                          </PaginationButton>
                        </React.Fragment>
                      );
                    }
                    return (
                      <PaginationButton 
                        key={page} 
                        active={currentPage === page} 
                        onClick={() => paginate(page)}
                      >
                        {page}
                      </PaginationButton>
                    );
                  })
                }
                
                <PaginationButton 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                >
                  Next
                </PaginationButton>
              </Pagination>
            )}
          </TableContainer>
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentList;