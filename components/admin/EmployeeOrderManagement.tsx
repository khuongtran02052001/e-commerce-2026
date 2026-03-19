'use client';

import { getCurrentEmployee, getEmployeesByRole } from '@/actions/employeeActions';
import {
  assignDeliveryman,
  confirmAddress,
  confirmOrder,
  getOrderWorkflow,
  getOrdersForEmployee,
  markAsDelivered,
  markAsPacked,
  markFailedDelivery,
  receivePaymentFromDeliveryman,
  rescheduleDelivery,
  startDelivery,
} from '@/actions/orderEmployeeActions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Employee, OrderWithTracking, getRoleDisplayName } from '@/types/domain/employee';
import {
  formatOrderActor,
  normalizeOrderStatus,
  requiresOrderCashCollection,
} from '@/types/domain/order';
import {
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Package,
  RefreshCw,
  Truck,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const WORKFLOW_STAGE_INDEX: Record<string, number> = {
  pending: 0,
  address_confirmed: 1,
  order_confirmed: 2,
  packed: 3,
  ready_for_delivery: 4,
  out_for_delivery: 5,
  delivered: 6,
  completed: 7,
};

const requiresCashCollection = (order: OrderWithTracking) => {
  return requiresOrderCashCollection(order);
};

const getOrderWorkflowFlags = (order: OrderWithTracking) => {
  const tracking = order.tracking || {};
  const status = normalizeOrderStatus(order.status);
  const stage = WORKFLOW_STAGE_INDEX[status] ?? -1;

  const hasAddressConfirmed = Boolean(tracking.addressConfirmedBy) || stage >= 1;
  const hasOrderConfirmed = Boolean(tracking.orderConfirmedBy) || stage >= 2;
  const hasPacked = Boolean(tracking.packedBy) || stage >= 3;
  const hasAssignedDeliveryman = Boolean(tracking.assignedDeliverymanId) || stage >= 4;
  const hasStartedDelivery =
    Boolean(tracking.dispatchedBy || tracking.dispatchedAt) ||
    stage >= 5 ||
    status === 'failed_delivery' ||
    status === 'rescheduled';
  const hasDelivered = Boolean(tracking.deliveredBy) || stage >= 6;
  const hasPaymentReceived =
    Boolean(tracking.paymentReceivedBy) ||
    normalizeOrderStatus(order.paymentStatus) === 'paid' ||
    stage >= 7;

  const isTerminal = ['cancelled', 'refunded', 'failed'].includes(status);

  return {
    status,
    hasAddressConfirmed,
    hasOrderConfirmed,
    hasPacked,
    hasAssignedDeliveryman,
    hasStartedDelivery,
    hasDelivered,
    hasPaymentReceived,
    isTerminal,
  };
};

export default function EmployeeOrderManagement() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [orders, setOrders] = useState<OrderWithTracking[]>([]);
  const [deliverymen, setDeliverymen] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithTracking | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<string>('');
  const [actionNotes, setActionNotes] = useState('');
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [selectedDeliveryman, setSelectedDeliveryman] = useState<string>('');
  const [workflowLogsByOrder, setWorkflowLogsByOrder] = useState<Record<string, any[]>>({});
  const [openWorkflowOrderId, setOpenWorkflowOrderId] = useState<string | null>(null);
  const [loadingWorkflowOrderId, setLoadingWorkflowOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'workflow'>('orders');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [currentEmp, ordersData] = await Promise.all([
        getCurrentEmployee(),
        getOrdersForEmployee(),
      ]);
      let deliverymenData: Employee[] = [];
      if (currentEmp && (currentEmp.role === 'packer' || currentEmp.role === 'incharge')) {
        deliverymenData = await getEmployeesByRole('deliveryman');
      }
      setEmployee(currentEmp);
      setOrders(ordersData);
      setDeliverymen(deliverymenData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  const handleAction = async () => {
    if (!selectedOrder) return;
    const needCashCollection = requiresCashCollection(selectedOrder);

    setActionLoading(true);
    try {
      let result;

      switch (actionType) {
        case 'confirmAddress':
          result = await confirmAddress(selectedOrder.id, actionNotes);
          break;
        case 'confirmOrder':
          result = await confirmOrder(selectedOrder.id, actionNotes);
          break;
        case 'markPacked':
          result = await markAsPacked(selectedOrder.id, actionNotes);
          break;
        case 'assignDeliveryman':
          if (!selectedDeliveryman) {
            toast.error('Please select a deliveryman');
            return;
          }
          result = await assignDeliveryman(selectedOrder.id, selectedDeliveryman);
          break;
        case 'startDelivery':
          result = await startDelivery(selectedOrder.id, actionNotes);
          break;
        case 'markDelivered':
          result = await markAsDelivered(
            selectedOrder.id,
            needCashCollection ? cashAmount : undefined,
            actionNotes,
          );
          break;
        case 'rescheduleDelivery':
          result = await rescheduleDelivery(selectedOrder.id, actionNotes);
          break;
        case 'failedDelivery':
          result = await markFailedDelivery(selectedOrder.id, actionNotes);
          break;
        case 'receivePayment':
          result = await receivePaymentFromDeliveryman(selectedOrder.id, actionNotes);
          break;
        default:
          toast.error('Invalid action');
          return;
      }

      if (result.success) {
        toast.success(result.message);
        setShowActionDialog(false);
        setActionNotes('');
        setCashAmount(0);
        setSelectedDeliveryman('');
        loadData();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error performing action:', error);
      toast.error('Failed to perform action');
    } finally {
      setActionLoading(false);
    }
  };

  const openActionDialog = (order: OrderWithTracking, type: string) => {
    setSelectedOrder(order);
    setActionType(type);
    setCashAmount(order.totalPrice);
    setShowActionDialog(true);
  };

  const toggleWorkflow = async (orderId: string) => {
    if (openWorkflowOrderId === orderId) {
      setOpenWorkflowOrderId(null);
      return;
    }

    setOpenWorkflowOrderId(orderId);
    if (workflowLogsByOrder[orderId]) return;

    setLoadingWorkflowOrderId(orderId);
    try {
      const logs = await getOrderWorkflow(orderId);
      console.log(logs);
      setWorkflowLogsByOrder((prev) => ({ ...prev, [orderId]: logs || [] }));
    } catch (error) {
      console.error('Failed to load workflow logs:', error);
      toast.error('Failed to load workflow logs');
    } finally {
      setLoadingWorkflowOrderId(null);
    }
  };

  const canPerformAction = (order: OrderWithTracking, action: string): boolean => {
    if (!employee) return false;
    const flags = getOrderWorkflowFlags(order);

    switch (action) {
      case 'confirmAddress':
        return employee.role === 'callcenter' && !flags.hasAddressConfirmed && !flags.isTerminal;
      case 'confirmOrder':
        return (
          (employee.role === 'callcenter' || employee.role === 'incharge') &&
          flags.hasAddressConfirmed &&
          !flags.hasOrderConfirmed &&
          !flags.isTerminal
        );
      case 'markPacked':
        return (
          (employee.role === 'packer' || employee.role === 'incharge') &&
          flags.hasOrderConfirmed &&
          !flags.hasPacked &&
          !flags.isTerminal
        );
      case 'assignDeliveryman':
        return (
          (employee.role === 'packer' || employee.role === 'incharge') &&
          flags.hasPacked &&
          !flags.hasAssignedDeliveryman &&
          !flags.isTerminal
        );
      case 'markDelivered':
        return (
          (employee.role === 'deliveryman' || employee.role === 'incharge') &&
          flags.hasAssignedDeliveryman &&
          flags.hasStartedDelivery &&
          !flags.hasDelivered &&
          !flags.isTerminal
        );
      case 'startDelivery':
        return (
          (employee.role === 'deliveryman' || employee.role === 'incharge') &&
          flags.hasAssignedDeliveryman &&
          !flags.hasStartedDelivery &&
          !flags.hasDelivered &&
          !flags.isTerminal
        );
      case 'rescheduleDelivery':
        return (
          (employee.role === 'deliveryman' || employee.role === 'incharge') &&
          flags.hasAssignedDeliveryman &&
          flags.hasStartedDelivery &&
          !flags.hasDelivered &&
          !flags.isTerminal
        );
      case 'failedDelivery':
        return (
          (employee.role === 'deliveryman' || employee.role === 'incharge') &&
          flags.hasAssignedDeliveryman &&
          flags.hasStartedDelivery &&
          !flags.hasDelivered &&
          !flags.isTerminal
        );
      case 'receivePayment':
        return (
          (employee.role === 'accounts' || employee.role === 'incharge') &&
          flags.hasDelivered &&
          (Boolean(order.tracking?.cashCollected) || requiresCashCollection(order)) &&
          !flags.hasPaymentReceived &&
          !flags.isTerminal
        );
      default:
        return false;
    }
  };

  const getOrderProgress = (order: OrderWithTracking): number => {
    const flags = getOrderWorkflowFlags(order);
    let progress = 0;
    if (flags.hasAddressConfirmed) progress += 16.67;
    if (flags.hasOrderConfirmed) progress += 16.67;
    if (flags.hasPacked) progress += 16.67;
    if (flags.hasAssignedDeliveryman) progress += 16.67;
    if (flags.hasDelivered) progress += 16.67;
    if (flags.hasPaymentReceived) progress += 16.65;
    return progress;
  };

  const getPendingActionCount = (currentRole: Employee['role']) =>
    orders.filter((order) => {
      if (currentRole === 'callcenter') {
        return canPerformAction(order, 'confirmAddress') || canPerformAction(order, 'confirmOrder');
      }
      if (currentRole === 'packer') {
        return (
          canPerformAction(order, 'markPacked') || canPerformAction(order, 'assignDeliveryman')
        );
      }
      if (currentRole === 'deliveryman') {
        return (
          canPerformAction(order, 'startDelivery') ||
          canPerformAction(order, 'markDelivered') ||
          canPerformAction(order, 'rescheduleDelivery') ||
          canPerformAction(order, 'failedDelivery')
        );
      }
      if (currentRole === 'accounts') {
        return canPerformAction(order, 'receivePayment');
      }
      if (currentRole === 'incharge') {
        return (
          canPerformAction(order, 'confirmAddress') ||
          canPerformAction(order, 'confirmOrder') ||
          canPerformAction(order, 'markPacked') ||
          canPerformAction(order, 'assignDeliveryman') ||
          canPerformAction(order, 'startDelivery') ||
          canPerformAction(order, 'markDelivered') ||
          canPerformAction(order, 'rescheduleDelivery') ||
          canPerformAction(order, 'failedDelivery') ||
          canPerformAction(order, 'receivePayment')
        );
      }
      return false;
    }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600">You are not assigned as an employee</p>
          <p className="text-sm text-gray-500 mt-2">Please contact your administrator</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Order Management</h1>
          <p className="text-gray-600">
            Role: <span className="font-semibold">{getRoleDisplayName(employee.role)}</span>
          </p>
        </div>
        <Button onClick={loadData} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Action</p>
              <p className="text-2xl font-bold">{getPendingActionCount(employee.role)}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold">
                {orders.filter((o) => o.tracking?.deliveredBy).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Your Performance</p>
              <p className="text-2xl font-bold">{employee.performance?.ordersProcessed || 0}</p>
            </div>
            <User className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'orders' | 'workflow')}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="workflow">Workflow Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-500">No orders to display</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 sm:p-6">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Order #{order.orderNumber.slice(0, 8)}...
                        </h3>
                        <p className="text-sm text-gray-600">{order.customerName}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                        <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{Math.round(getOrderProgress(order))}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getOrderProgress(order)}%` }}
                        />
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold">Amount:</span> ${order.totalPrice}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="font-semibold">City:</span> {order.address.city}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span className="font-semibold">Items:</span> {order.products.length}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-semibold">Date:</span>{' '}
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Tracking Info */}
                    {order.tracking && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold mb-2 text-sm">Tracking Information</h4>
                        <div className="space-y-1 text-xs">
                          {order.tracking.addressConfirmedBy && (
                            <p className="text-gray-600">
                              ✓ Address confirmed by{' '}
                              {formatOrderActor(order.tracking.addressConfirmedBy) || 'Unknown'}
                            </p>
                          )}
                          {order.tracking.orderConfirmedBy && (
                            <p className="text-gray-600">
                              ✓ Order confirmed by{' '}
                              {formatOrderActor(order.tracking.orderConfirmedBy) || 'Unknown'}
                            </p>
                          )}
                          {order.tracking.packedBy && (
                            <p className="text-gray-600">
                              ✓ Packed by {formatOrderActor(order.tracking.packedBy) || 'Unknown'}
                            </p>
                          )}
                          {order.tracking.assignedDeliverymanName && (
                            <p className="text-gray-600">
                              ✓ Assigned to{' '}
                              {formatOrderActor(order.tracking.assignedDeliverymanName) ||
                                'Unknown'}
                            </p>
                          )}
                          {order.tracking.deliveredBy && (
                            <p className="text-gray-600">
                              ✓ Delivered by{' '}
                              {formatOrderActor(order.tracking.deliveredBy) || 'Unknown'}
                            </p>
                          )}
                          {order.tracking.paymentReceivedBy && (
                            <p className="text-gray-600">
                              ✓ Payment received by{' '}
                              {formatOrderActor(order.tracking.paymentReceivedBy) || 'Unknown'}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleWorkflow(order.id)}
                        className="flex items-center gap-2"
                      >
                        {openWorkflowOrderId === order.id ? 'Hide Workflow' : 'View Workflow'}
                      </Button>
                      {canPerformAction(order, 'confirmAddress') && (
                        <Button
                          size="sm"
                          onClick={() => openActionDialog(order, 'confirmAddress')}
                          className="flex items-center gap-2"
                        >
                          <MapPin className="h-4 w-4" />
                          Confirm Address
                        </Button>
                      )}
                      {canPerformAction(order, 'confirmOrder') && (
                        <Button
                          size="sm"
                          onClick={() => openActionDialog(order, 'confirmOrder')}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Confirm Order
                        </Button>
                      )}
                      {canPerformAction(order, 'markPacked') && (
                        <Button
                          size="sm"
                          onClick={() => openActionDialog(order, 'markPacked')}
                          className="flex items-center gap-2"
                        >
                          <Package className="h-4 w-4" />
                          Mark as Packed
                        </Button>
                      )}
                      {canPerformAction(order, 'assignDeliveryman') && (
                        <Button
                          size="sm"
                          onClick={() => openActionDialog(order, 'assignDeliveryman')}
                          className="flex items-center gap-2"
                        >
                          <Truck className="h-4 w-4" />
                          Assign Deliveryman
                        </Button>
                      )}
                      {canPerformAction(order, 'markDelivered') && (
                        <Button
                          size="sm"
                          onClick={() => openActionDialog(order, 'markDelivered')}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Mark as Delivered
                        </Button>
                      )}
                      {canPerformAction(order, 'startDelivery') && (
                        <Button
                          size="sm"
                          onClick={() => openActionDialog(order, 'startDelivery')}
                          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700"
                        >
                          <Truck className="h-4 w-4" />
                          Start Delivery
                        </Button>
                      )}
                      {canPerformAction(order, 'rescheduleDelivery') && (
                        <Button
                          size="sm"
                          onClick={() => openActionDialog(order, 'rescheduleDelivery')}
                          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700"
                        >
                          <Clock className="h-4 w-4" />
                          Reschedule
                        </Button>
                      )}
                      {canPerformAction(order, 'failedDelivery') && (
                        <Button
                          size="sm"
                          onClick={() => openActionDialog(order, 'failedDelivery')}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                        >
                          <Clock className="h-4 w-4" />
                          Mark Failed
                        </Button>
                      )}
                      {canPerformAction(order, 'receivePayment') && (
                        <Button
                          size="sm"
                          onClick={() => openActionDialog(order, 'receivePayment')}
                          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                        >
                          <DollarSign className="h-4 w-4" />
                          Receive Payment
                        </Button>
                      )}
                    </div>

                    {openWorkflowOrderId === order.id && (
                      <div className="mt-4 border rounded-lg p-4 bg-gray-50">
                        <h5 className="text-sm font-semibold mb-3">Workflow Logs</h5>
                        {loadingWorkflowOrderId === order.id ? (
                          <p className="text-sm text-gray-500">Loading workflow logs...</p>
                        ) : (workflowLogsByOrder[order.id] || []).length === 0 ? (
                          <p className="text-sm text-gray-500">No workflow logs yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {(workflowLogsByOrder[order.id] || []).map((log, index) => {
                              const action = log?.action || log?.status || 'Action';
                              const role = log?.role || log?.changedByRole || 'system';
                              const actor =
                                log?.employeeName ||
                                log?.performedBy ||
                                log?.changedBy ||
                                log?.userEmail ||
                                'Unknown';
                              const note = log?.notes || log?.note || '';
                              const cashAmount = log?.cashAmount;
                              const at = log?.createdAt || log?.timestamp || log?.changedAt;
                              return (
                                <div
                                  key={`${order.id}-wf-${index}`}
                                  className="text-xs bg-white border rounded p-2"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="font-semibold text-gray-800">
                                      {String(action)}
                                    </span>
                                    <span className="text-gray-500">
                                      {at ? new Date(at).toLocaleString() : '-'}
                                    </span>
                                  </div>
                                  <div className="mt-1 text-gray-600">
                                    Role: <span className="font-medium">{String(role)}</span> | By:{' '}
                                    <span className="font-medium">{String(actor)}</span>
                                  </div>
                                  {typeof cashAmount === 'number' && (
                                    <div className="mt-1 text-gray-600">
                                      Cash: <span className="font-medium">${cashAmount}</span>
                                    </div>
                                  )}
                                  {note ? (
                                    <div className="mt-1 text-gray-600">Note: {String(note)}</div>
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="workflow">
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-500">No orders to display</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={`${order.id}-workflow-tab`} className="bg-white rounded-lg shadow p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="font-semibold">Order #{order.orderNumber.slice(0, 8)}...</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toggleWorkflow(order.id)}>
                      Load Logs
                    </Button>
                  </div>

                  {openWorkflowOrderId === order.id && (
                    <div className="mt-3 border rounded-md p-3 bg-gray-50">
                      {loadingWorkflowOrderId === order.id ? (
                        <p className="text-sm text-gray-500">Loading workflow logs...</p>
                      ) : (workflowLogsByOrder[order.id] || []).length === 0 ? (
                        <p className="text-sm text-gray-500">No workflow logs yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {(workflowLogsByOrder[order.id] || []).map((log, index) => (
                            <div
                              key={`${order.id}-wf-tab-${index}`}
                              className="bg-white border rounded p-2 text-xs"
                            >
                              <p className="font-medium text-gray-800">
                                {String(log?.action || log?.status || 'Action')}
                              </p>
                              <p className="text-gray-600">
                                {String(
                                  log?.performedBy || log?.changedBy || log?.userEmail || 'Unknown',
                                )}{' '}
                                - {String(log?.role || log?.changedByRole || 'system')}
                              </p>
                              <p className="text-gray-500">
                                {log?.createdAt || log?.timestamp || log?.changedAt
                                  ? new Date(
                                      log?.createdAt || log?.timestamp || log?.changedAt,
                                    ).toLocaleString()
                                  : '-'}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'confirmAddress' && 'Confirm Address'}
              {actionType === 'confirmOrder' && 'Confirm Order'}
              {actionType === 'markPacked' && 'Mark as Packed'}
              {actionType === 'assignDeliveryman' && 'Assign Deliveryman'}
              {actionType === 'startDelivery' && 'Start Delivery'}
              {actionType === 'markDelivered' && 'Mark as Delivered'}
              {actionType === 'rescheduleDelivery' && 'Reschedule Delivery'}
              {actionType === 'failedDelivery' && 'Mark Delivery as Failed'}
              {actionType === 'receivePayment' && 'Receive Payment'}
            </DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.orderNumber.slice(0, 8)}...
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {actionType === 'assignDeliveryman' && (
              <div>
                <Label htmlFor="deliveryman">Select Deliveryman</Label>
                <Select value={selectedDeliveryman} onValueChange={setSelectedDeliveryman}>
                  <SelectTrigger id="deliveryman">
                    <SelectValue placeholder="Choose deliveryman" />
                  </SelectTrigger>
                  <SelectContent>
                    {deliverymen.map((dm) => {
                      const deliverymanId = dm.id || dm.id;
                      if (!deliverymanId) return null;
                      return (
                        <SelectItem key={deliverymanId} value={deliverymanId}>
                          {dm.firstName} {dm.lastName}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}

            {actionType === 'markDelivered' &&
              (() => {
                if (!selectedOrder || !requiresCashCollection(selectedOrder)) return null;

                return (
                  <div>
                    <Label htmlFor="cashAmount">Cash Collected Amount</Label>
                    <Input
                      id="cashAmount"
                      type="number"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(Number(e.target.value))}
                      placeholder="Enter amount"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Order total: ${selectedOrder?.totalPrice}
                    </p>
                  </div>
                );
              })()}

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Add any notes..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAction} disabled={actionLoading}>
              {actionLoading ? 'Processing...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
