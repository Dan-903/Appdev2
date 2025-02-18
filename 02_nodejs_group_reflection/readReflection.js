const fs = require("fs")

fs.readFile("reflection.txt", 'utf-8', readingFile)

function readingFile(error, data){

    console.log(error)
    console.log(data)
}

console.log("This will go first before the content in reflection.txt meaning that the file is read asynchronously") 

