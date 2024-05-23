const pool = require('../db/db')
const axios = require('axios')

const { AUTH_SERVICE } = require('../config');

const getClass = async (req,res)=>{
        
    try{
        const TableName = 'class'
        let data = await pool.query(`SELECT * FROM ${TableName}` )
        if(data.rowCount>0){
            data = data.rows
            res.status(200).json(data)
        }
        else{
            res.status(201).send( {message: `No Data Found ` })
        }

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

const addClass = async (req,res)=>{
    const {className} = req.body
    // console.log(className);
    try{
        const TableName = 'class'
        await pool.query(`INSERT INTO ${TableName} (className) VALUES('${className}')` )
        res.status(201).send( {message: ` Add New Class Successful`})
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

const getCourse = async (req,res)=>{
    try{
        const TableName = 'course'
        let data = await pool.query(`SELECT * FROM ${TableName}` )
        if(data.rowCount>0){
            data = data.rows
            res.status(200).json(data)
        }
        else{
            res.status(201).send( {message: `No Data Found ` })
        }

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

const addCourse = async (req,res)=>{
    
    const {courseName,classId} = req.body
    console.log(courseName);
    try{
        const TableName = 'course'
        await pool.query(`INSERT INTO ${TableName} (courseName,classId) VALUES('${courseName}','${classId}')` )
        res.status(201).send( {message: ` Add New Class Successful`})
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

const getClassById = async (req,res)=>{
    const { id } = req.params

    try{
        const TableName = 'class'
        let data = await pool.query(`SELECT id,className FROM ${TableName} WHERE id=${id} LIMIT 1` )
        if(data.rowCount>0){
            data = data.rows[0]
            res.status(200).json(data)
        }
        else{
            res.status(201).send( {message: `No Data Found ` })
        }

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
};

const getCourseById = async (req,res)=>{
    const { id } = req.params

    try{
        const TableName = 'course'
        let data = await pool.query(`SELECT id,courseName,classId FROM ${TableName} WHERE id=${id} LIMIT 1` )
        if(data.rowCount>0){
            data = data.rows[0]
            res.status(200).json(data)
        }
        else{
            res.status(201).send( {message: `No Data Found ` })
        }

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

const getCourseByClassId = async (req,res)=>{
    const { classid } = req.params

    try{
        const TableName = 'course'
        let data = await pool.query(`SELECT id,courseName,classId FROM ${TableName} WHERE classId=${classid}` )
        if(data.rowCount>0){
            data = data.rows
            res.status(200).json(data)
        }
        else{
            res.status(201).send( {message: `No Data Found ` })
        }

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

module.exports = {getClass,addClass,getCourse,addCourse,getClassById,getCourseById,getCourseByClassId};