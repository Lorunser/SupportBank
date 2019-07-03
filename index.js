//#region imports
//file imports
record = require('./record.js');
Person = require('./person.js').Person;
createPeopleObject = require('./person.js').createPeopleObject;
readFile = require("./input.js").readFile;
getInput = require("./input.js").getInput;
const logger = require("./logger.js").logger;

//main
function main(){
    logger.debug('Program launched');
    let recordArray = readFile('./data/Transactions2014.csv');
    let people = createPeopleObject(recordArray);
    
    while(true){
        var secondOption = getInput(people);
        //var secondOption = "Todd";
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

main();