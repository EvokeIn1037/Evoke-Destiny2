import { spawn } from 'node:child_process'
import { readFile, writeFile, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { createConnection } from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RANGE_START = 4202
const RANGE_END = 4225

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const portFile = path.join(repoRoot, '.dev-port')
const tempStorage = path.join(repoRoot, '.playwright-storage-tmp.json')
const finalStorage = path.join(repoRoot, '.playwright-storage-state.json')

function isPortListening(port) {
  return new Promise((resolve) => {
    const socket = createConnection({ host: '127.0.0.1', port })
    const done = (ok) => {
      socket.destroy()
      resolve(ok)
    }
    socket.once('connect', () => done(true))
    socket.once('error', () => done(false))
    socket.setTimeout(500, () => done(false))
  })
}

async function findRunningPort() {
  for (let p = RANGE_START; p <= RANGE_END; p++) {
    if (await isPortListening(p)) return p
  }
  return null
}

if (!existsSync(portFile)) {
  console.error('No .dev-port found. Run `npm run dev:web` first, in this worktree.')
  process.exit(1)
}
let port = Number((await readFile(portFile, 'utf8')).trim())

if (!(await isPortListening(port))) {
  console.warn(`.dev-port says ${port}, but nothing is listening there.`)
  const found = await findRunningPort()
  if (found === null) {
    console.error(
      `No dev server found on ports ${RANGE_START}-${RANGE_END}. Run \`npm run dev:web\` in another terminal, then re-run this script.`,
    )
    process.exit(1)
  }
  console.warn(`Found a running dev server on port ${found}; using it instead.`)
  port = found
}

const url = `http://localhost:${port}`

console.log(`Opening browser at ${url}.`)
console.log('Sign in via Auth0, then close the browser window to save auth state.')

await new Promise((resolve, reject) => {
  const child = spawn('npx', ['playwright', 'open', `--save-storage=${tempStorage}`, url], {
    stdio: 'inherit',
  })
  child.on('exit', (code) =>
    code === 0 ? resolve() : reject(new Error(`playwright open exited with code ${code}`)),
  )
})

if (!existsSync(tempStorage)) {
  console.error('No storage state was saved. Did you sign in before closing?')
  process.exit(1)
}

const state = JSON.parse(await readFile(tempStorage, 'utf8'))

const rewritten = []
for (const o of state.origins) {
  const match = o.origin.match(/^http:\/\/localhost:(\d+)$/)
  if (match) {
    for (let p = RANGE_START; p <= RANGE_END; p++) {
      rewritten.push({ ...o, origin: `http://localhost:${p}` })
    }
  } else {
    rewritten.push(o)
  }
}
state.origins = rewritten

await writeFile(finalStorage, JSON.stringify(state, null, 2))
await unlink(tempStorage)

console.log(`Saved auth covering ports ${RANGE_START}-${RANGE_END} to ${finalStorage}.`)
console.log('Restart AI Agent so browser evaluators pick up the new auth state.')
