if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}





const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review = require('./models/reviews');
const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const mongoose = require("mongoose");
// const Listing = require('./models/listing');
// const reviews = require("./models/reviews");

main().then(() => {
  console.log("connection successful");
}).catch(err => console.log(err));


async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);

}


const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // time in seconds (1 day)
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});




const sessionOptions ={
  store,
  secret: process.env.SECRET,
  resave:false,
  saveUninitialized : true,
  cookie : {
    expires : Date.now()+ 7*24 * 60 * 60 * 1000 ,
    maxAge : 7*24 * 60 * 60 * 1000,
    httpOnly : true,
  }
};


// app.get("/", (req, res) => {
//   res.send("working !!");
// })

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
    res.locals.success = req.flash('success');
     res.locals.error = req.flash('error');
     res.locals.currentUser = req.user;
    next();
});

app.use("/listings" , listingsRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);


app.use((req, res, next) => {
  next(new ExpressError(404, "ERR : 404 , Page Not Found !!"));
});


app.use((err, req, res, next) => {
  let statusCode = Number(err.statusCode) || 500;
  let message = err.message || "Something went wrong!";
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080, () => {
  console.log("Server is listening to the port");
})


