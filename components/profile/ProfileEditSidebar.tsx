'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { fetchService } from '@/lib/restClient';
import { showToast } from '@/lib/toast';
import { useUserData } from '@/contexts/UserDataContext';
import { Calendar, Phone, Save, User, X } from 'lucide-react';
import { useState } from 'react';

interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  default: boolean;
  type: 'home' | 'office' | 'other';
  createdAt?: string;
  phone?: string;
}

interface UserProfile {
  id: string;
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string;
  dateOfBirth?: string;
  profileImage?: {
    url?: string;
    asset?: {
      url: string;
    };
  };
  addresses?: Address[];
  preferences?: Record<string, unknown>;
  loyaltyPoints?: number;
  rewardPoints?: number;
  totalSpent?: number;
  lastLogin?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ProfileEditSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onProfileUpdated?: () => void;
}

export default function ProfileEditSidebar({
  isOpen,
  onClose,
  user,
  onProfileUpdated,
}: ProfileEditSidebarProps) {
  const [loading, setLoading] = useState(false);
  const { refreshUserData } = useUserData();
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
    dateOfBirth: user.dateOfBirth || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetchService('/auth/me', {
        method: 'PUT',
        body: JSON.stringify({
          ...formData,
        }),
      });

      if (response.ok) {
        showToast.success('Profile Updated', 'Your profile has been successfully updated.');
        await refreshUserData();
        onClose();
        if (onProfileUpdated) {
          onProfileUpdated();
        }
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast.error('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Edit Profile</span>
          </SheetTitle>
          <SheetDescription>Update your personal information.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Account Data (Read-only) */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                Account (Read-only)
              </h3>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-gray-600">First Name</Label>
                  <div className="text-gray-900 bg-white p-2 rounded border text-sm">
                    {user.firstName || 'Not provided'}
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-600">Last Name</Label>
                  <div className="text-gray-900 bg-white p-2 rounded border text-sm">
                    {user.lastName || 'Not provided'}
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-600">Email</Label>
                  <div className="text-gray-900 bg-white p-2 rounded border text-sm">
                    {user.email || 'Not provided'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Editable Profile Data */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Profile Information
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="firstName" className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>First Name</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="lastName" className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Last Name</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>Phone Number</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="dateOfBirth" className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Date of Birth</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-6 border-t">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </div>
              )}
            </Button>

            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
