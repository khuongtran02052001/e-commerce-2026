'use server';

import { auth } from '@/lib/auth';
import { fetchServiceJsonServer } from '@/lib/restClient';
import { Employee, EmployeeRole, EmployeeStatus } from '@/types/domain/employee';

type ApiAny = Record<string, any>;

const toUiRole = (role?: string): EmployeeRole => {
  const normalized = String(role || '')
    .trim()
    .toUpperCase();

  const map: Record<string, EmployeeRole> = {
    CALL_CENTER: 'callcenter',
    CALLCENTER: 'callcenter',
    PACKER: 'packer',
    WAREHOUSE: 'warehouse',
    WARE_HOUSE: 'warehouse',
    DELIVERYMAN: 'deliveryman',
    DELIVERY_MAN: 'deliveryman',
    INCHARGE: 'incharge',
    IN_CHARGE: 'incharge',
    ACCOUNTS: 'accounts',
  };

  return map[normalized] ?? 'callcenter';
};

const toApiRole = (role: EmployeeRole): string => {
  const map: Record<EmployeeRole, string> = {
    callcenter: 'CALL_CENTER',
    packer: 'PACKER',
    warehouse: 'WARE_HOUSE',
    deliveryman: 'DELIVERYMAN',
    incharge: 'IN_CHARGE',
    accounts: 'ACCOUNTS',
  };
  return map[role];
};

const normalizeEmployee = (value: ApiAny): Employee => {
  const id = value?.id || value?.userId || '';
  return {
    id,
    userId: value?.userId || id,
    email: value?.email || '',
    firstName: value?.firstName || '',
    lastName: value?.lastName || '',
    role: toUiRole(value?.role || value?.employeeRole),
    status: String(
      value?.status || value?.employeeStatus || 'active',
    ).toLowerCase() as EmployeeStatus,
    assignedBy: value?.assignedBy || value?.assignedById || '',
    assignedAt:
      value?.assignedAt || value?.updatedAt || value?.createdAt || new Date().toISOString(),
    suspendedAt: value?.suspendedAt,
    suspendedBy: value?.suspendedBy,
    suspensionReason: value?.suspensionReason,
    activatedAt: value?.activatedAt,
    permissions: value?.permissions || {},
    performance: value?.performance || value?.metrics || {},
    createdAt: value?.createdAt || new Date().toISOString(),
    updatedAt: value?.updatedAt || new Date().toISOString(),
  };
};

const unwrapList = (payload: any, key: string) => {
  const direct = Array.isArray(payload?.[key]) ? payload[key] : null;
  const inData = Array.isArray(payload?.data?.[key]) ? payload.data[key] : null;
  const dataArray = Array.isArray(payload?.data) ? payload.data : null;
  const plainArray = Array.isArray(payload) ? payload : null;
  return direct || inData || dataArray || plainArray || [];
};

const unwrapObject = (payload: any, key: string) =>
  payload?.[key] || payload?.data?.[key] || payload?.data || payload || null;

async function getSessionOrUnauthorized() {
  const session = await auth();
  if (!session?.accessToken) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function getAllUsers(): Promise<
  Array<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmployee: boolean;
    employeeRole?: string;
    employeeStatus?: string;
    createdAt: string;
  }>
> {
  try {
    const session = await getSessionOrUnauthorized();
    const res = await fetchServiceJsonServer<ApiAny>('/admin/users/combined?limit=200&offset=0', {
      accessToken: session.accessToken,
      cache: 'no-store',
    });
    const rows = unwrapList(res, 'users');
    return rows.map((u: ApiAny) => ({
      id: u.id,
      email: u.email || '',
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      isEmployee: Boolean(u.isEmployee),
      employeeRole: u.employeeRole || u.role,
      employeeStatus: u.employeeStatus || u.status,
      createdAt: u.createdAt || new Date().toISOString(),
    }));
  } catch (err) {
    console.error('Error fetching users:', err);
    return [];
  }
}

export async function getAllEmployees(): Promise<Employee[]> {
  try {
    const session = await getSessionOrUnauthorized();
    const res = await fetchServiceJsonServer<ApiAny>('/admin/employees', {
      accessToken: session.accessToken,
      cache: 'no-store',
    });
    return unwrapList(res, 'employees').map(normalizeEmployee);
  } catch (err) {
    console.error('Error fetching employees:', err);
    return [];
  }
}

