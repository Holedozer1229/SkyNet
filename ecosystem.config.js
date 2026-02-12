module.exports = {
  apps: [
    {
      name: 'starlord2-backend',
      script: './backend/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3001
      }
    },
    {
      name: 'starlord2-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './frontend',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
