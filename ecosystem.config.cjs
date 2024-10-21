const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env") });
module.exports = {
  apps: [
    {
      name: "fraxionui",
      script: "serve",
      args: "dist",
      env: {
        NODE_ENV: "production",
        PM2_SERVE_PORT: 5000,
        PM2_SERVE_SPA: "true",
        PM2_SERVE_HOMEPAGE: "/index.html",
      },
      env_testing: {
        NODE_ENV: "testing",
        PM2_SERVE_PORT: 5001,
        PM2_SERVE_SPA: "true",
        PM2_SERVE_HOMEPAGE: "/index.html",
      },
    },
  ],
};
