const PROTO_PATH = "../proto/fruits.proto";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const FruitService = grpc.loadPackageDefinition(packageDefinition).FruitService;

const client = new FruitService(
  "localhost:30001",
  grpc.credentials.createInsecure()
);

let fruits = [
  { id: "1", name: "Apple" },
  { id: "2", name: "Mango" },
  { id: "3", name: "Orange" },
  { id: "4", name: "Cherry" },
  { id: "5", name: "Banana" },
  { id: "6", name: "Pineapple" },
];

// get the call,
let call = client.sendFruitsAsStream(function (error, response) {
  // and handle the response after sending the stream
  if (error) {
    console.log("Got some error", error);
    return;
  }
  console.log("Total number of fruit is => ", response.count);
});

async function sendFruitsAsStream() {
  let count = 1;
  for (const fruit of fruits) {
    setTimeout(function () {
      call.write(fruit);
     
    }, 1000 * count);
    console.log(count);
    count++;
  }

  setTimeout(function () {
    call.end();
  }, 6000);
}

sendFruitsAsStream();
