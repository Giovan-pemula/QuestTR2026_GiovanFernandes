const Joi = require('joi');
const fs = require('fs');
const userService = require('../services/user.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const createUserSchema = Joi.object({ //bagian validasi banh
  username: Joi.string().min(3).required().messages({
    'string.min': 'Username harus 3 huruf atau lebih',
    'any.required': 'Username wajib',
    'string.empty': 'Username tidak boleh kosong',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email harus valid',
    'any.required': 'Email wajib',
    'string.empty': 'Email tidak boleh kosong',
  }),
  password: Joi.string()
  .min(8)
  .required()
  .messages({
    'string.min': 'password harus 8 huruf/angka atau lebih',
    'any.required': 'Password wajib',
    'string.empty': 'Password tidak boleh kosong'
  }),
});

const loginSchema = Joi.object ({
  username : Joi.string().required(),
  password: Joi.string().required(),
});


// cleanup untuk mislanya kalau user gagal dibikin atau gagal lolos validasinya image mereka ga langsung
//ke folder images
const cleanUp = (req) => {
  if (!req.file) return;

  if (req.file.path && fs.existsSync(req.file.path)) {
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      console.error('gagal to cleanup file:', e);
    }
  }
};

const registerUser = async (req, res) => {
  try {
    // VALIDASI
    await createUserSchema.validateAsync(req.body, { abortEarly: false });

    const { email, username,password } = req.body;
    const profilePhoto = req.file ? req.file.filename : null;

    // cek email
    if (await userService.findUserByEmail(email)) {
      cleanUp(req);
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    // cek username
    if (await userService.findUserByUsername(username)) {
      cleanUp(req);
      return res.status(409).json({ message: 'Username sudah terdaftar' });
    }

    const hashs = await bcrypt.hash(password,10)
    const newUser = await userService.registerUser({
      email,
      username,
      password : hashs,
      profilePhoto,
    });

    return res.status(200).json({
      status: 200,
      msg: 'Berhasil menambahkan user',
      data: newUser,
  });


  } catch (error) {
    // console.error(error); optional cuman bantu buat pahami aja errornya di mana di terminal
    cleanUp(req);

  
    if (error.isJoi) {
      return res.status(400).json({
        errors: error.details.map(d => d.message),
      });
    }

    
    if (error.code === 'P2002') {
      return res.status(409).json({
        message: 'Email atau username sudah terdaftar',
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const loginUser = async(req, res,next) =>{
  try{
    const {username,password} = await loginSchema.validateAsync(
      req.body,
      {abortEarly : false}
    );

    const userName = await userService.findUserByUsername(username);
    if(!userName){
      return res
      .status(401)
      // .console.log(error)
      .json({message: 'Salah Username atau salah password'})
    };

    const passWord = await bcrypt.compare(password, userName.password);
    if(!passWord){
      return res
      .status(401)
      // .console.log(error)
      .json({message: 'Salah username atau salah password'})
    };
    
    const token = jwt.sign(
      {userId: userName.id, username: userName.username},
      process.env.JWT_SECRET,
      {expiresIn: '1d'}
    );

    res.json({
      message: 'login success',
      token,
    });

    return res.json({
      message: 'Login berhasil',
      data: { token },
    });


  }catch(error){
    // console.log(error);
  }


};

const updateUserSchema = Joi.object({
  id: Joi.number()
    .required()
    .messages({
      'any.required': 'ID tidak boleh kosong',
      'number.base': 'ID harus berupa angka',
      'number.empty': 'ID tidak boleh kosong'
    }),
  isActive: Joi.boolean()
    .required()
    .messages({
      'any.required': 'isActive tidak boleh kosong',
      'boolean.base': 'isActive harus berupa  true/false',
      'boolean.empty': 'isActive tidak boleh kosong'
    }),
});

const updateUser = async (req, res) => {
  try {
    
    const { id, isActive } =
      await updateUserSchema.validateAsync(req.body, {
        abortEarly: false,
      });
      
      
    const updated = await userService.updateUser(id, { isActive });
    const user = await userService.findUserById(id);

    if (!updated) {
      return res.status(404).json({
        status: 404,
        msg: 'User gk ada',
        data: null,
      });
    }
    return res.status(200).json({
      status: 200,
      msg: 'Success Update Status',
      data: user,
    });

  } catch (error) {
    // console.log(error);  optional cuman bantu buat pahami aja errornya di mana di terminal
    if (error.isJoi) {
      return res.status(400).json({
      status: 400,
      errors: error.details.map(err => err.message),
  });
}

    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 404,
        msg: 'User tidak ditemukan',
        data: null,
      });
    }
  }
};

const deleteUser = async(req,res) =>{
  const userId = Number(req.params.userId);

  try{
  const User = await userService.findUserById(userId);
    if(!User){
      // console.log('user tidak ditemukan banh');
      return res.status(404)
      .json({message: 'Idnya tidak ada'});
    }
    // data: 
  await userService.deleteUser(userId);

   if (User.profilePhoto) {
      fs.unlink(
        path.join(__dirname, '../../images', User.profilePhoto),
        () => {}
      );
    }

    return res.status(200).json({
      status: 200,
      msg: 'Berhasil delete user',
      data: User,
  });
  }catch(error){
    console.log(error);
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    return res.status(200).json({
      status: 200,
      msg: 'Success',
      data: users,
    });
  } catch (error) {
    //  console.error(error); optional cuman bantu buat pahami aja errornya di mana di terminal
    return res.status(500).json({
      status: 500,
      msg: 'Internal server error',
      data: null,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const user = await userService.findUserById(userId);

    if (!user) {
      return res.status(404).json({
        status: 404,
        msg: 'User gk ada',
        data: null,
      });
    }

    return res.status(200).json({
      status: 200,
      msg: 'Success',
      data: user,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      msg: 'Internal server error',
      data: null,
    });
  }
};

const getusersWithPagination = async (req, res) => {
  try {
    const limit = Number(req.params.limit);
    const page = Number(req.params.page);

    if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
      return res.status(400).json({
        status: 400,
        msg: 'invalid limit atau halaman banh',
        data: null,
      });
    }

    const skip = (page - 1) * limit;

    const [users, totalData] = await Promise.all([
      userService.getuserwithPagination(skip, limit),
      userService.countUsers(),
    ]);

    const max_page = Math.ceil(totalData / limit);

    return res.status(200).json({
      status: 200,
      msg: 'Success',
      data: {
        users,
        max_page,
        totalData,
      },
    });



  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      msg: 'Internal server error',
      data: null,
    });
  }
};

module.exports = {
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  getusersWithPagination,
  loginUser,
  deleteUser,
};
