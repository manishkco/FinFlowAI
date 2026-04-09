import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authAPI } from '../services/api';
import { getInitials } from '../utils/helpers';
import { Moon, Sun, User, Lock, Bell, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { dark, toggleTheme } = useTheme();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    currency: user?.currency || 'USD',
    monthlyBudget: user?.monthlyBudget || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordErrors, setPasswordErrors] = useState({});

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setProfileLoading(true);
    try {
      const { data } = await authAPI.updateProfile(profileForm);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
        <p className="text-slate-400 text-sm mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile section */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <User size={18} className="text-slate-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white">Profile Information</h3>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
            {getInitials(user?.name)}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Member since {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
              className="input"
              placeholder="Your full name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Currency</label>
              <select
                value={profileForm.currency}
                onChange={(e) => setProfileForm(p => ({ ...p, currency: e.target.value }))}
                className="input"
              >
                {[['USD', '$ US Dollar'], ['EUR', '€ Euro'], ['GBP', '£ British Pound'],
                  ['INR', '₹ Indian Rupee'], ['JPY', '¥ Japanese Yen'], ['CAD', '$ Canadian Dollar']].map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Monthly Budget</label>
              <input
                type="number"
                value={profileForm.monthlyBudget}
                onChange={(e) => setProfileForm(p => ({ ...p, monthlyBudget: e.target.value }))}
                className="input font-amount"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={profileLoading} className="btn-primary text-sm flex items-center gap-2">
              {profileLoading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : null}
              Save changes
            </button>
          </div>
        </form>
      </div>

      {/* Appearance */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          {dark ? <Moon size={18} className="text-slate-500" /> : <Sun size={18} className="text-slate-500" />}
          <h3 className="font-semibold text-slate-900 dark:text-white">Appearance</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Dark mode</p>
            <p className="text-xs text-slate-400 mt-0.5">Switch between light and dark themes</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
              dark ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
              dark ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* Security info */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Shield size={18} className="text-slate-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white">Security</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Password</p>
              <p className="text-xs text-slate-400 mt-0.5">Last changed: Unknown</p>
            </div>
            <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              Password change available via API
            </span>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
            <div className="flex items-start gap-3">
              <Shield size={16} className="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Your account is protected</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                  Passwords are hashed with bcrypt · JWT tokens expire in 7 days · All routes require authentication
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
