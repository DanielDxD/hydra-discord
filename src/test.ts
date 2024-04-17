import "reflect-metadata"
import { groupRepackers } from "./utils/helpers"
import { repackRepository } from "./repository"
import { dataSource } from "./data-source"
import { repackers as repackerlist } from "./constants"
import axios from "axios"

async function main() {
    await dataSource.initialize()

    const repackerA = await repackRepository.find({
        take: 5,
        where: {
            repacker: repackerlist[8],
        }
    })
    const repackerB = await repackRepository.find({
        take: 5,
        where: {
            repacker: repackerlist[6],
        }
    })

    const repackerArr = repackerA.concat(repackerB)

    const total = repackerArr.length
    const repackers = groupRepackers(repackerArr)

    await axios.post(process.env.WEBHOOK_URL as string, {
        content: `**A lista de repacks foi atualizada**\n${total} novo${total > 1 ? "s" : ""} repack${total > 1 ? "s" : ""} incluído${total > 1 ? "s" : ""}`,
        "embeds": [
            {
                title: "Repacks atualizados\n\n",
                description: Object.keys(repackers).map((item) => `> ${item} - ${repackers[item].length} Novos jogos\n${repackers[item].map(repackName => `- ${repackName}`).join('\n')}`).join('\n'),
                color: 152811
            }
        ]
    })
}

main()

