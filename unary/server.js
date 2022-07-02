const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "../proto/fruits.proto";
let protoLoader = require("@grpc/proto-loader");

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};


let packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const fruitProto = grpc.loadPackageDefinition(packageDefinition); 

const server = new grpc.Server();
let fruits = [
    {id: '1', name: 'Apple'},
    {id: '2', name: 'Mango'}
];

const fruit = {id: '1', name: 'Orange'};

const error = new Error("Fruit not found!");

server.addService(fruitProto.FruitService.service, {
    getAllFruits: (call, callback) => {
        const id = +call.request.id;
        console.log('request for fruit id => '+ id);
        if(id>2) {
            callback(error);
            return;
        }
        console.log('Fruit is => '+JSON.stringify(fruits[id - 1]));
        callback(null, {Fruit: fruits[id - 1]});
        
        //for sending some error 
        // callback(error, fruits);

    }
});

server.bindAsync(
    "localhost:30001",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      console.log("Server running at http://localhost:30001");
      server.start();
    }
  );