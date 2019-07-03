const Record = require('./record.js').Record;

exports.DataFormatter = class DataFormatter{
    static createFromAnyJson(jsonArray, translator){
        let recordArray = new Array();

        for(let i = 0; i < jsonArray.length; i++){
            let jsonInputRecord = jsonArray[i];
            let record = Record.newFromAnyJson(jsonInputRecord, translator)
            recordArray.push(record);
        }

        return recordArray;
    };
    
    static createRecordArrayFromJson(jsonArray){
        const translator = {
            "Date": "Date",
            "Narrative": "Narrative",
            "From": "FromAccount",
            "To": "ToAccount",
            "Amount": "Amount"
        };

        let jsonArray = JSON.parse(jsonString);        
        return this.createFromAnyJson(jsonArray, translator);
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

        return this.createFromAnyJson(jsonArray, translator);
    }

    static createRecordArrayFromCsv(csvString){
        csvString = String(csvString);
        let lines = csvString.split('\n');

        var propNames = lines[0].split(',');
        var recordArray = new Array();

        for(let i = 1; i < lines.length; i++){
            var line = lines[i];
            var record = Record.newFromCsv(propNames, line);
            recordArray.push(record);
        }

        return recordArray;
    }
}