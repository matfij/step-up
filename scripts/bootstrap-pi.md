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

## Setup Cloudflare tunnel

1. Download and install cloudflared:

```bash
   wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64 -O cloudflared
   chmod +x cloudflared
   sudo mv cloudflared /usr/local/bin/
```

2. Copy certificate from a machine with a browser (run on your PC):

```bash
   cloudflared tunnel login
   scp C:\Users\\.cloudflared\cert.pem pi@:~/.cloudflared/cert.pem
```

3. Create the tunnel (on the Pi):

```bash
   cloudflared tunnel create errant-tower
```

4. Create config file at `~/.cloudflared/config.yml`:

```yaml
tunnel:
credentials-file: /home/pi/.cloudflared/.json

ingress:
  - hostname: errant-tower.online
    service: http://localhost:5000
  - service: http_status:404
```

> Get your `<TUNNEL_ID>` by running `cloudflared tunnel list`

5. Add DNS record in Cloudflare:

```bash
   cloudflared tunnel route dns errant-tower errant-tower.online
```

Or manually add a CNAME record in Cloudflare dashboard:

- Type: `CNAME`
- Name: `@`
- Target: `<TUNNEL_ID>.cfargotunnel.com`
- Proxy: enabled (orange cloud)
