# Portfolio Backend & Admin Dashboard Setup Script

Write-Host "🚀 Setting up Portfolio Backend..." -ForegroundColor Cyan

# Check if Node.js is installed
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js found: $(node --version)" -ForegroundColor Green

# Navigate to backend directory
Set-Location -Path "$PSScriptRoot\backend"

# Install dependencies
Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Check MongoDB
Write-Host "`n🔍 Checking MongoDB..." -ForegroundColor Yellow
$mongoRunning = Get-Process mongod -ErrorAction SilentlyContinue

if ($mongoRunning) {
    Write-Host "✅ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB is not running. Please start it with 'mongod' command" -ForegroundColor Yellow
    Write-Host "   Download MongoDB from: https://www.mongodb.com/try/download/community" -ForegroundColor Cyan
}

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Make sure MongoDB is running (run 'mongod' in a new terminal)" -ForegroundColor White
Write-Host "2. Start the backend server: cd backend; npm start" -ForegroundColor White
Write-Host "3. Create admin account: Visit http://localhost:5000/api/auth/setup" -ForegroundColor White
Write-Host "4. Open admin dashboard: admin/index.html" -ForegroundColor White
Write-Host "5. Login with email: admin@portfolio.com, password: admin123`n" -ForegroundColor White
