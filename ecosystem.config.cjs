require('dotenv').config();

module.exports = {
  apps: [
    {
      name: "fraxionui",
      script: "serve",
      args: "dist",
      env: {
        NODE_ENV: "production",
        PM2_SERVE_PORT:  process.env.VITE_PORT,
        PM2_SERVE_SPA: "true",
        PM2_SERVE_HOMEPAGE: "/index.html"
      },
    },
  ],
};
