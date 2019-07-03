//imports
const moment = require('moment');

exports.Record = class Record{
    //CSV props: Date,From,To,Narrative,Amount
    //json props: [{Date FromAccount ToAccount Narrative Amount}]

    constructor(namesOrJson, csvLine){
        //1 argument for JSON, 2 for csv     
        if(csvLine === undefined){
            //json
            this.constructFromJson(namesOrJson);
        }
        else{
            //csv
            this.constructFromCSV(namesOrJson, csvLine);
        }

        this.validate();
    }

    constructFromXml(xmlItem){

    }

    constructFromJson(jsonItem){
        let propNames = Object.keys(jsonItem);

        for(let i = 0; i < propNames.length; i ++){
            let property = propNames[i];
            this[property] = jsonItem[property];
        }

        //mary formats
        if(this.hasOwnProperty("FromAccount")){
            this.From = this.FromAccount;
        }
        if(this.hasOwnProperty("ToAccount")){
            this.To = this.toAccount;
        }
    }

    constructFromCSV(propNames, csvLine){
        let items = csvLine.split(',');

        for(var i = 0; i < propNames.length; i++){
            this[propNames[i]] = items[i];
        }
    }

    validate(){
        //amount validation
        if(isNaN(this.Amount)){
            var error_message = this.Amount + " is not a valid amount >> setting to 0"
            console.log(error_message);
            this.Amount = 0;
        }
        else{
            this.Amount = parseFloat(this.Amount);
        }

        //date validation
        var testDate = moment(this.Date, "DD-MM-YYYY")
        if (moment(testDate).isValid())
        {
            this.Date = testDate;
        }
        else{
            var error_message = this.Date + " is not a valid date >> setting to Y2K 1/1/2000"
            console.log(error_message);
            this.Date = moment("1/1/2000", "DD-MM-YYYY");
        }
    }

    stringify(){
        let repr = this.Amount.toFixed(1) + " on " + moment(this.Date).format("DD-MM-YYYY") + " for " + this.Narrative + " | " + this.From + " >> " + this.To;
        return repr;
    }
}

class csvRecord{
    
}

exports.createRecordArrayFromJson = function(jsonArray){
    let recordArray = new Array();

    for(let i = 0; i < jsonArray.length; i++){
        let record = new exports.Record(jsonArray[i]);
        recordArray.push(record);
    }

    return recordArray;
}

exports.createRecordArrayFromCSV = function(lines){
    //takes input as an Array of lines
    //creates Array of records

    var propNames = lines[0].split(',');
    var recordArray = new Array();

    for(i = 1; i < lines.length; i++){
        var line = lines[i];
        var record = new exports.Record(propNames, line);

        recordArray.push(record);
    }

    return recordArray;
}