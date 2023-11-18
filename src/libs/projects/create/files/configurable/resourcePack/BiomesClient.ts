import { CreateProjectConfig } from '../../../../CreateProjectConfig'
import { ConfigurableFile } from '../ConfigurableFile'
import { BaseFileSystem } from '/@/libs/fileSystem/BaseFileSystem'
import { join } from '/@/libs/path'

export class BiomesClientFile extends ConfigurableFile {
	public readonly id: string = 'biomesClient'

	public async create(
		fileSystem: BaseFileSystem,
		projectPath: string,
		config: CreateProjectConfig
	) {
		await fileSystem.writeFileJson(
			join(projectPath, `RP/biomes_client.json`),
			{
				biomes: {},
			},
			true
		)
	}
}
