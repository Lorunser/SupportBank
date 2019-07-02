//#region imports
//user input
const readline = require('readline-sync');

//file input
/*
//const filename = './DodgyTransactions2015.csv';
//const filename = './Transactions2014.csv';
const filename = './Transactions2013.json';
const fs = require('fs');
const readStream = fs.createReadStream(filename);
const lineReader = require('readline').createInterface({
    input: readStream
});
*/

//file imports
record = require('./record.js');
Person = require('./person.js').Person;
createPeopleObject = require('./person.js').createPeopleObject;
//#endregion

//#region logging
var log4js = require('log4js');

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: './logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});

const logger = log4js.getLogger('./logs/debug.log');
//#endregion

//#region input and reading
function getInput(people){
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
    /*
    var lines = new Array();
    var recordArray = new Array();
    logger.debug('Trying to read from ' + filename)
    
    lineReader.on('line', function (line) {
        lines.push(line);
    });

    readStream.on('end', () => {
        if(recordArray.length == 0){
            logger.debug('Finished reading in file');
            recordArray = record.createRecordArrayFromCSV(lines);
            main(recordArray);
        }
    })
    */

    let lines = csvString.split("\n");
    let recordArray = record.createRecordArrayFromCSV(lines); 
}

function readJSON(jsonString){
    try{
        let jsonArray = JSON.parse(jsonString);
        let recordArray = record.createRecordArrayFromJson(jsonArray);
        main(recordArray);
    }  
    catch(err) {
        console.log('Error parsing JSON string:', err)
        logger.error('Error parsing JSON string:', err)
    }
}

function readXML(xmlString){
    try{
        let convert = require('xml-js');
        let jsonString = convert.xml2json(xmlString);
        readJSON(jsonString);
    }
    catch(err) {
        console.log('Error parsing XML :', err)
        logger.error('Error parsing XML :', err)
    }    
}

function readFile(path){
    const fs = require('fs');
    logger.debug('Trying to read from ' + path)

    fs.readFile(path, (err, text) => {
        if (err) {
            console.log("File read failed:", err);
            logger.error('File read failed', err)
            return;
        }

        if(path.match("/*.json")){
            readJSON(text);
        }
        else if(path.match("/*.csv")){
            readCSV();
        }
        else if(path.match("/*.xml")){
            readXML();
        }
        else{
            console.log('Unsupported filetype');
            logger.error('Unsupported filetype');
        })
}
//#endregion

//main
function main(recordArray){
    var people = createPeopleObject(recordArray);
    
    while(true){
        var secondOption = getInput(people);
        var name, person;

        if(secondOption === "All"){
            var nameArray = Object.keys(people).sort();

            for(var i = 0; i < nameArray.length; i++){
                name = nameArray[i];
                person = people[name];
                person.displayBalance();
            }
        }
        else{
            var name = secondOption;
            var person = new Person(recordArray, name);

            person.displayTransactions();
        }
    }
}

logger.debug('Program launched');
readFile("./Transactions2013.json");