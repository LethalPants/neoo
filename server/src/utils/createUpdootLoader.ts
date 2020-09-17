import { Updoot } from '../entities/Updoot';
import DataLoader from 'dataloader';

// [{postId: 5, userId: 10}]
// [{postId: 5, userId: 10, value: 1}]
export const createUpdootLoader = () =>
	new DataLoader<{ postId: number; userId: number }, Updoot | null>(
		async (keys: any) => {
			const updoots = await Updoot.findByIds(keys as any);
			const updootIdsToUpdoot: Record<string, Updoot> = {};
			updoots.forEach((updoot: Updoot) => {
				updootIdsToUpdoot[`${updoot.userId}|${updoot.postId}`] = updoot;
			});

			return keys.map(
				(key: any) => updootIdsToUpdoot[`${key.userId}|${key.postId}`]
			);
		}
	);