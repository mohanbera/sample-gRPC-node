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
  { id: "1", name: "Apple" },
  { id: "2", name: "Mango" },
  { id: "3", name: "Orange" },
  { id: "4", name: "Cherry" },
  { id: "5", name: "Banana" },
  { id: "6", name: "Pineapple" },
];

server.addService(fruitProto.FruitService.service, {
  getStreamOfFruits: sendFruitsAsStream,
});

async function sendFruitsAsStream(call) {
  let count = 1;
  for (const fruit of fruits) {
    setTimeout(function () {
      call.write({ Fruit: fruit });
    }, 1000 * count);
    console.log(count);
    count++;
  }

  setTimeout(function () {
    call.end();
  }, 6000);
}

server.bindAsync(
  "localhost:30001",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at http://localhost:30001");
    server.start();
  }
);
