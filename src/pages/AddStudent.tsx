import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/ui/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { addStudent, Student, ValidationError } from '../services/feeService';

const AddStudent: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    rollNumber: '',
    class: '',
    section: '',
    parentName: '',
    contactNumber: '',
    email: '',
    address: '',
    admissionDate: new Date()
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await addStudent(formData as any);
      navigate('/students');
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.message);
      } else {
        setError('Failed to add student. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ padding: '24px' }}>
        <h1 style={{ marginBottom: '24px' }}>Add New Student</h1>
        
        <Card>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ 
                padding: '12px',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                {error}
              </div>
            )}
            
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            
            <Input
              label="Roll Number"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              required
              fullWidth
            />
            
            <Input
              label="Class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              required
              fullWidth
            />
            
            <Input
              label="Section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              fullWidth
            />
            
            <Input
              label="Parent Name"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              required
              fullWidth
            />
            
            <Input
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              fullWidth
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
            
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              fullWidth
            />
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <Button type="submit" isLoading={loading}>
                Add Student
              </Button>
              
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => navigate('/students')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default AddStudent;