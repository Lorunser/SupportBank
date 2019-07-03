//region imports
const Person = require('./person.js').Person;
const createRecordArray = require("./input.js").createRecordArray;
const getInput = require("./input.js").getInput;
const logger = require("./logger.js").logger;

//main
function main(){
    logger.debug('Program launched');
    let recordArray = createRecordArray('./data/Transactions2013.json');
    let people = Person.createPeopleObject(recordArray);
    
    while(true){
        var secondOption = getInput(people, recordArray);
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