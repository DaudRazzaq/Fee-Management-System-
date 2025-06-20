import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/ui/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { addPayment, getAllStudents, getAllFeeStructures, Student, FeeStructure, Payment, ValidationError } from '../services/feeService';
import { useAuth } from '../context/AuthContext';

const Form = styled.form`
  display: flex;
  flex-direction: column;
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
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }
  
  &:disabled {
    background-color: #e2e8f0;
    cursor: not-allowed;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const InfoCard = styled.div`
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 16px;
  margin-top: 8px;
`;

const InfoField = styled.div`
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  font-weight: 500;
  color: #0369a1;
  margin-right: 8px;
`;

const InfoValue = styled.span`
  color: #0c4a6e;
`;

const SuccessMessage = styled.div`
  background-color: #d1fae5;
  color: #047857;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

// Fee Items table styling
const FeeItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 10px;
  background-color: #f1f5f9;
  color: #1e293b;
  font-weight: 500;
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #e2e8f0;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: #fee2e2;
  }
`;

const AddItemButton = styled(Button)`
  margin-bottom: 20px;
`;

const TotalAmount = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  text-align: right;
  margin-bottom: 20px;
  padding-right: 10px;
`;

interface FeeItem {
  id: string;
  feeStructureId: string;
  feeName: string;
  amount: number;
}

interface PaymentFormData {
  studentId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'check' | 'bank_transfer' | 'online';
  receiptNumber: string;
  status: 'paid' | 'pending' | 'overdue';
  createdBy: string;
  feeItems: FeeItem[]; // New field to store multiple fee items
}

