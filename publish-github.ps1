$ErrorActionPreference = 'Stop'
$token = (Get-Content 'C:\Users\ALPARSLAN\Desktop\FITNESS\.env' | Where-Object { $_ -like 'EXPO_PUBLIC_GITHUB_TOKEN=*' }).Split('=',2)[1].Trim()
$headers = @{ Authorization = "Bearer $token"; Accept = 'application/vnd.github+json'; 'X-GitHub-Api-Version' = '2022-11-28' }
$repo = 'yamannerhan/erhanf-t'
$tag = 'v1.0.9'
$apk = "C:\Users\ALPARSLAN\Desktop\EF\erhan-fit-v1.0.9.apk"

if (-not (Test-Path $apk)) {
  $release = 'C:\Users\ALPARSLAN\Desktop\EF\android\app\build\outputs\apk\release\app-release.apk'
  if (Test-Path $release) {
    Copy-Item $release $apk -Force
    Write-Host "Release APK kopyalandi"
  } else {
    throw "Release APK bulunamadi. Android Studio'da Release build alin: $apk"
  }
}

foreach ($oldTag in @('v1.0.8', 'v1.0.7')) {
  try {
    $old = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/releases/tags/$oldTag" -Headers $headers
    Invoke-RestMethod -Method Delete -Uri "https://api.github.com/repos/$repo/releases/$($old.id)" -Headers $headers | Out-Null
    Write-Host "SILINDI $oldTag"
  } catch { Write-Host "$oldTag yok" }
}

$body = @{
  tag_name = $tag
  name = 'ERHAN FIT v1.0.9'
  body = "Acilis takilmasi duzeltildi, splash animasyonu, Android uyumluluk."
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
$asset = Invoke-RestMethod -Method Post -Uri "https://uploads.github.com/repos/$repo/releases/$rid/assets?name=erhan-fit-v1.0.9.apk" -Headers $uh -Body $bytes
Write-Host "BASARILI: $($asset.browser_download_url)"
