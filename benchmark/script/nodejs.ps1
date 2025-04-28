$bombardierPath = "bombardier"

$cmd1 = "sleep 5; $bombardierPath -c 50 -n 100000 http://localhost:8080/nodejs"

Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd1

Write-Host "Finished!" -ForegroundColor Green
