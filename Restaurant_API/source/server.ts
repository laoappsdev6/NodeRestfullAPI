import { Request, Response, Application } from 'express';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import api from './api/api';

export let app: Application = express();

app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true, parameterLimit: 50000 }));

app.use(cors());
app.use(cookieParser());

// <==  my API ==>
app.use('/Restaurant', api)

app.use((req, res) => {
    const error = new Error('API not found!');
    console.log(error.message)
    res.status(404).json({
        message: error.message,
        status: 0
    });
});

let PORT = 9599;
app.listen(PORT, '0.0.0.0', () => {
    console.log('Server is running on PORT:' + PORT);
});