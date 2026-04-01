# Connect to instance
ssh -i "<ssh-key>.pem" "<ec2-address>"

# Updating system
sudo apt-get update && sudo apt-get upgrade -y

# Installing Git
sudo apt-get install -y git

# Installing .NET 10
wget https://packages.microsoft.com/config/ubuntu/24.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

sudo apt-get install -y aspnetcore-runtime-10.0
dotnet --list-runtimes
sudo apt-get install -y dotnet-sdk-10.0
dotnet --version

# Setup app
sudo nano /etc/stepup.env
    # ```
    # ASPNETCORE_ENVIRONMENT=Production
    # ASPNETCORE_URLS=http://0.0.0.0:8080
    # ConnectionStrings__DefaultConnection=<YOUR_ATLAS_CONNECTION_STRING>
    # DatabaseName=<DATABASE_NAME>
    # Email__ApiKey=<EMAIL_API_KEY>
    # Email__FromAddress=<EMAIL_FROM_ADDRESS>
    # Email__FromName=<EMAIL_FROM_NAME>
    # ```
sudo chmod 600 /etc/stepup.env

git clone https://github.com/matfij/step-up.git

echo "--- Building server ---"
cd /step-up/apps/server
dotnet publish -c Release -o ~/publish

# Setup app service
sudo nano /etc/systemd/system/stepup.service
    # ```
    # [Unit]
    # Description=Step Up API
    # After=network.target

    # [Service]
    # Type=exec
    # User=ubuntu
    # WorkingDirectory=/home/ubuntu/publish
    # EnvironmentFile=/etc/stepup.env
    # ExecStart=/usr/bin/dotnet /home/ubuntu/publish/StepUpServer.dll
    # Restart=always
    # RestartSec=5

    # [Install]
    # WantedBy=multi-user.target
    # ```

# Start service
sudo systemctl daemon-reload
sudo systemctl enable stepup
sudo systemctl start stepup
sudo systemctl status stepup
