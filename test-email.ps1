$body = @{
    to = "jhuamanif@ipesa.com.pe"
    subject = "Prueba SIGMA - Resend"
    html = "<h1>Hola!</h1><p>Esta es una prueba del sistema de correos SIGMA.</p>"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer sb_publishable_fPcqshbcKb-AnsxErUHieg_lBZQP4uu"
}

try {
    $response = Invoke-RestMethod -Uri "https://limvvebxkvhibuobmpkx.supabase.co/functions/v1/resend-email" -Method Post -Headers $headers -Body $body
    Write-Host "EXITO:" ($response | ConvertTo-Json)
} catch {
    Write-Host "ERROR:" $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        Write-Host "RESPUESTA:" $reader.ReadToEnd()
    }
}
