const fetch = require('node-fetch');
const SQL = require("./sql_worker");

var momentTZ = require('moment-timezone');
var got = require('got');

const sqlWorker = new SQL.Sql_Worker();

class Race{
    constructor(year, round){
        this.year = year;
        this.raceNumber = round;
    }

    //Fetch year and round of a given Season. Required for some calls
    //Will always fetch last round
    async getSeasonInfo(){
        try{
            let jsonData = sqlWorker.getLastRace()

            var obj = {
                targetYear: jsonData[0].year,
                targetRound: jsonData[0].round,
            };
            return obj;
        } catch (e) {
            console.error(e);
        }
    }

    //Generate a URL to Query the ergast Website. Depricated
    generateURL(year, round, mode){
        /*
        * MODE
        * 0 = results
        * 1 = qualifying
        */
        
        let URL = "";
        switch(mode){
            case 0:
                URL = "http://ergast.com/api/f1/"+year+"/"+round+"/results.json";
                break;
            case 1:
                URL = "http://ergast.com/api/f1/"+year+"/"+round+"/qualifying.json"
                break;
            default:
                console.error("Error in ModeSelect");
                break;
        }
        return URL;
    }

    //Get Podium places
    async getPodiumInfoAtTarget(){
        try{
            if(this.year=="current" && this.raceNumber=="last")
            {
                var seasonInfo = this.getSeasonInfo();
                var raceYear = (await seasonInfo).targetYear;
                var raceRound = (await seasonInfo).targetRound;
            }
            else
            {
                raceYear = this.year;
                raceRound= this.raceNumber;
            }

            var raceId = sqlWorker.getRaceIdByYearAndRound(raceYear, raceRound)[0].raceid;

            var jsonData = await sqlWorker.getRaceTopThreeByRaceId(raceId); //1061 2021 10

            var firstPlaceDriver = jsonData[0];
            var secondPlaceDriver = jsonData[1];
            var thirdPlaceDriver = jsonData[2];
            
            var firstPlaceDriver_NAME = firstPlaceDriver.forename + " " + firstPlaceDriver.surname;
            var secondPlaceDriver_NAME = secondPlaceDriver.forename + " " + secondPlaceDriver.surname;
            var thirdPlaceDriver_NAME = thirdPlaceDriver.forename + " " + thirdPlaceDriver.surname;

            var obj = {
                first: firstPlaceDriver_NAME,
                second: secondPlaceDriver_NAME,
                third: thirdPlaceDriver_NAME
            }
            return obj;
        } catch (e) {
            console.error(e);
        }
    }
    
    async getRaceTableAtTarget(mode, locale){
        /*
        * Mode selection for follow up questions
        * Mode = 0: First 10 places
        * Mode = 1: All entries starting from 11
        */
        try{
            var response = "";

            if(this.year=="current" && this.raceNumber=="last")
            {
                var seasonInfo = this.getSeasonInfo();
                var raceYear = (await seasonInfo).targetYear;
                var raceRound = (await seasonInfo).targetRound;
            }
            else
            {
                raceYear = this.year;
                raceRound= this.raceNumber;
            }
            
            var raceId = await sqlWorker.getRaceIdByYearAndRound(raceYear, raceRound)[0].raceid;
            var jsonData = await sqlWorker.getRaceTableByRaceId(raceId); //1061 2021 10

            //Depending on mode either the first 10 entries will be read or all the remaining ones
            var startAtDriver, countTillDriver;
            if(mode == 0){
                startAtDriver = 0;
                countTillDriver = 10;
            } else if (mode == 1){
                startAtDriver = 10;
                countTillDriver = jsonData.length;
            }
            
            for (var i = startAtDriver; i<countTillDriver; i++){
                var driver_firstName = jsonData[i].forename;
                var driver_lastName = jsonData[i].surname;  
                
                var i_ranking = i+1;

                if(locale == "de-DE"){
                    response = response + "Platz " + i_ranking + ": " + driver_firstName + " " + driver_lastName +". ";
                } else if (locale == "en-US"){
                    response = response + "Place " + i_ranking + ": " + driver_firstName + " " + driver_lastName +". ";
                } else {
                    response = response + "Platz " + i_ranking + ": " + driver_firstName + " " + driver_lastName +". ";
                }    
            }
            return response;
        } catch (e) {
            console.error(e);
        }
    }
    
    async getPlacementAtTarget(placement){
        try{

            var seasonInfo = this.getSeasonInfo();
            var raceYear = (await seasonInfo).targetYear;
            var raceRound = (await seasonInfo).targetRound;

            var driver = sqlWorker.getRacePlacementByDate(raceYear, raceRound, placement);
            
            var driver = driver.forename + " " + driver.surname;
            
            return driver;
        } catch (e) {
            console.error(e);
        }
    }
    
