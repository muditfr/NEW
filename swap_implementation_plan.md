# Swap Features Implementation Plan

## Overview
This document outlines the implementation plan for adding swap request functionality to the devTinder application, including:
- Request & Accept Swaps
- Show current and pending swap requests  
- Ratings or feedback after a swap
- Delete swap requests if not accepted

## Current System Analysis

### Backend Structure
- **Models**: User, ConnectionRequest
- **Routes**: auth.js, profile.js, request.js, userroute.js
- **Current Flow**: Users send connection requests (interested/ignored) → Recipients accept/reject

### Frontend Structure
- **Components**: Login, Profile, Feed, Requests, Connections, etc.
- **Current Flow**: View feeds → Send requests → Manage received requests

## Implementation Plan

### 1. Backend Changes

#### A. New Models

**1.1. SwapRequest Model** (`src/models/swapRequest.js`)
```javascript
const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  itemOffered: {
    type: String,
    required: true,
    maxLength: 200,
  },
  itemRequested: {
    type: String,
    required: true,
    maxLength: 200,
  },
  description: {
    type: String,
    maxLength: 500,
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["pending", "accepted", "rejected", "completed", "cancelled"],
      message: "{VALUE} is incorrect status type",
    },
    default: "pending",
  },
  proposedDate: {
    type: Date,
  },
  acceptedDate: {
    type: Date,
  },
  completedDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

swapRequestSchema.index({ fromUserId: 1, toUserId: 1 });
```

**1.2. SwapRating Model** (`src/models/swapRating.js`)
```javascript
const mongoose = require("mongoose");

const swapRatingSchema = new mongoose.Schema({
  swapRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SwapRequest",
    required: true,
  },
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  feedback: {
    type: String,
    maxLength: 500,
  },
  ratedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true,
});

swapRatingSchema.index({ swapRequestId: 1, ratedBy: 1 }, { unique: true });
```

#### B. New Routes

**1.3. Swap Routes** (`src/routes/swap.js`)
```javascript
const express = require("express");
const swapRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const SwapRequest = require("../models/swapRequest");
const SwapRating = require("../models/swapRating");
const User = require("../models/user");

// Send swap request
swapRouter.post("/swap/request", userAuth, async (req, res) => {
  // Implementation for creating swap requests
});

// Accept/reject swap request
swapRouter.post("/swap/review/:status/:requestId", userAuth, async (req, res) => {
  // Implementation for accepting/rejecting swap requests
});

// Get pending swap requests (received)
swapRouter.get("/swap/requests/received", userAuth, async (req, res) => {
  // Implementation for fetching received swap requests
});

// Get pending swap requests (sent)
swapRouter.get("/swap/requests/sent", userAuth, async (req, res) => {
  // Implementation for fetching sent swap requests
});

// Delete swap request
swapRouter.delete("/swap/request/:requestId", userAuth, async (req, res) => {
  // Implementation for deleting swap requests
});

// Mark swap as completed
swapRouter.post("/swap/complete/:requestId", userAuth, async (req, res) => {
  // Implementation for marking swap as completed
});

// Add rating/feedback
swapRouter.post("/swap/rating", userAuth, async (req, res) => {
  // Implementation for adding ratings and feedback
});

// Get swap history
swapRouter.get("/swap/history", userAuth, async (req, res) => {
  // Implementation for fetching swap history
});

// Get user ratings
swapRouter.get("/swap/ratings/:userId", userAuth, async (req, res) => {
  // Implementation for fetching user ratings
});

module.exports = swapRouter;
```

#### C. Update User Model

**1.4. User Model Updates** (`src/models/user.js`)
```javascript
// Add these fields to existing userSchema:
swapRating: {
  type: Number,
  default: 0,
  min: 0,
  max: 5,
},
totalSwaps: {
  type: Number,
  default: 0,
},
successfulSwaps: {
  type: Number,
  default: 0,
},
```

#### D. Update App.js

**1.5. App.js Updates** (`src/app.js`)
```javascript
// Add swap router
const swapRouter = require("./routes/swap");
app.use("/", swapRouter);
```

### 2. Frontend Changes

#### A. New Components

**2.1. SwapRequest Component** (`src/components/SwapRequest.jsx`)
- Form to create new swap requests
- Fields: item offered, item requested, description, proposed date
- Validation and error handling

**2.2. SwapRequests Component** (`src/components/SwapRequests.jsx`)
- Display received swap requests
- Accept/reject functionality
- Show request details

