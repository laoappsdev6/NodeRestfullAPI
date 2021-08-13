import { NextFunction, Request, Response } from 'express';
import { Sequelize, Op } from "sequelize";
import { Service } from '../services/services';
import { User, UserModel, ChengePassword, LogIn } from '../models/user.model';
import { UserEntity } from '../models/database.entity';
export class UserConroller {
    public static addUser(req: Request, res: Response) {
        const user = req.body as UserModel;
        if (Object.entries(user).length === 0) {
            res.send(Service.respon([], 'Data is empty!', 0));
        } else {
            UserEntity.findOne({ where: { username: user.username } }).then(result => {
                if (result) {
                    res.send(Service.respon([], `Username: ${user.username} is already exist!`, 0));
                } else {
                    try {
                        user.uuid = Service.genUUID();
                        user.isActive = false;
                        if (!user.parent) {
                            user.parent = user.uuid;
                        }
                        UserEntity.create(user).then(result => {
                            res.send(Service.respon(result, "Add user successfully", 1));
                        }).catch(e => {
                            res.send(Service.respon([], "Add user failed! " + e, 0));
                        })
                    } catch (e) {
                        console.log(e);
                        res.send(Service.respon([], "Error: " + e, 0));
                    }
                }
            }).catch(e => {
                res.send(Service.respon([], "Error: " + e, 0));
            })
        }
    }
    public static activeUser(req: Request, res: Response) {
        if (req.body.id) {
            let id: number = req.body.id;
            UserEntity.findByPk(id).then(async result => {
                if (result) {
                    try {
                        result.isActive = true;
                        await result.save();
                        res.send(Service.respon([], `User id: ${id} active successfully`, 1));
                    } catch (e) {
                        res.send(Service.respon([], "Active user failed! " + e, 0));
                    }
                } else {
                    res.send(Service.respon([], `User id: ${id} is not exist!`, 0));
                }
            }).catch(e => {
                res.send(Service.respon([], "Error: " + e, 0));
            })
        } else {
            res.send(Service.respon([], 'User id is empty!', 0));
        }
    }
    public static updateUser(req: Request, res: Response) {
        const user = req.body as UserModel;
        if (Object.entries(user).length === 0) {
            res.send(Service.respon([], 'Data is empty!', 0));
        } else {
            if (user.id) {
                UserEntity.findByPk(user.id).then(async result => {
                    if (result) {
                        UserEntity.findOne({ where: { username: user.username, id: { [Op.not]: user.id } } }).then(async result2 => {
                            if (result2) {
                                res.send(Service.respon([], `Username: ${user.username} is already exist!`, 0));
                            } else {
                                try {
                                    Service.copyObject(user, result);
                                    await result.save();
                                    res.send(Service.respon(result, `User id: ${user.id} update successfully`, 1));
                                } catch (e) {
                                    res.send(Service.respon([], "Update user failed! " + e, 0));
                                }
                            }
                        }).catch(e => {
                            res.send(Service.respon([], "Error: " + e, 0));
                        })
                    } else {
                        res.send(Service.respon([], `User id: ${user.id} is not exist!`, 0));
                    }
                }).catch(e => {
                    res.send(Service.respon([], "Error: " + e, 0));
                })
            } else {
                res.send(Service.respon([], 'User id is empty!', 0));
            }
        }
    }
    public static changePassword(req: Request, res: Response) {
        const user = req.body as ChengePassword;
        if (Object.entries(user).length === 0) {
            res.send(Service.respon([], 'Data is empty!', 0));
        } else {
            if (user.id) {
                UserEntity.findByPk(user.id).then(async result => {
                    if (result) {
                        if (result.validPassword(user.oldPassword)) {
                            if (user.newPassword.length >= 6) {
                                try {
                                    result.password = user.newPassword;
                                    await result.save();
                                    res.send(Service.respon(result, `User id: ${user.id} change password successfully`, 1));
                                } catch (e) {
                                    res.send(Service.respon([], "Change password failed! : " + e, 0));
                                }
                            } else {
                                res.send(Service.respon([], 'New password mush be then 6 digist!', 0));
                            }
                        } else {
                            res.send(Service.respon([], `Old password: ${user.oldPassword} wrong!`, 0));
                        }
                    } else {
                        res.send(Service.respon([], `User id: ${user.id} is not exist!`, 0));
                    }
                }).catch(e => {
                    res.send(Service.respon([], "Error: " + e, 0));
                })
            } else {
                res.send(Service.respon([], 'User id is empty!', 0));
            }
        }
    }
    public static resetPassword(req: Request, res: Response) {
        if (req.body.id) {
            let id: number = req.body.id;
            UserEntity.findByPk(id).then(async result => {
                if (result) {
                    try {
                        result.password = "123456";
                        await result.save();
                        res.send(Service.respon([], `User id: ${id} reset password to: 123456`, 1));
                    } catch (e) {
                        res.send(Service.respon([], "Reset password failed! " + e, 0));
                    }
                } else {
                    res.send(Service.respon([], `User id: ${id} is not exist!`, 0));
                }
            }).catch(e => {
                res.send(Service.respon([], "Error: " + e, 0));
            })
        } else {
            res.send(Service.respon([], 'User id is empty!', 0));
        }
    }
    public static deleteUser(req: Request, res: Response) {
        if (req.body.id) {
            let id: number = req.body.id;
            UserEntity.findByPk(id).then(async result => {
                if (result) {
                    try {
                        let x = await result.destroy();
                        res.send(Service.respon(x, `User id: ${id} delete successfully`, 1));
                    } catch (e) {
                        res.send(Service.respon([], "Delete user failed!  " + e, 0));
                    }
                } else {
                    res.send(Service.respon([], `User id: ${id} is not exist!`, 0));
                }
            }).catch(e => {
                res.send(Service.respon([], "Error: " + e, 0));
            })
        } else {
            res.send(Service.respon([], 'User id is empty!', 0));
        }
    }
    public static userListAll(req: Request, res: Response) {
        try {
            const keyword: string = req.body.keyword ? String(req.body.keyword) : '';
            UserEntity.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${keyword}%` } },
                        { username: { [Op.like]: `%${keyword}%` } }
                    ]
                }, order: [
                    ['id', 'DESC']
                ]
            }).then(result => {
                if (result[0]) {
                    const data = Service.clone(result);

                    for (let index = 0; index < data.length; index++) {
                        delete data[index]['password'];
                    }
                    res.send(data);
                } else {
                    res.send(Service.respon([], "Sorry, no user info!", 0));
                }
            }).catch(e => {
                res.send(Service.respon([], "Error: " + e, 0));
            })
        } catch (e) {
            res.send(Service.respon([], "Error: " + e, 0));
        }
    }
    public static userListPage(req: Request, res: Response) {
        try {
            const limit = req.body.limit ? Number(req.body.limit) : 5;
            const page = req.body.page ? Number(req.body.page) : 1;
            const offset: number = ((page - 1) * limit);
            const keyword: string = req.body.keyword ? String(req.body.keyword) : '';
            UserEntity.findAndCountAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${keyword}%` } },
                        { username: { [Op.like]: `%${keyword}%` } }
                    ]
                }, order: [
                    ['id', 'desc']
                ], limit: limit, offset: offset
            }).then(result => {
                if (result.rows[0]) {
                    const data = Service.clone(result);

                    for (let index = 0; index < data.rows.length; index++) {
                        delete data.rows[index]['password'];
                    }
                    res.send(data);
                } else {
                    res.send(Service.respon([], "Sorry, no user info!", 0));
                }
            }).catch(e => {
                res.send(Service.respon([], "Error: " + e, 0));
            })
        } catch (e) {
            res.send(Service.respon([], "Error: " + e, 0));
        }
    }
    public static getUser(req: Request, res: Response) {
        if (req.body.id) {
            const id: number = req.body.id;
            try {
                UserEntity.findOne({ where: { id: id } }).then(result => {
                    if (result) {
                        const data = Service.clone(result);
                        delete data.password;
                        res.send(data);
                    } else {
                        res.send(Service.respon([], "Sorry, no useraaa info!", 0));
                    }
                }).catch(e => {
                    res.send(Service.respon([], "Error: " + e, 0));
                })
            } catch (e) {
                res.send(Service.respon([], "Error: " + e, 0));
            }
        } else {
            res.send(Service.respon([], 'User id is empty!', 0));
        }
    }
    public static userListBetweenDate(req: Request, res: Response) {
        try {
            const firstDate: string = req.body.firstDate ? String(req.body.firstDate) : '';
            const lastDate: string = req.body.lastDate ? String(req.body.lastDate) : '';
            UserEntity.findAll({
                where: {
                    // createdAt: { [Op.between]: [firstDate, lastDate] }
                }, order: [
                    ['id', 'DESC']
                ]
            }).then(result => {
                if (result[0]) {
                    const data = Service.clone(result);

                    for (let index = 0; index < data.length; index++) {
                        delete data[index]['password'];
                    }
                    res.send(data);
                } else {
                    res.send(Service.respon([], "Sorry, no user info!", 0));
                }
            }).catch(e => {
                res.send(Service.respon([], "Error: " + e, 0));
            })
        } catch (e) {
            res.send(Service.respon([], "Error: " + e, 0));
        }
    }
}
