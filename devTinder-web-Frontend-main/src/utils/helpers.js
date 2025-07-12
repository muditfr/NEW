// Helper function to check if user is an admin
export const isAdmin = (user) => {
  return user && user.role === 'admin';
};

// Helper function to check if user is authenticated
export const isAuthenticated = (user) => {
  return user !== null && user !== undefined;
};

// Helper function to get user role display name
export const getUserRoleDisplayName = (role) => {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'user':
      return 'User';
    default:
      return 'User';
  }
};

// Helper function to format date
export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};