export async function getEmployeesByRole(role: EmployeeRole): Promise<Employee[]> {
  try {
    const session = await getSessionOrUnauthorized();
    const apiRole = toApiRole(role);
    const roleCandidates = Array.from(
      new Set([
        apiRole,
        apiRole.replace('DELIVERYMAN', 'DELIVERY_MAN'),
        apiRole.replace('DELIVERY_MAN', 'DELIVERYMAN'),
        apiRole.toLowerCase(),
      ]),
    );

    const urls = roleCandidates.flatMap((roleValue) => [
      `/admin/employees?role=${encodeURIComponent(roleValue)}&page=1&perPage=200`,
      `/admin/employees?role=${encodeURIComponent(roleValue)}&limit=200&offset=0`,
      `/admin/employees?role=${encodeURIComponent(roleValue)}`,
    ]);

    for (const url of urls) {
      try {
        const res = await fetchServiceJsonServer<ApiAny>(url, {
          accessToken: session.accessToken,
          cache: 'no-store',
        });
        const employees: Employee[] = unwrapList(res, 'employees').map(normalizeEmployee);
        if (employees.length) return employees.filter((emp: Employee) => emp.role === role);
      } catch {
        // try next URL variant
      }
    }

    // Final fallback: fetch all employees and filter client-side
    const allRes = await fetchServiceJsonServer<ApiAny>('/admin/employees', {
      accessToken: session.accessToken,
      cache: 'no-store',
    });
    return (unwrapList(allRes, 'employees').map(normalizeEmployee) as Employee[]).filter(
      (emp: Employee) => emp.role === role,
    );
  } catch (err) {
    console.error('Error fetching employees by role:', err);
    return [];
  }
}

export async function getCurrentEmployee(): Promise<Employee | null> {
  try {
    const session = await getSessionOrUnauthorized();
    const res = await fetchServiceJsonServer<ApiAny>('/admin/employees/me/metrics', {
      accessToken: session.accessToken,
      cache: 'no-store',
    });
    const employeeLike = unwrapObject(res, 'employee');
    if (!employeeLike) return null;
    return normalizeEmployee(employeeLike);
  } catch (err) {
    console.error('Error fetching current employee:', err);
    return null;
  }
}

export async function assignEmployeeRole(
  userId: string,
  role: EmployeeRole,
): Promise<{ success: boolean; message: string; employee?: Employee }> {
  try {
    const session = await getSessionOrUnauthorized();
    const res = await fetchServiceJsonServer<ApiAny>('/admin/employees/assign-role', {
      method: 'POST',
      body: JSON.stringify({ userId, role: toApiRole(role) }),
      accessToken: session.accessToken,
    });

    return {
      success: res?.success !== false,
      message: res?.message || 'Employee role assigned',
      employee: res?.employee ? normalizeEmployee(res.employee) : undefined,
    };
  } catch (err) {
    console.error('Error assigning employee role:', err);
    return { success: false, message: 'Failed to assign employee role' };
  }
}

export async function removeEmployeeRole(userId: string) {
  try {
    const session = await getSessionOrUnauthorized();
    const res = await fetchServiceJsonServer<ApiAny>(`/admin/employees/${userId}/role`, {
      method: 'DELETE',
      accessToken: session.accessToken,
    });
    return { success: res?.success !== false, message: res?.message || 'Employee role removed' };
  } catch (err) {
    console.error('Error removing employee role:', err);
    return { success: false, message: 'Failed to remove role' };
  }
}

export async function updateEmployeeStatus(
  userId: string,
  status: EmployeeStatus,
  reason?: string,
) {
  try {
    const session = await getSessionOrUnauthorized();
    const url =
      status === 'suspended'
        ? `/admin/employees/${userId}/suspend`
        : `/admin/employees/${userId}/activate`;
    const method = 'PATCH';
    const body = status === 'suspended' ? { reason: reason || 'Suspended by admin' } : {};

    const res = await fetchServiceJsonServer<ApiAny>(url, {
      method,
      body: JSON.stringify(body),
      accessToken: session.accessToken,
    });
    return { success: res?.success !== false, message: res?.message || 'Employee status updated' };
  } catch (err) {
    console.error('Error updating employee status:', err);
    return { success: false, message: 'Failed to update employee status' };
  }
}

export async function manageEmployeeUser(payload: {
  email: string;
  role: EmployeeRole;
  active: boolean;
}) {
  try {
    const session = await getSessionOrUnauthorized();
    const res = await fetchServiceJsonServer<ApiAny>('/admin/employees/manage-user', {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        role: toApiRole(payload.role),
        active: payload.active,
      }),
      accessToken: session.accessToken,
    });
    return { success: res?.success !== false, message: res?.message || 'Updated successfully' };
  } catch (err) {
    console.error('Error managing employee user:', err);
    return { success: false, message: 'Failed to manage employee' };
  }
}
