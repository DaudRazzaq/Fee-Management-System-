import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { addFeeStructure, getAllFeeStructures, deleteFeeStructure, updateFeeStructure, FeeStructure } from '../services/feeService';

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
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

const Form = styled.form`
  margin-top: 24px;
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
  
  &.edit {
    color: #2563eb;
  }
  
  &.delete {
    color: #dc2626;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const SuccessMessage = styled.div`
  background-color: #d1fae5;
  color: #047857;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const FrequencyLabel = styled.span<{ frequency: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  
  ${props => {
    switch (props.frequency) {
      case 'monthly':
        return `
          background-color: #e0f2fe;
          color: #0369a1;
        `;
      case 'quarterly':
        return `
          background-color: #f0fdf4;
          color: #15803d;
        `;
      case 'annually':
        return `
          background-color: #fef3c7;
          color: #92400e;
        `;
      default:
        return `
          background-color: #f3e8ff;
          color: #7e22ce;
        `;
    }
  }}
`;

interface FeeStructureFormData {
  id?: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually' | 'one-time';
  class: string;
  description: string;
}

const FeeStructurePage: React.FC = () => {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FeeStructureFormData>({
    name: '',
    amount: 0,
    frequency: 'monthly',
    class: '',
    description: ''
  });
  
  const [editMode, setEditMode] = useState(false);
  
  useEffect(() => {
    const fetchFeeStructures = async () => {
      try {
        setLoading(true);
        const data = await getAllFeeStructures();
        setFeeStructures(data);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch fee structures');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeeStructures();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      if (editMode && formData.id) {
        await updateFeeStructure(formData.id, formData);
        setSuccess('Fee structure updated successfully');
      } else {
        await addFeeStructure(formData);
        setSuccess('Fee structure added successfully');
      }
      
      // Refresh the list
      const data = await getAllFeeStructures();
      setFeeStructures(data);
      
      // Reset form
      setFormData({
        name: '',
        amount: 0,
        frequency: 'monthly',
        class: '',
        description: ''
      });
      setEditMode(false);
      
    } catch (error: any) {
      setError(error.message || 'Failed to save fee structure');
    }
  };
  
  const handleEdit = (fee: FeeStructure) => {
    setFormData({
      id: fee.id,
      name: fee.name,
      amount: fee.amount,
      frequency: fee.frequency,
      class: fee.class || '',
      description: fee.description || ''
    });
    setEditMode(true);
    setError(null);
    setSuccess(null);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this fee structure?')) {
      try {
        await deleteFeeStructure(id);
        setFeeStructures(feeStructures.filter(fee => fee.id !== id));
        setSuccess('Fee structure deleted successfully');
      } catch (error: any) {
        setError(error.message || 'Failed to delete fee structure');
      }
    }
  };
  
  const handleCancel = () => {
    setFormData({
      name: '',
      amount: 0,
      frequency: 'monthly',
      class: '',
      description: ''
    });
    setEditMode(false);
    setError(null);
    setSuccess(null);
  };
  
  const formatFrequency = (frequency: string): string => {
    switch (frequency) {
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      case 'annually': return 'Annually';
      case 'one-time': return 'One-time';
      default: return frequency;
    }
  };
  
  return (
    <Layout>
      <div style={{ padding: '24px' }}>
        <h1>Fee Structure Management</h1>
        
        <Card title={editMode ? "Edit Fee Structure" : "Add New Fee Structure"}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          <Form onSubmit={handleSubmit}>
            <FormRow>
              <FormColumn>
                <Input
                  label="Fee Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                  placeholder="Eg: Tuition Fee, Library Fee"
                />
              </FormColumn>
              
              <FormColumn>
                <Input
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  fullWidth
                  min={0}
                  step="0.01"
                  placeholder="Enter amount"
                />
              </FormColumn>
            </FormRow>
            
            <FormRow>
              <FormColumn>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#475569' }}>
                  Frequency
                </label>
                <Select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  required
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                  <option value="one-time">One-time</option>
                </Select>
              </FormColumn>
              
              <FormColumn>
                <Input
                  label="Applicable Class"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Leave empty if applicable to all classes"
                  helperText="Leave empty if applicable to all classes"
                />
              </FormColumn>
            </FormRow>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#475569' }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '16px',
                  color: '#1e293b',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
                placeholder="Add any additional details about this fee"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button type="submit">
                {editMode ? 'Update Fee Structure' : 'Add Fee Structure'}
              </Button>
              
              {editMode && (
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </Form>
        </Card>
        
        <h2 style={{ marginTop: '32px' }}>Fee Structure List</h2>
        
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <tr>
                  <TableHeader>Fee Name</TableHeader>
                  <TableHeader>Amount</TableHeader>
                  <TableHeader>Frequency</TableHeader>
                  <TableHeader>Applicable Class</TableHeader>
                  <TableHeader>Description</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </TableHead>
              <tbody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} style={{ textAlign: 'center', padding: '24px' }}>
                      Loading fee structures...
                    </TableCell>
                  </TableRow>
                ) : feeStructures.length > 0 ? (
                  feeStructures.map(fee => (
                    <TableRow key={fee.id}>
                      <TableCell>{fee.name}</TableCell>
                      <TableCell>₹{fee.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <FrequencyLabel frequency={fee.frequency}>
                          {formatFrequency(fee.frequency)}
                        </FrequencyLabel>
                      </TableCell>
                      <TableCell>{fee.class || 'All Classes'}</TableCell>
                      <TableCell>{fee.description || '-'}</TableCell>
                      <TableCell>
                        <ActionButtons>
                          <ActionButton className="edit" onClick={() => handleEdit(fee)}>
                            Edit
                          </ActionButton>
                          <ActionButton className="delete" onClick={() => handleDelete(fee.id)}>
                            Delete
                          </ActionButton>
                        </ActionButtons>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} style={{ textAlign: 'center', padding: '24px' }}>
                      No fee structures added yet. Create your first fee structure above.
                    </TableCell>
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

export default FeeStructurePage;