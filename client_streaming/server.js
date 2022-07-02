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


server.addService(fruitProto.FruitService.service, 
    { sendFruitsAsStream: sendCountOfFruits }
);

function sendCountOfFruits(call, callback) {
    let fruitCount = 0;
    call.on('data', function(fruitStream) {
        console.log('The fruit id => ', fruitStream.id, ' & name is => ',fruitStream);
        fruitCount++;
    });

    call.on('end', function() {
        callback(null, { count: fruitCount});
    });
}

server.bindAsync(
  "localhost:30001",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at http://localhost:30001");
    server.start();
  }
);
