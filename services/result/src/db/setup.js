const {Client} = require('pg')
const pool = require('./db')
const dotenv  = require('dotenv');
dotenv.config({});

const DB_NAME = process.env.DB_NAME || 'db-name';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PASSWORD = process.env.DB_PASSWORD || 'root';
const DB_PORT = process.env.DB_PORT || 'root';

// const isDev = process.env.NODE_ENV === 'development';

//    if (!isDev) return console.log('in production environment - skipping database creation.');

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
    const TableName1 = 'result'
    const CreateTableQuery1 = `CREATE TABLE IF NOT EXISTS ${TableName1}(id SERIAL PRIMARY KEY NOT NULL, rank int NOT NULL, user_Id int NOT NULL UNIQUE, exam_Id int NOT NULL, submition text not NULL, correct_Ans int NOT NULL, wrong_Ans NOT NULL, masks float NOT NULL, status VARCHAR(20) NOT NULL)`
    await tb_client.query(`${CreateTableQuery1}`);
    console.log(`created table ${TableName1}.`);
       
    await tb_client.end();
}

const setupDatabase = async ()=>{
    
    await createDatabase()
    await createTable()

}


module.exports = {setupDatabase};