const fetch = require('node-fetch');
const SQL = require("./sql_worker");

const sqlWorker = new SQL.Sql_Worker();

class Race{
    constructor(year, round){
        this.year = year;
        this.raceNumber = round;
    }

    async getSeasonInfo(){
        try{
            
            var response = await fetch(this.generateURL(this.year, this.raceNumber, 0));
            var jsonData = await response.json();

            console.log(jsonData);

            var obj = {
                targetYear: jsonData.MRData.RaceTable.season,
                targetRound: jsonData.MRData.RaceTable.round,

            };
            return obj;
        } catch (e) {
            console.error(e);
        }
    }

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

    async getPodiumInfoAtTarget(){
        try{
            var seasonInfo = this.getSeasonInfo();
            var raceYear = (await seasonInfo).targetYear;
            var raceRound = (await seasonInfo).targetRound;

            //console.log(raceYear + " " + raceRound);

            var raceId = sqlWorker.getRaceIdByYearAndRound(raceYear, raceRound)[0].raceid;
            //console.log(raceId);
            var jsonData = sqlWorker.getRaceTopThreeByRaceId(raceId); //1061 2021 10
            //console.log(jsonData);
            
            var textToSpeech = "";

            var firstPlaceDriver = jsonData[0];
            var secondPlaceDriver = jsonData[1];
            var thirdPlaceDriver = jsonData[2];
            
            var firstPlaceDriver_NAME = firstPlaceDriver.forename + " " + firstPlaceDriver.surname;
            var secondPlaceDriver_NAME = secondPlaceDriver.forename + " " + secondPlaceDriver.surname;
            var thirdPlaceDriver_NAME = thirdPlaceDriver.forename + " " + thirdPlaceDriver.surname;
            
            textToSpeech = "Erster wurde " + firstPlaceDriver_NAME + ", gefolgt von " + secondPlaceDriver_NAME + " auf dem zweiten Platz während " + thirdPlaceDriver_NAME + " den dritten Platz belegte.";
            console.log(textToSpeech);
            return textToSpeech;
        } catch (e) {
            console.error(e);
        }
    }
    
    async getRaceTableAtTarget(mode){
        /*
        * Mode selection for follow up questions
        * Mode = 0: First 10 places
        * Mode = 1: All entries starting from 11
        */
        try{
            var response = await fetch(this.generateURL(this.year, this.raceNumber, 0));
            var jsonData = await response.json();
            
            var response = "";
            
            //Depending on mode either the first 10 entries will be read or all the remaining ones
            var startAtDriver, countTillDriver;
            if(mode == 0){
                startAtDriver = 0;
                countTillDriver = 10;
            } else if (mode == 1){
                startAtDriver = 10;
                countTillDriver = jsonData.MRData.RaceTable.Races[0].Results.length;
            }
            
            for (var i = startAtDriver; i<countTillDriver; i++){
                var driver_firstName = jsonData.MRData.RaceTable.Races[0].Results[i].Driver.givenName;
                var driver_lastName = jsonData.MRData.RaceTable.Races[0].Results[i].Driver.familyName;
                
                var i_ranking = i+1;
                
                response = response + "Platz " + i_ranking + ": " + driver_firstName + " " + driver_lastName +". ";
            }
            return response;
        } catch (e) {
            console.error(e);
        }
    }
    
    async getPlacementAtTarget(placement){
        try{
            var response = await fetch(this.generateURL(this.year, this.raceNumber, 0));
            var jsonData = await response.json();
            
            var driver = jsonData.MRData.RaceTable.Races[0].Results[placement-1].Driver.givenName + " " + jsonData.MRData.RaceTable.Races[0].Results[placement-1].Driver.familyName;
            var response = "Platz " + placement + " belegt " + driver;
            
            return response;
        } catch (e) {
            console.error(e);
        }
    }
    
