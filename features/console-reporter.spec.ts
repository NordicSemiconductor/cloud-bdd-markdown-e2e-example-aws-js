import { spawn } from 'node:child_process'
import { createReadStream } from 'node:fs'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

void describe('console-reporter', () => {
	void it('should exit with code 0 if the previous process runs successfully', async () => {
		const consoleReporter = spawn(
			'npx',
			['tsx', join('features', 'console-reporter.ts')],
			{
				cwd: process.cwd(),
			},
		)

		const data = createReadStream(
			join(process.cwd(), 'features', 'fixtures', 'report-success.json'),
		)
		data
			.on('data', (data) => {
				consoleReporter.stdin.write(data)
			})
			.on('end', () => {
				consoleReporter.stdin.end()
			})

		const code = await new Promise((resolve) =>
			consoleReporter.on('close', (code) => {
				resolve(code)
			}),
		)

		assert.equal(code, 0)
	})

	void it('should exit with code 1 if the previous process is failed', async () => {
		const consoleReporter = spawn(
			'npx',
			['tsx', join('features', 'console-reporter.ts')],
			{
				cwd: process.cwd(),
			},
		)

		const data = createReadStream(
			join(process.cwd(), 'features', 'fixtures', 'report-fail.json'),
		)
		data
			.on('data', (data) => {
				consoleReporter.stdin.write(data)
			})
			.on('end', () => {
				consoleReporter.stdin.end()
			})

		const code = await new Promise((resolve) =>
			consoleReporter.on('close', (code) => {
				resolve(code)
			}),
		)

		assert.equal(code, 1)
	})
})
