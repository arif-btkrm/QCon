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
    const TableName1 = 'contest'
    const CreateTableQuery1 = `CREATE TABLE IF NOT EXISTS ${TableName1}(id SERIAL PRIMARY KEY NOT NULL, Name VARCHAR(255) NOT NULL, time timestamptz NOT NULL, duration_munite int NOT NULL, total_marks int NOT NULL, pass_marks int NOT NULL, negative_marks float DEFAULT 0, questions_ids text NOT NULL, class_id int DEFAULT 0, course_id int DEFAULT 0, added_by int NOT NULL)`
    await tb_client.query(`${CreateTableQuery1}`);
    console.log(`created table ${TableName1}.`);
       
    // Creating Table 2
    const TableName2 = 'submit'
    const CreateTableQuery2 = `CREATE TABLE IF NOT EXISTS ${TableName2}(id SERIAL PRIMARY KEY, contest_id int REFERENCES contest(id) NOT NULL, user_id int NOT NULL UNIQUE, submit_time timestamptz NOT NULL, answers text NOT NULL)`
    await pool.query(`${CreateTableQuery2}`);
    console.log(`created table ${TableName2}`);

    await tb_client.end();
}

const setupDatabase = async ()=>{
    
    await createDatabase()
    await createTable()
    // await seedTable()

}


module.exports = {setupDatabase};