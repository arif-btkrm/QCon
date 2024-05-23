const pool = require('../db/db')
const jwt = require ('jsonwebtoken')
const axios = require('axios')

const { USER_SERVICE } = require('./../config');
const { json } = require('express');

const signinController = async (req,res)=>{
    const {email,password} = req.body
    // console.log(email)
    try{
        const data = await pool.query(`SELECT users.id,users.name,users.email,role.rolename FROM users INNER JOIN role ON role.id = users.role WHERE email= '${email}' AND password = '${password}' LIMIT 1`)
        // console.log(`Dataaaaa ${data.rowCount}`)
        if (data.rowCount == 0) {
            return	res.status(400).send({ message: 'Invalid credentials' });
		}
        const userData = data.rows[0]
        const accessToken = jwt.sign(
			userData,
			process.env.JWT_KEY ?? 'myKey',
			{ expiresIn: '2h' }
		);
      return  res.status(200).send({accessToken : `${accessToken}`})

    }catch(err){
        // console.log(`SigninController Error : ${err}`)
        res.sendStatus(500)
    }   
};

const verifyToken = async (req,res)=>{
    
    const token = req.body.accessToken;
    let decoded; 

    try{
      decoded = jwt.verify(token, process.env.JWT_KEY);
    }
    catch(err){
        console.log(err)
        return res.status(401).json({ message: 'Invalid Token' });
    }

    console.log(decoded)
    const {id, name, email, rolename} = decoded

    try{
        let user =  await axios.get(`${USER_SERVICE}/users/${id}`)
        user = user.data
        if (!user) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		return res.status(200).json({ message: 'Authorized', user });

    }catch(err){
        console.log("Error From Auth Controller")
        console.log(err)
        return res.sendStatus(500)
    }
          
   
};

module.exports = {signinController,verifyToken};