Write-Host "🚀 PocketBase Database Setup for Makbig Academy" -ForegroundColor Green
Write-Host ""

# Check if PocketBase is running
Write-Host "Checking if PocketBase is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8090/_/" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ PocketBase is running at http://127.0.0.1:8090" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ PocketBase is not running. Please start it first:" -ForegroundColor Red
    Write-Host "   .\pocketbase.exe serve" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Open your browser and go to: http://127.0.0.1:8090/_/" -ForegroundColor Cyan
Write-Host "2. Create your admin account (first time only)" -ForegroundColor Cyan
Write-Host "3. Create the following collections:" -ForegroundColor Cyan
Write-Host ""

Write-Host "🗄️ Collection 1: 'users' (Auth Collection)" -ForegroundColor Magenta
Write-Host "   - Type: Auth" -ForegroundColor White
Write-Host "   - Schema:" -ForegroundColor White
Write-Host "     * name (Text, Required)" -ForegroundColor Gray
Write-Host "     * role (Select, Required, Options: student, admin)" -ForegroundColor Gray
Write-Host "     * domain (Text, Optional)" -ForegroundColor Gray
Write-Host ""

Write-Host "🗄️ Collection 2: 'domains' (Base Collection)" -ForegroundColor Magenta
Write-Host "   - Type: Base" -ForegroundColor White
Write-Host "   - Schema:" -ForegroundColor White
Write-Host "     * name (Text, Required, Unique)" -ForegroundColor Gray
Write-Host ""

Write-Host "🗄️ Collection 3: 'uploads' (Base Collection)" -ForegroundColor Magenta
Write-Host "   - Type: Base" -ForegroundColor White
Write-Host "   - Schema:" -ForegroundColor White
Write-Host "     * student_id (Relation to users, Required)" -ForegroundColor Gray
Write-Host "     * image (File, Required, Max 5MB, Images only)" -ForegroundColor Gray
Write-Host "     * week (Number, Required)" -ForegroundColor Gray
Write-Host "     * domain (Text, Required)" -ForegroundColor Gray
Write-Host "     * admin_reply (Text, Optional)" -ForegroundColor Gray
Write-Host ""

Write-Host "🔐 Security Rules:" -ForegroundColor Yellow
Write-Host "After creating collections, set up security rules:" -ForegroundColor White
Write-Host ""

Write-Host "Users Collection Rules:" -ForegroundColor Cyan
Write-Host "- List: @request.auth.id != ''" -ForegroundColor Gray
Write-Host "- View: @request.auth.id = id" -ForegroundColor Gray
Write-Host "- Create: @request.auth.id = ''" -ForegroundColor Gray
Write-Host "- Update: @request.auth.id = id" -ForegroundColor Gray
Write-Host "- Delete: @request.auth.id = id" -ForegroundColor Gray
Write-Host ""

Write-Host "Domains Collection Rules:" -ForegroundColor Cyan
Write-Host "- List: true" -ForegroundColor Gray
Write-Host "- View: true" -ForegroundColor Gray
Write-Host "- Create: @request.auth.role = 'admin'" -ForegroundColor Gray
Write-Host "- Update: @request.auth.role = 'admin'" -ForegroundColor Gray
Write-Host "- Delete: @request.auth.role = 'admin'" -ForegroundColor Gray
Write-Host ""

Write-Host "Uploads Collection Rules:" -ForegroundColor Cyan
Write-Host "- List: @request.auth.id != ''" -ForegroundColor Gray
Write-Host "- View: @request.auth.id != ''" -ForegroundColor Gray
Write-Host "- Create: @request.auth.role = 'student' AND @request.auth.id = student_id" -ForegroundColor Gray
Write-Host "- Update: @request.auth.role = 'admin' OR (@request.auth.id = student_id AND admin_reply = '')" -ForegroundColor Gray
Write-Host "- Delete: @request.auth.role = 'admin'" -ForegroundColor Gray
Write-Host ""

Write-Host "📝 Sample Data:" -ForegroundColor Yellow
Write-Host "After setup, add these domains:" -ForegroundColor White
Write-Host "- Python Programming" -ForegroundColor Gray
Write-Host "- Full Stack Development" -ForegroundColor Gray
Write-Host "- Data Analytics" -ForegroundColor Gray
Write-Host "- Machine Learning" -ForegroundColor Gray
Write-Host "- Web Design" -ForegroundColor Gray
Write-Host "- Mobile Development" -ForegroundColor Gray
Write-Host ""

Write-Host "🎯 Create Admin User:" -ForegroundColor Yellow
Write-Host "1. Go to Users collection" -ForegroundColor White
Write-Host "2. Create a new user" -ForegroundColor White
Write-Host "3. Set role to 'admin'" -ForegroundColor White
Write-Host "4. Use this account to login to your app" -ForegroundColor White
Write-Host ""

Write-Host "🚀 Start Your App:" -ForegroundColor Yellow
Write-Host "npm start" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Setup Complete! Your Makbig Academy is ready!" -ForegroundColor Green


