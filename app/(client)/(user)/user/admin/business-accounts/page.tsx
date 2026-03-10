'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { isUserAdmin } from '@/lib/adminUtils';
import { useUserData } from '@/contexts/UserDataContext';
import { fetchService } from '@/lib/restClient';
import { Building2, Calendar, CheckCircle, Clock, Mail, User, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface BusinessAccount {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isBusiness: boolean;
  businessApprovedBy?: string;
  businessApprovedAt?: string;
  createdAt: string;
  membershipType: string;
}

export default function BusinessAccountsAdmin() {
  const { authUser } = useUserData();
  const [accounts, setAccounts] = useState<BusinessAccount[]>([]);
  const [allAccounts, setAllAccounts] = useState<BusinessAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchBusinessAccounts();
  }, []);

  useEffect(() => {
    setAdminEmail(authUser?.email || '');
  }, [authUser?.email]);

  const fetchBusinessAccounts = async () => {
    try {
      const response = await fetchService('/admin/business-accounts');
      if (response.ok) {
        const payload = await response.json();
        const items = payload?.data || payload?.accounts || [];
        const list = Array.isArray(items) ? items : [];
        setAllAccounts(list);
        const pendingOnly = list.filter(
          (account: BusinessAccount) =>
            account.isBusiness && !account.businessApprovedBy,
        );
        setAccounts(pendingOnly);
      } else {
        toast.error('Failed to fetch business accounts');
      }
    } catch (error) {
      console.error('Error fetching business accounts:', error);
      toast.error('Error loading business accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (accountId: string, approve: boolean) => {
    if (!adminEmail) {
      toast.error('Admin email not available');
      return;
    }
    setProcessing(accountId);
    try {
      const response = await fetchService('/admin/business-accounts/approve', {
        method: 'POST',
        body: JSON.stringify({
          accountId,
          approve,
          adminEmail,
        }),
      });

      if (response.ok) {
        toast.success(`Business account ${approve ? 'approved' : 'rejected'} successfully`);
        fetchBusinessAccounts(); // Refresh the list
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update business account');
      }
    } catch (error) {
      console.error('Error updating business account:', error);
      toast.error('Error updating business account');
    } finally {
      setProcessing(null);
    }
  };

  const canViewAll = isUserAdmin(adminEmail);
  const displayedAccounts = showAll && canViewAll ? allAccounts : accounts;

  const getStatusBadge = (account: BusinessAccount) => {
    if (account.isBusiness && account.businessApprovedBy) {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    } else if (account.isBusiness) {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-700 border-gray-200">
          <User className="w-3 h-3 mr-1" />
          Regular
        </Badge>
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Account Management</h1>
        <p className="text-gray-600">Manage and approve business account requests</p>
        {canViewAll && (
          <div className="mt-4">
            <Button
              size="sm"
              variant={showAll ? 'default' : 'outline'}
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? 'Show Pending Only' : 'Show All Accounts'}
            </Button>
          </div>
        )}
      </div>

      {displayedAccounts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {showAll ? 'No Accounts Found' : 'No Pending Requests'}
            </h3>
            <p className="text-gray-500">
              {showAll
                ? 'No business accounts available.'
                : 'No business account requests to approve.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayedAccounts.map((account) => (
            <Card key={account.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {account.firstName && account.lastName
                          ? `${account.firstName} ${account.lastName}`
                          : account.email}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {account.email}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Joined {new Date(account.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(account)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      Membership:{' '}
                      <span className="font-medium capitalize">{account.membershipType}</span>
                    </p>
                    {account.businessApprovedBy && (
                      <p className="text-sm text-gray-600">
                        Approved by:{' '}
                        <span className="font-medium">{account.businessApprovedBy}</span>
                      </p>
                    )}
                    {account.businessApprovedAt && (
                      <p className="text-sm text-gray-600">
                        Approved on:{' '}
                        <span className="font-medium">
                          {new Date(account.businessApprovedAt).toLocaleDateString()}
                        </span>
                      </p>
                    )}
                  </div>

                  {account.isBusiness && !account.businessApprovedBy && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproval(account.id, false)}
                        disabled={processing === account.id}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApproval(account.id, true)}
                        disabled={processing === account.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
