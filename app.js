const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const campground = require("./models/campground");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// app.get("/makecampground", async (req, res) => {
//   const camp = new campground({
//     title: "My Backyard",
//     description: "cheap camping",
//   });
//   await camp.save();
//   res.send(camp);
// });

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  // res.send(req.body)
  const newCampground = new campground(req.body.campground);
  await newCampground.save();
  res.redirect(`/campgrounds/${newCampground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  const showCampground = await campground.findById(req.params.id);
  res.render("campgrounds/show", { showCampground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const editCampground = await campground.findById(req.params.id);
  res.render("campgrounds/edit", { editCampground });
});

app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const submitCampground = await campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${submitCampground._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const deleteCampground = await campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
