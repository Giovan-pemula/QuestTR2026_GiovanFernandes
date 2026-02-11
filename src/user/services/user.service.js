// const { parse } = require('path');
const userRepository = require('../repository/user.repository');

const findUserByEmail = async (email) =>
  userRepository.findUserByEmail(email);

const findUserByUsername = async (username) =>
  userRepository.findUserByUsername(username);

const registerUser = async (data) =>
  userRepository.registerUser(data);

const getAllUsers = async () => {
  return await userRepository.getAllUsers();
};

const findUserById = async (id) => userRepository.findUserById(id);

const updateUser = async (id, data) => {
  return await userRepository.updateUser(id, data);
}
const getuserwithPagination = async (skip, take) => {
  return await userRepository.getuserwithPagination(skip, take);
}
const countUsers = async () => {
  return await userRepository.countUsers();
}

const deleteUser = async (id)=>{
  return await userRepository.deleteUser(id);
}


module.exports = {
  findUserByEmail,
  findUserByUsername, 
  registerUser,
  getAllUsers,
  findUserById,
  updateUser,
  getuserwithPagination,
  countUsers,
  deleteUser,
};