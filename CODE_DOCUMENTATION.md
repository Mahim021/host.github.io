# Portfolio Backend & Admin Dashboard - Code Documentation

## 📁 Project Structure

```
backend/
├── models/          # MongoDB schemas (data structure definitions)
├── routes/          # API endpoints (handle HTTP requests)
├── middleware/      # Authentication & validation logic
├── server.js        # Main entry point (starts the server)
├── package.json     # Dependencies & scripts
└── .env            # Environment variables (secrets, config)

admin/
├── index.html       # Admin dashboard HTML structure
├── admin-style.css  # Dashboard styling
└── admin-script.js  # Frontend JavaScript (API calls, UI logic)
```

---

## 🔧 Backend Files Explained

### **server.js** - Main Application Entry Point
**Purpose:** Initializes and configures the Express server

**What it does:**
1. Loads environment variables from `.env` file
2. Sets up Express middleware (CORS, JSON parsing)
3. Connects to MongoDB database
4. Registers API route handlers
5. Starts the server on port 5000 (or PORT from .env)

**Key Code:**
- `app.use(cors())` - Allows frontend to access API from different domain/port
- `mongoose.connect()` - Establishes MongoDB connection
- `app.use('/api/auth', ...)` - Registers authentication routes
- `app.listen(PORT)` - Starts listening for HTTP requests

---

### **models/** - Database Schema Definitions

#### **models/Project.js**
**Purpose:** Defines structure for project documents in MongoDB

**Fields:**
- `title` - Project name (required)
- `description` - What the project does (required)
- `technologies` - Array of tech stack items (e.g., ["React", "Node.js"])
- `image` - URL to project screenshot/image
- `liveUrl` - Link to deployed project
- `githubUrl` - Link to source code
- `featured` - Boolean to highlight important projects
- `order` - Number for custom sorting (lower = shows first)
- `createdAt` - Auto-generated timestamp

**Usage:** Creates 'projects' collection in MongoDB

---

#### **models/Experience.js**
**Purpose:** Defines structure for work/education experiences

**Fields:**
- `role` - Job title or position (required)
- `company` - Organization name (required)
- `duration` - Time period (e.g., "Jan 2023 - Present")
- `description` - Responsibilities and achievements
- `technologies` - Skills/tools used
- `order` - Custom sorting number
- `createdAt` - Auto-generated timestamp

**Usage:** Creates 'experiences' collection in MongoDB

---

#### **models/Contact.js**
**Purpose:** Stores messages from portfolio contact form

**Fields:**
- `name` - Visitor's name (required)
- `email` - Visitor's email (required)
- `message` - Message content (required)
- `read` - Boolean (false by default, marks new messages)
- `createdAt` - When message was sent

**Usage:** Creates 'contacts' collection in MongoDB

---

#### **models/Admin.js**
**Purpose:** Stores admin user credentials (securely)

**Fields:**
- `email` - Admin login email (unique)
- `password` - Hashed password (NEVER stored as plain text)
- `createdAt` - Account creation date

**Special Methods:**
- `pre('save')` hook - Automatically hashes password before saving
- `comparePassword()` - Safely compares login password with hashed version

**Security:** Uses bcrypt for password hashing (10 salt rounds)

---

### **routes/** - API Endpoint Handlers

#### **routes/auth.js**
**Purpose:** Handle admin authentication

**Endpoints:**

**POST /api/auth/login**
- **Access:** Public (anyone can attempt login)
- **Purpose:** Authenticate admin and generate JWT token
- **Process:**
  1. Receives email & password
  2. Finds admin in database
  3. Compares password using bcrypt
  4. Generates JWT token (expires in 24 hours)
  5. Returns token to client
- **Response:** `{ token: "jwt...", message: "Login successful" }`

**POST /api/auth/setup**
- **Access:** Public (but checks for existing admin)
- **Purpose:** Create first admin account (run once only)
- **Process:**
  1. Checks if admin already exists
  2. Creates admin from .env credentials
  3. Password is auto-hashed by model
- **Usage:** Visit `http://localhost:5000/api/auth/setup` once after setup

---

#### **routes/projects.js**
**Purpose:** CRUD operations for portfolio projects

**Endpoints:**

**GET /api/projects** (Public)
- Returns all projects sorted by order, then creation date
- Used by portfolio frontend to display projects

