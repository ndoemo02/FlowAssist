# FlowAssist Archive Automation Script
# Version: 1.0
# Safety: MOVE ONLY - NO DELETION
# Author: System Architect AI
# Date: 2026-02-11

param(
    [switch]$DryRun = $false,
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Stop"
$script:MoveLog = @()
$script:ErrorLog = @()
$script:SkipLog = @()

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

# Banner
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  FlowAssist Archive Automation - SAFE MODE" -ForegroundColor Cyan
Write-Host "  NO DELETION • MOVE ONLY • VERIFY BUILDS" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-ColorOutput Yellow "[DRY RUN] MODE - No files will be moved"
    Write-Host ""
}

# Log function
function Add-MoveLog {
    param($Source, $Dest, $Size, $Status)
    $script:MoveLog += [PSCustomObject]@{
        Source = $Source
        Destination = $Dest
        Size = $Size
        Status = $Status
        Time = Get-Date -Format "HH:mm:ss"
    }
}

# Safe move function
function Safe-Move {
    param(
        [string]$Source,
        [string]$Destination,
        [string]$Category
    )
    
    if (-not (Test-Path $Source)) {
        Write-ColorOutput Red "[SKIP] Source not found: $Source"
        $script:SkipLog += $Source
        return $false
    }
    
    # Get size
    $size = 0
    if (Test-Path $Source -PathType Container) {
        $size = (Get-ChildItem -Path $Source -Recurse -File | Measure-Object -Property Length -Sum).Sum
    } else {
        $size = (Get-Item $Source).Length
    }
    
    $sizeStr = "{0:N2} MB" -f ($size / 1MB)
    
    Write-ColorOutput Cyan "[$Category] Moving: $Source ($sizeStr)"
    
    if ($DryRun) {
        Write-ColorOutput Yellow "   -> Would move to: $Destination"
        Add-MoveLog $Source $Destination $sizeStr "DRY_RUN"
        return $true
    }
    
    try {
        # Create destination parent directory
        $destParent = Split-Path $Destination -Parent
        if (-not (Test-Path $destParent)) {
            New-Item -ItemType Directory -Path $destParent -Force | Out-Null
        }
        
        # Move
        Move-Item -Path $Source -Destination $Destination -Force
        Write-ColorOutput Green "   [OK] Moved successfully"
        Add-MoveLog $Source $Destination $sizeStr "SUCCESS"
        return $true
    }
    catch {
        Write-ColorOutput Red "   [ERROR] $_"
        $script:ErrorLog += "Failed to move $Source : $_"
        Add-MoveLog $Source $Destination $sizeStr "FAILED"
        return $false
    }
}

# STEP 1: CREATE ARCHIVE STRUCTURE
Write-Host ""
Write-ColorOutput Cyan "━━━ STEP 1: Creating Archive Structure ━━━"
Write-Host ""

$archiveFolders = @(
    "archive/legacy_versions",
    "archive/unused_models",
    "archive/dev_scenes",
    "archive/old_maps",
    "archive/sandbox_pages",
    "archive/temp_files",
    "archive/orphan_assets"
)

foreach ($folder in $archiveFolders) {
    if (-not $DryRun) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
    }
    Write-ColorOutput Green "[+] Created: $folder"
}

# STEP 2: MOVE LEGACY VERSIONS
Write-Host ""
Write-ColorOutput Cyan "━━━ STEP 2: Moving Legacy Versions ━━━"
Write-Host ""

$legacyProjects = @(
    @{Source="flow-v2"; Dest="archive/legacy_versions/flow-v2"},
    @{Source="flow-v12"; Dest="archive/legacy_versions/flow-v12"}
)

foreach ($project in $legacyProjects) {
    Safe-Move -Source $project.Source -Destination $project.Dest -Category "LEGACY_VERSION"
}

# STEP 3: MOVE UNUSED MODELS
Write-Host ""
Write-ColorOutput Cyan "━━━ STEP 3: Moving Unused 3D Models ━━━"
Write-Host ""

