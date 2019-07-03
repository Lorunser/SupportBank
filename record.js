//imports
const moment = require('moment');
const logger = require('./logger.js').logger;

exports.Record = class Record{
    //CSV props: Date,From,To,Narrative,Amount
    //json props: [{Date FromAccount ToAccount Narrative Amount}]

    constructor(jsonRecord){
        this.assignProps(jsonRecord);
        this.validate();
    }

    //#region instance methods
    assignProps(jsonItem){
        const props = ["Date", "From", "To", "Narrative", "Amount"]; 
        let propNames = Object.keys(jsonItem);

        for(let i = 0; i < propNames.length; i ++){
            let property = propNames[i];
            if(props.includes(property)){
                this[property] = jsonItem[property]; 
            }
            else{
                throw "Property (" + property + ") not allowed in domain model";
            }
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
            this.Date = (this.Date - 25569) * 86400;
            this.Date = moment(this.Date, "X");
        }

        if(moment(this.Date).isValid() == false){
            var error_message = this.Date + " is not a valid date >> setting to Y2K 1/1/2000"
            logger.info(error_message);
            this.Date = moment("1/1/2000", "DD-MM-YYYY");
        }
    }

    stringify(){
        let repr = this.Amount.toFixed(1) + " on " + moment(this.Date).format("DD-MM-YYYY") + " for " + this.Narrative + " | " + this.From + " >> " + this.To;
        return repr;
    }
    //#endregion

    //#region static conversion methods
    static newFromCsv(propNames, csvLine){
        let items = csvLine.split(',');
        let jsonRecord = new Object();

        for(var i = 0; i < propNames.length; i++){
            jsonRecord[propNames[i]] = items[i];
        }

        return new Record(jsonRecord);
    }

    static newFromJson(jsonOld){
        let propNames = Object.keys(jsonOld);
        let jsonRecord = new Object();

        for(var i = 0; i < propNames.length; i++){
            let property = propNames[i]

            if(property === "FromAccount"){
                jsonRecord["From"] = jsonOld[property];
            }
            else if(property === "ToAccount"){
                jsonRecord["To"] = jsonOld[property];
            }
            else{
                jsonRecord[property] = jsonOld[property]; 
            }
        }

        return new Record(jsonRecord);
    }

    static newFromAnyJson(jsonOld, translator){
        let modelProps = Object.keys(translator);
        let jsonRecord = new Object();

        for(let i = 0; i < modelProps.length; i++){
            let modelName = modelProps[i];
            let oldName = translator[modelName];

            let value = Record.resolve(jsonOld, oldName);
            jsonRecord[modelName] = value;
        }

        return new Record(jsonRecord);
    }

    static resolve(obj, path){
        path = path.split('.');
        var current = obj;
        while(path.length) {
            if(typeof current !== 'object') return undefined;
            current = current[path.shift()];
        }
        return current;
    }
    //#endregion
}

exports.DataFormatter = class DataFormatter{
    static createRecordArrayFromJson(jsonArray){
        let recordArray = new Array();

        for(let i = 0; i < jsonArray.length; i++){
            let jsonInputRecord = jsonArray[i];
            let record = exports.Record.newFromJson(jsonInputRecord);
            recordArray.push(record);
        }

        return recordArray;
    }

    static createRecordArrayFromCsv(csvString){
        csvString = String(csvString);
        let lines = csvString.split('\n');

        var propNames = lines[0].split(',');
        var recordArray = new Array();

        for(let i = 1; i < lines.length; i++){
            var line = lines[i];
            var record = exports.Record.newFromCsv(propNames, line);
            recordArray.push(record);
        }

        return recordArray;
    }

    static createRecordArrayFromXml(xmlString){
        const translator = {
            "Date": "_attributes.Date",
            "Narrative": "Description._text",
            "From": "Parties.From._text",
            "To": "Parties.To._text",
            "Amount": "Value._text"
        };

        let convert = require('xml-js');
        let jsonString = convert.xml2json(xmlString, {compact: true, spaces: 4});
        
        let jsonArray = JSON.parse(jsonString);
        jsonArray = jsonArray.TransactionList.SupportTransaction;

        let recordArray = new Array();

        for(let i = 0; i < jsonArray.length; i++){
            let jsonInputRecord = jsonArray[i];
            let record = exports.Record.newFromAnyJson(jsonInputRecord, translator);
            recordArray.push(record);
        }

        return recordArray;
    }
}