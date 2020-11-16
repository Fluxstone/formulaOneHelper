const fetch = require('node-fetch');

class Race{
    constructor(year, round){
        this.year = year;
        this.raceNumber = round;
    }

    generateURL(year, round, mode){
        /*
        * MODE
        * 0 = results
        * 1 = qualifying
        * 2 = TBD
        * 3 = TBD
        * 4 = TBD
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
            var response = await fetch(this.generateURL(this.year, this.raceNumber, 0));
            var jsonData = await response.json();
            
            var response = "";
            
            var firstPlaceDriver = jsonData.MRData.RaceTable.Races[0].Results[0].Driver;
            var secondPlaceDriver = jsonData.MRData.RaceTable.Races[0].Results[1].Driver;
            var thirdPlaceDriver = jsonData.MRData.RaceTable.Races[0].Results[2].Driver;
            
            var firstPlaceDriver_NAME = firstPlaceDriver.givenName + " " + firstPlaceDriver.familyName;
            var secondPlaceDriver_NAME = secondPlaceDriver.givenName + " " + secondPlaceDriver.familyName;
            var thirdPlaceDriver_NAME = thirdPlaceDriver.givenName + " " + thirdPlaceDriver.familyName;
            
            response = "Erster wurde " + firstPlaceDriver_NAME + ", gefolgt von " + secondPlaceDriver_NAME + " auf dem zweiten Platz während " + thirdPlaceDriver_NAME + " den dritten Platz belegte.";
            
            return response;
        } catch (e) {
            console.error(e);
        }
    }
    
    async getRaceTableAtTarget(){
        try{
            var response = await fetch(this.generateURL(this.year, this.raceNumber, 0));
            var jsonData = await response.json();
            
            var response = "";
            
            //TODO: Get first 10 entries, then ask if the user wants to hear more
            //jsonData.MRData.RaceTable.Races[0].Results.length
            
            for (var i = 0; i<10; i++){
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
            var response = "Platz " + placement + " belegte " + driver;
            
            return response;
        } catch (e) {
            console.error(e);
        }
    }
}

class Season{
    constructor(year){
        this.year = year;
    }

    generateURL(year, mode){

    }

    async getSeasonInfo(callback){

    }
}

class Standings{
    constructor(year, round){

    }

    generateURL(year, round, mode){

    }

    async getSeasonInfo(callback){

    }
}

module.exports = {
    Race,
    Season,
    Standings
};