import { NextFunction, Request, response, Response } from 'express';
import { Sequelize, Op } from "sequelize";
import { Service, TableName } from '../services/services';
import { UserEntity, DBconnection } from '../models/database.entity';
import { CategoryFactory, CategoryModel } from '../models/category.model';
export class CategoryController {
    public static addCategory(req: Request, res: Response) {
        const data = req.body as CategoryModel;
        if (Object.entries(data).length === 0) {
            res.send(Service.respon([], "Data is empty!", 0));
        } else {
            const entity = CategoryFactory(TableName.category + '_' + req.headers['uuid'], DBconnection);
            new Promise<Sequelize>(async () => {
                await entity.sync();
            });

            entity.findOne({ where: { categoryname: data.categoryname } }).then(result => {
                if (result) {
                    res.send(Service.respon(result, `Category name: ${data.categoryname} is already exist!`, 0));
                } else {
                    try {
                        entity.create(data).then(result => {
                            res.send(Service.respon(result, "Add category successfully", 1));
                        }).catch(e => {
                            res.send(Service.respon([], "Add category failed! " + e, 0));
                        })
                    } catch (e) {
                        res.send(Service.respon([], "Error: " + e, 0));
                    }
                }
            }).catch(e => {
                res.send(Service.respon([], "Error: " + e, 0));
            });
        }
    }
    public static activeCategory(req: Request, res: Response) {
        const data = req.body as CategoryModel;
        if (data.id) {
            const entity = CategoryFactory(TableName.category + '_' + req.headers['uuid'], DBconnection);
            new Promise<Sequelize>(async () => {
                await entity.sync();
            });

            entity.findByPk(data.id).then(async result => {
                if (result) {
                    result.isActive = true;
                    await result.save();
                    res.send(Service.respon(result, `Category id: ${data.id} active successfully`, 1));
                } else {
                    res.send(Service.respon([], `Category id: ${data.id} is not exist!`, 0));
                }
            }).catch(e => {
                res.send(Service.respon([], "Error: " + e, 0));
            });
        } else {
            res.send(Service.respon([], "Category id is empty!", 0));
        }
    }
    public static updateCategory(req: Request, res: Response) {
        const data = req.body as CategoryModel;
        if (Object.entries(data).length === 0) {
            res.send(Service.respon([], "Data is empty!", 0));
        } else {
            if (data.id) {
                const entity = CategoryFactory(TableName.category + '_' + req.headers['uuid'], DBconnection);
                new Promise<Sequelize>(async () => {
                    await entity.sync();
                });

                entity.findByPk(data.id).then(async result => {
                    if (result) {
                        entity.findOne({ where: { categoryname: data.categoryname, id: { [Op.not]: data.id } } }).then(async result2 => {
                            if (result2) {
                                res.send(Service.respon([], `Category name: ${data.categoryname} is already exist!`, 0));
                            } else {
                                try {
                                    Service.copyObject(data, result);
                                    await result.save();
                                    res.send(Service.respon(result, `Category id: ${data.id} update successfully`, 1));
                                } catch (e) {
                                    res.send(Service.respon([], `Category id: ${data.id} update failed! ` + e, 0));
                                }
                            }
                        });
                    } else {
                        res.send(Service.respon([], `Category id: ${data.id} is not exist!`, 0));
                    }
                }).catch(e => {
                    res.send(Service.respon([], "Error: " + e, 0));
                });
            } else {
                res.send(Service.respon([], "Category id is empty!", 0));
            }
        }
    }
    public static deleteCategory(req: Request, res: Response) {
        const data = req.body as CategoryModel;
        if (data.id) {
            const entity = CategoryFactory(TableName.category + '_' + req.headers['uuid'], DBconnection);
            new Promise<Sequelize>(async () => {
                await entity.sync();
            });

            entity.findByPk(data.id).then(async result => {
                if (result) {
                    try {
                        let x = await result.destroy();
                        res.send(Service.respon(x, `Categroy id: ${data.id} delete successfully`, 1));
                    } catch (e) {
                        res.send(Service.respon([], `Category id: ${data.id} delete failed!`, 0));
                    }
                } else {
                    res.send(Service.respon([], `Category id: ${data.id} is not exist!`, 0));
                }
            }).catch(e => {
                res.send(Service.respon([], "Error: " + e, 0));
            });
        } else {
            res.send(Service.respon([], "Category id is empty!", 0));
        }
    }
    public static getCategory(req: Request, res: Response) {
        const data = req.body as CategoryModel;
        if (data.id) {
            const entity = CategoryFactory(TableName.category + '_' + req.headers['uuid'], DBconnection);
            new Promise<Sequelize>(async () => {
                await entity.sync();
            })

            try {
                entity.findOne({ where: { id: data.id } }).then(result => {
                    if (result) {
                        res.send(result);
                    } else {
                        res.send(Service.respon([], "No data found!", 0));
                    }
                }).catch(e => {
                    res.send(Service.respon([], "Error: " + e, 0));
                });
            } catch (e) {
                res.send(Service.respon([], "Error: " + e, 0));
            }
        } else {
            res.send(Service.respon([], "Category id is empty!", 0));
        }
    }
    public static categoryListAll(req: Request, res: Response) {
        const entity = CategoryFactory(TableName.category + '_' + req.headers['uuid'], DBconnection);
        new Promise<Sequelize>(async () => {
            await entity.sync();
        });

        try {
            const keyword: string = req.body.keyword ? String(req.body.keyword) : '';
            entity.findAll({
                where: {
                    [Op.or]: [
                        { categoryname: { [Op.like]: `%${keyword}%` } }
                    ]
                }, order: [
                    ['id', 'DESC']
                ]
            }).then(result => {
                if (result[0]) {
                    res.send(result);
                } else {
                    res.send(Service.respon([], "No data found!", 0));
                }
            }).catch(e => {
                res.send(Service.respon([], "Error: " + e, 0));
            });
        } catch (e) {
            res.send(Service.respon([], "Error: " + e, 0));
        }
    }
    public static categoryListPage(req: Request, res: Response) {
        const entity = CategoryFactory(TableName.category + '_' + req.headers['uuid'], DBconnection);
        new Promise<Sequelize>(async () => {
            await entity.sync();
        });

        try {
            const limit = req.body.limit ? Number(req.body.limit) : 5;
            const page = req.body.page ? Number(req.body.page) : 1;
            const offset: number = ((page - 1) * limit);
            const keyword: string = req.body.keyword ? String(req.body.keyword) : '';
            entity.findAndCountAll({
                where: {
                    [Op.or]: [
                        { categoryname: { [Op.like]: `%${keyword}%` } }
                    ]
                }, order: [
                    ['id', 'desc']
                ], limit: limit, offset: offset
            }).then(result => {
                if (result.rows[0]) {
                    res.send(result);
                } else {
                    res.send(Service.respon([], "No data found!", 0));
                }
            }).catch(e => {
                res.send(Service.respon([], "Error: " + e, 0));
            })
        } catch (e) {
            res.send(Service.respon([], "Error: " + e, 0));
        }
    }
}