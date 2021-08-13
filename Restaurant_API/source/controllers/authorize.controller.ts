import { NextFunction, Request, Response } from 'express';
import { Service } from '../services/services';
import { UserModel, LogIn } from '../models/user.model';
import { UserEntity } from '../models/database.entity';
export class AuthorizeController {
    public static logIn(req: Request, res: Response) {
        if (Object.entries(req.body).length === 0) {
            res.send(Service.respon([], 'Data is empty!', 0));
        } else {
            const user = req.body as LogIn;
            UserEntity.findOne({ where: { username: user.username } }).then(result => {
                if (result) {
                    if (result.validPassword(user.password)) {
                        const user = Service.clone(result);
                        delete user.password;
                        const token = Service.createToken(user as UserModel);
                        res.send(Service.respon({ user, token }, 'Wellcom to restaurant', 1));
                    } else {
                        res.send(Service.respon([], 'Wrong password!', 0))
                    }
                } else {
                    res.send(Service.respon([], `Wrong username!`, 0));
                }
            })
        }
    }
    public static checkAuthorize(req: Request, res: Response, next: NextFunction) {
        const token: string = req.headers['token'] + '';
        if (token !== 'undefined' && token !== '') {
            const newToken = Service.validateToken(token);
            res.setHeader('token', newToken);
            if (newToken) {
                next();
            }
            else {
                res.status(402).send(Service.respon(token, 'Your have no authorize!', 0));
            }
        } else {
            res.status(404).send(Service.respon([], 'You have no token!', 0));
        }
    }
    public static checkUUID(req: Request, res: Response, next: NextFunction) {
        const uuid: string = req.headers['uuid'] + '';
        if (uuid !== 'undefined' && uuid !== '') {
            try {
                UserEntity.findOne({ where: { parent: uuid } }).then(result => {
                    if (result) {
                        next();
                    } else {
                        res.status(400).send(Service.respon([], 'uuid is not availabled!', 0));
                    }
                }).catch(e => {
                    res.status(402).send(Service.respon([], "Error: " + e, 0));
                });
            } catch (e) {
                res.status(402).send(Service.respon([], "Error: " + e, 0));
            }
        } else {
            res.status(404).send(Service.respon([], 'uuid is empty!', 0));
        }
    }
}
