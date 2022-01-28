const Express = require("express");
var request = require("request");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
var mysql = require('mysql');
const ObjectId = require("mongodb").ObjectID;
const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const CONNECTION_URL = uri;
const DATABASE_NAME = "ais_student_master";

var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var database, collection;
var masterModel = require("./masterModel");

    //mongoDB connection
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("student_master");
        console.log("Connected to MongoDB server");
    });

//mysql connection
var options = {
    host: 'localhost',
    user: 'root',
    password: 'Neelabja@123',
    database: 'ais_student_master',
    insecureAuth: true,
  };

var connection = mysql.createConnection(options);

connection.connect(function (error) {
    if (error) {
      console.log('Error in connection');
      console.log(error);
    }
    else{
        console.log("connected to mysql server");
    }
  });
//----------------------------------------------------------------------------------------------------------------------------------------------

app.post("/testAPI/", (request, response) => {

    var ID = request.body.ID;
    collection.find({"studentID":ID},{projection:{"firstName":1,"middleName":1,"lastName":1,"contactNo":1,"_id":0}}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }

    masterModel.get_details(connection, request.body.ID, function (err, result1) {
        //console.log(result);
        for (const key in result1) {
            var rank = (result1[key].rank);
            var formatted = {
                English : result1[key].English,
                Bengali : result1[key].Bengali,
                Maths : result1[key].Maths,
                History : result1[key].History,
                Geography : result1[key].Geography,
                Life_Science : result1[key].LifeScience,
                Physical_Science : result1[key].PhysicalScience,
                Total : result1[key].Total
            }
        }
        if (err) {
          console.log(err);
        }
        else {
            var TotalData = {
                Rank: rank,
                Student_Details : result,
                Academic_Results : result1,    
            }
            var responseData = {
                status: "success",
                Data: TotalData
            }
            // console.log(result1);
        }
        response.send(responseData);
    });
    // console.log(ID);
    
    });
});



app.listen(5000, () => console.log('Server started on port 5000'));