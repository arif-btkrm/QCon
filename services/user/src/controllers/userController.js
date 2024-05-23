const pool = require('./../db/db')
const axios = require('axios')

const { AUTH_SERVICE } = require('./../config');

const signupController = async (req,res)=>{
    const {name, email,password} = req.body
    console.log(req.body);
    
    try{
        await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email,password] )
        res.status(201).send( {message: ` User signUp Successful`})

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

const signinController = async (req,res)=>{
    
    try{
        await axios.post(`${AUTH_SERVICE}/auth/login`, req.body)
          .then(function (response) {
            res.status(response.status).send(response.data);
          })
          .catch(function (error) {
            console.log(error);
            res.status(error.response.status).send(error.response.data);

          });
    }catch(err){
         console.log(err)
        res.sendStatus(500)
    }   
};

const userProfileController = async (req,res)=>{
    const id  = req.headers['x-user-id']
    console.log(`Id From req.headers ${id}`)
    try{
        const data = await pool.query(`SELECT users.name,users.email,role.rolename FROM users INNER JOIN role ON role.id = users.role WHERE users.id= '${id}' LIMIT 1`)
        res.status(200).send(data.rows[0])

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

const userByIdController = async (req,res)=>{
    const { id } = req.params
    // console.log(id)
    try{
        let data = await pool.query(`SELECT users.id,users.name,users.email,role.rolename FROM users INNER JOIN role ON role.id = users.roleId WHERE users.id= '${id}' LIMIT 1`)
        data = data.rows[0]
        res.status(200).json(data)

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

// Todo
const addUserController = async (_req,res)=>{
    try{
        // ToDo Add  Admin, teacher by SuperAdmin
        res.status(201).send( {message: ` ${process.env.SERVICE_NAME} Add User`})

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

module.exports = {signupController,signinController,userProfileController,addUserController,userByIdController};