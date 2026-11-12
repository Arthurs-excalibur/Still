$port = 3008
$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

$serverProc = Start-Process -FilePath "npx.cmd" -ArgumentList "next", "start", "-p", "$port" -PassThru -NoNewWindow
Start-Sleep -Seconds 2

try {
    # Run Edge with JS expression to find overflowing elements
    $js = @"
(() => {
  const overflows = [];
  document.querySelectorAll('*').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.right > 320 || el.scrollWidth > 320) {
      overflows.push({
        tag: el.tagName,
        className: el.className,
        right: rect.right,
        width: rect.width,
        scrollWidth: el.scrollWidth,
        text: el.innerText ? el.innerText.substring(0, 30) : ''
      });
    }
  });
  console.log('OVERFLOWS:', JSON.stringify(overflows, null, 2));
})()
"@

    # Use node to run a diagnostic via edge or CDP if possible, or check styles
    Write-Host "Diagnostic script ready"
} finally {
    Stop-Process -Id $serverProc.Id -Force -ErrorAction SilentlyContinue
    Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.StartTime -gt (Get-Date).AddMinutes(-5) } | Stop-Process -Force -ErrorAction SilentlyContinue
}

