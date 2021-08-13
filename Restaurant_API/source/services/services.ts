import * as jwt from 'jsonwebtoken';
// const jwt = require('jsonwebtoken');
// import { CustomerUserModel } from '../entities/Entities/customer.user.entity';
import date from 'date-and-time';
import * as uuid from 'uuid';
import { User, UserModel } from '../models/user.model';
export class Service {

    public static respon(data: any, message: string, status: number) {
        return { status, message, data };
    }
    public static clone(data: any) {
        return JSON.parse(JSON.stringify(data))
    }
    public static copyObject(a: any, b: any) {
        for (const key in a) {
            if (Object.prototype.hasOwnProperty.call(a, key)) {
                b[key] = a[key];
            }
        }
    }
    static createToken(data: UserModel) {
        try {
            return jwt.sign({
                data,
            }, Keys.jwtKey, { expiresIn: '10000000000H' });
        } catch (error) {
            console.log(error);
            return '';
        }
        return '';
    }
    static validateToken(k: string) {
        try {
            const data = jwt.verify(k, Keys.jwtKey) as UserModel;
            console.log(data);
            const token = Service.createToken(data);
            if (token) return token;
            else return '';
        } catch (error) {
            console.log(error);
            return '';
        }
    }
    public static genUUID(): string {
        return uuid.v1();
    }
    public static nDate(): string {
        const dd = new Date();
        return date.format(dd, 'YYYY-MM-DD HH:mm:ss');
    }
}
export const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Vientiane'
});
export const  enum TableName {
    users = 'users',
    category = 'category'
}

//     static validateToken(k: string) {
//         try {
//             const data = jwt.verify(k, Keys.jwtKey) as CustomerUserModel;
//             const token = APIService.createToken(data);
//             if (token) return token;
//             else return '';
//         } catch (error) {
//             console.log(error);
//             return '';
//         }
//     }
//     static checkMySelf(k: string, req: Request) {
//         try {
//             const o = jwt.decode(k);
//             if (o) {
//                 const data = o['data'] as CustomerUserModel;
//                 const user = req.headers['_user'] as unknown as CustomerUserModel;
//                 const id = req.body.id;
//                 if (user.id === data.id && user.id === id && user.id && data.id && id) {
//                     return true;
//                 } else {
//                     return false;
//                 }
//             }
//             return false;
//         } catch (error) {
//             console.log(error);
//         }
//         return false;
//     }
//     static vatlidateSuperAdmin(k: string) {
//         if (k === Keys.superadminkey)
//             return true;
//         else return false;
//     }
//     static clone(data: any) {
//         return JSON.parse(JSON.stringify(data))
//     }

// }
enum Keys {
    jwtKey = 'Dx4YsbptOGuHmL94qdC2YAPqsUFpzJkc',
    superadminkey = '9F58A83B7628211D6E739976A3E3A'
}