**GET /api/projects/:id** (Public)
- Returns single project by MongoDB _id
- Used for project detail pages

**POST /api/projects** (Admin Only)
- Creates new project from request body
- Requires JWT token in Authorization header
- Returns created project with HTTP 201 status

**PUT /api/projects/:id** (Admin Only)
- Updates existing project
- `new: true` returns updated document
- `runValidators: true` ensures data validity

**DELETE /api/projects/:id** (Admin Only)
- Permanently removes project from database
- Returns success message

**Authentication:** Admin-only routes use `authMiddleware` to verify JWT token

---

#### **routes/experiences.js**
**Purpose:** CRUD operations for work experiences

**Endpoints:** Similar to projects routes

**GET /api/experiences** (Public)
- Returns all experiences sorted by order
- Used by Experience section of portfolio

**POST /api/experiences** (Admin Only)
- Add new experience entry

**PUT /api/experiences/:id** (Admin Only)
- Update experience details

**DELETE /api/experiences/:id** (Admin Only)
- Remove experience from timeline

---

#### **routes/contact.js**
**Purpose:** Handle contact form submissions and message management

**Endpoints:**

**POST /api/contact/submit** (Public)
- Saves visitor message to database
- New messages are marked as unread by default
- Returns success confirmation

**GET /api/contact** (Admin Only)
- Retrieves all messages sorted by newest first
- Shows read/unread status
- Used by admin dashboard Messages section

**PATCH /api/contact/:id/read** (Admin Only)
- Marks specific message as read
- Updates `read` field to true

**DELETE /api/contact/:id** (Admin Only)
- Permanently deletes message
- Used to remove spam or old messages

---

### **middleware/auth.js**
**Purpose:** Protect admin-only routes from unauthorized access

**How it works:**
1. **Extract Token:** Gets JWT from `Authorization: Bearer <token>` header
2. **Verify Token:** Uses `jwt.verify()` with JWT_SECRET from .env
3. **Attach Data:** If valid, adds admin info to `req.admin`
4. **Proceed or Reject:** Calls `next()` if valid, returns 401 if not

**Usage:** Add to routes like: `router.post('/', authMiddleware, handler)`

**Security:**
- Validates token signature (prevents tampering)
- Checks expiration (tokens expire after 24 hours)
- Rejects missing or invalid tokens

---

## 🎨 Admin Dashboard Files

### **admin/index.html**
**Purpose:** Structure of admin dashboard interface

**Sections:**

1. **Login Page (`#loginPage`)**
   - Email and password inputs
   - Submit button
   - Error message display
   - Initially visible, hidden after login

2. **Dashboard (`#dashboardPage`)**
   - **Sidebar:** Navigation menu (Projects, Experiences, Messages, Logout)
   - **Topbar:** Page title and "Add New" button
   - **Content Sections:**
     - `#projectsSection` - Grid of project cards
     - `#experiencesSection` - Grid of experience cards
     - `#messagesSection` - List of contact messages

3. **Modal Dialog (`#modal`)**
   - Dynamic form for adding/editing items
   - Form fields change based on current section
   - Save and Cancel buttons

---

### **admin/admin-style.css**
**Purpose:** Visual styling for admin dashboard

**Style Organization:**

1. **Global Styles**
   - Reset margins/padding
   - Base font family
   - Background colors

