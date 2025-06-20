import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getAllStudents, deleteStudent, Student } from '../services/feeService';

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

const EmptyState = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: #64748b;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px 0;
  color: #64748b;
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

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await getAllStudents();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = students.filter(
        student => 
          student.name.toLowerCase().includes(term) || 
          student.rollNumber.toLowerCase().includes(term) ||
          student.class.toLowerCase().includes(term)
      );
      setFilteredStudents(filtered);
    }
    setCurrentPage(1); // Reset to first page on new search
  }, [searchTerm, students]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled in the useEffect
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        setStudents(students.filter(student => student.id !== id));
        setFilteredStudents(filteredStudents.filter(student => student.id !== id));
      } catch (error: any) {
        alert(error.message || 'Failed to delete student');
      }
    }
  };
  
  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  return (
    <Layout>
      <div style={{ padding: '24px' }}>
        <h1>Student Management</h1>
        
        <ActionBar>
          <form onSubmit={handleSearch}>
            <SearchBox>
              <SearchInput 
                type="text" 
                placeholder="Search by name, roll number or class" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchButton type="submit">Search</SearchButton>
            </SearchBox>
          </form>
          
          <Link to="/students/add">
            <Button>Add New Student</Button>
          </Link>
        </ActionBar>
        
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
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Roll Number</TableHeader>
                  <TableHeader>Class</TableHeader>
                  <TableHeader>Parent Name</TableHeader>
                  <TableHeader>Contact</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </TableHead>
              <tbody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <LoadingSpinner>Loading students...</LoadingSpinner>
                    </TableCell>
                  </TableRow>
                ) : currentStudents.length > 0 ? (
                  currentStudents.map(student => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.rollNumber}</TableCell>
                      <TableCell>{student.class} {student.section}</TableCell>
                      <TableCell>{student.parentName}</TableCell>
                      <TableCell>{student.contactNumber}</TableCell>
                      <TableCell>
                        <ActionButtons>
                          <Link to={`/students/${student.id}`}>
                            <ActionButton className="edit">View</ActionButton>
                          </Link>
                          <Link to={`/students/edit/${student.id}`}>
                            <ActionButton className="edit">Edit</ActionButton>
                          </Link>
                          <ActionButton 
                            className="delete" 
                            onClick={() => handleDelete(student.id)}
                          >
                            Delete
                          </ActionButton>
                        </ActionButtons>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <EmptyState>
                        {searchTerm ? 'No students found matching your search.' : 'No students added yet.'}
                      </EmptyState>
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

export default StudentList;