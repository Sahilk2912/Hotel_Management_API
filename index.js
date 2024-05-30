const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());
//Adds a middleware 

//Room array with status (0=Unoccupied)
const rooms = [
  { id: 101, status: 0 },
  { id: 102, status: 0 },
  { id: 103, status: 0 },
  { id: 104, status: 0 },
  { id: 105, status: 0 },
];

//Customers Arrray
const customers = [
    {
        id: 1,
        name: "John",
        no: 1234567890,
        room: 0
    }//Example Data
];


app.get('/', (req, res) => {
    res.send('Hello World!!');
});

//Route to get status of all Rooms 
app.get('/api/rooms', (req, res) => {
    res.send(rooms);
})


//Route to get details of all customers
app.get("/api/customers", (req, res) => {
  res.send(customers);
});




//Route to get status of a specific room by its ID
app.get("/api/rooms/:id", (req, res) => {
  const roomId = parseInt(req.params.id, 10);
  const room = rooms.find((r) => r.id === roomId);

  if (room) {
    res.send({ id: room.id, status: room.status });
  } else {
    res.status(404).send({ error: "Room not found" });
  }
});
// req.query stores the query and can be displayed via req.query 

//Joi is used to check for input validation
app.post("/api/customers", (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    no: Joi.number().integer().min(10).required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).send(error.details[0].message);
  }
  // Find the first empty room
  const room = rooms.find((r) => r.status === 0);
  if (!room) {
    return res.status(400).send("No available rooms");
  }

  // Assign the room to the customer
  const customer = {
    id: customers.length + 1,
    name: req.body.name,
    no: req.body.no,
    room: room.id,
  };
  customers.push(customer);

  // Update the room status to occupied (1)
  room.status = 1;

  res.send(customer);
});


//Port to Update Customer Details
app.put("/api/customer/:room", (req, res) => {

const roomId = parseInt(req.params.room, 10);
const customer = customers.find((r) => r.room === roomId);
    if (!customer) {
    //Check if room exists or not
  return res.status(404).send("Room not Found");
    }
    //Check for Input Validation
const schema = Joi.object({
    name: Joi.string().min(3).required(),
    no: Joi.number().integer().min(10).required(),
  });
    const result = schema.validate(req.body);
    if (result.error) {
      return res.status(400).send(error.details[0].message);
    }
    //Updating
    customer.name = req.body.name;
    customer.no = req.body.no;

    res.send(customer);
    //Sending it back to the client
});

// Route to delete a customer by room ID and update the room status
app.delete("/api/customer/:room", (req, res) => {

  const roomId = parseInt(req.params.room, 10);
  const customerIndex = customers.findIndex(c => c.room === roomId);
  const room = rooms.find((r) => r.id === roomId);
    
    //Checking if room is occupied or not
    if (room.status === 0) {
        return res.status(400).send("Room is not occupied")
        }

  if (customerIndex === -1) {
    // Check if customer exists for the given room
    return res.status(404).send("Room not found");
  }
  const customer = customers.splice(customerIndex, 1)[0];
  // Find the room and update its status to unoccupied (0)
  if (room) {
    room.status = 0;
  }
  res.send("Deleted successfully");
  // Confirmation
});


//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Live on http://localhost:${port}`));