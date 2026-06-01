#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pickPort = resolve(here, 'pick-port.mjs');
const portFile = resolve(process.cwd(), '.dev-port');

const pick = spawnSync(process.execPath, [pickPort], {stdio: 'inherit'});
if (pick.status !== 0) {
  process.exit(pick.status ?? 1);
}

const port = readFileSync(portFile, 'utf8').trim();
const forwarded = process.argv.slice(2);

const result = spawnSync('npx', ['expo', 'start', '--port', port, ...forwarded], {
  stdio: 'inherit',
});
process.exit(result.status ?? 1);
