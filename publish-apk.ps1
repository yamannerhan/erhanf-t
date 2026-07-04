# ERHAN FIT - GitHub Release APK Yukleme
# Build bittikten sonra calistir: powershell -File publish-apk.ps1

$ErrorActionPreference = "Stop"
$repo = "yamannerhan/erhanf-t"
$tag = "v1.0.6"
$apkName = "erhan-fit-v1.0.6.apk"

# APK yolu (Android Studio release build)
$apkCandidates = @(
  "C:\EFIT\android\app\build\outputs\apk\release\app-release.apk",
  "C:\Users\ALPARSLAN\Desktop\FITNESS\android\app\build\outputs\apk\release\app-release.apk",
  ".\android\app\build\outputs\apk\release\app-release.apk"
)

$apkSrc = $apkCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $apkSrc) {
  Write-Host "HATA: APK bulunamadi. Once Android Studio'da Release build alin." -ForegroundColor Red
  exit 1
}

$envFile = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envFile)) { $envFile = "C:\EFIT\.env" }
$token = (Get-Content $envFile | Where-Object { $_ -match '^EXPO_PUBLIC_GITHUB_TOKEN=' }) -replace '^EXPO_PUBLIC_GITHUB_TOKEN=',''
if (-not $token) {
  Write-Host "HATA: .env dosyasinda EXPO_PUBLIC_GITHUB_TOKEN yok." -ForegroundColor Red
  exit 1
}

$headers = @{
  Authorization = "Bearer $token"
  Accept = "application/vnd.github+json"
  "X-GitHub-Api-Version" = "2022-11-28"
}

Write-Host "APK: $apkSrc"
Write-Host "Release: $tag"

$release = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/releases/tags/$tag" -Headers $headers
$releaseId = $release.id

# Eski APK varsa sil
foreach ($asset in ($release.assets | Where-Object { $_.name -like "*.apk" })) {
  Write-Host "Eski asset siliniyor: $($asset.name)"
  Invoke-RestMethod -Method Delete -Uri "https://api.github.com/repos/$repo/releases/assets/$($asset.id)" -Headers $headers | Out-Null
}

# Yeni APK yukle
$uploadUrl = "https://uploads.github.com/repos/$repo/releases/$releaseId/assets?name=$apkName"
$apkBytes = [System.IO.File]::ReadAllBytes($apkSrc)
$uploadHeaders = @{
  Authorization = "Bearer $token"
  Accept = "application/vnd.github+json"
  "Content-Type" = "application/vnd.android.package-archive"
}
$asset = Invoke-RestMethod -Method Post -Uri $uploadUrl -Headers $uploadHeaders -Body $apkBytes

Write-Host ""
Write-Host "BASARILI!" -ForegroundColor Green
Write-Host "Indirme: $($asset.browser_download_url)"
