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

    Write-Host "Server is up! Taking Milestone 4 verification screenshots..."

    function Take-Shot($name, $url, $w, $h) {
        $file = Join-Path $outDir $name
        $argList = @(
            "--headless",
            "--disable-gpu",
            "--hide-scrollbars",
            "--screenshot=$file",
            "--window-size=$w,$h",
            $url
        )
        Start-Process -FilePath $edgePath -ArgumentList $argList -Wait -NoNewWindow
        Start-Sleep -Milliseconds 700
    }

    Take-Shot "desktop-history.png" "http://127.0.0.1:$port/?view=history&theme=light" 1280 800
    Take-Shot "desktop-settings.png" "http://127.0.0.1:$port/?view=settings&theme=light" 1280 900
    Take-Shot "mobile-settings-320px.png" "http://127.0.0.1:$port/?view=settings&theme=light" 320 640

    Write-Host "Milestone 4 screenshots captured!"
} finally {
    Write-Host "Stopping server..."
    Stop-Process -Id $serverProc.Id -Force -ErrorAction SilentlyContinue
    Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.StartTime -gt (Get-Date).AddMinutes(-5) } | Stop-Process -Force -ErrorAction SilentlyContinue
}

