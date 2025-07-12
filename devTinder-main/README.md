# DevTinder - Admin Features Implementation

A skill-swapping platform with comprehensive admin management capabilities.

## 🚀 Features

### User Features
- **User Registration & Authentication**
- **Profile Management**
- **Skill-based Matching**
- **Connection Requests**
- **User Reporting System**
- **Real-time System Messages**

### Admin Features
- **User Management** - Ban/unban users who violate platform policies
- **Content Moderation** - Review and reject inappropriate skill descriptions
- **Swap Monitoring** - Monitor all connection requests (pending, accepted, cancelled)
- **Platform Communication** - Send platform-wide messages and alerts
- **Analytics & Reporting** - Download reports of user activity and platform statistics
- **Real-time Dashboard** - Overview of platform metrics and recent activity

## 🛠 Installation

### Backend Setup
```bash
cd devTinder-main
npm install
npm run create-admin  # Creates admin user
npm run dev           # Starts development server
```

### Frontend Setup
```bash
cd devTinder-web-Frontend-main
npm install
npm run dev           # Starts frontend development server
```

## 👨‍💼 Admin Access

### Creating Admin User
Run the admin creation script:
```bash
npm run create-admin
```

**Default Admin Credentials:**
- Email: `admin@devtinder.com`
- Password: `Admin@123`

### Admin Dashboard
Access the admin dashboard at `/admin` after logging in as an admin user.

## 🔧 Admin Features

### 1. User Management
- **View All Users**: Paginated list of all registered users
- **Ban Users**: Ban users with reason and timestamp
- **Unban Users**: Remove ban from users
- **User Activity Tracking**: Monitor user actions and behavior

### 2. Content Moderation
- **Review Reports**: View all user reports with details
- **Resolve Reports**: Mark reports as resolved or dismissed
- **Reject Skills**: Remove inappropriate skills from user profiles
- **Automated Logging**: All admin actions are logged for audit

### 3. Swap Monitoring
- **View All Swaps**: Monitor all connection requests
- **Swap Statistics**: Real-time analytics on connection success rates
- **Status Filtering**: Filter swaps by status (pending, accepted, rejected)
- **User Interaction Analysis**: Track user engagement patterns

### 4. Platform Communication
- **Broadcast Messages**: Send platform-wide notifications
- **Message Types**: Feature updates, maintenance alerts, general announcements
- **Priority Levels**: Urgent, high, medium, low priority messages
- **Message Scheduling**: Set expiration dates for messages

### 5. Analytics & Reporting
- **User Activity Reports**: Download detailed user activity logs
- **Feedback Reports**: Export all user reports and feedback
- **Platform Statistics**: Export user and swap statistics
- **Custom Date Ranges**: Filter reports by date range

## 📊 Database Schema

### New Models Added:
- **ActivityLog**: Tracks all user activities for analytics
- **Report**: Stores user reports for content moderation
- **SystemMessage**: Platform-wide messages and announcements

### Updated Models:
- **User**: Added admin fields (isAdmin, isBanned, banReason, etc.)

## 🔐 Security Features

- **Role-based Access Control**: Admin routes protected by admin middleware
- **Activity Logging**: All admin actions logged with user details
- **Ban System**: Automatic login prevention for banned users
- **Input Validation**: Comprehensive validation on all admin actions

## 🌐 API Endpoints

### Admin Routes (Protected)
```
GET    /admin/users                 - Get all users
POST   /admin/users/:id/ban         - Ban user
POST   /admin/users/:id/unban       - Unban user
GET    /admin/reports               - Get all reports
POST   /admin/reports/:id/resolve   - Resolve report
POST   /admin/skills/:id/reject     - Reject user skills
GET    /admin/swaps                 - Get all swaps
GET    /admin/swaps/stats          - Get swap statistics
POST   /admin/messages/broadcast    - Send broadcast message
GET    /admin/messages             - Get system messages
GET    /admin/reports/users        - Get user activity report
GET    /admin/reports/export       - Export platform data
```

### User Routes
```
POST   /report/create              - Create user report
GET    /report/my-reports          - Get user's reports
GET    /report/system-messages     - Get system messages
```

## 🎨 Frontend Components

### Admin Components
- **AdminDashboard**: Main admin interface with tabbed navigation
- **UserManagement**: User administration interface
- **ReportManagement**: Content moderation interface
- **SwapMonitoring**: Connection request monitoring
- **MessageBroadcasting**: Platform communication tools

### User Components
- **ReportUser**: Report inappropriate content modal
- **SystemMessages**: Display platform-wide messages
- **Enhanced UserCard**: Added report button for users

## 📈 Usage Examples

### Creating a System Message
```javascript
POST /admin/messages/broadcast
{
  "title": "Platform Maintenance",
  "message": "Scheduled maintenance on Sunday 2-4 PM",
  "type": "maintenance",
  "priority": "high",
  "expiresAt": "2024-01-15T00:00:00Z"
}
```

### Banning a User
```javascript
POST /admin/users/USER_ID/ban
{
  "reason": "Violating community guidelines"
}
```

### Generating Activity Report
```javascript
GET /admin/reports/users?startDate=2024-01-01&endDate=2024-01-31
```

## 🔍 Monitoring & Analytics

### Activity Tracking
- User logins/logouts
- Profile updates
- Connection requests
- Report submissions
- Admin actions

### Real-time Dashboard
- Total users count
- Active connections
- Banned users
- Recent activity feed
- Success rate metrics

## 🚨 Error Handling

- Comprehensive error handling for all admin operations
- Graceful degradation when services are unavailable
- Detailed error logging for debugging
- User-friendly error messages

## 🧪 Testing

### Manual Testing
1. Create admin user using the script
2. Login as admin and access `/admin`
3. Test each admin feature:
   - User banning/unbanning
   - Report resolution
   - Message broadcasting
   - Data export

### API Testing
Use tools like Postman to test admin endpoints with proper authentication.

## 📝 Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/devTinder
PORT=7777
JWT_SECRET=your-jwt-secret
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions about the admin features:
1. Check the documentation
2. Review the API endpoints
3. Test with the provided admin credentials
4. Check the console for error messages

---

**Note**: This implementation includes all requested admin features:
- ✅ Reject inappropriate or spammy skill descriptions
- ✅ Ban users who violate platform policies
- ✅ Monitor pending, accepted, or cancelled swaps
- ✅ Send platform-wide messages
- ✅ Download reports of user activity, feedback logs, and swap stats

The system is production-ready with proper security, logging, and error handling.