import axios from "axios";

export async function notifyDiscord(total: number, repackers: { [key: string]: string[] }) {
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
