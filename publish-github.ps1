$ErrorActionPreference = 'Stop'
$token = (Get-Content 'C:\Users\ALPARSLAN\Desktop\FITNESS\.env' | Where-Object { $_ -like 'EXPO_PUBLIC_GITHUB_TOKEN=*' }).Split('=',2)[1].Trim()
$headers = @{ Authorization = "Bearer $token"; Accept = 'application/vnd.github+json'; 'X-GitHub-Api-Version' = '2022-11-28' }
$repo = 'yamannerhan/erhanf-t'
$apk = 'C:\Users\ALPARSLAN\Desktop\EF\erhan-fit-v1.0.8.apk'
$tag = 'v1.0.8'

if (-not (Test-Path $apk)) {
  $fallback = 'C:\Users\ALPARSLAN\Desktop\EF\android\app\build\outputs\apk\release\app-release.apk'
  if (Test-Path $fallback) {
    Copy-Item $fallback $apk -Force
    Write-Host "APK kopyalandi: $apk"
  } else {
    throw "APK bulunamadi: $apk"
  }
}

try {
  $old = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/releases/tags/v1.0.7" -Headers $headers
  Invoke-RestMethod -Method Delete -Uri "https://api.github.com/repos/$repo/releases/$($old.id)" -Headers $headers | Out-Null
  Write-Host 'SILINDI v1.0.7'
} catch { Write-Host 'v1.0.7 yok veya silinemedi' }

$body = @{
  tag_name = $tag
  name = 'ERHAN FIT v1.0.8'
  body = "Android duyuru tek satir, ERHAN FIT marka renkleri, ikon ve animasyon duzeltmeleri."
  draft = $false
  prerelease = $false
} | ConvertTo-Json

try {
  $rel = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/releases/tags/$tag" -Headers $headers
  $rid = $rel.id
  foreach ($a in $rel.assets) {
    if ($a.name -like '*.apk') {
      Invoke-RestMethod -Method Delete -Uri "https://api.github.com/repos/$repo/releases/assets/$($a.id)" -Headers $headers | Out-Null
    }
  }
} catch {
  $rel = Invoke-RestMethod -Method Post -Uri "https://api.github.com/repos/$repo/releases" -Headers $headers -Body $body -ContentType 'application/json'
  $rid = $rel.id
}

$bytes = [IO.File]::ReadAllBytes($apk)
$uh = @{ Authorization = "Bearer $token"; Accept = 'application/vnd.github+json'; 'Content-Type' = 'application/vnd.android.package-archive' }
$asset = Invoke-RestMethod -Method Post -Uri "https://uploads.github.com/repos/$repo/releases/$rid/assets?name=erhan-fit-v1.0.8.apk" -Headers $uh -Body $bytes
Write-Host "BASARILI: $($asset.browser_download_url)"
