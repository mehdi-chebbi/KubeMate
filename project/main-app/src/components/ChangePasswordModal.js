import React, { useState } from 'react';
import { Key, Loader2 } from 'lucide-react';
import { apiService } from '../services/apiService';

const ChangePasswordModal = ({ isOpen, onClose, onError, username }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await apiService.changeOwnPassword(
        formData.currentPassword,
        formData.newPassword
      );

      if (result.success) {
        setError('');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        onClose(result.message || 'Password changed successfully!');
      } else {
        setError(result.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="k8s-card p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Key className="w-6 h-6 text-k8s-blue" />
            <h3 className="text-xl font-bold text-white">Change Password</h3>
          </div>
          <button
            onClick={() => {
              onClose();
              setError('');
              setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }}
            className="text-k8s-gray hover:text-white transition-colors text-2xl"
            disabled={loading}
          >
            ×
          </button>
        </div>

        {username && (
          <p className="text-k8s-gray text-sm mb-4">
            Changing password for: <span className="text-k8s-blue font-medium">{username}</span>
          </p>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-k8s-gray mb-2">
              Current Password
            </label>
            <input
              type="password"
              id="current-password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="k8s-input w-full"
              placeholder="Enter current password"
              disabled={loading}
              autoFocus
            />
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-k8s-gray mb-2">
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="k8s-input w-full"
              placeholder="Enter new password (min 6 characters)"
              disabled={loading}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-k8s-gray mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="k8s-input w-full"
              placeholder="Confirm new password"
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                setError('');
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }}
              className="k8s-button-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="k8s-button-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Changing...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  Change Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
