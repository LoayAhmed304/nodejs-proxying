# Reverse Proxy Server

A lightweight and secure **reverse proxy server** built with **Node.js**, handling SSL termination, request forwarding, caching, and security headers.

## Note

- **This is not a full/production-ready proxy web server!** – This repository serves as a learning project where I experimented with various security measures, proxying techniques and optimiazations. I'd love to hear your thoughts!

- **Check my Learning Journey.md file and feel free to discuss with me about anything, I'm bored...**

## Features

- **HTTPS Support** – Uses SSL certificates for secure communication.
- **Reverse Proxy** – Routes requests to different backend services.
- **Caching (GET Requests Only)** – Speeds up responses and reduces backend load.
- **Security Headers** – Protects against common web vulnerabilities.
- **Custom Request Headers** – Adds headers before forwarding requests.

## Project Structure

```
📁 project-root
├── 📂 config
│   ├── sslConfig.js      # SSL certificate configuration
│   ├── proxyConfig.js    # Proxy routing configuration
├── 📂 utils
│   ├── errorHandler.js   # Handles proxy errors
│   ├── cache.js          # Implements caching
├── server.js            # Main proxy server file
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```

## Setup Instructions

### 1. Install Dependencies

```sh
npm install
```

### 2. Configure SSL (For HTTPS)

- Place your **private.key** and **server.crt** inside the `config/` folder.
- Update `sslConfig.js` to point to these files.

### 3. Start the Proxy Server

```sh
node server.js
```

The server will listen on **port 443 (HTTPS)** and redirect **HTTP (port 80) to HTTPS**. Make sure to give it sufficient permissions for such use. Or just run

```sh
sudo node server.js
```

## Proxy Routing

Modify `proxyConfig.js` to define how requests should be forwarded:

```js
module.exports = [
  { path: "/api", target: "http://localhost:3000" },
  { path: "/photos", target: "http://localhost:4000" },
  { path: "/azi", target: "http://localhost:5000" },
];
```

## Custom Headers

All requests proxied through this server will include:

```sh
My-Header: A custom header value made by the proxy
```

Which can be changed upon desire.
