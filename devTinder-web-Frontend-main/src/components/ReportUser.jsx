import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const ReportUser = ({ reportedUser, onClose, onSuccess }) => {
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { value: 'inappropriate_skills', label: 'Inappropriate or Fake Skills' },
    { value: 'spam', label: 'Spam or Promotional Content' },
    { value: 'harassment', label: 'Harassment or Abuse' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reportType || !description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        BASE_URL + "/report/create",
        {
          reportedUserId: reportedUser._id,
          reportType,
          description: description.trim()
        },
        { withCredentials: true }
      );
      
      onSuccess && onSuccess();
      onClose && onClose();
    } catch (error) {
      console.error("Error submitting report:", error);
      alert(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Report User</h2>
          <button 
            onClick={onClose}
            className="btn btn-ghost btn-sm"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            You are reporting: <span className="font-semibold">
              {reportedUser.firstName} {reportedUser.lastName}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select a reason</option>
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full h-24"
              placeholder="Please provide details about the issue..."
              required
              maxLength={500}
            />
            <div className="text-sm text-gray-500 mt-1">
              {description.length}/500 characters
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-error"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          <p>
            <strong>Note:</strong> False reports may result in action against your account.
            Reports are reviewed by our admin team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportUser;