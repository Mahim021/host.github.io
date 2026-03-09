# Portfolio Admin System - Quick Guide

## ✅ Setup Complete!

Your portfolio now has a dynamic backend system with admin control panel.

## 🎯 What Was Done

### 1. Database Seeding
- **7 Projects** added to MongoDB from your hardcoded portfolio
- **3 Experiences** added to MongoDB
- All data is now stored in MongoDB Atlas cloud database

### 2. Frontend Integration
- `api-integration.js` script created to fetch data from backend
- Projects and experiences now load dynamically from API
- Falls back to hardcoded data if API is unavailable

### 3. Admin Control
- Admin dashboard at `admin/index.html`
- Full CRUD operations for projects and experiences
- Login with: **arifulalam7865@gmail.com** / **admin123**

## 🚀 How To Use

### Starting the Backend Server
```powershell
cd backend
npm start
```
Server runs on: http://localhost:5000

### Access Admin Dashboard
1. Make sure backend server is running
2. Open: `admin/index.html` in your browser
3. Login with your credentials
4. Add/Edit/Delete projects and experiences

### View Portfolio
1. Open: `home/home.html` in your browser
2. Projects and experiences load from database automatically
3. Changes made in admin panel appear instantly on frontend

## 📊 API Endpoints

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

- `GET /api/experiences` - Get all experiences
- `POST /api/experiences` - Create new experience (admin only)
- `PUT /api/experiences/:id` - Update experience (admin only)
- `DELETE /api/experiences/:id` - Delete experience (admin only)

## 🔄 How It Works

1. **Admin adds/edits content** → Saved to MongoDB
2. **Frontend loads page** → Fetches from API
3. **Data renders dynamically** → No need to edit HTML anymore!

## 📝 Next Steps

1. Login to admin dashboard
2. Review the seeded projects and experiences
3. Edit or add new ones as needed
4. Test the frontend to see changes appear automatically
5. Eventually deploy both frontend and backend to production

## 🛠️ Files Modified

- `backend/seedDatabase.js` - Database seeding script
- `home/api-integration.js` - Frontend API integration
- `home/home.html` - Added API script reference
- All projects/experiences now manageable from admin panel!
