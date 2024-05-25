import {getAccount, getAccounts, sendEmail, sendEmailActive} from "#root/services/account.service.js";
import {model as Account} from "#root/models/account.model.js";
import bcrypt from "bcryptjs";

export const getListAccountView = async (req, res) => {
  const employees = await getAccounts();
  return res.render('pages/employee-list', {
    employees,
    isAdmin: req?.cookies?.account === 'admin',
  });
};

export const createAccountApi = async (req, res) => {
  try {
    const { avatar, fullName, username, email } = req.body;

    const hashedPassword = await bcrypt.hash(username, 4);

    const account = new Account({
      avatar,
      fullName,
      username,
      password: hashedPassword,
      email,
    });

    await account.save();

    await sendEmailActive(account);
    return res.json({ success: true, message: 'Account created successfully'});
  } catch (err) {
    return res.json({ success: false, message: 'Internal server error' });
  }
};

export const updateAccountApi = async (req, res) => {
  try {
    await Account.findByIdAndUpdate(req?.params?.id, req.body);

    return res.redirect('/account');
  } catch (err) {
    return res.redirect(`/account/${req?.params?.id}`);
  }
};

export const getAccountFormView = async (req, res) => {
  if (req.params.id === 'new') {
    return res.render('pages/employee-form', {
      account: {},
      buttonText: 'Thêm',
      formAction: '/account',
      isAdmin: req?.cookies?.account === 'admin',
    });
  }

  const id = req.params.id;
  const account = await getAccount(id);

  return res.render('pages/employee-form', {
    account,
    buttonText: 'Sửa',
    formAction: `/account/${req.params.id}?_method=PUT`,
    isAdmin: req?.cookies?.account === 'admin',
  });
};

export const updateAccountLockApi = async (req, res) => {
  const id = req.params.id;
  try {
    const account = await getAccount(id);

    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found!'});
    }

    account.isLocked = req?.body?.isLock;
    await account.save();

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
}

export const sendActivationAccountEmailApi = async (req, res) => {
  try {
    const account = await getAccount(req?.params?.id);
    await sendEmailActive(account);
    return res.json({ success: true, message: 'Activation email sent successfully' });
  }
  catch (err) {
    return res.json({ success: false, message: 'Error sending activation email' });
  }
};