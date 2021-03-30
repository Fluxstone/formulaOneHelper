const mysql = require('mysql');
const util = require('util');
const con = mysql.createConnection({
  host: "116.203.154.145",
  port: "3306",
  user: "root",
  password: "Baum1234,",
  database: "f1db"
});

const query = util.promisify(con.query).bind(con);

function createResponseArray(rows){
  
}

function getRaceIdByYearAndRound(year, round, callback){
  con.connect(function(err) {
    if (err){
      console.log("MySQL connection error: " + err.stack);
      process.exit(1);
    } else {
      var sqlQuery="SELECT raceid FROM races WHERE year=? AND round=?";
    
      con.query(sqlQuery, [year, round],function (err, rows, fields) {
        // close connection first
        con.end();
        //Create Response Array

        // done: call callback with results
        callback(err, rows);
      });
    }
  });
}

async function getRaceWinnersByRaceId(raceid){
  var sqlQuery = "SELECT * FROM results WHERE raceid=1034 order by -position desc limit 3;";
  const rows = await query(sqlQuery);
  return rows;
}
async function func(){
  var test = await getRaceWinnersByRaceId(3232);
  console.log(test);
}

func();