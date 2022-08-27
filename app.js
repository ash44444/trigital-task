const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb://localhost:27017/admin",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("DB connected");
  }
);

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  day: String,
  date: String,
});

const User = new mongoose.model("User", userSchema);

//create user in database
app.post("/register", (req, res) => {
  const { name, phone, day, date } = req.body;

  let user = new User({
    name,
    phone,
    day,
    date,
  });
  user.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send({ message: "Successfully Registered, Please login now." });
    }
  });
});

//search user with one letter
app.get("/search/:key", async (req, res) => {
  let data = await User.find({
    $or: [{ name: { $regex: req.params.key } }],
  });

  res.send(data);
});

//for day to day search
const getDocument = async () => {
  try {
    const result = await User.find({
      $and: [{ date: { $gt: "22/8/2022" } }, { date: { $lt: "28/8/2022" } }],
    });

    console.log(result);
  } catch (error) {
    console.log(err);
  }
};

getDocument();

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
