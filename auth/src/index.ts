import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: true,
}));

// routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});
// error handler
app.use(errorHandler);

const start = async () => {
    if(!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is not defined');
    }

    try{
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    } catch(error) {
        console.log({error})
    }
}

app.listen(3000, () => {
    console.log('Listening on port 3000!');
});

start();
