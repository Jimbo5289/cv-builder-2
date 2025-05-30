module.exports = {
  apps: [{
    name: "cv-builder",
    script: "src/index.js",
    cwd: "./server",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production",
      PORT: 3005
    }
  }]
} 