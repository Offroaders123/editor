import { CreateProjectConfig } from '../../../../CreateProjectConfig'
import { BaseFileSystem } from '/@/libs/fileSystem/BaseFileSystem'
import { join } from '/@/libs/path'

export class SkinsFile {
	public readonly id: string = 'skins'

	public async create(
		fileSystem: BaseFileSystem,
		projectPath: string,
		config: CreateProjectConfig
	) {
		await fileSystem.writeFileJson(
			join(projectPath, 'SP/skins.json'),
			{
				geometry: 'skinpacks/skins.json',
				skins: [],
				serialize_name: config.namespace,
				localization_name: config.namespace,
			},
			true
		)
	}
}