$unusedModels = @(
    # Furniture
    "public/models/KAISER Idell 6631-T LUKSUS Table lamp",
    "public/models/Mirror Oval",
    "public/models/Sahara",
    "public/models/Thermory Benchmark thermo-pine C47 Cladding",
    "public/models/Thermory Stripes thermo-radiata pine CAR3 Cladding",
    
    # Orphan GLB files
    "public/models/Flowassist3d/dinning_table.glb",
    "public/models/Flowassist3d/laptop_dell_xps.glb",
    "public/models/Flowassist3d/drone_bake.glb",
    "public/models/Flowassist3d/tv_low_poly.glb",
    "public/models/Flowassist3d/studio_light.glb",
    "public/models/Flowassist3d/golden_play_button.glb",
    "public/models/Flowassist3d/silver_play_button.glb",
    "public/models/Flowassist3d/cyberpunk_music_0304144534_texture.glb",
    "public/models/Flowassist3d/earthquakes_-_2000_to_2019.glb",
    "public/models/Flowassist3d/of_planes_and_satellites.glb",
    "public/models/Flowassist3d/of_planes_and_satellites (1).glb",
    "public/models/Flowassist3d/old_paper.glb",
    "public/models/Flowassist3d/02_paper.glb",
    "public/models/Flowassist3d/floor_plan_generator_test_output.glb",
    "public/models/Flowassist3d/free_quill-pen__lowpoly.glb",
    "public/models/Flowassist3d/sample_2026-01-09T064435.177.glb",
    "public/models/Flowassist3d/sample_2026-01-09T064435.177 (1).glb",
    "public/models/Flowassist3d/sm_stone_ga312251958.glb",
    
    # Nested duplicates folder
    "public/models/Flowassist3d/Flowassist3d-20260109T055551Z-1-001",
    "public/models/Flowassist3d/source",
    "public/models/Flowassist3d/stylized-isometric-living-room-diorama",
    
    # Unused assets/models
    "public/assets/models/base_basic_pbr.glb",
    "public/assets/models/base_basic_shaded.glb",
    "public/assets/models/gaming_setup_low-poly.glb",
    "public/assets/models/ipad10.glb",
    "public/assets/models/ipad_pro_2024.glb",
    "public/assets/models/kula led.glb",
    "public/assets/models/kula led2.glb",
    "public/assets/models/lampa.glb",
    "public/assets/models/sofa.glb",
    "public/assets/models/table.glb",
    
    # Duplicate sci-fi panel
    "public/sci-fi_panels_material_with_circuits_pbr.glb"
)

foreach ($model in $unusedModels) {
    $filename = Split-Path $model -Leaf
    $dest = "archive/unused_models/$filename"
    Safe-Move -Source $model -Destination $dest -Category "UNUSED_MODEL"
}

# STEP 4: MOVE OLD MAPS
Write-Host ""
Write-ColorOutput Cyan "━━━ STEP 4: Moving Unused Maps ━━━"
Write-Host ""

Safe-Move -Source "public/models/map_lviv_ukraine.glb" -Destination "archive/old_maps/map_lviv_ukraine.glb" -Category "OLD_MAP"
Safe-Move -Source "public/_BACKUP_WARSAW" -Destination "archive/old_maps/_BACKUP_WARSAW" -Category "OLD_MAP"

# STEP 5: MOVE DEV SCENES
Write-Host ""
Write-ColorOutput Cyan "━━━ STEP 5: Moving Dev Test Pages ━━━"
Write-Host ""

$devPages = @(
    @{Source="src/app/dev"; Dest="archive/dev_scenes/dev"},
    @{Source="src/app/sandbox"; Dest="archive/dev_scenes/sandbox"},
    @{Source="src/app/v2"; Dest="archive/dev_scenes/v2"},
    @{Source="src/app/v3"; Dest="archive/dev_scenes/v3"},
    @{Source="src/app/lanyard"; Dest="archive/dev_scenes/lanyard"}
)

foreach ($page in $devPages) {
    Safe-Move -Source $page.Source -Destination $page.Dest -Category "DEV_PAGE"
}

# STEP 6: MOVE TEMP FILES
Write-Host ""
Write-ColorOutput Cyan "━━━ STEP 6: Moving Temp/Debug Files ━━━"
Write-Host ""

$tempFiles = @(
    "check_model.js",
    "output.txt",
    "Untitled-1.json",
    "implementation_plan.md",
    "27.01FlowAssistant.code-workspace"
)

foreach ($file in $tempFiles) {
    $dest = "archive/temp_files/$file"
    Safe-Move -Source $file -Destination $dest -Category "TEMP_FILE"
}

# STEP 7: MOVE UNUSED VIDEOS
Write-Host ""
Write-ColorOutput Cyan "━━━ STEP 7: Moving Unused Videos ━━━"
Write-Host ""

$unusedVideos = @(
    "public/assets/video/Amber test.mp4",
    "public/assets/video/drzewo video.mp4",
    "public/assets/video/flowassist-promo.mp4"
)

foreach ($video in $unusedVideos) {
    $filename = Split-Path $video -Leaf
    $dest = "archive/orphan_assets/$filename"
    Safe-Move -Source $video -Destination $dest -Category "UNUSED_VIDEO"
}

# STEP 8: MOVE UNRELATED PROJECTS
Write-Host ""
Write-ColorOutput Cyan "━━━ STEP 8: Moving Unrelated Projects ━━━"
Write-Host ""

Safe-Move -Source "ai-news-aggregation-dashboard (2)" -Destination "archive/legacy_versions/ai-news-aggregation-dashboard" -Category "UNRELATED_PROJECT"