    async getQualifyingPodiumInfo(){
        try{            
            var seasonInfo = this.getSeasonInfo();
            var raceYear = (await seasonInfo).targetYear;
            var raceRound = (await seasonInfo).targetRound;



            var raceId = sqlWorker.getRaceIdByYearAndRound(raceYear, raceRound)[0].raceid;

            var jsonData = sqlWorker.getQualifyingTopThreeByRaceId(raceId); //1061 2021 10
        
            var firstPlaceDriver = jsonData[0];
            var secondPlaceDriver = jsonData[1];
            var thirdPlaceDriver = jsonData[2];
            
            var firstPlaceDriver_NAME = firstPlaceDriver.forename + " " + firstPlaceDriver.surname;
            var secondPlaceDriver_NAME = secondPlaceDriver.forename + " " + secondPlaceDriver.surname;
            var thirdPlaceDriver_NAME = thirdPlaceDriver.forename + " " + thirdPlaceDriver.surname;

            var obj = {
                first: firstPlaceDriver_NAME,
                firstTime: firstPlaceDriver.q3,
                second: secondPlaceDriver_NAME,
                secondTime: secondPlaceDriver.q3,
                third: thirdPlaceDriver_NAME,
                thirdTime: thirdPlaceDriver.q3,
            }
            
            return obj;
        } catch (e){
            console.error(e);
        }
    }
    
    async getQualifyingRaceTable(mode, locale){
        try{
            var response = "";

            var seasonInfo = this.getSeasonInfo();
            var raceYear = (await seasonInfo).targetYear;
            var raceRound = (await seasonInfo).targetRound;
        
            var raceId = sqlWorker.getRaceIdByYearAndRound(raceYear, raceRound)[0].raceid;
            var jsonData = sqlWorker.getQualifyingTableByRaceId(raceId); //1061 2021 10
            var textToSpeech = "";
            
            //Depending on mode either the first 10 entries will be read or all the remaining ones
            var startAtDriver, countTillDriver;
            if(mode == 0){
                startAtDriver = 0;
                countTillDriver = 10;
            } else if (mode == 1){
                startAtDriver = 10;
                countTillDriver = jsonData.length;
            }
            
            for (var i = startAtDriver; i<countTillDriver; i++){
                var driver_firstName = jsonData[i].forename;
                var driver_lastName = jsonData[i].surname;  
                
                var i_ranking = i+1;
                
                if(locale == "de-DE"){
                    response = response + "Platz " + i_ranking + ": " + driver_firstName + " " + driver_lastName +". ";
                } else if (locale == "en-US"){
                    response = response + "Place " + i_ranking + ": " + driver_firstName + " " + driver_lastName +". ";
                } else {
                    response = response + "Platz " + i_ranking + ": " + driver_firstName + " " + driver_lastName +". ";
                }  
            }
            textToSpeech = response;
            return textToSpeech;
        } catch (e) {
            console.error(e);
        }
    }

