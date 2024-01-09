import { Dash } from 'dash-compiler'
import { CompatabilityFileSystem } from '@/libs/fileSystem/CompatabilityFileSystem'
import { WorkerFileSystemEndPoint } from '@/libs/fileSystem/WorkerFileSystem'
import { CompatabilityFileType } from '@/libs/data/compatability/FileType'
import { CompatabilityPackType } from '../data/compatability/PackType'
import { sendAndWait } from '../worker/Communication'
import wasmUrl from '@swc/wasm-web/wasm-web_bg.wasm?url'
import { initRuntimes } from 'bridge-js-runtime'

initRuntimes(wasmUrl)

//@ts-ignore make path browserify work in web worker
globalThis.process = {
	cwd: () => '',
	env: {},
	release: {
		name: 'browser',
	},
}

const inputFileSystem = new WorkerFileSystemEndPoint('inputFileSystem')
const compatabilityInputFileSystem = new CompatabilityFileSystem(
	inputFileSystem
)
const outputFileSystem = new WorkerFileSystemEndPoint('outputFileSystem')
const compatabilityOutputFileSystem = new CompatabilityFileSystem(
	outputFileSystem
)

let dash: null | Dash<{ fileTypes: any; packTypes: any }> = null

async function getJsonData(path: string): Promise<any> {
	if (path.startsWith('data/')) path = path.slice('path/'.length)

	return (
		await sendAndWait({
			action: 'getJsonData',
			path,
		})
	).data
}

async function setup(config: any, configPath: string, actionId: string) {
	const packType = new CompatabilityPackType(config)
	const fileType = new CompatabilityFileType(config, () => false)

	dash = new Dash<{ fileTypes: any; packTypes: any }>(
		compatabilityInputFileSystem,
		compatabilityOutputFileSystem,
		<any>{
			config: configPath,
			packType,
			fileType,
			requestJsonData: <any>getJsonData,
			console: {
				log(...args: any[]) {
					postMessage({
						action: 'log',
						message: args.join(' '),
					})

					console.log(...args)
				},
				error(...args: any[]) {
					postMessage({
						action: 'log',
						message: args.join(' '),
					})

					console.error(...args)
				},
				time: console.time,
				timeEnd: console.timeEnd,
			},
		}
	)

	dash.progress.onChange((progress) => {
		postMessage({
			action: 'progress',
			progress: progress.percentage,
		})
	})

	await dash.setup({
		fileTypes: await getJsonData(
			'packages/minecraftBedrock/fileDefinitions.json'
		),
		packTypes: await getJsonData(
			'packages/minecraftBedrock/packDefinitions.json'
		),
	})

	postMessage({
		action: 'setupComplete',
		id: actionId,
	})
}

async function build(actionId: string) {
	if (!dash) {
		console.warn('Tried building but Dash is not setup yet!')

		return
	}

	await dash.build()

	postMessage({
		action: 'buildComplete',
		id: actionId,
	})
}

onmessage = (event: any) => {
	if (!event.data) return

	if (event.data.action === 'setup')
		setup(event.data.config, event.data.configPath, event.data.id)

	if (event.data.action === 'build') build(event.data.id)
}
