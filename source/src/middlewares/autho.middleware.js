import {Account} from "#root/models/index.js";
import bcrypt from "bcryptjs";

const checkLogin = async (req, res, next) => {
  if (!req?.cookies?.account) {
    return res.render('pages/sign-in', {layout: false});
  }

  const account = await Account.findOne({ username: req?.cookies?.account});
  if (!account) return res.render('pages/sign-in', {layout: false});

  if (await bcrypt.compareSync(account.username, account.password)) return res.redirect('/user/password-create');

  return next();
}

const checkActive = async (req, res, next) => {
  if (!req?.cookies?.account) {
    return res.render('pages/sign-in', {layout: false});
  }

  const account = await Account.findOne({ username: req?.cookies?.account});
  if (!account) return res.render('pages/sign-in', {layout: false});

  if (await bcrypt.compareSync(account.username, account.password)) return res.redirect('/user/password-create');

  return next();
}

export const checkAdmin = async (req, res, next) => {
  if (!(req?.cookies?.account === 'admin')) {
    return res.redirect('/report');
  }

  return next();
}