    async getQualifyingPodiumInfo(){
        try{
            var textToSpeech = "";
            
            var response = await fetch(this.generateURL(this.year, this.raceNumber, 1));
            var jsonData = await response.json();
            
            var response = "";
            
            var firstPlaceDriver = jsonData.MRData.RaceTable.Races[0].QualifyingResults[0];
            var secondPlaceDriver = jsonData.MRData.RaceTable.Races[0].QualifyingResults[1];
            var thirdPlaceDriver = jsonData.MRData.RaceTable.Races[0].QualifyingResults[2];
            
            var firstPlaceDriver_NAME = firstPlaceDriver.Driver.givenName + " " + firstPlaceDriver.Driver.familyName;
            var secondPlaceDriver_NAME = secondPlaceDriver.Driver.givenName + " " + secondPlaceDriver.Driver.familyName;
            var thirdPlaceDriver_NAME = thirdPlaceDriver.Driver.givenName + " " + thirdPlaceDriver.Driver.familyName;
            
            textToSpeech = "Erster wurde im Qualifying " + firstPlaceDriver_NAME + " mit einer Zeit von " + firstPlaceDriver.Q3 + 
            ", gefolgt von " + secondPlaceDriver_NAME + " mit einer Zeit von " + secondPlaceDriver.Q3 + " auf dem zweiten Platz während " 
            + thirdPlaceDriver_NAME + " den dritten Platz mit einer Zeit von " + thirdPlaceDriver.Q3 + " belegte.";
            
            return textToSpeech;
        } catch (e){
            console.error(e);
        }
    }
    
    async getQualifyingRaceTable(mode){
        try{
            var textToSpeech = "";
            
            var response = await fetch(this.generateURL(this.year, this.raceNumber, 1));
            var jsonData = await response.json();
            
            var response = "";
            
            var startAtDriver, countTillDriver;
            if(mode == 0){
                startAtDriver = 0;
                countTillDriver = 10;
            } else if (mode == 1){
                startAtDriver = 10;
                countTillDriver = jsonData.MRData.RaceTable.Races[0].QualifyingResults.length;
            }
            
            for (var i = startAtDriver; i<countTillDriver; i++){
                var driver_firstName = jsonData.MRData.RaceTable.Races[0].QualifyingResults[i].Driver.givenName;
                var driver_lastName = jsonData.MRData.RaceTable.Races[0].QualifyingResults[i].Driver.familyName;
                
                var i_ranking = i+1;
                
                textToSpeech = textToSpeech + "Platz " + i_ranking + ": " + driver_firstName + " " + driver_lastName +". ";
            }
            return textToSpeech;
        } catch (e) {
            console.error(e);
        }
    }
}

class Standings{
    constructor(year){
        this.year = year;
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
    
    async getDriverStandingsTable(mode){
         try{
            var textToSpeech = "";
            
            var response = await fetch(this.generateURL(this.year, 0));
            var jsonData = await response.json();
            
            var startAtDriver, countTillDriver;
            if(mode == 0){
                startAtDriver = 0;
                countTillDriver = 10;
            } else if (mode == 1){
                startAtDriver = 10;
                countTillDriver = jsonData.MRData.StandingsTable.StandingsLists[0].DriverStandings.length;
            }
            
            for (var i = startAtDriver; i<countTillDriver; i++){
                var driver_firstName = jsonData.MRData.StandingsTable.StandingsLists[0].DriverStandings[i].Driver.givenName;
                var driver_lastName = jsonData.MRData.StandingsTable.StandingsLists[0].DriverStandings[i].Driver.familyName;
                
                var i_ranking = i+1;
                
                textToSpeech = textToSpeech + "Platz " + i_ranking + ": " + driver_firstName + " " + driver_lastName +". ";
            }
            
            return textToSpeech;
        } catch (e) {
            console.error(e);
        }
    }
    
    async getDriverStandingsLeaders(){
        try{
            var textToSpeech = "";
            
            var response = await fetch(this.generateURL(this.year, 0));
            var jsonData = await response.json();

            var firstDriver = jsonData.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];
            var secondDriver = jsonData.MRData.StandingsTable.StandingsLists[0].DriverStandings[1];
            var thirdDriver = jsonData.MRData.StandingsTable.StandingsLists[0].DriverStandings[2];
            
            var firstDriver_NAME = firstDriver.Driver.givenName + " " + firstDriver.Driver.familyName;
            var secondDriver_NAME = secondDriver.Driver.givenName + " " + secondDriver.Driver.familyName;
            var thirdDriver_NAME = thirdDriver.Driver.givenName + " " + thirdDriver.Driver.familyName;
            
            textToSpeech = "Erster ist " + firstDriver_NAME + " mit " + firstDriver.points + " Punkten, " +
            "gefolgt von " + secondDriver_NAME + " mit " + secondDriver.points + " Punkten während " +
            thirdDriver_NAME + " mit " + thirdDriver.points + " Punkten dritter ist.";
            
            return textToSpeech;
        } catch (e) {
            console.error(e);
        }
    }
    
