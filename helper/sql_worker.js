const mysql = require('sync-mysql');
const con = new mysql({
  host: "116.203.154.145",
  port: "3306",
  user: "root",
  password: "Baum1234,",
  database: "f1db"
});


function getRaceIdByYearAndRound(year, round){}

function getRaceWinnersByRaceId(raceid){
  var sqlQuery = 
  `select results.driverId, drivers.surname, drivers.forename 
  from results 
  inner join drivers ON results.driverId = drivers.driverid AND results.raceid=${raceid}
  order by -position desc limit 3;`;
  const result = con.query(sqlQuery);
  return result;
}

function getDriverNameFromId(driverId){
  var sqlQuery = `SELECT * FROM drivers WHERE driverid=${driverId}`;
  const result = con.query();
  return result;
}

function getConstructorNameFromId(constructorId){}

