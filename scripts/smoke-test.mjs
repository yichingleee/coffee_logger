import { spawn } from 'node:child_process'
import process from 'node:process'
import { access } from 'node:fs/promises'
import { join } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

const PORT = process.env.SMOKE_PORT || '3100'
const BASE_URL = process.env.SMOKE_BASE_URL || `http://localhost:${PORT}`
const routesEnv = process.env.SMOKE_ROUTES
const routes = routesEnv
    ? routesEnv.split(',').map((route) => route.trim()).filter(Boolean)
    : ['/', '/login', '/signup']

let server = null
const buildIdPath = join(process.cwd(), '.next', 'BUILD_ID')

const startServer = () => {
    server = spawn(
        'node',
        ['node_modules/next/dist/bin/next', 'start', '-p', PORT],
        { stdio: 'inherit', env: { ...process.env, PORT } }
    )
}

const runBuild = () =>
    new Promise((resolve, reject) => {
        const build = spawn('npm', ['run', 'build'], { stdio: 'inherit' })
        build.on('exit', (code) => {
            if (code === 0) {
                resolve()
            } else {
                reject(new Error(`npm run build failed with code ${code}`))
            }
        })
    })

const ensureBuild = async () => {
    try {
        await access(buildIdPath)
    } catch {
        await runBuild()
    }
}

const waitForServer = async () => {
    const deadline = Date.now() + 60000
    while (Date.now() < deadline) {
        if (server.exitCode !== null) {
            throw new Error(`next start exited early with code ${server.exitCode}`)
        }
        try {
            const res = await fetch(BASE_URL, { redirect: 'manual' })
            if (res.status < 500) {
                return
            }
        } catch {
            // Ignore connection errors until server is ready.
        }
        await delay(500)
    }
    throw new Error(`Server did not become ready at ${BASE_URL}`)
}

const runChecks = async () => {
    await ensureBuild()
    startServer()
    await waitForServer()
    const failures = []

    for (const route of routes) {
        const url = `${BASE_URL}${route}`
        try {
            const res = await fetch(url, { redirect: 'manual' })
            if (res.status >= 400) {
                failures.push(`${route} -> ${res.status}`)
            }
        } catch (error) {
            failures.push(`${route} -> ${error instanceof Error ? error.message : String(error)}`)
        }
    }

    if (failures.length > 0) {
        throw new Error(`Smoke test failures:\n${failures.join('\n')}`)
    }
}

const shutdown = async () => {
    if (!server || server.exitCode !== null) {
        return
    }
    server.kill('SIGINT')
    await delay(3000)
    if (server.exitCode === null) {
        server.kill('SIGKILL')
    }
}

try {
    await runChecks()
    console.log('Smoke test passed.')
} catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
} finally {
    await shutdown()
}
