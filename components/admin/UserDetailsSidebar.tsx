'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Calendar, Clock, Mail, RefreshCw, UserCheck, UserX } from 'lucide-react';
import React, { useState } from 'react';

interface CombinedUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  imageUrl: string;
  createdAt: number;
  lastSignInAt?: number;
  emailVerified: boolean;
  banned: boolean;
  locked: boolean;
  isActive: boolean;
  activatedAt?: string;
  activatedBy?: string;
  loyaltyPoints: number;
  totalSpent: number;
  notificationCount: number;
}

interface UserDetailsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: CombinedUser | null;
  onActivate: (userId: string, activate: boolean) => Promise<void>;
  onDelete: (userId: string) => Promise<void>;
  onUserUpdate?: (updatedUser: CombinedUser) => void;
  isLoading: boolean;
}

export const UserDetailsSidebar: React.FC<UserDetailsSidebarProps> = ({
  isOpen,
  onClose,
  user,
  onActivate,
  onDelete,
  onUserUpdate,
  isLoading,
}) => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  if (!user) return null;

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    setActionLoading(action);
    try {
      if (action === 'delete') {
        await onDelete(user.id);
        onClose();
      } else {
        await onActivate(user.id, action === 'activate');
       
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const getActionButton = () => {
    return (
      <div className="flex gap-2 w-full">
        <Button
          variant={user.isActive ? 'destructive' : 'default'}
          onClick={() => handleAction(user.isActive ? 'deactivate' : 'activate')}
          disabled={actionLoading === (user.isActive ? 'deactivate' : 'activate') || isLoading}
          className="flex-1"
        >
          {actionLoading === (user.isActive ? 'deactivate' : 'activate') ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : user.isActive ? (
            <UserX className="h-4 w-4 mr-2" />
          ) : (
            <UserCheck className="h-4 w-4 mr-2" />
          )}
          {user.isActive ? 'Deactivate' : 'Activate'}
        </Button>
        <Button
          variant="outline"
          onClick={() => handleAction('delete')}
          disabled={actionLoading === 'delete' || isLoading}
        >
          {actionLoading === 'delete' ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Remove'}
        </Button>
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>User Details</SheetTitle>
            <SheetDescription>Manage user account</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6 pb-6">
              {/* User Profile */}
              <Card
                className={`p-6 transition-opacity duration-200 ${
                  actionLoading === 'activate' ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={user.imageUrl}
                      alt={user.fullName}
                      className="w-16 h-16 rounded-full"
                    />
                    {actionLoading === 'activate' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{user.fullName}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={user.emailVerified ? 'default' : 'secondary'}>
                        {user.emailVerified ? 'Verified' : 'Unverified'}
                      </Badge>
                      {user.banned && <Badge variant="destructive">Banned</Badge>}
                      {user.locked && <Badge variant="outline">Locked</Badge>}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Account Information */}
              <Card className="p-6">
                <h4 className="font-medium mb-4">Account Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Joined
                    </span>
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Last Sign In
                    </span>
                    <span>{user.lastSignInAt ? formatDate(user.lastSignInAt) : 'Never'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Account Status
                    </span>
                    <Badge variant={user.isActive ? 'default' : 'secondary'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>

            <div className="border-t bg-background/50 px-6 py-6 mt-auto">{getActionButton()}</div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
