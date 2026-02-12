# Deployment Configuration

This repository uses GitHub Actions to deploy to DigitalOcean. The following secrets must be configured in the repository settings to enable automated deployments.

## Required Secrets

The deployment workflow requires three GitHub secrets to be configured:

### 1. DO_SSH_PRIVATE_KEY

Your SSH private key for accessing the DigitalOcean droplet.

**Format**: Include the entire key including the header and footer lines:
```
-----BEGIN OPENSSH PRIVATE KEY-----
[key content]
-----END OPENSSH PRIVATE KEY-----
```

**Security Notes**:
- This should be a dedicated deployment key, not your personal SSH key
- The key should have appropriate permissions (600) on your local system
- Never commit this key to the repository
- Rotate this key regularly (recommended: every 90 days)

### 2. DO_HOST

Your DigitalOcean droplet IP address or hostname.

**Format**: IP address (e.g., `123.45.67.89`) or hostname (e.g., `skynt.example.com`)

**Example**: `198.51.100.42`

### 3. DO_USERNAME

SSH username for deployment access to the DigitalOcean droplet.

**Format**: Username string

**Recommended**: Use a dedicated deployment user instead of `root` for better security

**Example**: `deploy` or `github-actions`

## Setting Up Secrets

To configure these secrets in your GitHub repository:

1. Navigate to your repository on GitHub
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add each secret with the exact names listed above:
   - Name: `DO_SSH_PRIVATE_KEY` | Value: [your private key]
   - Name: `DO_HOST` | Value: [your server IP or hostname]
   - Name: `DO_USERNAME` | Value: [your SSH username]

**Direct link**: `https://github.com/Holedozer1229/SkyNet/settings/secrets/actions`

## Deployment Workflow

The automated deployment workflow (`.github/workflows/mainnet.yml`) performs the following steps on every push to the `main` branch:

1. **Checkout code**: Retrieves the latest code from the repository
2. **Build Docker image**: Builds the frontend Docker image
3. **Push to registry**: Pushes the image to GitHub Container Registry (GHCR)
4. **Deploy to server**: SSHs into your DigitalOcean droplet and:
   - Pulls the latest Docker image
   - Stops and removes the existing container
   - Starts a new container with the updated image

## Security Best Practices

### SSH Key Management

- **Use dedicated deployment keys**: Create a separate SSH key pair specifically for deployments
- **Limit key permissions**: On the server, restrict what the deployment key can do using `authorized_keys` options
- **Rotate keys regularly**: Set a schedule to rotate deployment keys (recommended: every 90 days)
- **Use passphrases**: When possible, use SSH key passphrases for additional security
- **Monitor key usage**: Review GitHub Actions logs regularly for unauthorized access attempts

### Server Configuration

- **Dedicated deployment user**: Create a non-root user specifically for deployments
  ```bash
  # On your DigitalOcean droplet
  sudo adduser deploy
  sudo usermod -aG docker deploy
  ```
- **Restrict sudo access**: The deployment user should only have permissions needed for deployment
- **Configure firewall**: Use UFW or iptables to restrict access
  ```bash
  sudo ufw allow 22/tcp
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw enable
  ```

### Repository Access

- **Use GitHub deploy keys**: For repository access, use deploy keys instead of personal access tokens
- **Branch protection**: Enable branch protection rules on the `main` branch
- **Required reviews**: Require pull request reviews before merging to `main`
- **Status checks**: Require status checks to pass before merging

### Deployment Environments

Consider using GitHub Environments for additional security:

1. Navigate to **Settings** → **Environments**
2. Create a "production" environment
3. Configure environment protection rules:
   - Required reviewers
   - Wait timer
   - Deployment branches (restrict to `main` only)

## Initial Server Setup

Before the first deployment, ensure your DigitalOcean droplet is properly configured:

### 1. Install Docker

```bash
# Update package list
sudo apt-get update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add deployment user to docker group
sudo usermod -aG docker $USER
```

### 2. Configure SSH Access

```bash
# Create .ssh directory for deployment user
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add your deployment public key to authorized_keys
echo "your-public-key-here" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 3. Test SSH Connection

From your local machine, test the SSH connection:
```bash
ssh -i /path/to/private/key username@your-server-ip
```

### 4. Test Docker

Verify Docker is working:
```bash
docker --version
docker ps
```

## Post-PR Actions Required

After this PR is merged, the repository owner **MUST** complete the following steps:

### 1. Rotate SSH Keys (If Compromised)

If you suspect your current SSH key may have been exposed:

```bash
# On your local machine, generate a new SSH key pair
ssh-keygen -t ed25519 -C "github-actions-deployment" -f ~/.ssh/skynt_deploy

