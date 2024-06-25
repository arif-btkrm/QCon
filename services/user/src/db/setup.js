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

    // Creating Table
    const TableName1 = 'role'
    const CreateTableQuery1 = `CREATE TABLE IF NOT EXISTS ${TableName1}(id SERIAL PRIMARY KEY, role_name VARCHAR(20))`
    await tb_client.query(`${CreateTableQuery1}`);
    console.log(`created table ${TableName1}`);
       
    // Creating Table
    const TableName2 = 'users'
    const CreateTableQuery2 = `CREATE TABLE IF NOT EXISTS ${TableName2}(id SERIAL PRIMARY KEY, Name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL,  role_id int REFERENCES role (id) DEFAULT 4)`
    await pool.query(`${CreateTableQuery2}`);
    console.log(`created table ${TableName2}`);

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
    const TableName1 = 'role'
    const SelectQuery1 = `SELECT * FROM ${TableName1} `
    const data1 = await tb_client.query(`${SelectQuery1}`);
    console.log(`Data From table ${TableName1} : ${data1}`);

    if(data1.rowCount == 0){
        const InsertQuery1 = `INSERT INTO ${TableName1}(role_name) VALUES ('SuperAdmin'),('Admin'),('Teacher'),('Student')`
        await tb_client.query(`${InsertQuery1}`);
        console.log(`Seeded table ${TableName1}.`);
    }
    else{
        console.log(`Already Seeded table ${TableName1}.`);
    }

    // Seeding Table 2
    const TableName2 = 'users'
    const SelectQuery2 = `SELECT * FROM ${TableName2} `
    const data2 = await tb_client.query(`${SelectQuery2}`);
    console.log(`Data From table ${TableName2} : ${data2}`);

    if(data2.rowCount == 0){
        const InsertQuery2 = `INSERT INTO ${TableName2}(Name, email, password, role_id) VALUES ('Mr. SuperAdmin','superadmin@qcon.com','superadmin',1),('Mr. Admin','admin@qcon.com','admin',2),('Mr. Teacher 1','teacher1@qcon.com','teacher1',3),('Mr. Teacher 2','teacher2@qcon.com','teacher2',3),('Mr. Student 1','student1@qcon.com','student1',4),('Mr. Student 2','student2@qcon.com','student2',4),('Mr. Student 3','student3@qcon.com','student3',4),('Mr. Student 4','student4@qcon.com','student4',4),('Mr. Student 5','student5@qcon.com','student5',4),('Mr. Student 6','student6@qcon.com','student6',4),('Mr. Student 7','student7@qcon.com','student7',4),('Mr. Student 8','student8@qcon.com','student8',4),('Mr. Student 9','student9@qcon.com','student9',4),('Mr. Student 10','student10@qcon.com','student10',4)`
        await tb_client.query(`${InsertQuery2}`);
        console.log(`Seeded table ${TableName2}.`);
    }
    else{
        console.log(`Already Seeded table ${TableName2}.`);
    }
    await tb_client.end();
}

const setupDatabase = async ()=>{
    
    await createDatabase()
    await createTable()
    await seedTable()

}


module.exports = {setupDatabase};