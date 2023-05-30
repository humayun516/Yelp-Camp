const mongoose = require("mongoose");
const campground = require("../models/campground");
const { places, descriptors } = require("./seedHelpers");
const cities = require("./cities");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await campground.deleteMany({});
  //   const c = new campground({ title: "purple field" });
  //   await c.save();
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam, velit autem dolores quos nesciunt consequuntur incidunt voluptates alias hic maxime molestiae, expedita numquam ex ipsam voluptate veniam nihil earum pariatur.",
      price,
    });

    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
