# Setup C# Server on Raspberry PI

Setup C# Minimal API on Raspberry PI using Ngrok.

## Install .Net 10

1. `wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh`
2. `chmod +x dotnet-install.sh`
3. `./dotnet-install.sh --channel 10.0`
4. `export PATH=$PATH:$HOME/.dotnet`

## Setup environment

1. `git clone https://github.com/matfij/step-up.git`
2. `cd ./step-up/apps/server/StepUpServer`
3. `nano appsettings.Production.json`

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "<CONNECTION_STRING>"
  },
  "Email": {
    "ApiKey": "<API_KEY>",
    "FromAddress": "step-up@errant-tower.online",
    "FromName": "Step Up"
  },
  "DatabaseName": "StepUpDB"
}
```

## Build app

1. `cd ..`
2. `dotnet publish -c Release -o publish`

## Setup Ngrok

1. `sudo apt-get install snapd`
2. `sudo snap install ngrok`
3. `export PATH=$PATH:/snap/bin`
4. `ngrok config add-authtoken <SECRET_TOKEN>`

## Start server

1. `cd ./publish`
2. `dotnet StepUpServer.dll`
3. `ngrok http 5000`
