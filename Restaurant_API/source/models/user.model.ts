import { BuildOptions, DataTypes, DATE, Model, ModelAttributes, Sequelize, UUID, UUIDV1 } from 'sequelize';
import { Service } from '../services/services';
import * as bcryptjs from 'bcryptjs';
import { BaseModel } from './base.model';

export interface LogIn {
    username: string;
    password: string;
}

export interface ChengePassword {
    id: number;
    oldPassword: string;
    newPassword: string;
}

export interface UserAttributes extends BaseModel {
    name: string;
    username: string;
    password: string;
    phonenumber: string;
    parent: string;
    hashPassword: (password: string) => string;
    validPassword: (password: string) => boolean;
}

export interface UserModel extends Model<UserAttributes>, UserAttributes {
    prototype: {
        validPassword: (password: string) => boolean;
        hashPassword: (password: string) => string;
    };
}
export class User extends Model<UserModel, UserAttributes> {
    prototype: {
        validPassword: (password: string) => boolean;
        hashPassword: (password: string) => string;
    } | undefined;
}
export type UserStatic = typeof Model & {
    new(value?: object, object?: BuildOptions): UserModel;
};

export const UserFactory = (name: string, sequelize: Sequelize): UserStatic => {
    const attributes: ModelAttributes<UserModel> = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
            autoIncrementIdentity: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING, allowNull: false
        },
        username: {
            type: DataTypes.STRING, allowNull: false,
            validate: { len: { args: [2, 20], msg: 'Username is short!' } }
        },
        password: {
            type: DataTypes.STRING, allowNull: false,
            validate: { len: { args: [6, 1000], msg: 'Password must be then 6 digits!' } }
        },
        phonenumber: {
            type: DataTypes.STRING, allowNull: false,
            validate: {
                len: { args: [10, 15], msg: 'Phonenumber must be then 10 digits!' },
                isInt: { args: true, msg: 'Phonenumber is number only!' }
            }
        },
        uuid: {
            type: DataTypes.STRING, allowNull: false, defaultValue: Service.genUUID()
        },
        parent: {
            type: DataTypes.STRING, allownull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false
        }
    } as unknown as ModelAttributes<UserModel>;
    let x = sequelize.define(name, attributes, { tableName: name, freezeTableName: true, timestamps: true });

    x.prototype.hashPassword = function (password: string): string {
        if (!password) return '';
        const str = password + this.username + this.phonenumber;
        return this.password = bcryptjs.hashSync(str, bcryptjs.genSaltSync())
    }
    x.prototype.validPassword = function (password: string): boolean {
        const str = password + this.username + this.phonenumber;
        if (bcryptjs.compareSync(str, this.password)) return true;
        return false;
    }
    x.beforeCreate(async (user, options) => {
        if (user.changed('password')) {
            if (user.password && user.username && user.phonenumber) {
                const str = user.password + user.username + user.phonenumber;
                return bcryptjs.hash(str, bcryptjs.genSaltSync())
                    .then(hash => {
                        user.password = hash;
                    })
                    .catch(Error => {
                        throw new Error(Error);
                    });
            }
        }
    });

    x.beforeUpdate(async (user, option) => {
        if (user.changed('password')) {
            if (user.password && user.username && user.phonenumber) {
                const str = user.password + user.username + user.phonenumber;
                return bcryptjs.hash(str, bcryptjs.genSaltSync())
                    .then(hash => {
                        user.password = hash;
                    })
                    .catch(err => {
                        throw new Error(err);
                    });
            }
        }
    });
    return x;
};
