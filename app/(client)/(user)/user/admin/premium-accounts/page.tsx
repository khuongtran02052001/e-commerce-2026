'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { isUserAdmin } from '@/lib/adminUtils';
import { useUserData } from '@/contexts/UserDataContext';
import { fetchService } from '@/lib/restClient';
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Crown,
  Mail,
  User,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface PremiumAccount {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  premiumStatus: string;
  premiumAppliedAt?: string;
  premiumApprovedBy?: string;
  premiumApprovedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  membershipType: string;
}

export default function PremiumAccountsAdmin() {
  const { authUser } = useUserData();
  const [accounts, setAccounts] = useState<PremiumAccount[]>([]);
  const [allAccounts, setAllAccounts] = useState<PremiumAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchPremiumAccounts();
  }, []);

  useEffect(() => {
    setAdminEmail(authUser?.email || '');
  }, [authUser?.email]);

  const fetchPremiumAccounts = async () => {
    try {
      const response = await fetchService('/admin/premium-accounts');
      if (response.ok) {
        const payload = await response.json();
        const items = payload?.data || payload?.accounts || [];
        const list = Array.isArray(items) ? items : [];
        setAllAccounts(list);
        const pendingOnly = list.filter(
          (account: PremiumAccount) => account.premiumStatus === 'pending',
        );
        setAccounts(pendingOnly);
      } else {
        toast.error('Failed to fetch premium accounts');
      }
    } catch (error) {
      console.error('Error fetching premium accounts:', error);
      toast.error('Error loading premium accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (accountId: string, approve: boolean, reason?: string) => {
    if (!adminEmail) {
      toast.error('Admin email not available');
      return;
    }
    setProcessing(accountId);
    try {
      const response = await fetchService('/admin/premium-accounts/approve', {
        method: 'POST',
        body: JSON.stringify({
          accountId,
          approve,
          adminEmail,
          reason,
        }),
      });

      if (response.ok) {
        toast.success(`Premium account ${approve ? 'approved' : 'rejected'} successfully`);
        fetchPremiumAccounts(); // Refresh the list
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update premium account');
      }
    } catch (error) {
      console.error('Error updating premium account:', error);
      toast.error('Error updating premium account');
    } finally {
      setProcessing(null);
    }
  };

  const canViewAll = isUserAdmin(adminEmail);
  const displayedAccounts = showAll && canViewAll ? allAccounts : accounts;

  const getStatusBadge = (account: PremiumAccount) => {
    switch (account.premiumStatus) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-200">
            <User className="w-3 h-3 mr-1" />
            None
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Premium Account Management</h1>
        <p className="text-gray-600">Manage and approve premium account applications</p>
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
            <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {showAll ? 'No Accounts Found' : 'No Pending Requests'}
            </h3>
            <p className="text-gray-500">
              {showAll
                ? 'No premium accounts available.'
                : 'No premium account requests to approve.'}
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
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Crown className="w-5 h-5 text-yellow-600" />
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
                        {account.premiumAppliedAt && (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Applied {new Date(account.premiumAppliedAt).toLocaleDateString()}
                          </div>
                        )}
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
                    {account.premiumApprovedBy && (
                      <p className="text-sm text-gray-600">
                        Processed by:{' '}
                        <span className="font-medium">{account.premiumApprovedBy}</span>
                      </p>
                    )}
                    {account.premiumApprovedAt && (
                      <p className="text-sm text-gray-600">
                        Date:{' '}
                        <span className="font-medium">
                          {new Date(account.premiumApprovedAt).toLocaleDateString()}
                        </span>
                      </p>
                    )}
                    {account.rejectionReason && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Reason: {account.rejectionReason}
                      </p>
                    )}
                  </div>

                  {account.premiumStatus === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleApproval(
                            account.id,
                            false,
                            'Application does not meet requirements',
                          )
                        }
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