const AddPayment: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [students, setStudents] = useState<Student[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // New state for handling fee item selection
  const [currentFeeStructureId, setCurrentFeeStructureId] = useState<string>('');
  const [currentFeeAmount, setCurrentFeeAmount] = useState<number>(0);
  
  const [formData, setFormData] = useState<PaymentFormData>({
    studentId: '',
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    paymentMethod: 'cash',
    receiptNumber: generateReceiptNumber(),
    status: 'paid',
    createdBy: user?.uid || '',
    feeItems: [] // Initialize empty array for fee items
  });
  
  // Generate a receipt number based on date and random string
  function generateReceiptNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `R${year}${month}${day}-${random}`;
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsData = await getAllStudents();
        const feesData = await getAllFeeStructures();
        
        setStudents(studentsData);
        setFeeStructures(feesData);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch data');
      }
    };
    
    fetchData();
  }, []);
  
  useEffect(() => {
    // Update createdBy when user changes
    if (user?.uid) {
      setFormData(prev => ({
        ...prev,
        createdBy: user.uid
      }));
    }
  }, [user]);
  
  // Update selected student when studentId changes
  useEffect(() => {
    if (formData.studentId) {
      const student = students.find(s => s.id === formData.studentId) || null;
      setSelectedStudent(student);
    } else {
      setSelectedStudent(null);
    }
  }, [formData.studentId, students]);
  
  // Update current fee amount when fee structure selection changes
  useEffect(() => {
    if (currentFeeStructureId) {
      const fee = feeStructures.find(f => f.id === currentFeeStructureId);
      if (fee) {
        setCurrentFeeAmount(fee.amount);
      }
    } else {
      setCurrentFeeAmount(0);
    }
  }, [currentFeeStructureId, feeStructures]);
  
  // Calculate total amount whenever fee items change
  useEffect(() => {
    const total = formData.feeItems.reduce((sum, item) => sum + item.amount, 0);
    setFormData(prev => ({
      ...prev,
      amount: total
    }));
  }, [formData.feeItems]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'feeStructureId') {
      setCurrentFeeStructureId(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'amount' ? parseFloat(value) || 0 : value
      }));
    }
  };
  
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
    
    const newFeeItem: FeeItem = {
      id: Math.random().toString(36).substring(2, 10), // Generate a random ID
      feeStructureId: currentFeeStructureId,
      feeName: feeStructure.name,
      amount: currentFeeAmount
    };
    
    setFormData(prev => ({
      ...prev,
      feeItems: [...prev.feeItems, newFeeItem]
    }));
    
    // Reset selection
    setCurrentFeeStructureId('');
    setCurrentFeeAmount(0);
    setError(null);
  };
  
  const handleRemoveFeeItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      feeItems: prev.feeItems.filter(item => item.id !== id)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    if (formData.feeItems.length === 0) {
      setError('Please add at least one fee item');
      setLoading(false);
      return;
    }
    
    try {
      // Create a payment for each fee item
      for (const feeItem of formData.feeItems) {
        const paymentData = {
          studentId: formData.studentId,
          studentName: selectedStudent?.name || '',
          rollNumber: selectedStudent?.rollNumber || '',
          feeStructureId: feeItem.feeStructureId,
          feeName: feeItem.feeName,
          amount: feeItem.amount,
          paymentDate: new Date(formData.paymentDate),
          paymentMethod: formData.paymentMethod,
          receiptNumber: `${formData.receiptNumber}-${formData.feeItems.indexOf(feeItem) + 1}`,
          status: formData.status,
          createdBy: formData.createdBy
        };
        
        await addPayment(paymentData);
      }
      
      setSuccess('Payments recorded successfully!');
      
      // Reset form with a new receipt number
      setFormData({
        studentId: '',
        amount: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
        receiptNumber: generateReceiptNumber(),
        status: 'paid',
        createdBy: user?.uid || '',
        feeItems: []
      });
      
      setSelectedStudent(null);
      
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.message);
      } else {
        setError('Failed to record payment. Please try again.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div style={{ padding: '24px' }}>
        <h1 style={{ marginBottom: '24px' }}>Record New Payment</h1>
        
        <Card>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          <Form onSubmit={handleSubmit}>
            <FormRow>
              <FormColumn>
                <Label>Student <span style={{ color: '#dc2626' }}>*</span></Label>
                <Select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a student</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.rollNumber})
                    </option>
                  ))}
                </Select>
                
                {selectedStudent && (
                  <InfoCard>
                    <InfoField>
                      <InfoLabel>Class:</InfoLabel>
                      <InfoValue>{selectedStudent.class} {selectedStudent.section}</InfoValue>
                    </InfoField>
                    <InfoField>
                      <InfoLabel>Parent:</InfoLabel>
                      <InfoValue>{selectedStudent.parentName}</InfoValue>
                    </InfoField>
                    <InfoField>
                      <InfoLabel>Contact:</InfoLabel>
                      <InfoValue>{selectedStudent.contactNumber}</InfoValue>
                    </InfoField>
                  </InfoCard>
                )}
              </FormColumn>
              
              <FormColumn>
                <Label>Payment Date <span style={{ color: '#dc2626' }}>*</span></Label>
                <Input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                
                <Label style={{ marginTop: '16px' }}>Receipt Number <span style={{ color: '#dc2626' }}>*</span></Label>
                <Input
                  name="receiptNumber"
                  value={formData.receiptNumber}
                  onChange={handleChange}
                  required
                  fullWidth
                  helperText="Auto-generated, but you can change it"
                />
              </FormColumn>
            </FormRow>
            
            {/* Fee Type Selection Section */}
            <Card title="Add Fee Types" padding="small">
              <FormRow>
                <FormColumn>
                  <Label>Select Fee Type</Label>
                  <Select
                    name="feeStructureId"
                    value={currentFeeStructureId}
                    onChange={handleChange}
                  >
                    <option value="">Select a fee type</option>
                    {feeStructures.map(fee => (
                      <option key={fee.id} value={fee.id}>
                        {fee.name} - ₹{fee.amount} ({fee.frequency})
                      </option>
                    ))}
                  </Select>
                </FormColumn>
                
                <FormColumn>
                  <Label>Amount (₹)</Label>
                  <Input
                    type="number"
                    value={currentFeeAmount}
                    onChange={(e) => setCurrentFeeAmount(parseFloat(e.target.value) || 0)}
                    fullWidth
                    min={0}
                    step="0.01"
                  />
                </FormColumn>
              </FormRow>
              
              <AddItemButton 
                type="button" 
                onClick={handleAddFeeItem}
                size="small"
                variant="secondary"
              >
                + Add Fee Item
              </AddItemButton>
              
              {/* Fee Items Table */}
              {formData.feeItems.length > 0 && (
                <>
                  <FeeItemsTable>
                    <thead>
                      <tr>
                        <TableHeader>Fee Type</TableHeader>
                        <TableHeader>Amount</TableHeader>
                        <TableHeader>Action</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.feeItems.map(item => (
                        <tr key={item.id}>
                          <TableCell>{item.feeName}</TableCell>
                          <TableCell>₹{item.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <RemoveButton onClick={() => handleRemoveFeeItem(item.id)}>
                              Remove
                            </RemoveButton>
                          </TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </FeeItemsTable>
                  
                  <TotalAmount>
                    Total Amount: ₹{formData.amount.toLocaleString()}
                  </TotalAmount>
                </>
              )}
            </Card>
            
            <FormRow style={{ marginTop: '20px' }}>
              <FormColumn>
                <Label>Payment Method <span style={{ color: '#dc2626' }}>*</span></Label>
                <Select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="online">Online Payment</option>
                </Select>
              </FormColumn>
              
              <FormColumn>
                <Label>Payment Status <span style={{ color: '#dc2626' }}>*</span></Label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </Select>
              </FormColumn>
            </FormRow>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <Button 
                type="submit" 
                isLoading={loading} 
                disabled={loading || formData.feeItems.length === 0}
              >
                Record Payment
              </Button>
              
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => navigate('/payments')}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};

export default AddPayment;