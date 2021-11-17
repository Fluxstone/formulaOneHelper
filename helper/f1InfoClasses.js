const fetch = require('node-fetch');
const SQL = require("./sql_worker");

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


            console.log(jsonData);

            var obj = {
                targetYear: jsonData[0].year,
                targetRound: jsonData[0].round,
            };

            console.log(obj);
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
            if(this.year=="current" && this.round=="last")
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

            
            //console.log(raceYear + " " + raceRound);

            var raceId = sqlWorker.getRaceIdByYearAndRound(raceYear, raceRound)[0].raceid;
            //console.log(raceId);
            var jsonData = await sqlWorker.getRaceTopThreeByRaceId(raceId); //1061 2021 10
            //console.log("Json Data" + jsonData);
            
            var textToSpeech = "";

            var firstPlaceDriver = jsonData[0];
            var secondPlaceDriver = jsonData[1];
            var thirdPlaceDriver = jsonData[2];
            
            var firstPlaceDriver_NAME = firstPlaceDriver.forename + " " + firstPlaceDriver.surname;
            var secondPlaceDriver_NAME = secondPlaceDriver.forename + " " + secondPlaceDriver.surname;
            var thirdPlaceDriver_NAME = thirdPlaceDriver.forename + " " + thirdPlaceDriver.surname;
            
            textToSpeech = "Erster wurde " + firstPlaceDriver_NAME + ", gefolgt von " + secondPlaceDriver_NAME + " auf dem zweiten Platz während " + thirdPlaceDriver_NAME + " den dritten Platz belegte.";
            //console.log(textToSpeech);
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
            //var response = await fetch(this.generateURL(this.year, this.raceNumber, 0));
           //var jsonData = await response.json();
            
            var response = "";

            if(this.year=="current" && this.round=="last")
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
            //console.log(raceId);
            var jsonData = sqlWorker.getRaceTableByRaceId(raceId); //1061 2021 10
            //console.log(jsonData);


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
                var driver_firstName = jsonData[i].forename;
                var driver_lastName = jsonData[i].surname;  
                
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
            //var response = await fetch(this.generateURL(this.year, this.raceNumber, 0));
            //var jsonData = await response.json();

            var seasonInfo = this.getSeasonInfo();
            var raceYear = (await seasonInfo).targetYear;
            var raceRound = (await seasonInfo).targetRound;

            var driver = sqlWorker.getRacePlacementByDate(raceYear, raceRound, placement);
            //console.log(placement);
            
            var driver = driver.forename + " " + driver.surname;
            var response = "Platz " + placement + " belegt " + driver;
            
            return response;
        } catch (e) {
            console.error(e);
        }
    }
    
    async getQualifyingPodiumInfo(){
        try{            
            var seasonInfo = this.getSeasonInfo();
            var raceYear = (await seasonInfo).targetYear;
            var raceRound = (await seasonInfo).targetRound;

            //console.log(raceYear + " " + raceRound);

            var raceId = sqlWorker.getRaceIdByYearAndRound(raceYear, raceRound)[0].raceid;
            //console.log(raceId);
            var jsonData = sqlWorker.getQualifyingTopThreeByRaceId(raceId); //1061 2021 10
            console.log(jsonData);
            
            var textToSpeech = "";

            var firstPlaceDriver = jsonData[0];
            var secondPlaceDriver = jsonData[1];
            var thirdPlaceDriver = jsonData[2];
            
            var firstPlaceDriver_NAME = firstPlaceDriver.forename + " " + firstPlaceDriver.surname;
            var secondPlaceDriver_NAME = secondPlaceDriver.forename + " " + secondPlaceDriver.surname;
            var thirdPlaceDriver_NAME = thirdPlaceDriver.forename + " " + thirdPlaceDriver.surname;
            
            textToSpeech = "Erster wurde im Qualifying " + firstPlaceDriver_NAME + " mit einer Zeit von " + firstPlaceDriver.q3 + 
            ", gefolgt von " + secondPlaceDriver_NAME + " mit einer Zeit von " + secondPlaceDriver.q3 + " auf dem zweiten Platz während " 
            + thirdPlaceDriver_NAME + " den dritten Platz mit einer Zeit von " + thirdPlaceDriver.q3 + " belegte.";
            
            return textToSpeech;
        } catch (e){
            console.error(e);
        }
    }
    
    async getQualifyingRaceTable(mode){
        try{
            var response = "";

            var seasonInfo = this.getSeasonInfo();
            var raceYear = (await seasonInfo).targetYear;
            var raceRound = (await seasonInfo).targetRound;
            
            var raceId = sqlWorker.getRaceIdByYearAndRound(raceYear, raceRound)[0].raceid;
            //console.log(raceId);
            var jsonData = sqlWorker.getQualifyingTableByRaceId(raceId); //1061 2021 10
            console.log(jsonData);
            
            var textToSpeech = "";
            
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
                var driver_firstName = jsonData[i].forename;
                var driver_lastName = jsonData[i].surname;  
                
                var i_ranking = i+1;
                
                response = response + "Platz " + i_ranking + ": " + driver_firstName + " " + driver_lastName +". ";
            }
            textToSpeech = response;
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

    //Fetch year and round of a given Season. Required for some calls
    async getSeasonYear(){
        try{
                
            var response = await fetch(this.generateURL(this.year, 0));
            var jsonData = await response.json();
            var standingsYear = jsonData.MRData.StandingsTable.season;

            //console.log(jsonData.MRData.StandingsTable.season);
    
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
    
    async getDriverStandingsTable(mode){
         try{
            
            
            //var response = await fetch(this.generateURL(this.year, 0));
            //var jsonData = await response.json();


            var standingsYear = await this.getSeasonYear();
            //console.log(standingsYear)
            var jsonData = sqlWorker.getDriverStandingsTableByYear(standingsYear);
            //console.log(jsonData[1]);

            var textToSpeech = "";
            
            var startAtDriver, countTillDriver;
            if(mode == 0){
                startAtDriver = 0;
                countTillDriver = 10;
            } else if (mode == 1){
                startAtDriver = 10;
                countTillDriver = jsonData.MRData.StandingsTable.StandingsLists[0].DriverStandings.length;
            }
            
            for (var i = startAtDriver; i<countTillDriver; i++){
                var driver_firstName = jsonData[i].forename;
                var driver_lastName = jsonData[i].surname;
                
                //console.log(driver_firstName + " " +driver_lastName)

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
            
            var standingsYear = await this.getSeasonYear();
            //console.log(standingsYear)
            var jsonData = sqlWorker.getDriverStandingsTableByYear(standingsYear);
            //console.log(jsonData[1]);

            var textToSpeech = "";

            var firstPlaceDriver = jsonData[0];
            var secondPlaceDriver = jsonData[1];
            var thirdPlaceDriver = jsonData[2];
            
            var firstPlaceDriver_NAME = firstPlaceDriver.forename + " " + firstPlaceDriver.surname;
            var secondPlaceDriver_NAME = secondPlaceDriver.forename + " " + secondPlaceDriver.surname;
            var thirdPlaceDriver_NAME = thirdPlaceDriver.forename + " " + thirdPlaceDriver.surname;
            
            textToSpeech = "Erster ist " + firstPlaceDriver_NAME + " mit " + firstPlaceDriver.points + " Punkten, " +
            "gefolgt von " + secondPlaceDriver_NAME + " mit " + secondPlaceDriver.points + " Punkten während " +
            thirdPlaceDriver_NAME + " mit " + thirdPlaceDriver.points + " Punkten dritter ist.";
            
            return textToSpeech;
        } catch (e) {
            console.error(e);
        }
    }
    
    async getDriverStandingsPlacement(placement){
        try{
            var textToSpeech = "";
            
            var standingsYear = await this.getSeasonYear();
            //console.log(standingsYear)
            var jsonData = sqlWorker.getDriverStandingsPlacementByYear(standingsYear, placement);
            //console.log(jsonData[0]);

            var driver = jsonData[0].forename + " " + jsonData[0].surname;
            textToSpeech = "Platz " + placement + " belegt " + driver + " mit " + jsonData[0].points + " Punkten.";

            return textToSpeech;
        } catch (e) {
            console.error(e);
        }
    }
    
    async getConstructorStandingsTable(){
        try{
            var textToSpeech = "";
            
            var standingsYear = await this.getSeasonYear();
            //console.log(standingsYear)
            var jsonData = sqlWorker.getConstructorsTableByYear(standingsYear);
            //console.log(jsonData);
            
            //var constructorInfo = jsonData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
            
            for (var i = 0; i<jsonData.length; i++){
                var constructorName = jsonData[i].name;
                
                var i_ranking = i+1;
                
                textToSpeech = textToSpeech + "Platz " + i_ranking + ": " + constructorName +" mit " + jsonData[i].points + " Punkten. ";
            }
            
            return textToSpeech;
        } catch (e) {
            console.error(e);
        }
    }
    
    async getConstructorStandingsLeaders(){
        try{
            var textToSpeech = "";
            
            var standingsYear = await this.getSeasonYear();
            //console.log(standingsYear)
            var jsonData = sqlWorker.getConstructorsLeadersByYear(standingsYear);
            console.log(jsonData);

            var firstConstructor = jsonData[0];
            var secondConstructor = jsonData[1];
            var thirdConstructor = jsonData[2];
            
            var firstConstructor_NAME = firstConstructor.name;
            var secondConstructor_NAME = secondConstructor.name;
            var thirdConstructor_NAME = thirdConstructor.name;
            
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
            
            var standingsYear = await this.getSeasonYear();
            //console.log(standingsYear)
            var jsonData = sqlWorker.getConstructorsPlacementByYear(standingsYear, placement);
            console.log(jsonData);

            var constructorInfo = jsonData[0];
            textToSpeech = "Platz " + placement + " belegt " + constructorInfo.name + " mit " + constructorInfo.points + " Punkten.";

            return textToSpeech;
        } catch (e) {
            console.error(e);
        }
    }
}


//var race = new Race("current","last");
var race = new Race(2021, 10)
//var standings = new Standings("current");
const foo = async () => {
    var response = await race.getPodiumInfoAtTarget();
    //var response = await standings.getConstructorStandingsPlacement(4);
    console.log(response);
}

foo();

module.exports = {
    Race,
    Standings
};
