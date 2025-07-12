import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const AdminDashboard = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalConnections: 0,
    pendingRequests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(BASE_URL + "/admin/stats", {
        withCredentials: true
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Admin Dashboard</h1>
        <p className="text-center text-gray-600">Welcome back, {user?.firstName}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-primary text-primary-content">
          <div className="card-body">
            <h2 className="card-title text-2xl">{stats.totalUsers}</h2>
            <p>Total Users</p>
          </div>
        </div>
        <div className="card bg-secondary text-secondary-content">
          <div className="card-body">
            <h2 className="card-title text-2xl">{stats.activeUsers}</h2>
            <p>Active Users</p>
          </div>
        </div>
        <div className="card bg-accent text-accent-content">
          <div className="card-body">
            <h2 className="card-title text-2xl">{stats.totalConnections}</h2>
            <p>Total Connections</p>
          </div>
        </div>
        <div className="card bg-neutral text-neutral-content">
          <div className="card-body">
            <h2 className="card-title text-2xl">{stats.pendingRequests}</h2>
            <p>Pending Requests</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card bg-base-300 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">User Management</h2>
            <p>Manage user accounts, roles, and permissions</p>
            <div className="card-actions justify-end">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/admin/users')}
              >
                Manage Users
              </button>
            </div>
          </div>
        </div>
        <div className="card bg-base-300 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Reports</h2>
            <p>View system reports and analytics</p>
            <div className="card-actions justify-end">
              <button className="btn btn-secondary">View Reports</button>
            </div>
          </div>
        </div>
        <div className="card bg-base-300 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Settings</h2>
            <p>Configure system settings and preferences</p>
            <div className="card-actions justify-end">
              <button className="btn btn-accent">Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;