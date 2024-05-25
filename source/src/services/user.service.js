import bcrypt from 'bcryptjs';
import {Account} from "#root/models/index.js";

export const signIn = (username, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let user = await Account.findOne({
                username: username
            });
            //user already exist
            if (user) {
                if(user.isActive){
                    // compare password
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        userData.user = user;
                    } else {
                        userData.errCode = 4;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 3;
                    userData.errMessage = 'User have not been active';
                    userData.user = user;
                }
            } else {
                userData.errCode = 2;
                userData.errMessage = `User not found`
            }
            resolve(userData)
        } catch (error) {
            reject(error)
        }
    })
};

export const signInWithToken = (body) => {

};

export const changePassword = async (username, oldPassword, newPassword) => {
    try {
        const user = await Employee.findOne({ username });

        if (!user) {
            return res.json({ success: false});
          }

        const check = await bcrypt.compareSync(oldPassword, user.password);

        if (!check) {
            return res.json({ success: false});
          }
        
          const hashedNewPassword = await bcrypt.hash(newPassword, 4);
          user.password = hashedNewPassword;
          await user.save();

          return res.json({ success: true});
    } catch (error) {
        return res.json({ success: false});
    }
};

export const getCurrUser = async (conditions) => {
    const account = await Employee.findOne(conditions);
    return account;
};

export const updateAvatar = () => {

};

export const createPassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try{
            let userData = {};
            userData = await Account.findOneAndUpdate(
                { username: data.username },
                {
                    $set: {
                        isActive: true,
                        password: await bcrypt.hash(data.newPassword, 4)
                    }
                }
            );
            userData.errCode = 0;
            userData.errMessage = 'OK';
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
};

export const updateProfile = () => {

};