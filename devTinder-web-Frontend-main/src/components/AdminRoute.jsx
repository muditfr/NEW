import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const user = useSelector((store) => store.user);

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role
  if (user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card bg-base-300 shadow-xl">
          <div className="card-body text-center">
            <h2 className="card-title justify-center text-error">Access Denied</h2>
            <p className="text-lg mb-4">You don't have permission to access this page.</p>
            <p className="text-sm text-gray-600">
              This page is restricted to administrators only.
            </p>
            <div className="card-actions justify-center">
              <button 
                className="btn btn-primary"
                onClick={() => window.history.back()}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;