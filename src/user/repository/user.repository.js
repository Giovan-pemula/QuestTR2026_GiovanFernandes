const { number } = require('joi');
const db = require('../../helpers/db');

const findUserByEmail = async (email) => {
  return db.user.findUnique({
    where: { email },
  });
};

const findUserByUsername = async (username) => {
  return db.user.findUnique({
    where: { username },
  });
};

const registerUser = async (data) => {
  return db.user.create({
    data,
  });
}

const getAllUsers = async () =>{
  return db.user.findMany();
};

const findUserById = async (id) => {
  return db.user.findUnique({
    where: { id: Number(id) },
  });
}

const updateUser = async (id, data) => {
  return db.user.update({
    where: { id: Number(id) },
    data,
  });
}

const getuserwithPagination = async (skip, take) => {
  
  return db.user.findMany({
    skip,
    take,
    
  });
  
}


const countUsers = async () => { 
  return db.user.count();
}

const deleteUser = async(id)=>{
  return await db.user.delete({
    where:{ id: Number(id)}
  })
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
  deleteUser
};

