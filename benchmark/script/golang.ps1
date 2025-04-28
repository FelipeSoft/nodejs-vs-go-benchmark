$bombardierPath = "bombardier"

$cmd2 = "sleep 5; $bombardierPath -c 50 -n 100000 http://localhost:8081/golang"

Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd2

Write-Host "Finished!" -ForegroundColor Green
