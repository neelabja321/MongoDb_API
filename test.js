'use strict';
var mysql = require('mysql');
var mongodn = require('mongodb');
var mongoClient = new mongodn.MongoClient();
var conn =mysql.createConnection({
        host:'localhost',
        user: 'root',
        password:'Neelabja@123'
        ,database: 'ais_student_master'
        ,insecureAuth:true
    });

var getBooksByUser=(username,collection)=>{
    
    let query = 'SELECT * FROM userBooks';
    if(username.trim().length!==0)
        query += ` WHERE userID = '${username}'`;
    query+=';';

    let results =conn.query(query,(err,res)=>{
        if(err!==null){
            console.log(err.message);
            throw new Error('MySQL: error getting results from MySQL');//https://stackoverflow.com/questions/4312710/client-does-not-support-authentication-protocol-requested-by-server
        }
        else{
            let userBooks = [];
           
            for(const user of res){
                for(const book of collection){
                   if(user.ISBN===book.ISBN) 
                    userBooks.push({
                       user: user.userID,
                        book: book.title
                    });
                }
            }// end for
            console.dir(userBooks);
            process.exit();
        }
    });
};

var getBooks =(userID) =>{
    mongoClient.connect('mongodb://localhost/e-library',(err,db)=>{
        if (err){
            throw new Error('MongoError: Cannot connect to database');
        }
        db.collection('library').find({}).toArray(
            (err1,collection)=>{
                if(err1)
                    throw new Error('Cannot retrieve data');
                getBooksByUser(userID,collection);
                db.close();
                }
        );
    });
};

getBooks('kaka1');
          