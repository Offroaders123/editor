import { Ref, onMounted, onUnmounted, ref } from 'vue'
import { ActionsCategory } from './Categories/Actions'
import { AppearanceCategory } from './Categories/Appearance'
import { Category } from './Categories/Category'
import { EditorCategory } from './Categories/Editor'
import { GeneralCategory } from './Categories/General'
import { ProjectsCategory } from './Categories/Projects'
import { EventSystem } from '/@/libs/event/EventSystem'
import { LocalFileSystem } from '/@/libs/fileSystem/LocalFileSystem'

export class Settings {
	public categories: Category[] = []
	public settings: any = null
	public eventSystem = new EventSystem(['settingsChanged'])

	private fileSystem: LocalFileSystem = new LocalFileSystem()

	constructor() {
		this.fileSystem.setRootName('settings')

		this.addCategory(new GeneralCategory())
		this.addCategory(new EditorCategory())
		this.addCategory(new AppearanceCategory())
		this.addCategory(new ProjectsCategory())
		this.addCategory(new ActionsCategory())
	}

	public async load() {
		if (!(await this.fileSystem.exists('settings.json'))) {
			this.settings = defaultSettings

			return
		}

		this.settings = await this.fileSystem.readFileJson('settings.json')

		this.eventSystem.dispatch('settingsChanged', null)
	}

	public addCategory(category: Category) {
		this.categories.push(category)
	}

	public get(id: string): any {
		return this.settings[id]
	}

	public async set(id: string, value: any) {
		if (!this.settings) return

		this.settings[id] = value

		this.fileSystem.writeFileJson('settings.json', this.settings, false)

		this.eventSystem.dispatch('settingsChanged', value)
	}

	public useSettings(): Ref<any> {
		const settings = ref(this.settings)

		const me = this

		function updateSettings() {
			settings.value = me.settings
		}

		onMounted(() => {
			me.eventSystem.on('settingsChanged', updateSettings)
		})

		onUnmounted(() => {
			me.eventSystem.off('settingsChanged', updateSettings)
		})

		return settings
	}
}

export const defaultSettings = {
	language: 'English',
}
