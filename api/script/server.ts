// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from "express";
import * as defaultServer from "./default-server";

const https = require("https");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

defaultServer.start(function (err: Error, app: express.Express) {
  if (err) {
    throw err;
  }

  const httpsEnabled: boolean = Boolean(process.env.HTTPS) || false;
  const defaultPort: number = httpsEnabled ? 8443 : 3000;

  const port: number = Number(process.env.API_PORT) || Number(process.env.PORT) || defaultPort;
  const host: string = process.env.API_HOST || "localhost";
  let server: any;

  if (httpsEnabled) {
    const options = {
      key: fs.readFileSync("./certs/cert.key", "utf8"),
      cert: fs.readFileSync("./certs/cert.crt", "utf8"),
    };

    server = https.createServer(options, app).listen(host, port, function () {
      console.log(`API host listening at https://:${host}:${port}`);
    });
  } else {
    server = app.listen(port, function () {
      console.log(`API host listening at http://${host}:${port}`);
    });
  }

  server.setTimeout(0);
});
