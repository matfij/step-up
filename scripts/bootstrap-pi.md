# Setup C# Server on Raspberry PI

Setup C# Minimal API on Raspberry PI using Ngrok.

## Install .Net 10

1. `wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh`
2. `chmod +x dotnet-install.sh`
3. `./dotnet-install.sh --channel 10.0`
4. `export PATH=$PATH:$HOME/.dotnet`

## Build app

1. `git clone https://github.com/matfij/step-up.git`
2. `cd /step-up/apps/server`
3. `dotnet publish -c Release -o publish`

## Setup environment

1. `sudo nano /etc/stepup.env`

```ini
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:5000
ConnectionStrings__DefaultConnection=<YOUR_ATLAS_CONNECTION_STRING>
DatabaseName=<DATABASE_NAME>
Email__ApiKey=<EMAIL_API_KEY>
Email__FromAddress=<EMAIL_FROM_ADDRESS>
Email__FromName=<EMAIL_FROM_NAME>
```

2. `sudo chmod 600 /etc/stepup.env`

## Setup Ngrok

1. `sudo apt-get install snapd`
2. `sudo snap install ngrok`
3. `export PATH=$PATH:/snap/bin`
4. `ngrok config add-authtoken <SECRET_TOKEN>`

## Start server

1. `dotnet StepUpServer.dll`
2. `ngrok http 5000`
