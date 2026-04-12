# Setup C# Server on AWC EC2

Setup C# Minimal API on AWS EC2 Linux using Python3 Certbot and Nginx.

## Connect to instance

`ssh -i "<ssh-key>.pem" "<ec2-address>"`

## Updating system

`sudo apt-get update && sudo apt-get upgrade -y`

## Installing Git

`sudo apt-get install -y git`

## Installing .NET 10

1. `wget https://packages.microsoft.com/config/ubuntu/24.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb`
2. `sudo dpkg -i packages-microsoft-prod.deb`
3. `rm packages-microsoft-prod.deb`
4. `sudo apt-get update`
5. `sudo apt-get install -y aspnetcore-runtime-10.0`
6. `sudo apt-get install -y dotnet-sdk-10.0`

## Setup app

1. `sudo nano /etc/stepup.env`

```ini
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:8080
ConnectionStrings__DefaultConnection=<YOUR_ATLAS_CONNECTION_STRING>
DatabaseName=<DATABASE_NAME>
Email__ApiKey=<EMAIL_API_KEY>
Email__FromAddress=<EMAIL_FROM_ADDRESS>
Email__FromName=<EMAIL_FROM_NAME>
```

2. `sudo chmod 600 /etc/stepup.env`
3. `git clone https://github.com/matfij/step-up.git`
4. `cd /step-up/apps/server`
5. `dotnet publish -c Release -o ~/publish`

## Setup app service

1. `sudo nano /etc/systemd/system/stepup.service`

```ini
[Unit]
Description=Step Up API
After=network.target
[Service]
Type=exec
User=ubuntu
WorkingDirectory=/home/ubuntu/publish
EnvironmentFile=/etc/stepup.env
ExecStart=/usr/bin/dotnet /home/ubuntu/publish/StepUpServer.dll
Restart=always
RestartSec=
[Install]
WantedBy=multi-user.target
```

## Setup server certification

1. `sudo apt-get install -y nginx certbot python3-certbot-nginx`

2. `sudo nano /etc/nginx/sites-available/stepup`

```
server {
    server_name errant-tower.online www.errant-tower.online;
        location / {
            proxy_pass http://localhost:8080;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
```

3. `sudo ln -sf /etc/nginx/sites-available/stepup /etc/nginx/sites-enabled/stepup`
4. `sudo nginx -t`
5. `sudo systemctl reload nginx`
6. `sudo certbot --nginx -d errant-tower.online -d www.errant-tower.online`

## Start service

1. `sudo systemctl daemon-reload`
2. `sudo systemctl enable stepup`
3. `sudo systemctl start stepup`
4. `sudo systemctl status stepup`
