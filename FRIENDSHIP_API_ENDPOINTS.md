# Friendship API Endpoints - Postman Testing Guide

## Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints require Clerk authentication. Include the Clerk JWT token in the Authorization header:
```
Authorization: Bearer <clerk_jwt_token>
```

The backend will automatically extract the user's MongoDB `_id` from `req.user._id` using the ClerkAuthGuard.

---

## Endpoints

### 1. Send Friend Request
**POST** `/social/friendships/request`

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "receiverId": "507f1f77bcf86cd799439011"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Friend request sent successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "requesterId": "507f1f77bcf86cd799439010",
    "receiverId": "507f1f77bcf86cd799439011",
    "status": "pending"
  }
}
```

**Error Responses:**
- `400` - Cannot send friend request to yourself
- `409` - Friend request already exists / Already friends / Previous request rejected
- `401` - User not authenticated

---

### 2. Accept Friend Request
**PATCH** `/social/friendships/:friendshipId/accept`

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
```

**URL Parameters:**
- `friendshipId` - The ID of the friendship to accept

**Success Response (200):**
```json
{
  "success": true,
  "message": "Friend request accepted",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "requesterId": "507f1f77bcf86cd799439010",
    "receiverId": "507f1f77bcf86cd799439011",
    "status": "accepted"
  }
}
```

**Error Responses:**
- `404` - Friend request not found
- `403` - You can only accept friend requests sent to you
- `400` - This friend request is not in pending status
- `401` - User not authenticated

---

### 3. Reject Friend Request
**PATCH** `/social/friendships/:friendshipId/reject`

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
```

**URL Parameters:**
- `friendshipId` - The ID of the friendship to reject

**Success Response (200):**
```json
{
  "success": true,
  "message": "Friend request rejected",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "requesterId": "507f1f77bcf86cd799439010",
    "receiverId": "507f1f77bcf86cd799439011",
    "status": "rejected"
  }
}
```

**Error Responses:**
- `404` - Friend request not found
- `403` - You can only reject friend requests sent to you
- `400` - This friend request is not in pending status
- `401` - User not authenticated

---

### 4. Remove Friendship
**DELETE** `/social/friendships/:friendshipId`

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
```

**URL Parameters:**
- `friendshipId` - The ID of the friendship to remove

**Success Response (200):**
```json
{
  "success": true,
  "message": "Friendship removed successfully"
}
```

**Error Responses:**
- `404` - Friendship not found
- `403` - You are not authorized to remove this friendship
- `401` - User not authenticated

---

### 5. Get Friends List
**GET** `/social/friendships`

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "requesterId": "507f1f77bcf86cd799439010",
      "receiverId": "507f1f77bcf86cd799439011",
      "status": "accepted",
      "otherUser": {
        "_id": "507f1f77bcf86cd799439011",
        "email": "friend@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "profilePicture": "https://..."
      }
    }
  ],
  "count": 1
}
```

**Note:** Returns friends with populated user information.

---

### 6. Get Pending Received Requests
**GET** `/social/friendships/pending/received`

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "requesterId": "507f1f77bcf86cd799439010",
      "receiverId": "507f1f77bcf86cd799439011",
      "status": "pending",
      "otherUser": {
        "_id": "507f1f77bcf86cd799439010",
        "email": "requester@example.com",
        "firstName": "Jane",
        "lastName": "Smith"
      }
    }
  ],
  "count": 1
}
```

**Note:** Returns pending requests where the authenticated user is the receiver (incoming requests).

---

### 7. Get Pending Sent Requests
**GET** `/social/friendships/pending/sent`

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "requesterId": "507f1f77bcf86cd799439011",
      "receiverId": "507f1f77bcf86cd799439010",
      "status": "pending",
      "otherUser": {
        "_id": "507f1f77bcf86cd799439010",
        "email": "receiver@example.com",
        "firstName": "Bob",
        "lastName": "Johnson"
      }
    }
  ],
  "count": 1
}
```

**Note:** Returns pending requests where the authenticated user is the requester (outgoing requests).

---

### 8. Check Friendship Status
**GET** `/social/friendships/status/:userId`

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
```

**URL Parameters:**
- `userId` - The ID of the other user to check friendship status with

**Success Response (200) - No friendship:**
```json
{
  "success": true,
  "data": {
    "status": null
  }
}
```

**Success Response (200) - Pending (I sent):**
```json
{
  "success": true,
  "data": {
    "status": "pending",
    "friendshipId": "507f1f77bcf86cd799439012",
    "isSender": true,
    "isReceiver": false
  }
}
```

**Success Response (200) - Pending (They sent):**
```json
{
  "success": true,
  "data": {
    "status": "pending",
    "friendshipId": "507f1f77bcf86cd799439012",
    "isSender": false,
    "isReceiver": true
  }
}
```

**Success Response (200) - Friends:**
```json
{
  "success": true,
  "data": {
    "status": "accepted",
    "friendshipId": "507f1f77bcf86cd799439012"
  }
}
```

---

### 9. Get Friends Count
**GET** `/social/friendships/count`

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

---

### 10. Get Pending Requests Count
**GET** `/social/friendships/pending/count`

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "count": 3
  }
}
```

**Note:** Returns the count of pending friend requests received (for notification badges).

---

## Testing Flow Recommendation

### Test Scenario 1: Basic Friend Request Flow
1. **User A** sends friend request to **User B** → `POST /social/friendships/request`
2. **User B** gets pending received requests → `GET /social/friendships/pending/received`
3. **User A** checks status with **User B** → `GET /social/friendships/status/:userBId` (should show pending, isSender: true)
4. **User B** checks status with **User A** → `GET /social/friendships/status/:userAId` (should show pending, isReceiver: true)
5. **User B** accepts request → `PATCH /social/friendships/:friendshipId/accept`
6. Both users get friends list → `GET /social/friendships` (should show each other)
7. Check friends count → `GET /social/friendships/count`

### Test Scenario 2: Reject Request
1. **User A** sends friend request to **User B**
2. **User B** rejects request → `PATCH /social/friendships/:friendshipId/reject`
3. **User A** tries to send another request → Should get `409 Conflict`

### Test Scenario 3: Remove Friendship
1. After being friends, **User A** removes friendship → `DELETE /social/friendships/:friendshipId`
2. Both users check friends list → Should not see each other

### Test Scenario 4: Edge Cases
1. Try to send friend request to yourself → Should get `400 Bad Request`
2. Try to accept a request you sent → Should get `403 Forbidden`
3. Try to send duplicate request → Should get `409 Conflict`
4. Non-receiver tries to accept/reject → Should get `403 Forbidden`

---

## Database Collection
The friendships are stored in MongoDB collection: `friendships`

**Schema:**
```javascript
{
  _id: ObjectId,
  requester_id: ObjectId (ref: 'User'),
  receiver_id: ObjectId (ref: 'User'),
  status: String (enum: 'pending', 'accepted', 'rejected'),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ requester_id: 1, receiver_id: 1 }` - Unique compound index
- `{ requester_id: 1, status: 1 }` - For efficient queries
- `{ receiver_id: 1, status: 1 }` - For efficient queries

---

## Notes
- All MongoDB `_id` fields are automatically extracted from the Clerk JWT token
- You need at least 2 different user accounts with Clerk tokens to test the friend request flow
- The API uses bidirectional queries, so friendships work in both directions
- All timestamps are automatically managed by MongoDB
