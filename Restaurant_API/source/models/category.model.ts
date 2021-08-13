import { BuildOptions, DataTypes, DATE, Model, ModelAttributes, Sequelize, UUID, UUIDV1 } from 'sequelize';
import { Service } from '../services/services';
import { BaseModel } from './base.model';

export interface CategoryAttributes extends BaseModel {
    categoryname: string;
    description: string;
}

export interface CategoryModel extends Model<CategoryAttributes>, CategoryAttributes {

}

export type CategoryStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): CategoryModel;
}

export const CategoryFactory = (name: string, sequelize: Sequelize): CategoryStatic => {
    const attributes: ModelAttributes<CategoryModel> = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
            autoIncrementIdentity: true,
            allowNull: false
        },
        categoryname: {
            type: DataTypes.STRING, allowNull: false
        },
        description: {
            type: DataTypes.STRING, allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false
        }
    }
    let x = sequelize.define(name, attributes, { tableName: name, freezeTableName: true, timestamps: true });
    return x;
}