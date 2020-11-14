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

    async getRaceFromDate(){
        try{
            var response = await fetch(this.generateURL(this.year, this.raceNumber, 0));
            var jsonData = await response.json();
            return jsonData;
        } catch (e) {
            console.error(e);
        }
    }

    returnRaceInformation(){

    }
};

class Season{
    constructor(year){
        this.year = year;
    }

    generateURL(year, mode){

    }

    async getSeasonInfo(callback){

    }
};

class Standings{
    constructor(year, round){

    }

    generateURL(year, round, mode){

    }

    async getSeasonInfo(callback){

    }
};

module.exports = {
    Race,
    Season,
    Standings
}
