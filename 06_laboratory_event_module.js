const EventEmitter = require('events');
const { emit } = require('process');

const emitter = new EventEmitter();

const data = {
    name: "John Doe",
    age: 25
}
emitter.on('start', ()=>{
    console.log('Application Started!');
})

emitter.on('data', (data)=>{
    console.log(`Data Received: ${data.name}, ${data.age}`);
})

emitter.on('error', (err) => {
    console.log(err);
})

emitter.emit('start');
emitter.emit('data', data);
emitter.emit('error', 'something went wong');