**2.3. MySwapRequests Component** (`src/components/MySwapRequests.jsx`)
- Display sent swap requests
- Delete functionality for pending requests
- Status tracking

**2.4. SwapHistory Component** (`src/components/SwapHistory.jsx`)
- Display completed swaps
- Rating and feedback functionality
- Swap success metrics

**2.5. SwapRating Component** (`src/components/SwapRating.jsx`)
- Rating form (1-5 stars)
- Feedback text area
- Submit functionality

#### B. State Management

**2.6. Redux Slices** (`src/utils/`)
- `swapSlice.js`: Manage swap requests state
- `swapHistorySlice.js`: Manage swap history state
- `ratingsSlice.js`: Manage ratings state

#### C. Navigation Updates

**2.7. NavBar Updates** (`src/components/NavBar.jsx`)
- Add "Swaps" dropdown with:
  - "Request Swap"
  - "My Requests" 
  - "Received Requests"
  - "Swap History"

#### D. User Profile Updates

**2.8. Profile Component Updates** (`src/components/Profile.jsx`)
- Display swap rating
- Show total swaps and success rate
- Add "Request Swap" button

### 3. API Endpoints Summary

#### Swap Management
- `POST /swap/request` - Create new swap request
- `POST /swap/review/:status/:requestId` - Accept/reject swap request
- `DELETE /swap/request/:requestId` - Delete swap request
- `POST /swap/complete/:requestId` - Mark swap as completed

#### Data Retrieval
- `GET /swap/requests/received` - Get received swap requests
- `GET /swap/requests/sent` - Get sent swap requests
- `GET /swap/history` - Get swap history
- `GET /swap/ratings/:userId` - Get user ratings

#### Ratings
- `POST /swap/rating` - Add rating/feedback
- `GET /swap/ratings/:userId` - Get user's ratings

### 4. Database Schema Changes

#### SwapRequest Collection
```javascript
{
  _id: ObjectId,
  fromUserId: ObjectId,
  toUserId: ObjectId,
  itemOffered: String,
  itemRequested: String,
  description: String,
  status: String, // pending, accepted, rejected, completed, cancelled
  proposedDate: Date,
  acceptedDate: Date,
  completedDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### SwapRating Collection
```javascript
{
  _id: ObjectId,
  swapRequestId: ObjectId,
  fromUserId: ObjectId,
  toUserId: ObjectId,
  rating: Number, // 1-5
  feedback: String,
  ratedBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. User Experience Flow

#### A. Creating a Swap Request
1. User browses profiles/connections
2. Clicks "Request Swap" on a profile
3. Fills out swap form (items, description, date)
4. Submits request
5. Request appears in recipient's "Received Requests"

#### B. Managing Received Requests
1. User views "Received Requests"
2. Reviews swap details
3. Accepts or rejects request
4. If accepted, both users can see in "Active Swaps"

#### C. Managing Sent Requests
1. User views "My Requests"
2. Sees status of all sent requests
3. Can delete pending requests
4. Can track accepted requests

#### D. Completing Swaps
1. After real-world swap occurs
2. Either user marks swap as "completed"
3. Both users can then rate each other
4. Swap moves to history

#### E. Rating System
1. After swap completion
2. Users rate each other (1-5 stars)
3. Optional feedback text
4. Ratings affect user profile scores

### 6. Implementation Priority

#### Phase 1: Core Swap Functionality
1. Create SwapRequest model
2. Implement basic swap routes
3. Create SwapRequest and SwapRequests components
4. Basic accept/reject functionality

#### Phase 2: Request Management
1. Implement delete functionality
2. Create MySwapRequests component
3. Add status tracking
4. Implement request filtering

#### Phase 3: Rating System
1. Create SwapRating model
2. Implement rating routes
3. Create rating components
4. Update user profiles with ratings

#### Phase 4: Enhanced Features
1. Swap history tracking
2. Advanced filtering and search
3. Notifications system
4. Analytics dashboard

### 7. Security Considerations

- Validate all swap request data
- Ensure users can only modify their own requests
- Prevent spam/excessive requests
- Implement rate limiting
- Validate user permissions for each operation

### 8. Testing Strategy

#### Backend Testing
- Unit tests for all swap routes
- Model validation tests
- Authorization tests
- Edge case handling

#### Frontend Testing
- Component unit tests
- Integration tests for swap flow
- User interaction tests
- Error handling tests

This implementation plan provides a comprehensive approach to adding swap functionality while maintaining the existing codebase structure and following current patterns.