//user input
const readline = require('readline-sync');
const moment = require('moment');
const logger = require("./logger.js").logger;
const DataFormatter = require("./dataConversion").DataFormatter;

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

exports.createRecordArray = function(path){
    const fs = require('fs');
    logger.debug('Trying to read from ' + path)
    let recordArray;
    let text;

    try{
        text = fs.readFileSync(path);
    }
    catch (err) {
        logger.error('File read failed', err)
        throw err;
    }

    try{
        if(path.match("/*.json")){
            recordArray = DataFormatter.createRecordArrayFromJson(text);
            return recordArray;
        }
        else if(path.match("/*.csv")){
            recordArray = DataFormatter.createRecordArrayFromCsv(text);
            return recordArray;
        }
        else if(path.match("/*.xml")){
            recordArray = DataFormatter.createRecordArrayFromXml(text);
            return recordArray;
        }
        else{
            let message = 'Unsupported filetype';
            logger.error(message);
            throw message;
        }
    }
    catch(err){
        logger.error("Error while converting to domain model", err);
        throw err;
    }
}