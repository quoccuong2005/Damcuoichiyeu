Add-Type -AssemblyName System.Drawing

$imgDir = Resolve-Path "themes/wedding/source/images"
$files = Get-ChildItem -Path $imgDir -Filter "*.jpg" | Where-Object { $_.Name -notlike "qr_*" }

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]85)

$maxDim = 1920
$totalOriginal = 0
$totalOptimized = 0

Write-Output "Starting optimization of $($files.Count) images..."

foreach ($file in $files) {
    $filePath = $file.FullName
    $tempPath = [System.IO.Path]::Combine($file.DirectoryName, "temp_" + $file.Name)

    $origLen = $file.Length
    $totalOriginal += $origLen

    # Load image from file stream to avoid file locking
    $fs = New-Object System.IO.FileStream($filePath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read)
    $img = [System.Drawing.Image]::FromStream($fs)
    $fs.Close()
    $fs.Dispose()

    $width = $img.Width
    $height = $img.Height

    if ($width -gt $maxDim -or $height -gt $maxDim) {
        if ($width -ge $height) {
            $newWidth = $maxDim
            $newHeight = [int][Math]::Round(($height * $maxDim) / $width)
        } else {
            $newHeight = $maxDim
            $newWidth = [int][Math]::Round(($width * $maxDim) / $height)
        }
    } else {
        $newWidth = $width
        $newHeight = $height
    }

    $bmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
    $graph = [System.Drawing.Graphics]::FromImage($bmp)
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graph.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $graph.DrawImage($img, 0, 0, $newWidth, $newHeight)

    $bmp.Save($tempPath, $codec, $encoderParams)

    $graph.Dispose()
    $bmp.Dispose()
    $img.Dispose()

    # Replace original with temp
    Move-Item -Path $tempPath -Destination $filePath -Force

    $newLen = (Get-Item $filePath).Length
    $totalOptimized += $newLen

    $ratio = [Math]::Round(($newLen / $origLen) * 100, 1)
    Write-Output "Optimized $($file.Name): $([Math]::Round($origLen/1MB, 2)) MB -> $([Math]::Round($newLen/1KB, 0)) KB ($ratio%)"
}

Write-Output "--------------------------------------------------"
Write-Output "Total original size: $([Math]::Round($totalOriginal/1MB, 2)) MB"
Write-Output "Total optimized size: $([Math]::Round($totalOptimized/1MB, 2)) MB"
Write-Output "Saved: $([Math]::Round(($totalOriginal - $totalOptimized)/1MB, 2)) MB ($([Math]::Round((1 - $totalOptimized/$totalOriginal)*100, 1))% reduction)"
