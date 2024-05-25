import bcrypt from 'bcryptjs';
import { model as Employee } from '#root/models/account.model.js';
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'JWT_SECRET';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'taikhoanhoctap340@gmail.com',
        pass: 'fksrdkwgovmlgsgz',
    },
});

export const createAccount = async (body) => {
    await (new Employee({
        username: 'nv3',
        fullName: 'nv3',
        isActive: false,
        email: 'nv3@gmail.com',
        password: await bcrypt.hash('123456', 4),
    })).save();
};

export const sendEmailActive = async (account) => {
    const token = await jwt.sign({
        data: {
            id: account._id,
        },
    }, JWT_SECRET, {
        expiresIn: '1m',
    });

    const activationLink = `http://localhost:3000/user/activation/${token}`;

    const mailOptions = {
        from: 'taikhoanhoctap340@gmail.com',
        to: account.email,
        subject: 'Activate Your Account',
        html: `
            <p>Please click the following link to activate your account:</p>
            <p><a href="${activationLink}">${activationLink}</a></p>
        `,
    };

    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

export const sendEmail = async (email, activationLink) => {
    const mailOptions = {
        from: 'taikhoanhoctap340@gmail.com',
        to: email,
        subject: 'Activate Your Account',
        html: `<p>Please click the following link to activate your account:</p><p><a href="${activationLink}">${activationLink}</a></p>`,
    };

    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

export const getAccounts = async () => {
   const accounts = await Employee.find({});
   return accounts;
};

export const getAccount = async (id) => {
    const account = await Employee.findById(id);
    return account;
};

export const updateAccount = () => {

};