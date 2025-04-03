const fs = require('fs');

fs.readFile('sample.txt', 'utf-8', (err, data) => {
    if(err){
        console.error(err.message);
    }
    else{
        console.log(data);
    }
})

fs.writeFile('newFile.txt', 'This is a new file created by Node.js!', (err) => {
    if(err){
        console.error(err.message);
    }
    else{
        console.log("File created succesfully!");
    }
})

fs.appendFile('sample.txt', '\nAppended content.', (err) =>{
    if(err){
        console.error(err.message);
    }
    else{
        console.log("File updated succesfully!");
    }
})

fs.unlink('newFile.txt', (err) =>{
    if(err){
        console.error(err.message);
    }
    else{
        console.log("File deleted succesfully!");
    }
})