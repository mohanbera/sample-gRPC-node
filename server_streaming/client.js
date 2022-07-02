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

let call = client.getStreamOfFruits();

call.on("data", function (response) {
  console.log(response.Fruit);
});

call.on("end", function () {
  console.log("Got all the fruits");
});