    async getDriverStandingsPlacement(placement){
        try{
            var textToSpeech = "";
            
            var response = await fetch(this.generateURL(this.year, 0));
            var jsonData = await response.json();

            var driver = jsonData.MRData.StandingsTable.StandingsLists[0].DriverStandings[placement-1].Driver.givenName + " " + jsonData.MRData.StandingsTable.StandingsLists[0].DriverStandings[placement-1].Driver.familyName;
            textToSpeech = "Platz " + placement + " belegt " + driver + " mit " + jsonData.MRData.StandingsTable.StandingsLists[0].DriverStandings[placement-1].points + " Punkten.";

            return textToSpeech;
        } catch (e) {
            console.error(e);
        }
    }
    
    async getConstructorStandingsTable(){
        try{
            var textToSpeech = "";
            
            var response = await fetch(this.generateURL(this.year, 1));
            var jsonData = await response.json();
            
            var constructorInfo = jsonData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
            
            for (var i = 0; i<constructorInfo.length; i++){
                var constructorName = constructorInfo[i].Constructor.name;
                
                var i_ranking = i+1;
                
                textToSpeech = textToSpeech + "Platz " + i_ranking + ": " + constructorName +" mit " + constructorInfo[i].points + " Punkten. ";
            }
            
            return textToSpeech;
        } catch (e) {
            console.error(e);
        }
    }
    
    async getConstructorStandingsLeaders(){
        try{
            var textToSpeech = "";
            
            var response = await fetch(this.generateURL(this.year, 1));
            var jsonData = await response.json();

            var firstConstructor = jsonData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[0];
            var secondConstructor = jsonData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[1];
            var thirdConstructor = jsonData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[2];
            
            var firstConstructor_NAME = firstConstructor.Constructor.name;
            var secondConstructor_NAME = secondConstructor.Constructor.name;
            var thirdConstructor_NAME = thirdConstructor.Constructor.name;
            
            textToSpeech = "Erster ist " + firstConstructor_NAME + " mit " + firstConstructor.points + " Punkten, " +
            "gefolgt von " + secondConstructor_NAME + " mit " + secondConstructor.points + " Punkten während " +
            thirdConstructor_NAME + " mit " + thirdConstructor.points + " Punkten dritter ist.";
            
            return textToSpeech;
        } catch (e) {
            console.error(e);
        }
    }
    
    async getConstructorStandingsPlacement(placement){
        try{
            var textToSpeech = "";
            
            var response = await fetch(this.generateURL(this.year, 1));
            var jsonData = await response.json();

            var constructorInfo = jsonData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[placement-1].Constructor.name;
            textToSpeech = "Platz " + placement + " belegt " + constructorInfo + " mit " + jsonData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[placement-1].points + " Punkten.";

            return textToSpeech;
        } catch (e) {
            console.error(e);
        }
    }
}


/*var race = new Race("current","last");
const foo = async () => {
    var response = await race.getPodiumInfoAtTarget();
    console.log(response);
}

foo();
*/
module.exports = {
    Race,
    Standings
};