# Copy the public key to your server
ssh-copy-id -i ~/.ssh/skynt_deploy.pub username@your-server-ip

# Remove the old key from the server
ssh username@your-server-ip
# Edit ~/.ssh/authorized_keys and remove the old key
```

### 2. Configure GitHub Secrets

Navigate to `https://github.com/Holedozer1229/SkyNet/settings/secrets/actions` and add:

- **DO_SSH_PRIVATE_KEY**: Content of your new private key (`~/.ssh/skynt_deploy`)
- **DO_HOST**: Your DigitalOcean droplet IP address
- **DO_USERNAME**: SSH username (e.g., `deploy` or `ubuntu`)

### 3. Review Security

- **Check commit history**: Review repository commit history for any exposed credentials
- **Review Actions logs**: Check GitHub Actions logs for any credential exposure
- **Audit server access**: Review server access logs for unauthorized access
  ```bash
  sudo grep "Accepted publickey" /var/log/auth.log
  ```

### 4. Test Deployment

After configuring secrets, test the deployment:

1. Make a small change to the repository (e.g., update README)
2. Commit and push to `main` branch
3. Monitor the GitHub Actions workflow at: `https://github.com/Holedozer1229/SkyNet/actions`
4. Verify the application is running on your server
5. Check the deployed application in your browser

## Troubleshooting

### Deployment Fails: SSH Connection Refused

**Problem**: The workflow fails with "Connection refused" or similar SSH error.

**Solutions**:
- Verify the `DO_HOST` secret contains the correct IP address
- Check that SSH is running on the server: `sudo systemctl status ssh`
- Verify firewall allows SSH: `sudo ufw status`
- Test SSH connection manually from your machine

### Deployment Fails: Permission Denied

**Problem**: The workflow fails with "Permission denied (publickey)".

**Solutions**:
- Verify the `DO_SSH_PRIVATE_KEY` secret contains the complete private key
- Ensure the public key is in `~/.ssh/authorized_keys` on the server
- Check file permissions: `~/.ssh` should be 700, `authorized_keys` should be 600
- Verify the `DO_USERNAME` secret matches the server username

### Docker Pull Fails: Authentication Required

**Problem**: Docker cannot pull the image from GHCR.

**Solutions**:
- Ensure the image was pushed successfully in previous workflow steps
- Verify the repository visibility settings allow pulling
- The deployment server may need to authenticate with GHCR for private repositories

### Container Fails to Start

**Problem**: The Docker container exits immediately after starting.

**Solutions**:
- Check Docker logs: `docker logs skynt`
- Verify the container image is built correctly
- Check for port conflicts: `sudo netstat -tlnp | grep :80`
- Review application configuration and environment variables

## Monitoring and Maintenance

### Regular Tasks

- **Monitor deployments**: Review GitHub Actions workflow runs regularly
- **Check application logs**: `docker logs -f skynt`
- **Monitor server resources**: Use `htop`, `df -h`, and `docker stats`
- **Update dependencies**: Keep Docker and system packages updated
- **Rotate secrets**: Rotate SSH keys and other secrets every 90 days

### Backup Strategy

Implement a backup strategy for your deployed application:

```bash
# Backup Docker volumes
docker run --rm -v skynt_data:/data -v /backup:/backup ubuntu tar czf /backup/skynt_data_backup.tar.gz /data

# Backup configuration files
tar czf config_backup.tar.gz /etc/nginx /var/www/config
```

### Logging and Alerting

Consider implementing:
- Centralized logging (e.g., ELK stack, Papertrail)
- Server monitoring (e.g., Datadog, New Relic, Prometheus)
- Uptime monitoring (e.g., UptimeRobot, Pingdom)
- GitHub Actions status notifications (Slack, Discord, email)

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [DigitalOcean Droplet Documentation](https://docs.digitalocean.com/products/droplets/)
- [Docker Deployment Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [SSH Key Management](https://www.ssh.com/academy/ssh/key)

## Support

For issues related to:
- **GitHub Actions**: Check the [Actions tab](https://github.com/Holedozer1229/SkyNet/actions) for workflow logs
- **Server issues**: Review server logs with `journalctl` and `docker logs`
- **Application issues**: See the main [README.md](../README.md) and [DEPLOYMENT_GUIDE.md](../docs/DEPLOYMENT_GUIDE.md)

---

**Last Updated**: 2026-02-12

**Maintainer**: SKYNT Team
