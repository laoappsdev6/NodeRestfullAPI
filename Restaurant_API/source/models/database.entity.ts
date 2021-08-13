import { Sequelize } from "sequelize";
import { DB } from "../config/config";
import { TableName } from "../services/services";
import { UserFactory } from "./user.model";

export const DBconnection = new Sequelize(DB.dbname, DB.dbuser, DB.dbpass, { host: DB.dbhost, dialect: DB.dbdialect, timezone: DB.timezone, logging: false });

export const UserEntity = UserFactory(TableName.users, DBconnection);

export function initDB(): Promise<Sequelize> {
    return new Promise<Sequelize>(async (resolve, rejects) => {
        try {
            await UserEntity.sync();
            // await UserEntity.sync({ alter: true });
            // await UserEntity.sync({ force: true });

            resolve(DBconnection);
        } catch (e) {
            rejects(e)
        }
    });
};

initDB();