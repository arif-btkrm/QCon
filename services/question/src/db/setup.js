const {Client} = require('pg')
const pool = require('./db')
const dotenv  = require('dotenv');
dotenv.config({});

const DB_NAME = process.env.DB_NAME || 'db-name';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PASSWORD = process.env.DB_PASSWORD || 'root';
const DB_PORT = process.env.DB_PORT || 'root';

const createDatabase = async ()=> {
    
    const db_client = new Client({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        port: DB_PORT,
    });  
    
     await db_client.connect();
    
    let res = await db_client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${DB_NAME}'`);
    // Creating Database
    if (res.rowCount === 0) {
        console.log(`${DB_NAME} database not found, creating it.`);
        await db_client.query(`CREATE DATABASE "${DB_NAME}";`);
        console.log(`created database ${DB_NAME}.`);
    } else {
        console.log(`${DB_NAME} database already exists.`);
    }
    
     await db_client.end();
}

const createTable = async ()=>{
    const tb_client = new Client({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        port: DB_PORT,
        database : process.env.DB_NAME,
    });
    await tb_client.connect();


    // Creating Table 1
    const TableName1 = 'question'
    const CreateTableQuery1 = `CREATE TABLE IF NOT EXISTS ${TableName1}(id SERIAL PRIMARY KEY NOT NULL, question VARCHAR(255) NOT NULL, option1 VARCHAR(255) NOT NULL, option2 VARCHAR(255) NOT NULL, option3 VARCHAR(255) NOT NULL,option4 VARCHAR(255) NOT NULL, correct_ans int NOT NULL, class_id int, course_id int, added_by int)`
    await tb_client.query(`${CreateTableQuery1}`);
    console.log(`created table ${TableName1}.`);
       
    await tb_client.end();
}

const seedTable = async ()=>{
    const tb_client = new Client({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        port: DB_PORT,
        database : process.env.DB_NAME,
    });
    await tb_client.connect();

    
    // Seeding Table 1
    const TableName1 = 'question'
    const SelectQuery1 = `SELECT * FROM ${TableName1} `
    const data1 = await tb_client.query(`${SelectQuery1}`);
    console.log(`Data From table ${TableName1} :  ${data1}`);

    
    if(data1.rowCount == 0){
        const InsertQuery1 = `INSERT INTO ${TableName1} 
        (question, option1, option2, option3, option4, correct_ans, class_id, course_id, added_by) VALUES 
        ('National Bird of Bangladesh?','Corw','Moyna','Choroi','Doyel',4,10,1,3),
        ('বাংলাদেশের জাতীয় ফুল?','গোলাপ', 'জবা', 'শাপলা', 'জুই',3,10,1,3),
        ('Independent day of Banladesh','14 FEB', '26 MAR', '26 DEC', '14 APR',2,10,1,3),
        ('Which one is liquid','Milk', 'Cotton', 'Rice', 'Chair',1,10,1,3),
        ('2+5=?','25', '52', '10', '7',4,10,1,3),
        ('১ লা বৈশাখ কোন মাসে হয়?','আষাঢ়', 'বৈশাখ', 'ভাদ্র', 'মাঘ',2,10,1,4),
        ('ফলের রাজা-','জাম', 'লিচু', 'কলা', 'আম',4,10,1,4),
        ('The number of Vouel is - ','5', '6', '7', '8',1,10,1,4),
        ('কখন রাত হয়?','সকালে', 'রাতে', 'বিকেলে', 'দুপুরে',2,10,1,4),
        ('কোনটি সঠিক উত্তর','ভুল উত্তর', 'জানিনা', 'সঠিক উত্তর', 'কোনটি না',3,10,1,4),
        ('Color of hair is','White', 'Blue', 'Black', 'Red',2,10,1,4),
        ('Prime number is - ','2', '4', '6', '8',1,10,1,4)
        `
        await tb_client.query(`${InsertQuery1}`);
        console.log(`Seeded table ${TableName1}`);
    }
    else{
        console.log(`Already Seeded table ${TableName1}`);
    }

    await tb_client.end();
}

const setupDatabase = async ()=>{
    
    await createDatabase()
    await createTable()
    await seedTable()

}


module.exports = {setupDatabase};