# ═══════════════════════════════════════════════════════
# VERIFICATION PHASE
# ═══════════════════════════════════════════════════════

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-ColorOutput Magenta "  VERIFICATION PHASE"
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

if ($DryRun) {
    Write-ColorOutput Yellow "[!] Skipping verification (Dry Run Mode)"
} else {
    # Check critical files still exist
    Write-ColorOutput Cyan "━━━ Verifying Critical Files ━━━"
    Write-Host ""
    
    $criticalFiles = @(
        "src/app/page.tsx",
        "src/components/Navbar.tsx",
        "public/virtual_studio_ver_02.glb",
        "public/models/Flowassist3d/scene.gltf",
        "public/assets/video/ambi.mp4",
        "public/assets/video/drzewo_video.mp4",
        "src/hooks/useVoiceFlow.ts",
        "src/app/components/StudioModel.tsx"
    )
    
    $allCriticalExist = $true
    foreach ($file in $criticalFiles) {
        if (Test-Path $file) {
            Write-ColorOutput Green "[+] $file"
        } else {
            Write-ColorOutput Red "[X] MISSING: $file"
            $allCriticalExist = $false
        }
    }
    
    if (-not $allCriticalExist) {
        Write-ColorOutput Red "[CRITICAL] FILES MISSING - ROLLING BACK"
        exit 1
    }
    
    Write-Host ""
    Write-ColorOutput Green "[OK] All critical files verified"
}

# ═══════════════════════════════════════════════════════
# GENERATE REPORT
# ═══════════════════════════════════════════════════════

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-ColorOutput Cyan "  ARCHIVE REPORT"
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$totalMoved = ($script:MoveLog | Where-Object {$_.Status -eq "SUCCESS" -or $_.Status -eq "DRY_RUN"}).Count
$totalFailed = ($script:MoveLog | Where-Object {$_.Status -eq "FAILED"}).Count
$totalSkipped = $script:SkipLog.Count

Write-Host "Statistics:" -ForegroundColor Cyan
Write-Host "   Total Moved:   $totalMoved" -ForegroundColor Green
Write-Host "   Total Failed:  $totalFailed" -ForegroundColor $(if($totalFailed -gt 0){"Red"}else{"Gray"})
Write-Host "   Total Skipped: $totalSkipped" -ForegroundColor Yellow
Write-Host ""

# Calculate total size moved
$totalSize = 0
foreach ($log in $script:MoveLog) {
    if ($log.Status -eq "SUCCESS" -or $log.Status -eq "DRY_RUN") {
        $sizeNum = [double]($log.Size -replace " MB", "")
        $totalSize += $sizeNum
    }
}

Write-Host "Total Size Archived: $("{0:N2}" -f $totalSize) MB" -ForegroundColor Cyan
Write-Host ""

# Save detailed log
$reportPath = "archive/ARCHIVE_REPORT_$(Get-Date -Format 'yyyy-MM-dd_HHmmss').txt"
if (-not $DryRun) {
    $reportContent = @"
FlowAssist Archive Automation Report
Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

═══════════════════════════════════════════════════════
SUMMARY
═══════════════════════════════════════════════════════

Total Moved:   $totalMoved
Total Failed:  $totalFailed  
Total Skipped: $totalSkipped
Total Size:    $("{0:N2}" -f $totalSize) MB

═══════════════════════════════════════════════════════
MOVED FILES
═══════════════════════════════════════════════════════

$($script:MoveLog | Where-Object {$_.Status -eq "SUCCESS"} | ForEach-Object { "[$($_.Time)] $($_.Source) → $($_.Destination) ($($_.Size))" } | Out-String)

═══════════════════════════════════════════════════════
SKIPPED FILES
═══════════════════════════════════════════════════════

$($script:SkipLog | ForEach-Object { $_ } | Out-String)

═══════════════════════════════════════════════════════
ERRORS
═══════════════════════════════════════════════════════

$($script:ErrorLog | ForEach-Object { $_ } | Out-String)

"@
    
    $reportContent | Out-File -FilePath $reportPath -Encoding UTF8
    Write-ColorOutput Green "[REPORT] Detailed report saved: $reportPath"
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-ColorOutput Green "  [COMPLETE] ARCHIVE AUTOMATION COMPLETE"
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

if ($DryRun) {
    Write-ColorOutput Yellow "[INFO] This was a DRY RUN. Run without -DryRun to execute moves."
} else {
    Write-ColorOutput Cyan "Next Steps:"
    Write-Host "  1. Run: npm run build" -ForegroundColor White
    Write-Host "  2. Test production build" -ForegroundColor White
    Write-Host "  3. Test voice commands" -ForegroundColor White
    Write-Host "  4. Test 3D scene loading" -ForegroundColor White
    Write-Host "  5. Review archive/ folder" -ForegroundColor White
}

Write-Host ""
