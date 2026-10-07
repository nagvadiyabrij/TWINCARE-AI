param(
    [int]$CommitCount = 25
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

git config user.name "TwinCare Auto Bot"
git config user.email "auto-commit@twincare.ai"

$counterFile = Join-Path $repoRoot ".auto_commit_counter.txt"
$logFile = Join-Path $repoRoot ".auto_commit_log.txt"

$current = 0
if (Test-Path $counterFile) {
    $value = (Get-Content -Path $counterFile -Raw).Trim()
    if ($value -match '^\d+$') {
        $current = [int]$value
    }
}

for ($i = 1; $i -le $CommitCount; $i++) {
    $current++
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $message = "Auto commit #$current - $timestamp"

    Add-Content -Path $logFile -Value "$message"
    Set-Content -Path $counterFile -Value $current -Encoding utf8

    git add .
    git commit -m $message --allow-empty
}

Write-Host "Created $CommitCount automatic commits. Total count: $current"
