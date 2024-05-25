import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import dotenv from "dotenv";
import methodOverride from 'method-override';
import cors from 'cors';
import bcrypt from "bcryptjs";

import '#root/databases/mongoose.database.js';
import { router } from '#root/routes/index.js';
import {Account, Customer, Product, Transaction} from "#root/models/index.js";
import {activationAccountApi, signInApi, signInView, signOutView} from "#root/controllers/user.controller.js";
import {stringUtil} from "#root/utils/string.util.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
export const ROOT_PATH = path.dirname(process.argv[1]);
const VIEWS_PATH = path.join(ROOT_PATH, 'views');
const SESSION_SECRET = process.env.PORT || 'abcxyz';

const app = express();

app.use(cors());
app.use(express.static(path.join(ROOT_PATH, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(expressLayouts)
app.use(cookieParser());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true
  },
}));

app.set('views', VIEWS_PATH);
app.set('layout',`${VIEWS_PATH}/layouts/main.layout.ejs`)
app.set('view engine', 'ejs');

app.get('/user/activation/:code', activationAccountApi);
app.get('/user/sign-in', signInView);
app.post('/user/sign-in', signInApi);
app.get('/user/sign-out', signOutView);

// authorization
app.use(async (req, res, next) => {
  if (!req?.cookies?.account) {
    return res.render('pages/sign-in', {layout: false});
  }

  const account = await Account.findOne({ username: req?.cookies?.account});
  if (!account) return res.render('pages/sign-in', {layout: false});
  if (account?.isLocked) {
    res.cookie('account', '', {httpOnly: true}, {signed: true});
    return res.render('pages/locked.notify.ejs', {layout: false})
  }

  if (await bcrypt.compareSync(account.username, account.password)) return res.redirect('/user/password-create');

  return next();
});

app.use(router);

// handle 404
app.use((req, res, next) => {
  return res.redirect('/report');
});

// handle error res
app.use((error, req, res, next) => {

});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});