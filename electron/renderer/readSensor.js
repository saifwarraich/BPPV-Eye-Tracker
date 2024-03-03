const { SerialPort } = require("serialport");

// Define the port name
const portName = "/dev/ttyACM0";

// Create a new SerialPort instance
const port = new SerialPort({ path: portName, baudRate: 115200 }, function (
  err
) {
  if (err) {
    return console.log("Error: ", err.message);
  }
});

// Open the port
// port.open((err) => {
//   if (err) {
//     console.error("Error opening port:", err);
//     return;
//   }

//   console.log("Port opened successfully");

//   // Read data from the port
// });

setInterval(() => {
  port.read((err, data) => {
    if (err) {
      console.error("Error reading data:", err.message);
      return;
    }

    if (data) {
      console.log("Data:", data.toString());
    }
  });
}, 500);

// port.on("data", (data) => {
//   console.log("Data:", data.toString());
//   setTimeout(1000);
// });

// Handle errors
port.on("error", (err) => {
  console.error("Error:", err);
});

// Close the port when you're done
// port.close();
