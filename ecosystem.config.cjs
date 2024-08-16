module.exports = {
  apps: [
    {
      name: "fraxion-prod",
      script: "serve",
      args: "-s dist",
      env: {
        NODE_ENV: "production",
        PM2_SERVE_PORT: 5000,
        PM2_SERVE_SPA: "true",
      },
    },
  ],
};
