//user input
const readline = require('readline-sync');
const moment = require('moment');
const logger = require("./logger.js").logger;
const DataFormatter = require("./record").DataFormatter;

exports.getInput = function(people){
    //return [Name] or All
    console.log("1) List All")
    console.log("2) List [Account Name]")

    var input = readline.prompt();
    logger.debug('User input: ' + input);
    input = input.split(" ");

    var command = input.shift();
    var name = input.reduce(function(value, accumulator){ return value + " " + accumulator;});

    if(command === "List"){
        if (people.hasOwnProperty(name) || name === "All"){
            return name;
        }
        else{
            logger.debug('Inputted name is not in records');
            console.log("That person is not in our records. Try Again \n");
            return getInput();
        }
    }

    else{
        logger.debug('Unsupported command');
        console.log("Invalid command. Try again \n");
        return getInput();
    }
}

function readCSV(csvString){
    try{
        csvString = String(csvString);
        let lines = csvString.split('\n');
        let recordArray = DataFormatter.createRecordArrayFromCsv(lines); 
        return recordArray;
    }  
    catch(err) {
        console.log('Error parsing CSV string:', err)
        logger.error('Error parsing CSV string:', err)
        throw err;
    }
    
}

function readJSON(jsonString){
    try{
        let jsonArray = JSON.parse(jsonString);
        let recordArray = DataFormatter.createRecordArrayFromJson(jsonArray);
        return recordArray;
    }  
    catch(err) {
        console.log('Error parsing JSON string:', err)
        logger.error('Error parsing JSON string:', err)
        throw err;
    }
}

function readXML(xmlString){
    try{
        let convert = require('xml-js');
        let jsonString = convert.xml2json(xmlString, {compact: true, spaces: 4});
        
        let jsonArray = JSON.parse(jsonString);
        jsonArray = jsonArray.TransactionList.SupportTransaction;

        return DataFormatter.createRecordArrayFromXml(jsonArray);
    }
    catch(err) {
        console.log('Error parsing XML :', err)
        logger.error('Error parsing XML :', err)
        throw err;
    }    
}

exports.readFile = function(path){
    const fs = require('fs');
    logger.debug('Trying to read from ' + path)
    let recordArray;
    let text;

    try{
        text = fs.readFileSync(path);
    }
    catch (err) {
        console.log("File read failed:", err);
        logger.error('File read failed', err)
        return;
    }

    if(path.match("/*.json")){
        recordArray = readJSON(text);
        return recordArray;
    }
    else if(path.match("/*.csv")){
        recordArray = readCSV(text);
        return recordArray;
    }
    else if(path.match("/*.xml")){
        recordArray = readXML(text);
        return recordArray;
    }
    else{
        console.log('Unsupported filetype');
        logger.error('Unsupported filetype');
        return;
    }
}