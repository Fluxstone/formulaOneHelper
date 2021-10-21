const mysql = require('sync-mysql');
require('dotenv').config()

class Sql_Worker {
  constructor() {
    this._connectToDB();
  }

  _connectToDB() {
    const con = new mysql({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });
    this.con = con;
  }

  //SQL-Calls about QUALIFYING
  getQualifyingTopThreeByDate(year, round) {
    var sqlQuery =
      `select qualifying.driverId, drivers.forename, drivers.surname, qualifying.q1, qualifying.q2, qualifying.q3
      from drivers
      inner join qualifying on qualifying.driverId = drivers.driverId
      inner join races on qualifying.raceId = races.raceId
      and races.year=${year} and races.round=${round}
      order by -position desc limit 3;`;
    const result = this.con.query(sqlQuery);
    return result;
  }

  getQualifyingTableByDate(year, round) {
    var sqlQuery =
      `select qualifying.driverId, drivers.forename, drivers.surname, qualifying.q1, qualifying.q2, qualifying.q3
      from drivers
      inner join qualifying on qualifying.driverId = drivers.driverId
      inner join races on qualifying.raceId = races.raceId
      and races.year=${year} and races.round=${round};`;
    const result = this.con.query(sqlQuery);
    return result;
  }

  //SQL-Calls about RACEDAY
  getRaceTopThreeByRaceId(raceid) {
    var sqlQuery =
      `select results.driverId, results.position, drivers.surname, drivers.forename  
      from results 
      inner join drivers ON results.driverId = drivers.driverid AND results.raceid=${raceid}
      order by -position desc limit 3;`;
    const result = this.con.query(sqlQuery);
    return result;
  }

  getRaceTableByRaceId(raceid) {
    var sqlQuery =
      `select results.driverId, drivers.surname, drivers.forename 
      from results 
      inner join drivers ON results.driverId = drivers.driverid AND results.raceid=${raceid}
      order by -position desc;`;
    const result = this.con.query(sqlQuery);
    return result;
  }

  getRacePlacementByDate(year, round, placement) {
    var raceId = this.getRaceIdByYearAndRound(year, round);
    var arr_raceStandings = this.getRaceTableByRaceId(raceId[0].raceid);
    var result = arr_raceStandings[placement - 1];
    return result;
  }

  //SQL-Calls about Driver Standings
  getDriverStandingsTableByYear(year) {
    var raceId = this.getRaceIdByYear(year);
    raceId = raceId[0].raceId;

    var sqlQuery =
      `select drivers.driverId, drivers.forename, drivers.surname, driverStandings.driverId, driverStandings.points,  driverStandings.position, races.raceId
      from driverStandings
      inner join drivers on drivers.driverId = driverStandings.driverId
      inner join races on races.raceId = driverStandings.raceId
      and races.raceId=${raceId}
      order by -position desc`;
    const result = this.con.query(sqlQuery);
    return result;
  }

  getDriverStandingsLeadersByYear(year) {
    var raceId = this.getRaceIdByYear(year);
    raceId = raceId[0].raceId;

    var sqlQuery =
      `select drivers.driverId, drivers.forename, drivers.surname, driverStandings.driverId, driverStandings.points,  driverStandings.position, races.raceId
      from driverStandings
      inner join drivers on drivers.driverId = driverStandings.driverId
      inner join races on races.raceId = driverStandings.raceId
      and races.raceId=${raceId} 
      order by -position desc limit 3;`;
    const result = this.con.query(sqlQuery);
    return result;
  }

  getDriverStandingsPlacementByYear(year, placement) {
    var raceId = this.getRaceIdByYear(year);
    raceId = raceId[0].raceId;

    var sqlQuery =
      `select drivers.driverId, drivers.forename, drivers.surname, driverStandings.driverId, driverStandings.points,  driverStandings.position, races.raceId
      from driverStandings
      inner join drivers on drivers.driverId = driverStandings.driverId
      inner join races on races.raceId = driverStandings.raceId
      and races.raceId=${raceId}  and position = ${placement} 
      order by -position desc;`;
    const result = this.con.query(sqlQuery);
    return result;
  }

  //SQL-Calls about Constructor Standings
  getConstructorsTableByYear(year) {
    var raceId = this.getRaceIdByYear(year);
    raceId = raceId[0].raceId;

    var sqlQuery =
      `select constructors.constructorId, constructors.name, constructorStandings.constructorId, constructorStandings.points,  constructorStandings.position, races.raceId
      from constructorStandings
      inner join constructors on constructors.constructorId = constructorStandings.constructorId
      inner join races on races.raceId = constructorStandings.raceId
      and races.raceId=${raceId}
      order by -position desc;`;
    const result = this.con.query(sqlQuery);
    return result;
  }

  getConstructorsLeadersByYear(year) {
    var sqlQuery =
      `select constructors.constructorId, constructors.name, constructorStandings.constructorId, constructorStandings.points,  constructorStandings.position, races.raceId
      from constructorStandings
      inner join constructors on constructors.constructorId = constructorStandings.constructorId
      inner join races on races.raceId = constructorStandings.raceId
      and races.raceId=${year}
      order by -position desc limit 3;`;
    const result = this.con.query(sqlQuery);
    return result;
  }

  getConstructorsPlacementByYear(year, placement) {
    var raceId = this.getRaceIdByYear(year);
    raceId = raceId[0].raceId;

    var sqlQuery =
      `select constructors.constructorId, constructors.name, constructorStandings.constructorId, constructorStandings.points,  constructorStandings.position, races.raceId
      from constructorStandings
      inner join constructors on constructors.constructorId = constructorStandings.constructorId
      inner join races on races.raceId = constructorStandings.raceId
      and races.raceId=${raceId} and position = ${placement}
      order by -position desc;`;

    const result = this.con.query(sqlQuery);
    return result;
  }

  //SQL-Calls about ID's
  getRaceIdByYearAndRound(year, round) {
    var sqlQuery =
      `SELECT raceid FROM races WHERE year=${year} AND round=${round}`;
    const result = this.con.query(sqlQuery);
    return result;
  }

  //Will fetch latest race in that year
  getRaceIdByYear(year) {
    var sqlQuery =
      `select raceId
      from races
      where year = ${year} and date < CURDATE()
      order by -round asc limit 1;`;
    const result = this.con.query(sqlQuery);
    return result;
  }

  getDriverNameFromId(driverId) {
    var sqlQuery = `SELECT * FROM drivers WHERE driverid=${driverId}`;
    const result = this.con.query(sqlQuery);
    return result;
  }
}

var helper = new Sql_Worker();
//console.log(helper.getRaceIdByYearAndRound(2021,10));
module.exports = {
  Sql_Worker
};