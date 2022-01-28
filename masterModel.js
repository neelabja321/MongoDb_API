var x;
 module.exports = {

    get_details: function(connection,ID, controllerCallback) {    
        var sql = "SELECT English,Bengali,Maths,History,Geography,LifeScience,PhysicalScience,Total,`rank` FROM resultmaster WHERE studentid = '"+ID+"'";
        connection.query(sql, (err, result) => {    
        controllerCallback(err, result);      
        })    
      },

 }

 