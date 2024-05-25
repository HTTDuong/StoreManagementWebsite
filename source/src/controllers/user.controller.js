import {createPassword, getCurrUser, signIn, changePassword} from "../services/user.service.js";
import {permissions} from "#root/configs/permissions.config.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {Account} from "#root/models/index.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'JWT_SECRET';

const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    } else {
        res.redirect('/user/sign-in');
    }
};

export const signInView = (req, res) => {
    return res.render('pages/sign-in', {
        layout: false,
    });
};

export const signInApi = async (req, res) => {
    let {username, password} = req.body;

    if (!username || !password) {
        return res.status(500).json({
            errCode: 1, message: 'Missing inputs parameter!'
        })
    }

    let userData = await signIn(username, password);
    let userSend = userData.user;

    if (userData.errCode === 3) {
        return res.render('pages/password-create', {
            userSend,
            layout: false,
        });
    }
    else {
        res.cookie('account', username, {httpOnly: true}, {signed: true});

        req.session.isAuth = true;

        if (userSend?.permissions.includes(permissions.SALESPERSON)) {
            return res.redirect('/transaction/current');
        }
        return res.redirect('/report');
    }
};

export const activationAccountApi = async (req, res) => {
    try {
        const decode = await jwt.verify(req?.params?.code, JWT_SECRET);
        const account = await Account.findById(decode?.data?.id);
        res.cookie('account', account.username, {httpOnly: true}, {signed: true});

        if (account?.permissions?.includes(permissions.SALESPERSON)) {
            return res.redirect('/transaction/current');
        }
        return res.redirect('/report');
    }
    catch (err) {
        return res.json({success: false, message: err.message});
    }
};

export const signOutView = (req, res) => {
    res.cookie('account', '', {httpOnly: true}, {signed: true});

    return res.redirect('/user/sign-in');
};

export const createPasswordView = async (req, res) => {
    const account = await Account.findOne({ username: req?.cookies?.account});
    if (account.isActive) return res.render('pages/report', {layout: false});

    return res.render('pages/password-create', {
        layout: false,
        isAdmin: req?.cookies?.account === 'admin',
    });
}

export const createPasswordApi = async (req, res) => {
    let {newPassword, confirmpass} = req.body;

    if (!newPassword || !confirmpass) {
        return res.status(500).json({
            errCode: 1, message: 'Missing inputs parameter!'
        })
    }

    if (newPassword !== confirmpass) {
        return res.status(500).json({
            errCode: 1, message: 'Password not match!'
        })
    }

    let updatedUserData = await createPassword(req.body);

    res.cookie('account', '', {httpOnly: true}, {signed: true});

    return res.redirect('/user/sign-in');
}

export const getCurrentAccountView = async (req, res) => {
    const username = req.cookies['account'];

    // const id = req.params.id;
    const account = await getCurrUser({username});

    return res.render('pages/profile', {
        account,
        isAdmin: req?.cookies?.account === 'admin',
    });
}

export const updateCurrentAccountApi = (req, res) => {
    return res.json({success: true});
}

export const changePasswordView = async (req, res) => {
    return res.render('pages/password-change', {
        isAdmin: req?.cookies?.account === 'admin',
    });
}

export const changePasswordApi = async (req, res) => {
    const account = await getCurrUser({username});
    const check = await changePassword(account.username, account.password, req.body.newPassword);
    if(check)
    {
        return res.redirect('/user');
    }
    return res.render('pages/password-change', {
        isAdmin: req?.cookies?.account === 'admin',
    });
}