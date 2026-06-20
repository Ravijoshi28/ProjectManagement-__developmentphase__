# Project Management Platform

A modern full-stack project management application built with Next.js, MongoDB, React Query, Socket.IO, and TypeScript. The platform helps teams collaborate efficiently through project tracking, task management, real-time communication, and notifications.

## 🚀 Features

### Authentication & Authorization

* Secure JWT-based authentication
* Protected API routes
* Role-based project access
* Cookie-based session management

### Project Management

* Create and manage projects
* View all projects assigned to a user
* Add multiple members to a project
* Project ownership support
* Member role management

### Task Management

* Create tasks within projects
* Assign tasks to project members
* Edit and update tasks
* Task priorities:

  * Low
  * Medium
  * High
  * Critical
* Due date support
* Task descriptions and metadata

### Kanban Board

* Trello-style drag-and-drop interface
* Task status tracking:

  * To Do
  * In Progress
  * Review
  * Completed
* Optimistic UI updates
* Debounced status synchronization
* Real-time board updates

### Real-Time Features

* Socket.IO integration
* Real-time notifications
* Real-time task updates
* Instant collaboration experience
* Online user support

### Notification System

* Persistent notifications stored in MongoDB
* Real-time notification delivery
* Notification history
* Read/Unread tracking
* Notification types:

  * Project invitations
  * Task assignments
  * Task updates
  * Project activity

### Team Collaboration

* Add multiple members simultaneously
* Project member management
* User search and selection
* Collaborative task workflow

### User Experience

* Responsive design
* Modern UI with Tailwind CSS
* Loading states
* Error handling
* Optimistic updates
* Query caching with React Query

## 🛠️ Tech Stack

### Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* React Query (TanStack Query)
* Zustand
* Socket.IO Client
* Lucide React Icons
* ShadCN UI

### Backend

* Next.js API Routes
* MongoDB
* Mongoose
* JWT Authentication
* Socket.IO

## 📂 Project Structure

```bash
app/
├── api/
│   ├── auth/
│   ├── project/
│   ├── task/
│   ├── notification/
│   └── user/
├── components/
├── Models/
├── lib/
├── frontendLib/
└── zustand/
```

## 🔔 Notification Workflow

```text
Action Performed
        ↓
Stored in MongoDB
        ↓
Notification Created
        ↓
Check Online Status
        ↓
Socket Event Sent
        ↓
User Receives Notification
```

## 📋 Task Workflow

```text
Create Task
      ↓
Assign Member
      ↓
To Do
      ↓
In Progress
      ↓
Review
      ↓
Completed
```

## ⚡ Real-Time Architecture

```text
Client
  ↓
API Route
  ↓
MongoDB Update
  ↓
Socket.IO Event
  ↓
Connected Clients
```

## 🔒 Security Features

* JWT verification on protected routes
* Authorization middleware
* Secure cookie handling
* Protected project resources
* User validation before data access

## 📈 Future Enhancements

* File attachments
* Comments on tasks
* Activity timeline
* Email notifications
* Project analytics dashboard
* Team chat system
* Calendar integration
* Task labels and tags
* Advanced filtering and search

## 👨‍💻 Author

Built by Ravi Joshi using Next.js, MongoDB, Socket.IO, React Query, TypeScript, and Tailwind CSS.


## Changes that I will do in future versions 

 * OoAuth logins ---google,facebook,github
 * Integrate ai that will analyze your work or images to give suggestions
 * feature for adding files (s3 bucket)
 * many more (as i remember new things)
