// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require("path");

// const app = express();

// mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/backend")
//   .then(() => console.log("Connected to MongoDB"))
//   .catch(err => console.error("MongoDB error:", err));

// app.use(cors());
// app.use(express.json());

// app.use("/profileImages", express.static(path.join(__dirname, "profileImages")));

// app.use("/api/user", require("./routes/userRoutes"));

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/todoapp")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/user", userRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
