import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SettingsRepository } from '../repositories/SettingsRepository';

class SettingsController {

	async create(request: Request, response: Response) {
		const { chat, username } = request.body;

		const settingsRepository = getCustomRepository(SettingRepository);
		console.log('ok 1');
		const settings = settingsRepository.create({
			chat,
			username
		});
		console.log('ok 2');
		await settingsRepository.save(settings);
		console.log('ok 3');
		return response.json(settings);
	}
}

export { SettingsController };