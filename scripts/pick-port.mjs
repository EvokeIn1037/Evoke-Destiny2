#!/usr/bin/env node
import {createServer} from 'node:net';
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {resolve} from 'node:path';

const MIN_PORT = 4202;
const MAX_PORT = 4225;
const PORT_FILE = resolve(process.cwd(), '.dev-port');

function isPortFree(port) {
  return new Promise(resolve => {
    const server = createServer();
    server.unref();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen({port, host: '127.0.0.1', exclusive: true});
  });
}

function readPinnedPort() {
  if (!existsSync(PORT_FILE)) return null;
  const raw = readFileSync(PORT_FILE, 'utf8').trim();
  const n = Number(raw);
  if (!Number.isInteger(n) || n < MIN_PORT || n > MAX_PORT) return null;
  return n;
}

async function pickPort() {
  const pinned = readPinnedPort();
  if (pinned !== null && (await isPortFree(pinned))) return pinned;

  for (let port = MIN_PORT; port <= MAX_PORT; port++) {
    if (await isPortFree(port)) return port;
  }
  return null;
}

const chosen = await pickPort();
if (chosen === null) {
  console.error(
    `pick-port: no free port in range ${MIN_PORT}-${MAX_PORT}`,
  );
  process.exit(1);
}

writeFileSync(PORT_FILE, `${chosen}\n`, 'utf8');
console.log(chosen);
