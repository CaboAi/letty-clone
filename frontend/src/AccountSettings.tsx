import React, { useState } from 'react';
import { 
  Key, 
  Mail, 
  Users, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Copy,
  CheckCircle,
  XCircle,
  Shield
} from 'lucide-react';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { mockAccountSettings } from '../data/mockData';
import { AccountSettings, APIKey, ConnectedAccount, TeamMember } from '../types';

const AccountSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AccountSettings>(mockAccountSettings);
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const handleDeleteKey = (keyId: string) => {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      setSettings(prev => ({
        ...prev,
        apiKeys: prev.apiKeys.filter(key => key.id !== keyId)
      }));
    }
  };

  const handleDeleteMember = (memberId: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      setSettings(prev => ({
        ...prev,
        teamMembers: prev.teamMembers.filter(member => member.id !== memberId)
      }));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you'd show a toast notification
    alert('Copied to clipboard!');
  };

  const getAccountStatusIcon = (status: ConnectedAccount['status']) => {
    return status === 'connected' ? 
      <CheckCircle className="h-5 w-5 text-green-500" /> : 
      <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getRoleColor = (role: TeamMember['role']) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600">Manage API keys, integrations, and team access</p>
        </div>
      </div>

      {/* API Keys */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Key className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">API Keys</h3>
            </div>
            <Button size="sm" icon={Plus} onClick={() => setShowCreateKey(true)}>
              Create Key
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Manage API keys for programmatic access</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {settings.apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-gray-900">{apiKey.name}</h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Created {apiKey.created.toLocaleDateString()}</span>
                    {apiKey.lastUsed && (
                      <span>Last used {apiKey.lastUsed.toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    <code className="text-sm bg-white px-2 py-1 rounded border font-mono">
                      {visibleKeys.has(apiKey.id) ? apiKey.key : apiKey.key.replace(/./g, '*')}
                    </code>
                    <button
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {visibleKeys.has(apiKey.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(apiKey.key)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Trash2}
                    onClick={() => handleDeleteKey(apiKey.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Connected Accounts</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">OAuth integrations for email and messaging</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {settings.connectedAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getAccountStatusIcon(account.status)}
                  <div>
                    <h4 className="font-medium text-gray-900 capitalize">{account.type}</h4>
                    <p className="text-sm text-gray-500">{account.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    account.status === 'connected' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {account.status}
                  </span>
                  <Button size="sm" variant="outline">
                    {account.status === 'connected' ? 'Disconnect' : 'Reconnect'}
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              <Mail className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Connect More Accounts</h4>
              <p className="text-sm text-gray-500 mb-4">Add Outlook, Yahoo, or other email providers</p>
              <Button variant="outline" size="sm">Add Account</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Team Members */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
            </div>
            <Button size="sm" icon={Plus} onClick={() => setShowInviteMember(true)}>
              Invite Member
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Manage team access and permissions</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {settings.teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-500">{member.email}</p>
                    <p className="text-xs text-gray-400">
                      Last active {member.lastActive.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleColor(member.role)}`}>
                    {member.role}
                  </span>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">Edit</Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={Trash2}
                      onClick={() => handleDeleteMember(member.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Security</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">Account security and access controls</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <Button variant="outline" size="sm">Enable 2FA</Button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <h4 className="font-medium text-gray-900">Password</h4>
                <p className="text-sm text-gray-500">Last changed 3 months ago</p>
              </div>
              <Button variant="outline" size="sm">Change Password</Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900">Login Sessions</h4>
                <p className="text-sm text-gray-500">Manage active sessions and devices</p>
              </div>
              <Button variant="outline" size="sm">View Sessions</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Create API Key Modal */}
      {showCreateKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Create API Key</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Production API Key"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Permissions
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Full Access</option>
                    <option>Read Only</option>
                    <option>Limited Access</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowCreateKey(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setShowCreateKey(false);
                alert('API key created successfully!');
              }}>
                Create Key
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Team Member Modal */}
      {showInviteMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Invite Team Member</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="colleague@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="viewer">Viewer - View only access</option>
                    <option value="editor">Editor - Can modify settings</option>
                    <option value="admin">Admin - Full access</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowInviteMember(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setShowInviteMember(false);
                alert('Invitation sent successfully!');
              }}>
                Send Invitation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettingsPage;