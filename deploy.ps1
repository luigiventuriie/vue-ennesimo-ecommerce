# PowerShell deployment script for GitHub Pages

# Stop on errors
$ErrorActionPreference = "Stop"

Write-Host "Building project..." -ForegroundColor Cyan
npm run build-only

Write-Host "Navigating to build output directory..." -ForegroundColor Cyan
Set-Location dist

# if you are deploying to a custom domain
# "www.example.com" | Out-File CNAME -Encoding ASCII

Write-Host "Initializing git repository..." -ForegroundColor Cyan
git init
git checkout -b main
git add -A
git commit -m 'deploy'

Write-Host "Deploying to https://luigiventuriie.github.io/vue-ennesimo-ecommerce/" -ForegroundColor Cyan
git push -f git@github.com:luigiventuriie/vue-ennesimo-ecommerce.git main:gh-pages

Set-Location ..

Write-Host "Deployment complete!" -ForegroundColor Green