    async getNextRaceDate(deviceId, authToken){

        const gotResponse = await got.get(
            `https://api.eu.amazonalexa.com//v2/devices/${deviceId}/settings/System.timeZone`,
            {
              headers: {
                "Authorization": `Bearer ${authToken}`
              }
            }
        );

        var response = sqlWorker.getNextRaceDate();

        var raceTime = response[0].time;
        var raceDate = response[0].date;
        var raceName = response[0].name;

        var date = new Date(raceDate);

        date.setHours(raceTime.split(":")[0],raceTime.split(":")[1]);

        var setDate = momentTZ.tz(date, gotResponse.body.replace(/(['"])/g,""));

        var obj = {
            date: setDate,
            name: raceName
        }

        return await obj;
    }
}

class Standings{
    constructor(year){
        this.year = year;
    }

    //Fetch year and round of a given Season. Required for some calls
    async getSeasonYear(){
        try{
                
            var response = await fetch(this.generateURL(this.year, 0));
            var jsonData = await response.json();
            var standingsYear = jsonData.MRData.StandingsTable.season;


    
            return standingsYear;
        } catch (e) {
            console.error(e);
        }
    }

    generateURL(year, mode){
        /*
        * MODE
        * 0 = Driver standings
        * 1 = Constructor standings
        */
        
        let URL = "";
        switch(mode){
            case 0:
                URL = "http://ergast.com/api/f1/" + year + "/driverStandings.json";
                break;
            case 1:
                URL = "http://ergast.com/api/f1/" + year + "/constructorStandings.json";
                break;
            default:
                console.error("Error in ModeSelect");
                break;
        }
        return URL;
    }
    
    //Locales:
    //de-DE: German
    //en-US: English
    //Locale is parsed since amount of drivers is not known at the start of the request and is handled in a loop. Translation happens inside function.
    async getDriverStandingsTable(mode, locale){
         try{
            var standingsYear = await this.getSeasonYear();
            var jsonData = await sqlWorker.getDriverStandingsTableByYear(standingsYear);

            var textToSpeech = "";
            


            var startAtDriver, countTillDriver;
            if(mode == 0){
                startAtDriver = 0;
                countTillDriver = 10;
            } else if (mode == 1){
                startAtDriver = 10;
                countTillDriver = jsonData.length;
            }
            
            for (var i = startAtDriver; i<countTillDriver; i++){
                var driver_firstName = jsonData[i].forename;
                var driver_lastName = jsonData[i].surname;

                var i_ranking = i+1;
                
                if(locale == "de-DE"){
                    textToSpeech = textToSpeech + "Platz " + i_ranking + ": " + driver_firstName + " " + driver_lastName +". ";
                } else if (locale == "en-US"){
                    textToSpeech = textToSpeech + "Place " + i_ranking + ": " + driver_firstName + " " + driver_lastName +". ";
                } else {
                    textToSpeech = textToSpeech + "Platz " + i_ranking + ": " + driver_firstName + " " + driver_lastName +". ";
                }        
            }

            return textToSpeech;
        } catch (e) {
            console.error(e);
        }
    }
    
    async getDriverStandingsLeaders(){
        try{
            var standingsYear = await this.getSeasonYear();
            var jsonData = await sqlWorker.getDriverStandingsTableByYear(standingsYear);

            var firstPlaceDriver = jsonData[0];
            var secondPlaceDriver = jsonData[1];
            var thirdPlaceDriver = jsonData[2];
            
            var firstPlaceDriver_NAME = firstPlaceDriver.forename + " " + firstPlaceDriver.surname;
            var secondPlaceDriver_NAME = secondPlaceDriver.forename + " " + secondPlaceDriver.surname;
            var thirdPlaceDriver_NAME = thirdPlaceDriver.forename + " " + thirdPlaceDriver.surname;
        
            let obj = {
                firstPlaceDriver: firstPlaceDriver_NAME,
                firstPlaceDriverPoints: firstPlaceDriver.points,
                secondPlaceDriver: secondPlaceDriver_NAME,
                secondPlaceDriverPoints: secondPlaceDriver.points,
                thirdPlaceDriver: thirdPlaceDriver_NAME,
                thirdPlaceDriverPoints: thirdPlaceDriver.points,
            }

            return obj;
        } catch (e) {
            console.error(e);
        }
    }
    
    async getDriverStandingsPlacement(placement){
        try{
            var standingsYear = await this.getSeasonYear();
            var jsonData = await sqlWorker.getDriverStandingsPlacementByYear(standingsYear, placement);
            var driver = jsonData[0].forename + " " + jsonData[0].surname;

            let obj = {
                driver: driver,
                points: jsonData[0].points
            }

            return obj;
        } catch (e) {
            console.error(e);
        }
    }
    
    //Locales:
    //de-DE: German
    //en-US: English
    //Translation implementend here given that its unclear how many competitors are on the grid. Fallback locale is German
    async getConstructorStandingsTable(locale){
        try{
            var textToSpeech = "";
            
            var standingsYear = await this.getSeasonYear();
            var jsonData = sqlWorker.getConstructorsTableByYear(standingsYear);

            for (var i = 0; i<jsonData.length; i++){
                var constructorName = jsonData[i].name;
                var i_ranking = i+1;

                if(locale == "de-DE"){
                    textToSpeech = textToSpeech + "Platz " + i_ranking + ": " + constructorName +" mit " + jsonData[i].points + " Punkten. ";
                } else if (locale == "en-US"){
                    textToSpeech = textToSpeech + "Place " + i_ranking + ": " + constructorName +" with " + jsonData[i].points + " points. ";
                } else {
                    textToSpeech = textToSpeech + "Platz " + i_ranking + ": " + constructorName +" mit " + jsonData[i].points + " Punkten. ";
                }
            }
            
            return textToSpeech;
        } catch (e) {
            console.error(e);
        }
    }
    
    async getConstructorStandingsLeaders(){
        try{   
            var standingsYear = await this.getSeasonYear();
            var jsonData = await sqlWorker.getConstructorsLeadersByYear(standingsYear);

            var firstConstructor = jsonData[0];
            var secondConstructor = jsonData[1];
            var thirdConstructor = jsonData[2];
            
            var firstConstructor_NAME = firstConstructor.name;
            var secondConstructor_NAME = secondConstructor.name;
            var thirdConstructor_NAME = thirdConstructor.name;
            
            let obj = {
                firstConstructor: firstConstructor_NAME,
                firstConstructorPoints:firstConstructor.points,
                secondConstructor: secondConstructor_NAME,
                secondConstructorPoints: secondConstructor.points,
                thirdConstructor: thirdConstructor_NAME,
                thirdConstructorPoints: thirdConstructor.points
            }

            return obj;
        } catch (e) {
            console.error(e);
        }
    }
    
    async getConstructorStandingsPlacement(placement){
        try{
            var standingsYear = await this.getSeasonYear();
            var jsonData =await sqlWorker.getConstructorsPlacementByYear(standingsYear, placement);
            var obj = jsonData[0];
            return obj;
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = {
    Race,
    Standings
};


/*async function test(){
    let standings = new Standings(2022);
    let race = new Race("current", "last");

    //console.log(await standings.getDriverStandingsTable(1, "en-US"));
    console.log(await race.getQualifyingRaceTable(0, "de-DE"));
}
test();*/