'use server';

import { auth } from '@/lib/auth';
import axiosClient from '@/lib/axiosClient';
import { Employee, EmployeeRole, EmployeeStatus } from '@/types/employee';

// ===============================

// Helper: get admin email
// /employee/assign-role
// /employee/remove-role
// /employee/update-status
// /employee/list
// /employee/by-role
// /employee/current
// /employee/update-performance

// ===============================
async function getAdminEmail() {
  const session = await auth();
  return session?.user?.email || null;
}

// ===============================
// Assign Employee Role
// ===============================
export async function assignEmployeeRole(
  userId: string,
  role: EmployeeRole,
): Promise<{ success: boolean; message: string; employee?: Employee }> {
  try {
    const adminEmail = await getAdminEmail();
    if (!adminEmail) return { success: false, message: 'Unauthorized' };

    // Call REST API
    const res = await axiosClient.post('/employee/assign-role', {
      userId,
      role,
      assignedBy: adminEmail,
    });

    return res.data;
  } catch (err) {
    console.error('Error assigning employee role:', err);
    return { success: false, message: 'Failed to assign employee role' };
  }
}

// ===============================
// Remove Employee Role
// ===============================
export async function removeEmployeeRole(userId: string) {
  try {
    const adminEmail = await getAdminEmail();
    if (!adminEmail) return { success: false, message: 'Unauthorized' };

    const res = await axiosClient.post('/employee/remove-role', {
      userId,
      removedBy: adminEmail,
    });

    return res.data;
  } catch (err) {
    console.error('Error removing employee role:', err);
    return { success: false, message: 'Failed to remove role' };
  }
}

// ===============================
// Update Employee Status
// ===============================
export async function updateEmployeeStatus(
  userId: string,
  status: EmployeeStatus,
  reason?: string,
) {
  try {
    const adminEmail = await getAdminEmail();
    if (!adminEmail) return { success: false, message: 'Unauthorized' };

    const res = await axiosClient.post('/employee/update-status', {
      userId,
      status,
      reason,
      updatedBy: adminEmail,
    });

    return res.data;
  } catch (err) {
    console.error('Error updating employee status:', err);
    return { success: false, message: 'Failed to update employee status' };
  }
}

// ===============================
// Get All Employees
// ===============================
export async function getAllEmployees(): Promise<Employee[]> {
  try {
    const res = await axiosClient.get('/employee/list');
    return res.data.employees || [];
  } catch (err) {
    console.error('Error fetching employees:', err);
    return [];
  }
}

// ===============================
// Get Employees by Role
// ===============================
export async function getEmployeesByRole(role: EmployeeRole): Promise<Employee[]> {
  try {
    const res = await axiosClient.get(`/employee/by-role?role=${role}`);
    return res.data.employees || [];
  } catch (err) {
    console.error('Error fetching employees by role:', err);
    return [];
  }
}

// ===============================
// Get Current Employee
// ===============================
export async function getCurrentEmployee(): Promise<Employee | null> {
  try {
    const adminEmail = await getAdminEmail();
    if (!adminEmail) return null;

    const res = await axiosClient.get('/employee/current');
    return res.data.employee || null;
  } catch (err) {
    console.error('Error fetching current employee:', err);
    return null;
  }
}

// ===============================
// Update Employee Performance
// ===============================
export async function updateEmployeePerformance(
  userId: string,
  performanceData: Partial<{
    ordersProcessed: number;
    ordersConfirmed: number;
    ordersPacked: number;
    ordersAssignedForDelivery: number;
    ordersDelivered: number;
    cashCollected: number;
    paymentsReceived: number;
  }>,
) {
  try {
    const res = await axiosClient.post('/employee/update-performance', {
      userId,
      performanceData,
    });

    return res.data;
  } catch (err) {
    console.error('Error updating employee performance:', err);
    return { success: false, message: 'Failed to update performance' };
  }
}
