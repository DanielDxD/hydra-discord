import { DataSource } from "typeorm";
import {
    Game,
    GameShopCache,
    ImageCache,
    Repack,
    RepackerFriendlyName,
    UserPreferences,
    MigrationScript,
} from "./entity";
import type { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import path from "path";

export const createDataSource = (options: Partial<SqliteConnectionOptions>) =>
    new DataSource({
        type: "sqlite",
        database: path.resolve(__dirname, "..", "hydra.db"),
        entities: [
            Game,
            ImageCache,
            Repack,
            RepackerFriendlyName,
            UserPreferences,
            GameShopCache,
            MigrationScript,
        ],
        ...options,
    });

export const dataSource = createDataSource({
    synchronize: true,
});
