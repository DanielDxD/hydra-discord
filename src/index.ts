import cron from 'node-cron'
import { getNewGOGGames } from './repack-trackers/gog'
import { getNewRepacksFromXatab } from './repack-trackers/xatab'
import { getNewRepacksFromCPG } from './repack-trackers/cpg-repacks'
import { notifyDiscord } from './utils/notifyDiscord'
import { logger } from './utils/logger'
import { getNewRepacksFromUser } from './repack-trackers'
import { repackers } from './constants'
import { groupRepackers } from './utils/helpers'
import { Repack } from './entity'
import { repackRepository } from './repository'
import { MoreThan } from 'typeorm'
import { dataSource } from './data-source'


async function executeTasks() {

    await dataSource.initialize()

    const date = new Date()

    const track1337xUsers = async (existingRepacks: Repack[]) => {
        for (const repacker of repackers) {
            await getNewRepacksFromUser(
                repacker,
                existingRepacks.filter((repack) => repack.repacker === repacker)
            );
        }
    };

    const existingRepacks = await repackRepository.find({
        order: {
            createdAt: "desc"
        }
    })

    Promise.allSettled([
        getNewGOGGames(
            existingRepacks.filter((repack) => repack.repacker === "GOG")
        ),
        getNewRepacksFromXatab(
            existingRepacks.filter((repack) => repack.repacker === "Xatab")
        ),
        getNewRepacksFromCPG(
            existingRepacks.filter((repack) => repack.repacker === "CPG")
        ),
        track1337xUsers(existingRepacks)
    ])
        .then(async () => {
            const newRepacks = await repackRepository.find({
                where: {
                    createdAt: MoreThan(date)
                }
            })

            const total = newRepacks.length

            if (total === 0) return;

            const repackers = groupRepackers(newRepacks)

            await notifyDiscord(total, repackers)
        })
        .catch((e) => logger.error(e))
}

cron.schedule("0 0 */3 * * *", executeTasks)
