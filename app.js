const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const CONNECTION_URL = uri;
const DATABASE_NAME = "ais_student_master";

var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var database, collection;

app.listen(5000, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("student_master");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});

//----------------------------------------------------------------------------------------------------------------------------------------------

app.post("/testAPI/", (request, response) => {

    var ID = request.body.ID;
    collection.find({"studentID":ID},{projection:{"firstName":1,"middleName":1,"lastName":1,"contactNo":1,"_id":0}}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }

    var responseData = {
        status:"success",
        data:result,
    }
    // console.log(ID);
    response.send(responseData);
    });
});

