const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Set view engine
app.set("view engine", "ejs");

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Receive location from client
  socket.on("sendLocation", (data) => {
    io.emit("receiveLocation", {
      id: socket.id,
      latitude: data.latitude,
      longitude: data.longitude,
    });
  });
  
  // Handle device actions (ring, lost mode, erase)
  socket.on("deviceAction", (data) => {
    const { id, action } = data;
    console.log(`Device action requested for ${id}: ${action}`);
    
    // Emit to the specific device (in a real app)
    // For demo purposes, we'll just broadcast it back
    io.emit("deviceAction", {
      id,
      action,
      timestamp: new Date(),
    });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    io.emit("userDisconnected", socket.id);
  });
});

// Home route
app.get("/", (req, res) => {
  res.render("index");
});

// Start server
server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});

