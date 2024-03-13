import { fileSystem } from '@/App'
import { join } from '@/libs/path'
import { dark, light } from '@/libs/theme/DefaultThemes'
import { ThemeManager } from '@/libs/theme/ThemeManager'
import { Theme } from '@/libs/theme/Theme'
import { ExtensionManifest } from './Extensions'

export class Extension {
	public id: string = 'unloaded'

	private manifest: ExtensionManifest | null = null
	private themes: Theme[] = []
	private presets: any[] = []
	private snippets: any[] = []

	constructor(public path: string) {}

	public async load() {
		const manifest: ExtensionManifest = await fileSystem.readFileJson(join(this.path, 'manifest.json'))

		this.id = manifest.id
		this.manifest = manifest

		const themesPath = join(this.path, 'themes')
		if (await fileSystem.exists(themesPath)) {
			for (const entry of await fileSystem.readDirectoryEntries(themesPath)) {
				const theme: Theme = await fileSystem.readFileJson(entry.path)

				if (manifest.target != 'v2.1') {
					theme.colors.menuAlternate = theme.colors.sidebarNavigation
				}

				theme.colors = {
					...(theme.colorScheme === 'dark' ? dark.colors : light.colors),
					...theme.colors,
				}

				ThemeManager.addTheme(theme)
				this.themes.push(theme)
			}

			ThemeManager.reloadTheme()
		}

		const presetsPath = join(this.path, 'presets')
		if (await fileSystem.exists(presetsPath)) {
			for (const entry of await fileSystem.readDirectoryEntries(presetsPath)) {
				const preset: any = await fileSystem.readFileJson(entry.path)

				this.presets.push(preset)
			}
		}

		const snippetsPath = join(this.path, 'snippets')
		if (await fileSystem.exists(snippetsPath)) {
			for (const entry of await fileSystem.readDirectoryEntries(snippetsPath)) {
				const snippet: any = await fileSystem.readFileJson(entry.path)

				this.snippets.push(snippet)
			}
		}
	}

	public async unload() {
		for (const theme of this.themes) {
			ThemeManager.removeTheme(theme)
		}
	}
}