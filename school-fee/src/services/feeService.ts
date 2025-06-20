import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  deleteDoc, 
  serverTimestamp,
  addDoc, 
  orderBy,
  DocumentSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Type definitions
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  parentName: string;
  contactNumber: string;
  email?: string;
  address: string;
  admissionDate: Date;
  createdAt: any;
  updatedAt: any;
}

export interface FeeStructure {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually' | 'one-time';
  class?: string;
  description?: string;
  createdAt: any;
  updatedAt: any;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string; // Denormalized for query efficiency
  rollNumber: string;  // Denormalized for query efficiency
  feeStructureId: string;
  feeName: string;     // Denormalized for query efficiency
  amount: number;
  paymentDate: Date;
  paymentMethod: 'cash' | 'check' | 'bank_transfer' | 'online';
  receiptNumber: string;
  status: 'paid' | 'pending' | 'overdue';
  createdBy: string;
  createdAt: any;
  updatedAt: any;
}

// Student Management
export const addStudent = async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<Student> => {
  try {
    validateStudent(studentData);
    
    const studentRef = doc(collection(db, 'students'));
    const student: Student = {
      ...studentData,
      id: studentRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(studentRef, student);
    return student;
  } catch (error) {
    throw error;
  }
};

export const updateStudent = async (id: string, studentData: Partial<Student>): Promise<Student> => {
  try {
    const studentRef = doc(db, 'students', id);
    const studentSnap = await getDoc(studentRef);
    
    if (!studentSnap.exists()) {
      throw new ValidationError('Student not found');
    }
    
    const updatedData = {
      ...studentData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(studentRef, updatedData);
    
    return {
      ...studentSnap.data() as Student,
      ...updatedData
    };
  } catch (error) {
    throw error;
  }
};

export const getStudent = async (id: string): Promise<Student | null> => {
  try {
    const studentRef = doc(db, 'students', id);
    const studentSnap = await getDoc(studentRef);
    
    if (!studentSnap.exists()) {
      return null;
    }
    
    return studentSnap.data() as Student;
  } catch (error) {
    console.error('Error fetching student:', error);
    return null;
  }
};

export const getAllStudents = async (): Promise<Student[]> => {
  try {
    const studentsQuery = query(collection(db, 'students'), orderBy('name'));
    const studentsSnap = await getDocs(studentsQuery);
    
    return studentsSnap.docs.map(doc => doc.data() as Student);
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

export const getStudentsByClass = async (className: string): Promise<Student[]> => {
  try {
    const studentsQuery = query(
      collection(db, 'students'), 
      where('class', '==', className),
      orderBy('name')
    );
    const studentsSnap = await getDocs(studentsQuery);
    
    return studentsSnap.docs.map(doc => doc.data() as Student);
  } catch (error) {
    console.error('Error fetching students by class:', error);
    return [];
  }
};

export const deleteStudent = async (id: string): Promise<boolean> => {
  try {
    // Check if student exists
    const studentRef = doc(db, 'students', id);
    const studentSnap = await getDoc(studentRef);
    
    if (!studentSnap.exists()) {
      throw new ValidationError('Student not found');
    }
    
    // Check if student has payments
    const paymentsQuery = query(collection(db, 'payments'), where('studentId', '==', id));
    const paymentsSnap = await getDocs(paymentsQuery);
    
    if (!paymentsSnap.empty) {
      throw new ValidationError('Cannot delete student with payment records');
    }
    
    await deleteDoc(studentRef);
    return true;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    console.error('Error deleting student:', error);
    return false;
  }
};

// Fee Structure Management
export const addFeeStructure = async (feeData: Omit<FeeStructure, 'id' | 'createdAt' | 'updatedAt'>): Promise<FeeStructure> => {
  try {
    validateFeeStructure(feeData);
    
    const feeRef = doc(collection(db, 'feeStructures'));
    const feeStructure: FeeStructure = {
      ...feeData,
      id: feeRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(feeRef, feeStructure);
    return feeStructure;
  } catch (error) {
    throw error;
  }
};

export const updateFeeStructure = async (id: string, feeData: Partial<FeeStructure>): Promise<FeeStructure> => {
  try {
    const feeRef = doc(db, 'feeStructures', id);
    const feeSnap = await getDoc(feeRef);
    
    if (!feeSnap.exists()) {
      throw new ValidationError('Fee structure not found');
    }
    
    const updatedData = {
      ...feeData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(feeRef, updatedData);
    
    return {
      ...feeSnap.data() as FeeStructure,
      ...updatedData
    };
  } catch (error) {
    throw error;
  }
};

export const getFeeStructure = async (id: string): Promise<FeeStructure | null> => {
  try {
    const feeRef = doc(db, 'feeStructures', id);
    const feeSnap = await getDoc(feeRef);
    
    if (!feeSnap.exists()) {
      return null;
    }
    
    return feeSnap.data() as FeeStructure;
  } catch (error) {
    console.error('Error fetching fee structure:', error);
    return null;
  }
};

export const getAllFeeStructures = async (): Promise<FeeStructure[]> => {
  try {
    const feesQuery = query(collection(db, 'feeStructures'), orderBy('name'));
    const feesSnap = await getDocs(feesQuery);
    
    return feesSnap.docs.map(doc => doc.data() as FeeStructure);
  } catch (error) {
    console.error('Error fetching fee structures:', error);
    return [];
  }
};

export const deleteFeeStructure = async (id: string): Promise<boolean> => {
  try {
    // Check if fee structure exists
    const feeRef = doc(db, 'feeStructures', id);
    const feeSnap = await getDoc(feeRef);
    
    if (!feeSnap.exists()) {
      throw new ValidationError('Fee structure not found');
    }
    
    // Check if fee structure is used in payments
    const paymentsQuery = query(collection(db, 'payments'), where('feeStructureId', '==', id));
    const paymentsSnap = await getDocs(paymentsQuery);
    
    if (!paymentsSnap.empty) {
      throw new ValidationError('Cannot delete fee structure that has payments');
    }
    
    await deleteDoc(feeRef);
    return true;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    console.error('Error deleting fee structure:', error);
    return false;
  }
};

// Payment Management
export const addPayment = async (paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> => {
  try {
    validatePayment(paymentData);
    
    // Get student data for denormalization
    const studentRef = doc(db, 'students', paymentData.studentId);
    const studentSnap = await getDoc(studentRef);
    
    if (!studentSnap.exists()) {
      throw new ValidationError('Student not found');
    }
    
    const studentData = studentSnap.data() as Student;
    
    // Get fee structure data for denormalization
    const feeRef = doc(db, 'feeStructures', paymentData.feeStructureId);
    const feeSnap = await getDoc(feeRef);
    
    if (!feeSnap.exists()) {
      throw new ValidationError('Fee structure not found');
    }
    
    const feeData = feeSnap.data() as FeeStructure;
    
    const paymentRef = doc(collection(db, 'payments'));
    const payment: Payment = {
      ...paymentData,
      id: paymentRef.id,
      studentName: studentData.name,
      rollNumber: studentData.rollNumber,
      feeName: feeData.name,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(paymentRef, payment);
    return payment;
  } catch (error) {
    throw error;
  }
};

export const updatePayment = async (id: string, paymentData: Partial<Payment>): Promise<Payment> => {
  try {
    const paymentRef = doc(db, 'payments', id);
    const paymentSnap = await getDoc(paymentRef);
    
    if (!paymentSnap.exists()) {
      throw new ValidationError('Payment not found');
    }
    
    const updatedData = {
      ...paymentData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(paymentRef, updatedData);
    
    return {
      ...paymentSnap.data() as Payment,
      ...updatedData
    };
  } catch (error) {
    throw error;
  }
};

export const getPayment = async (id: string): Promise<Payment | null> => {
  try {
    const paymentRef = doc(db, 'payments', id);
    const paymentSnap = await getDoc(paymentRef);
    
    if (!paymentSnap.exists()) {
      return null;
    }
    
    return paymentSnap.data() as Payment;
  } catch (error) {
    console.error('Error fetching payment:', error);
    return null;
  }
};

export const getAllPayments = async (): Promise<Payment[]> => {
  try {
    const paymentsQuery = query(collection(db, 'payments'), orderBy('paymentDate', 'desc'));
    const paymentsSnap = await getDocs(paymentsQuery);
    
    return paymentsSnap.docs.map(doc => doc.data() as Payment);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
};

export const getPaymentsByStudent = async (studentId: string): Promise<Payment[]> => {
  try {
    const paymentsQuery = query(
      collection(db, 'payments'), 
      where('studentId', '==', studentId),
      orderBy('paymentDate', 'desc')
    );
    const paymentsSnap = await getDocs(paymentsQuery);
    
    return paymentsSnap.docs.map(doc => doc.data() as Payment);
  } catch (error) {
    console.error('Error fetching payments by student:', error);
    return [];
  }
};

export const getPaymentsByDateRange = async (startDate: Date, endDate: Date): Promise<Payment[]> => {
  try {
    const paymentsQuery = query(
      collection(db, 'payments'), 
      where('paymentDate', '>=', startDate),
      where('paymentDate', '<=', endDate),
      orderBy('paymentDate', 'desc')
    );
    const paymentsSnap = await getDocs(paymentsQuery);
    
    return paymentsSnap.docs.map(doc => doc.data() as Payment);
  } catch (error) {
    console.error('Error fetching payments by date range:', error);
    return [];
  }
};

export const deletePayment = async (id: string): Promise<boolean> => {
  try {
    // Check if payment exists
    const paymentRef = doc(db, 'payments', id);
    const paymentSnap = await getDoc(paymentRef);
    
    if (!paymentSnap.exists()) {
      throw new ValidationError('Payment not found');
    }
    
    await deleteDoc(paymentRef);
    return true;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    console.error('Error deleting payment:', error);
    return false;
  }
};

// Validation functions
const validateStudent = (student: any): boolean => {
  if (!student.name || student.name.trim() === '') {
    throw new ValidationError('Student name is required');
  }
  
  if (!student.rollNumber || student.rollNumber.trim() === '') {
    throw new ValidationError('Roll number is required');
  }
  
  if (!student.class || student.class.trim() === '') {
    throw new ValidationError('Class is required');
  }
  
  if (!student.parentName || student.parentName.trim() === '') {
    throw new ValidationError('Parent name is required');
  }
  
  if (!student.contactNumber || student.contactNumber.trim() === '') {
    throw new ValidationError('Contact number is required');
  }
  
  if (!student.address || student.address.trim() === '') {
    throw new ValidationError('Address is required');
  }
  
  if (!student.admissionDate) {
    throw new ValidationError('Admission date is required');
  }
  
  return true;
};

const validateFeeStructure = (feeStructure: any): boolean => {
  if (!feeStructure.name || feeStructure.name.trim() === '') {
    throw new ValidationError('Fee name is required');
  }
  
  if (!feeStructure.amount || isNaN(feeStructure.amount) || feeStructure.amount <= 0) {
    throw new ValidationError('Valid fee amount is required');
  }
  
  if (!feeStructure.frequency || !['monthly', 'quarterly', 'annually', 'one-time'].includes(feeStructure.frequency)) {
    throw new ValidationError('Valid frequency is required');
  }
  
  return true;
};

const validatePayment = (payment: any): boolean => {
  if (!payment.studentId || payment.studentId.trim() === '') {
    throw new ValidationError('Student ID is required');
  }
  
  if (!payment.feeStructureId || payment.feeStructureId.trim() === '') {
    throw new ValidationError('Fee structure ID is required');
  }
  
  if (!payment.amount || isNaN(payment.amount) || payment.amount <= 0) {
    throw new ValidationError('Valid payment amount is required');
  }
  
  if (!payment.paymentDate) {
    throw new ValidationError('Payment date is required');
  }
  
  if (!payment.paymentMethod || !['cash', 'check', 'bank_transfer', 'online'].includes(payment.paymentMethod)) {
    throw new ValidationError('Valid payment method is required');
  }
  
  if (!payment.receiptNumber || payment.receiptNumber.trim() === '') {
    throw new ValidationError('Receipt number is required');
  }
  
  if (!payment.status || !['paid', 'pending', 'overdue'].includes(payment.status)) {
    throw new ValidationError('Valid payment status is required');
  }
  
  if (!payment.createdBy || payment.createdBy.trim() === '') {
    throw new ValidationError('Creator information is required');
  }
  
  return true;
};