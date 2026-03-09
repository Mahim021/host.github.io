# Portfolio with MongoDB & Admin Dashboard

## Setup Instructions

### 1. Install MongoDB
Download and install MongoDB from: https://www.mongodb.com/try/download/community

After installation, start MongoDB:
```powershell
mongod
```

### 2. Install Backend Dependencies
```powershell
cd backend
npm install
```

### 3. Configure Environment
Edit `backend/.env` file:
- Change `ADMIN_PASSWORD` to something secure
- Update MongoDB URI if needed

### 4. Start Backend Server
```powershell
cd backend
npm start
```
Server will run on: http://localhost:5000

### 5. Create Admin Account (First Time Only)
Open browser and go to:
```
http://localhost:5000/api/auth/setup
```
This creates your admin account.

### 6. Access Admin Dashboard
Open: `admin/index.html` in your browser

**Login Credentials:**
- Email: admin@portfolio.com
- Password: admin123 (or whatever you set in .env)

### 7. Update Frontend to Use MongoDB

Your portfolio will now fetch projects and experiences from the database instead of hardcoded HTML.

## Features

### Admin Dashboard:
✅ Add/Edit/Delete Projects
✅ Add/Edit/Delete Experiences  
✅ View Contact Messages
✅ Mark messages as read/unread
✅ Secure JWT authentication

### API Endpoints:

**Public:**
- GET `/api/projects` - Get all projects
- GET `/api/experiences` - Get all experiences
- POST `/api/contact/submit` - Submit contact form

**Admin Only (requires token):**
- POST `/api/projects` - Create project
- PUT `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project
- Similar for experiences
- GET `/api/contact` - Get all messages

## Next Steps

1. **Update your portfolio frontend** to fetch data from API
2. **Add existing projects** via admin dashboard
3. **Add existing experiences** via admin dashboard
4. **Update contact form** to save to MongoDB

## Database Structure

**Projects:**
- title, description, technologies[], image, liveUrl, githubUrl, featured, order

**Experiences:**
- role, company, duration, description, technologies[], order

**Contact Messages:**
- name, email, message, read, createdAt

## Security Notes

- Change JWT_SECRET in production
- Change admin password
- Use HTTPS in production
- Add rate limiting for API
- Consider adding email verification

## Troubleshooting

**MongoDB not connecting?**
- Make sure MongoDB is running (`mongod`)
- Check connection string in .env

**Admin login not working?**
- Make sure you ran the setup endpoint first
- Check console for errors

**CORS errors?**
- Backend has CORS enabled for all origins
- In production, restrict to your domain only
