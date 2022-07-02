const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "../proto/fruits.proto";

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

client.getAllFruits({id: 1}, (error, Fruits) => {
    if(error) {
        console.log('Some error is there! '+error);
    }
    else {
        console.log(Fruits);
    }
});