
# PowerShell Simple HTTP Server
$folder = Get-Location

$HttpListener = New-Object System.Net.HttpListener
$HttpListener.Prefixes.Add("http://localhost:8000/")
$HttpListener.Start()

Write-Host "🚀 Web Server Started: http://localhost:8000"
Write-Host "📁 Directory: $folder"
Write-Host "Press Ctrl+C to stop"

while ($HttpListener.IsListening) {
    $Context = $HttpListener.GetContext()
    $Request = $Context.Request
    $Response = $Context.Response
    
    $LocalPath = $Request.Url.LocalPath
    if ($LocalPath -eq "/") { $LocalPath = "/index.html" }
    
    $FilePath = Join-Path $folder $LocalPath.TrimStart("/")
    
    try {
        if (Test-Path $FilePath) {
            $File = Get-Item $FilePath
            if ($File.PSIsContainer) {
                $FilePath = Join-Path $FilePath "index.html"
            }
            
            if (Test-Path $FilePath) {
                $Content = [System.IO.File]::ReadAllBytes($FilePath)
                $Response.ContentLength64 = $Content.Length
                $Response.OutputStream.Write($Content, 0, $Content.Length)
                Write-Host "✓ $LocalPath"
            } else {
                $Response.StatusCode = 404
                $Response.OutputStream.Write([System.Text.Encoding]::UTF8.GetBytes("404 Not Found"), 0, 13)
                Write-Host "✗ 404: $LocalPath"
            }
        } else {
            $Response.StatusCode = 404
            $Response.OutputStream.Write([System.Text.Encoding]::UTF8.GetBytes("404 Not Found"), 0, 13)
            Write-Host "✗ 404: $LocalPath"
        }
    } catch {
        $Response.StatusCode = 500
        Write-Host "✗ Error: $_"
    } finally {
        $Response.OutputStream.Close()
    }
}

$HttpListener.Stop()
