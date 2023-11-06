import { App } from '/@/App'
import { setupFileCategory } from './Category/file'
import { setupHelpCategory } from './Category/help'
import { setupToolsCategory } from './Category/tools'
import { setupProjectCategory } from './Category/project'
import { setupSettingsButton } from './Category/settings'

export async function setupDefaultMenus(app: App) {
	setupProjectCategory(app)
	setupSettingsButton(app)
	setupFileCategory(app)
	setupToolsCategory(app)
	setupHelpCategory(app)
}
