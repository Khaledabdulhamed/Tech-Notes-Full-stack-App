const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrybt = require('bcrypt')

const getAllUsers = asyncHandler(async (req, res) => {
        const users = await User.find().select('-password').lean()
        if(!users){
            return res.status(400).json({message: 'No users found'})
        }
        res.json(users)
})

const createNewUser = asyncHandler(async (req, res) => {
        const {username, password, roles } = req.body

        if(!username || !password || !Array.isArray(roles) || !roles.length) {
            return res.status(400).json({message: 'All fields are required'})
        }

        const duplicate = await User.findOne({username}).lean().exec()

        if(duplicate){
            return res.status(409).json({message: 'Duplicate username'})
        }

        const hashedPwd = await bcrybt.hash(password, 10)

        const userObject = {username, "password": hashedPwd, roles}

        const user= await User.create(userObject)

        if(user){
            res.status(201).json({message: `New user ${username} created`})
        }else{
            res.status(400).json({message: 'invalid user data recieved'})
        }
})

const updateUser = asyncHandler(async (req, res) => {

})
const deleteUser = asyncHandler(async (req, res) => {

})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}