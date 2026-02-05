const express = require('express');
const router = express.Router();
const usercontroller = require('../user/controller/user.controller.js');
const upload = require('../config/multer');

router.post(
  '/add',
  upload.single('profilePhoto'),
  usercontroller.registerUser
);


router.get('/', usercontroller.getAllUsers);
router.get('/:limit/:page', usercontroller.getusersWithPagination);
router.get('/:userId', usercontroller.getUserById);
router.put('/update/active', usercontroller.updateUser);
router.post('/login',usercontroller.loginUser)
router.delete('/:userId', usercontroller.deleteUser);

module.exports = router;


