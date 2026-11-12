$port = 3008
$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$outDir = Join-Path $PSScriptRoot "..\screenshots"
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force }

Write-Host "Starting next server on port $port..."
$serverProc = Start-Process -FilePath "npx.cmd" -ArgumentList "next", "start", "-p", "$port" -PassThru -NoNewWindow

try {
    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Milliseconds 500
        try {
            $resp = Invoke-WebRequest -Uri "http://127.0.0.1:$port" -UseBasicParsing -TimeoutSec 2
            if ($resp.StatusCode -eq 200) {
                $ready = $true
                break
            }
        } catch {}
    }

    if (!$ready) {
        Write-Error "Server failed to start on port $port"
        return
    }

    Write-Host "Server is up! Taking screenshots..."

    function Take-Shot($name, $url, $w, $h) {
        $file = Join-Path $outDir $name
        $argList = @(
            "--headless",
            "--disable-gpu",
            "--hide-scrollbars",
            "--virtual-time-budget=2000",
            "--screenshot=$file",
            "--window-size=$w,$h",
            $url
        )
        Start-Process -FilePath $edgePath -ArgumentList $argList -Wait -NoNewWindow
        Start-Sleep -Milliseconds 400
    }

    Take-Shot "desktop-welcome-light.png" "http://127.0.0.1:$port/?view=welcome&theme=light" 1280 800
    Take-Shot "desktop-today-light.png" "http://127.0.0.1:$port/?view=today&theme=light" 1280 800
    Take-Shot "desktop-today-dark.png" "http://127.0.0.1:$port/?view=today&theme=dark" 1280 800
    Take-Shot "mobile-welcome-320px-light.png" "http://127.0.0.1:$port/?view=welcome&theme=light" 320 640
    Take-Shot "mobile-today-320px-light.png" "http://127.0.0.1:$port/?view=today&theme=light" 320 640
    Take-Shot "mobile-today-320px-dark.png" "http://127.0.0.1:$port/?view=today&theme=dark" 320 640

    Write-Host "All screenshots captured successfully!"
} finally {
    Write-Host "Stopping next server..."
    Stop-Process -Id $serverProc.Id -Force -ErrorAction SilentlyContinue
    Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.StartTime -gt (Get-Date).AddMinutes(-5) } | Stop-Process -Force -ErrorAction SilentlyContinue
}
