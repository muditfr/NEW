import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const AdminDashboard = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Redirect if not admin
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }

    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        BASE_URL + "/admin/swaps/stats",
        { withCredentials: true }
      );
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.isAdmin) {
    return <div>Access Denied</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your DevTinder platform</p>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs tabs-boxed mb-8">
        <a 
          className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </a>
        <a 
          className={`tab ${activeTab === 'users' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </a>
        <a 
          className={`tab ${activeTab === 'reports' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </a>
        <a 
          className={`tab ${activeTab === 'swaps' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('swaps')}
        >
          Swaps
        </a>
        <a 
          className={`tab ${activeTab === 'messages' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          Messages
        </a>
        <a 
          className={`tab ${activeTab === 'analytics' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </a>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat bg-white shadow-lg rounded-lg">
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-primary">{stats?.totalUsers || 0}</div>
            <div className="stat-desc">Registered users</div>
          </div>
          
          <div className="stat bg-white shadow-lg rounded-lg">
            <div className="stat-title">Total Swaps</div>
            <div className="stat-value text-secondary">{stats?.totalSwaps || 0}</div>
            <div className="stat-desc">Connection requests</div>
          </div>
          
          <div className="stat bg-white shadow-lg rounded-lg">
            <div className="stat-title">Banned Users</div>
            <div className="stat-value text-error">{stats?.bannedUsers || 0}</div>
            <div className="stat-desc">Currently banned</div>
          </div>
          
          <div className="stat bg-white shadow-lg rounded-lg">
            <div className="stat-title">Swap Success Rate</div>
            <div className="stat-value text-success">
              {stats?.swapStats ? 
                Math.round((stats.swapStats.find(s => s._id === 'accepted')?.count || 0) / stats.totalSwaps * 100) + '%' 
                : '0%'}
            </div>
            <div className="stat-desc">Accepted connections</div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {activeTab === 'overview' && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentActivity?.map((activity, index) => (
                  <tr key={index}>
                    <td>
                      <div className="font-semibold">
                        {activity.userId?.firstName} {activity.userId?.lastName}
                      </div>
                    </td>
                    <td>
                      <div className="badge badge-outline">
                        {activity.action}
                      </div>
                    </td>
                    <td>{activity.details}</td>
                    <td>{new Date(activity.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content Placeholders */}
      {activeTab === 'users' && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <p className="text-gray-600">User management interface coming soon...</p>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Content Reports</h2>
          <p className="text-gray-600">Report management interface coming soon...</p>
        </div>
      )}

      {activeTab === 'swaps' && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Swap Monitoring</h2>
          <p className="text-gray-600">Swap monitoring interface coming soon...</p>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Broadcast Messages</h2>
          <p className="text-gray-600">Message broadcasting interface coming soon...</p>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Analytics & Reports</h2>
          <p className="text-gray-600">Analytics dashboard coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;