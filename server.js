import fs from "fs";
import https from "https";
import util from "util";
import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import bodyParser from "body-parser";
import { config } from "./config.js";
import { reset_firebase } from "./firebase.js";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const writeFileAsync = util.promisify(fs.writeFile);
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

let isDEV = true;
const PORT = config.PORT;
const PORT_DEV = 3000;
const INDEX = __dirname + "/public/index.html";
const INDEX_DEV = __dirname + "/public/index_dev.html";

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};

let APP_DATA = null;
let AUTH_DATA = null;

// Set up passport with a local strategy
passport.use(
  new LocalStrategy((username, password, done) => {
    if (username === config.USER && password === config.USER_PASS) {
      return done(null, { id: 1, username: config.USER });
    } else {
      return done(null, false);
    }
  })
);

// Set up session handling
app.use(
  session({
    secret: config.SESSION_SECRET, // Replace this with a random secret key
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport and session middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));

// Set up serialization and deserialization of user object
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Replace this with actual database lookup
  if (id === 1) {
    done(null, { id: 1, username: config.USER });
  } else {
    done(new Error("User not found"));
  }
});

// Set up home page
app.get("/", (req, res) => {
  isDEV ? res.sendFile(INDEX) : res.sendFile(INDEX_DEV);
  // res.sendFile(INDEX);
});
app.get("/data", async (req, res) => {
  let data_out;
  if (req.isAuthenticated()) {
    if (!AUTH_DATA) AUTH_DATA = await reset(true);
    data_out = AUTH_DATA;
  } else {
    if (!APP_DATA) APP_DATA = await reset(false);
    data_out = APP_DATA;
  }
  res.json(data_out);
});
app.get("/reset", isAuthenticated, async (req, res) => {
  AUTH_DATA = await reset(true);
  APP_DATA = await reset(false);
  res.json(AUTH_DATA);
});

// Set up login and logout routes
app.post(
  "/do_login",
  urlencodedParser,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return next(err);
    }
    res.redirect("/");
  });
});

const reset = async (isAuthenticated, andSave = false) => {
  const firebase_data = await reset_firebase();
  let data_out = [
    {
      id: "radios",
      type: "folder",
      name: "radios",
      children: firebase_data.radios,
    },
    {
      id: "music",
      type: "folder",
      name: "music",
      children: firebase_data.music,
    },
    {
      id: "open",
      type: "open",
      name: "open...",
    },
  ];
  if (isAuthenticated) {
    data_out.push({
      id: "settings",
      type: "folder",
      name: "settings",
      children: [
        {
          id: "logout",
          type: "logout",
          name: "logout",
        },
        {
          id: "reset",
          type: "reset",
          name: "reset",
        },
      ],
    });
  } else {
    data_out.push({
      id: "settings",
      type: "folder",
      name: "settings",
      children: [
        {
          id: "login",
          type: "login",
          name: "login",
        },
      ],
    });
  }

  data_out.push({
    id: "exit",
    type: "exit",
    name: "exit",
  });

  isAuthenticated ? (AUTH_DATA = data_out) : (APP_DATA = data_out);

  if (andSave) {
    try {
      const fileName = isAuthenticated ? "/auth_data.json" : "/app_data.json";
      const publicDirPath = path.join(__dirname, "public");
      const app_data_path = path.join(publicDirPath, fileName);
      await writeFileAsync(app_data_path, JSON.stringify(data_out));
    } catch (error) {
      console.log("error", error);
    }
  }

  return data_out;
};

// Start the server

if (isDEV) {
  app.listen(PORT_DEV, async () => {
    try {
      AUTH_DATA = await reset(true, true);
      APP_DATA = await reset(false, true);
      let rawdata = fs.readFileSync("public/app_data.json");
      APP_DATA = JSON.parse(rawdata);
      rawdata = fs.readFileSync("public/auth_data.json");
      AUTH_DATA = JSON.parse(rawdata);
    } catch (error) {
      console.error("DEV Error", error);
    }

    console.log(`DEV Server listening at port ${PORT_DEV}`);
  });
} else {
  const options = {
    key: fs.readFileSync("/app/privkey.pem"),
    cert: fs.readFileSync("/app/fullchain.pem"),
  };

  https.createServer(options, app).listen(PORT, async () => {
    try {
      AUTH_DATA = await reset(true, true);
      APP_DATA = await reset(false, true);
      let rawdata = fs.readFileSync("public/app_data.json");
      APP_DATA = JSON.parse(rawdata);
      rawdata = fs.readFileSync("public/auth_data.json");
      AUTH_DATA = JSON.parse(rawdata);
    } catch (error) {
      console.error("Error", error);
    }
    console.log(`DEV Server listening at port ${PORT}`);
  });
}
