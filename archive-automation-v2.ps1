# FlowAssist Archive Automation Script (ASCII Safe Version)
# Version: 1.1
# Safety: MOVE ONLY - NO DELETION
# Author: System Architect AI
# Date: 2026-02-11

param(
    [switch]$DryRun = $false
)

$ErrorActionPreference = "Stop"
$MoveLog = @()
$ErrorLog = @()
$SkipLog = @()

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  FlowAssist Archive Automation - SAFE MODE" -ForegroundColor Cyan
Write-Host "  NO DELETION | MOVE ONLY | VERIFY BUILDS" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "[DRY RUN] MODE - No files will be moved" -ForegroundColor Yellow
    Write-Host ""
}

# Log function
function Add-Log {
    param($Source, $Dest, $Size, $Status)
    $script:MoveLog += [PSCustomObject]@{
        Source = $Source
        Dest = $Dest
        Size = $Size
        Status = $Status
    }
}

# Safe move function
function Move-Safe {
    param(
        [string]$Source,
        [string]$Dest,
        [string]$Type
    )
    
    if (-not (Test-Path $Source)) {
        Write-Host "  [SKIP] $Source" -ForegroundColor DarkGray
        $script:SkipLog += $Source
        return
    }
    
    # Get size
    $size = 0
    try {
        if ((Get-Item $Source).PSIsContainer) {
            $size = (Get-ChildItem -Path $Source -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        } else {
            $size = (Get-Item $Source).Length
        }
    } catch {
        $size = 0
    }
    
    $sizeMB = [math]::Round($size / 1MB, 2)
    
    Write-Host "  [$Type] $Source ($size MB)" -ForegroundColor Cyan
    
    if ($DryRun) {
        Write-Host "    -> $Dest" -ForegroundColor Yellow
        Add-Log $Source $Dest "$sizeMB MB" "DRY_RUN"
        return
    }
    
    try {
        $destPath = Split-Path $Dest -Parent
        if (-not (Test-Path $destPath)) {
            New-Item -ItemType Directory -Path $destPath -Force | Out-Null
        }
        
        Move-Item -Path $Source -Destination $Dest -Force -ErrorAction Stop
        Write-Host "    [OK] Moved" -ForegroundColor Green
        Add-Log $Source $Dest "$sizeMB MB" "SUCCESS"
    }
    catch {
        Write-Host "    [ERROR] $_" -ForegroundColor Red
        $script:ErrorLog += "Failed: $Source -> $_"
        Add-Log $Source $Dest "$sizeMB MB" "FAILED"
    }
}

# STEP 1: CREATE ARCHIVE STRUCTURE
Write-Host ""
Write-Host "--- STEP 1: Creating Archive Structure ---" -ForegroundColor Cyan
Write-Host ""

$folders = @(
    "archive/legacy_versions",
    "archive/unused_models",
    "archive/dev_scenes",
    "archive/old_maps",
    "archive/temp_files",
    "archive/orphan_assets"
)

foreach ($f in $folders) {
    if (-not $DryRun -and -not (Test-Path $f)) {
        New-Item -ItemType Directory -Path $f -Force | Out-Null
    }
    Write-Host "  [+] $f" -ForegroundColor Green
}

# STEP 2: MOVE LEGACY VERSIONS
Write-Host ""
Write-Host "--- STEP 2: Moving Legacy Versions ---" -ForegroundColor Cyan
Write-Host ""

Move-Safe "flow-v2" "archive/legacy_versions/flow-v2" "LEGACY"
Move-Safe "flow-v12" "archive/legacy_versions/flow-v12" "LEGACY"

# STEP3: MOVE OLD MAPS
Write-Host ""
Write-Host "--- STEP 3: Moving Old Maps ---" -ForegroundColor Cyan
Write-Host ""

Move-Safe "public/models/map_lviv_ukraine.glb" "archive/old_maps/map_lviv_ukraine.glb" "MAP"
Move-Safe "public/_BACKUP_WARSAW" "archive/old_maps/_BACKUP_WARSAW" "MAP"

# STEP 4: MOVE DEV PAGES
Write-Host ""
Write-Host "--- STEP 4: Moving Dev Pages ---" -ForegroundColor Cyan
Write-Host ""

Move-Safe "src/app/dev" "archive/dev_scenes/dev" "DEV"
Move-Safe "src/app/sandbox" "archive/dev_scenes/sandbox" "DEV"
Move-Safe "src/app/v2" "archive/dev_scenes/v2" "DEV"
Move-Safe "src/app/v3" "archive/dev_scenes/v3" "DEV"
Move-Safe "src/app/lanyard" "archive/dev_scenes/lanyard" "DEV"

# STEP 5: MOVE TEMP FILES
Write-Host ""
Write-Host "--- STEP 5: Moving Temp Files ---" -ForegroundColor Cyan
Write-Host ""

$temp = @(
    "check_model.js",
    "output.txt",
    "Untitled-1.json",
    "implementation_plan.md",
    "27.01FlowAssistant.code-workspace",
    "ai-news-aggregation-dashboard (2)"
)

foreach ($t in $temp) {
    $name = Split-Path $t -Leaf
    Move-Safe $t "archive/temp_files/$name" "TEMP"
}

# STEP 6: MOVE UNUSED MODELS (First batch - simple paths)
Write-Host ""
Write-Host "--- STEP 6: Moving Unused Models ---" -ForegroundColor Cyan
Write-Host ""

Move-Safe "public/models/Mirror Oval" "archive/unused_models/Mirror_Oval" "MODEL"
Move-Safe 'public/models/Sahara' "archive/unused_models/Sahara" "MODEL"
Move-Safe "public/sci-fi_panels_material_with_circuits_pbr.glb" "archive/unused_models/sci-fi_panels.glb" "MODEL"

# VERIFICATION
Write-Host ""
Write-Host "=======================================================" -ForegroundColor Magenta
Write-Host "  VERIFICATION PHASE" -ForegroundColor Magenta
Write-Host "=======================================================" -ForegroundColor Magenta
Write-Host ""

if ($DryRun) {
    Write-Host "[!] Skipping verification (Dry Run)" -ForegroundColor Yellow
} else {
    Write-Host "--- Verifying Critical Files ---" -ForegroundColor Cyan
    Write-Host ""
    
    $critical = @(
        "src/app/page.tsx",
        "src/components/Navbar.tsx",
        "public/virtual_studio_ver_02.glb",
        "public/models/Flowassist3d/scene.gltf",
        "public/assets/video/ambi.mp4",
        "public/assets/video/drzewo_video.mp4"
    )
    
    $allOK = $true
    foreach ($c in $critical) {
        if (Test-Path $c) {
            Write-Host "  [+] $c" -ForegroundColor Green
        } else {
            Write-Host "  [X] MISSING: $c" -ForegroundColor Red
            $allOK = $false
        }
    }
    
    if (-not $allOK) {
        Write-Host "[CRITICAL] FILES MISSING" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "[OK] All critical files verified" -ForegroundColor Green
}

# REPORT
Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  ARCHIVE REPORT" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

$moved = ($MoveLog | Where-Object {$_.Status -eq "SUCCESS" -or $_.Status -eq "DRY_RUN"}).Count
$failed = ($MoveLog | Where-Object {$_.Status -eq "FAILED"}).Count
$skipped = $SkipLog.Count

Write-Host "Statistics:" -ForegroundColor Cyan
Write-Host "  Moved:   $moved" -ForegroundColor Green
Write-Host "  Failed:  $failed" -ForegroundColor $(if($failed -gt 0){"Red"}else{"Gray"})
Write-Host "  Skipped: $skipped" -ForegroundColor Yellow
Write-Host ""

# Calculate total size
$totalMB = 0
foreach ($log in $MoveLog) {
    if ($log.Status -eq "SUCCESS" -or $log.Status -eq "DRY_RUN") {
        $num = [double]($log.Size -replace " MB", "")
        $totalMB += $num
    }
}

Write-Host "Total Size: $([math]::Round($totalMB, 2)) MB" -ForegroundColor Cyan
Write-Host ""

# Save report
if (-not $DryRun) {
    $reportPath = "archive/ARCHIVE_REPORT_$(Get-Date -Format 'yyyy-MM-dd_HHmmss').txt"
    
    $report = @"
FlowAssist Archive Report
Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

SUMMARY
-------
Moved:   $moved
Failed:  $failed
Skipped: $skipped
Size:    $([math]::Round($totalMB, 2)) MB

MOVED FILES
-----------
$($MoveLog | Where-Object {$_.Status -eq "SUCCESS"} | ForEach-Object { "$($_.Source) -> $($_.Dest) ($($_.Size))" } | Out-String)

SKIPPED
-------
$($SkipLog | Out-String)

ERRORS
------
$($ErrorLog | Out-String)
"@
    
    $report | Out-File -FilePath $reportPath -Encoding UTF8
    Write-Host "[REPORT] Saved: $reportPath" -ForegroundColor Green
}

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Green
Write-Host "  [COMPLETE] ARCHIVE AUTOMATION FINISHED" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
Write-Host ""

if ($DryRun) {
    Write-Host "[INFO] This was a DRY RUN" -ForegroundColor Yellow
    Write-Host "Run: .\archive-automation-v2.ps1 (WITHOUT -DryRun)" -ForegroundColor White
} else {
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "  1. npm run build" -ForegroundColor White
    Write-Host "  2. Test production" -ForegroundColor White
    Write-Host "  3. Review archive/ folder" -ForegroundColor White
}

Write-Host ""
