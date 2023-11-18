import { CreateProjectConfig } from '../../../CreateProjectConfig'
import { ConfigurableFile } from './../ConfigurableFile'
import { BaseFileSystem } from '/@/libs/fileSystem/BaseFileSystem'
import { join } from '/@/libs/path'

export class TerrainTextureFile extends ConfigurableFile {
	public readonly id: string = 'terrainTexture'

	public async create(
		fileSystem: BaseFileSystem,
		projectPath: string,
		config: CreateProjectConfig
	) {
		await fileSystem.makeDirectory(join(projectPath, 'RP/textures'))

		await fileSystem.writeFileJson(
			join(projectPath, 'RP/textures/terrain_texture.json'),
			{
				num_mip_levels: 4,
				padding: 8,
				resource_pack_name: config.name,
				texture_name: 'atlas.terrain',
				texture_data: {},
			},
			true
		)
	}
}
