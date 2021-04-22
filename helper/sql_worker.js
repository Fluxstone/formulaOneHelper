const mysql = require('sync-mysql');
require('dotenv').config()

class sql_worker {
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
      `select results.driverId, drivers.surname, drivers.forename 
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

  getRacePlacementByDate(year, round) {
    var sqlQuery =
      ``;
    const result = this.con.query(sqlQuery);
    return result;
  }

  //SQL-Calls about Driver Standings
  getDriverStandingsTableByYear(year) {
    var sqlQuery =
      ``;
    const result = this.con.query(sqlQuery);
    return result;
  }

  getDriverStandingsLeadersByYear(year) {
    var sqlQuery =
      ``;
    const result = this.con.query(sqlQuery);
    return result;
  }

  getDriverStandingsPlacementByYear(placement, year) {
    var sqlQuery =
      ``;
    const result = this.con.query(sqlQuery);
    return result;
  }

  //SQL-Calls about Constructor Standings
  getConstructorsTableByYear(year) {
    var sqlQuery =
      ``;
    const result = this.con.query(sqlQuery);
    return result;
  }

  getConstructorsLeadersByYear(year) {
    var sqlQuery =
      ``;
    const result = this.con.query(sqlQuery);
    return result;
  }

  getConstructorsPlacementByYear(placement, year) {
    var sqlQuery =
      ``;
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

  getDriverNameFromId(driverId) {
    var sqlQuery = `SELECT * FROM drivers WHERE driverid=${driverId}`;
    const result = this.con.query();
    return result;
  }
}

var helper = new sql_worker();
console.log(helper.getRaceWinnersByRaceId(1034));
