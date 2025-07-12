import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/admin/users?page=${currentPage}&limit=${usersPerPage}`,
        { withCredentials: true }
      );
      setUsers(response.data.users);
      setTotalPages(Math.ceil(response.data.total / usersPerPage));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.emailId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserAction = async (userId, action) => {
    try {
      await axios.put(
        `${BASE_URL}/admin/users/${userId}/${action}`,
        {},
        { withCredentials: true }
      );
      fetchUsers();
      setModalOpen(false);
    } catch (error) {
      console.error(`Error ${action} user:`, error);
    }
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
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
        <h1 className="text-3xl font-bold text-center mb-4">User Management</h1>
        
        {/* Search Bar */}
        <div className="form-control w-full max-w-md mx-auto mb-6">
          <input
            type="text"
            placeholder="Search users..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="card bg-base-300 shadow-xl">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-full">
                          <img src={user.photoUrl} alt={user.firstName} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-bold">{user.firstName} {user.lastName}</div>
                      <div className="text-sm opacity-50">ID: {user._id}</div>
                    </td>
                    <td>{user.emailId}</td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.isActive ? 'badge-success' : 'badge-error'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline mr-2"
                        onClick={() => openUserModal(user)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <div className="join">
              <button
                className="join-item btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button className="join-item btn">
                Page {currentPage} of {totalPages}
              </button>
              <button
                className="join-item btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {modalOpen && selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">User Details</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedUser.photoUrl}
                  alt={selectedUser.firstName}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{selectedUser.firstName} {selectedUser.lastName}</h4>
                  <p className="text-sm text-gray-600">{selectedUser.emailId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Age:</span>
                  </label>
                  <p>{selectedUser.age || 'Not specified'}</p>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Gender:</span>
                  </label>
                  <p>{selectedUser.gender || 'Not specified'}</p>
                </div>
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">About:</span>
                </label>
                <p>{selectedUser.about}</p>
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Skills:</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.skills?.map((skill, index) => (
                    <span key={index} className="badge badge-outline">{skill}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Member Since:</span>
                </label>
                <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="modal-action">
              <button
                className="btn btn-error btn-sm"
                onClick={() => handleUserAction(selectedUser._id, 'deactivate')}
              >
                Deactivate
              </button>
              <button
                className="btn btn-warning btn-sm"
                onClick={() => handleUserAction(selectedUser._id, 'promote')}
              >
                Make Admin
              </button>
              <button className="btn btn-ghost" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;