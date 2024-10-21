const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env") });
console.log("ENV path", path.resolve(__dirname, ".env"));
console.log("ENV path1", process.env.VITE_BACKEND_URL);
module.exports = {
  apps: [
    {
      name: "fraxionui",
      script: "serve",
      args: "dist",
      node_args: "-r dotenv/config",
      append_env_to_name: true,
      env: {
        ...process.env,
        NODE_ENV: "production",
        PM2_SERVE_PORT: 5000,
        PM2_SERVE_SPA: "true",
        PM2_SERVE_HOMEPAGE: "/index.html",
      },
      env_testing: {
        ...process.env,
        NODE_ENV: "testing",
        PM2_SERVE_PORT: 5001,
        PM2_SERVE_SPA: "true",
        PM2_SERVE_HOMEPAGE: "/index.html",
      },
      env_file: path.resolve(__dirname, ".env"),
    },
  ],
};
