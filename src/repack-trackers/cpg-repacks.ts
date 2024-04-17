import { JSDOM } from "jsdom";

import { requestWebPage, savePage } from "./helpers";
import type { GameRepackInput } from "./helpers";
import { logger } from "../utils/logger";
import { Repack } from "src/entity";

export const getNewRepacksFromCPG = async (
    existingRepacks: Repack[] = [],
    page = 1
): Promise<void> => {
    const data = await requestWebPage(`https://cpgrepacks.site/page/${page}`);

    const { window } = new JSDOM(data);

    const repacks: GameRepackInput[] = [];

    try {
        Array.from(window.document.querySelectorAll(".post")).forEach(($post) => {
            const $title = $post.querySelector(".entry-title") as Element;
            const uploadDate = ($post.querySelector("time") as Element).getAttribute("datetime");

            const $downloadInfo = Array.from(
                $post.querySelectorAll(".wp-block-heading")
            ).find(($heading: Element) => ($heading.textContent as string).startsWith("Download")) as Element;

            /* Side note: CPG often misspells "Magnet" as "Magent" */
            const $magnet = Array.from($post.querySelectorAll("a")).find(
                ($a) =>
                    ($a.textContent as string).startsWith("Magnet") ||
                    ($a.textContent as string).startsWith("Magent")
            ) as HTMLAnchorElement;

            const fileSize = ($downloadInfo.textContent as string)
                .split("Download link => ")
                .at(1);

            repacks.push({
                title: $title.textContent as string,
                fileSize: fileSize ?? "N/A",
                magnet: $magnet.href as string,
                repacker: "CPG",
                page,
                uploadDate: new Date(uploadDate as string),
            });
        });
    } catch (err) {
        // @ts-ignore
        logger.error(err.message, { method: "getNewRepacksFromCPG" });
    }

    const newRepacks = repacks.filter(
        (repack) =>
            repack.uploadDate &&
            !existingRepacks.some(
                (existingRepack) => existingRepack.title === repack.title
            )
    );

    if (!newRepacks.length) return;

    await savePage(newRepacks);

    return getNewRepacksFromCPG(existingRepacks, page + 1);
};