2. **Login Page**
   - Centered form on gradient background
   - White card with shadow
   - Purple primary color (#667eea)

3. **Dashboard Layout**
   - Flexbox layout (sidebar + main content)
   - Sidebar: 250px wide, dark background (#2c3e50)
   - Main content: Flexible width

4. **Navigation**
   - Sidebar menu items with hover effects
   - Active state highlighting
   - Icon spacing

5. **Content Sections**
   - Card grid layout (responsive, auto-fill)
   - Card hover effects (lift and shadow)
   - Technology badges

6. **Forms & Modals**
   - Centered modal overlay
   - Form input styling
   - Button states (hover, disabled)

7. **Messages**
   - Message cards with read/unread indicators
   - Blue left border for unread messages
   - Timestamp and email display

---

### **admin/admin-script.js**
**Purpose:** Client-side logic for admin dashboard

**Key Components:**

1. **State Management**
   - `authToken` - Stored in localStorage for persistent login
   - `currentSection` - Tracks active section (projects/experiences/messages)
   - `editingId` - ID of item being edited (null when creating new)

2. **Authentication**
   - Login form handler - Sends credentials to API
   - Token storage - Saves JWT in localStorage
   - Auto-login - Checks for existing token on page load
   - Logout - Clears token and reloads page

3. **Navigation**
   - Sidebar click handlers
   - Section switching logic
   - Page title updates

4. **Data Loading**
   - `loadProjects()` - Fetches and displays project cards
   - `loadExperiences()` - Fetches and displays experience cards
   - `loadMessages()` - Fetches and displays contact messages

5. **CRUD Operations**
   - `showModal()` - Opens add/edit form
   - `loadItemData()` - Populates form when editing
   - Form submission - Creates or updates items
   - Delete functions - Removes items with confirmation

6. **API Communication**
   - All requests use `fetch()` API
   - Admin requests include `Authorization: Bearer ${token}` header
   - Error handling for network failures
   - JSON data encoding/decoding

---

## 🔐 Environment Variables (.env)

```env
PORT=5000                              # Server port
MONGODB_URI=mongodb://localhost:27017/portfolio  # Database connection
JWT_SECRET=your_secret_key             # Token signing key (CHANGE THIS!)
ADMIN_EMAIL=admin@portfolio.com        # Initial admin email
ADMIN_PASSWORD=admin123                # Initial admin password
```

**Security Notes:**
- Change `JWT_SECRET` to a random string in production
- Change `ADMIN_PASSWORD` after first login
- Never commit `.env` to version control (add to `.gitignore`)

---

## 🔄 Data Flow

### Adding a Project (Example)

1. **Admin clicks "Add New"** → Opens modal with empty form
2. **Admin fills form** → Enters title, description, technologies, etc.
3. **Admin clicks "Save"** → JavaScript collects form data
4. **POST request sent** → `fetch('/api/projects', { body: data, headers: { Authorization: token } })`
5. **Middleware checks** → `authMiddleware` verifies JWT token
6. **Route handler** → Creates new Project document
7. **Database saves** → MongoDB stores project in 'projects' collection
8. **Response sent** → API returns created project as JSON
9. **UI updates** → `loadProjects()` refreshes the display
10. **Modal closes** → User sees new project in grid

---

## 🚀 Startup Sequence

**First Time Setup:**
1. Install MongoDB and start it (`mongod`)
2. Run `cd backend; npm install`
3. Visit `http://localhost:5000/api/auth/setup` to create admin
4. Start backend: `npm start`
5. Open `admin/index.html` in browser
6. Login with credentials from `.env`

**Daily Development:**
1. Start MongoDB: `mongod`
2. Start backend: `cd backend; npm start`
3. Open admin dashboard or portfolio in browser
4. Backend runs on `http://localhost:5000`
5. Admin connects to backend API automatically

---

## 📊 Database Collections

**MongoDB stores data in these collections:**

1. **projects** - Portfolio projects
2. **experiences** - Work/education timeline
3. **contacts** - Contact form messages
4. **admins** - Admin user accounts

**View in MongoDB:**
```bash
# Connect to MongoDB shell
mongo

# Switch to database
use portfolio

# View all projects
db.projects.find()

# Count messages
db.contacts.count()
```

---

## 🔍 Debugging Tips

**Backend not starting:**
- Check if MongoDB is running (`mongod` in terminal)
- Verify `.env` file exists with correct values
- Check console for error messages

**Login not working:**
- Make sure you ran `/api/auth/setup` endpoint first
- Check credentials match those in `.env`
- Open browser console to see error messages

**API requests failing:**
- Check backend is running on port 5000
- Verify `API_URL` in `admin-script.js` is correct
- Check browser console Network tab for errors
- Ensure token exists in localStorage

**Data not showing:**
- Check if JWT token is still valid (expires after 24 hours)
- Verify data exists in database using MongoDB shell
- Check browser console for JavaScript errors

---

## 📝 Code Comments Legend

Throughout the codebase, comments follow this pattern:

```javascript
// ============ SECTION HEADER ============
// Marks major sections of code

/**
 * Function/File documentation
 * - Purpose explanation
 * - What it does
 * - Parameters
 * - Return values
 */

// Inline comment - Explains specific line
const variable = value;  // End-of-line comment
```

---

This documentation covers all backend and admin dashboard code. Refer to specific files for detailed inline comments explaining each function and code block.
