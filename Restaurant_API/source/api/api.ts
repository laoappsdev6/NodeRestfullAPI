import { Request, Response, Application, NextFunction } from 'express';
import express from 'express';
import { UserConroller } from '../controllers/user.controller';
import { AuthorizeController } from '../controllers/authorize.controller';
import { CategoryController } from '../controllers/category.controller';

const app: Application = express();

//<=== Login ===>
app.post('/login', AuthorizeController.logIn);

//<=== User ===>
app.post('/addUser', UserConroller.addUser);
// app.post('/addUser', AuthorizeController.checkAuthorize, UserConroller.addUser);
app.post('/activeUser', AuthorizeController.checkAuthorize, UserConroller.activeUser);
app.post('/updateUser', AuthorizeController.checkAuthorize, UserConroller.updateUser);
app.post('/changePassword', AuthorizeController.checkAuthorize, UserConroller.changePassword);
app.post('/resetPassword', AuthorizeController.checkAuthorize, UserConroller.resetPassword);
app.post('/deleteUser', AuthorizeController.checkAuthorize, UserConroller.deleteUser);
app.post('/userListAll', AuthorizeController.checkAuthorize, UserConroller.userListAll);
app.post('/userListPage', AuthorizeController.checkAuthorize, UserConroller.userListPage);
app.post('/getUser', AuthorizeController.checkAuthorize, UserConroller.getUser);
app.post('/userListBetweenDate', AuthorizeController.checkAuthorize, UserConroller.userListBetweenDate);

//<=== Category ===>
app.post('/addCategory', AuthorizeController.checkAuthorize, AuthorizeController.checkUUID, CategoryController.addCategory)
app.post('/activeCategory', AuthorizeController.checkAuthorize, AuthorizeController.checkUUID, CategoryController.activeCategory)
app.post('/updateCategory', AuthorizeController.checkAuthorize, AuthorizeController.checkUUID, CategoryController.updateCategory)
app.post('/deleteCategory', AuthorizeController.checkAuthorize, AuthorizeController.checkUUID, CategoryController.deleteCategory)
app.post('/categoryListAll', AuthorizeController.checkAuthorize, AuthorizeController.checkUUID, CategoryController.categoryListAll)
app.post('/getCategory', AuthorizeController.checkAuthorize, AuthorizeController.checkUUID, CategoryController.getCategory)
app.post('/categoryListPage', AuthorizeController.checkAuthorize, AuthorizeController.checkUUID, CategoryController.categoryListPage)

export = app;

