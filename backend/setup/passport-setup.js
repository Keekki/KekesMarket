const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../db/database");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://kekesmarketbackend.onrender.com/login/oauth2/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Check if user already exists in the db
      const sql = "SELECT * FROM users WHERE googleId = ?";
      db.get(sql, [profile.id], (err, user) => {
        if (err) {
          return done(err);
        }

        if (!user) {
          // If user doesn't exist, create a new user
          const newUser = {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
          };
          const insertSql = `INSERT INTO users (id, name, email, googleId, password_hash) VALUES (?, ?, ?, ?, ?)`;
          db.run(
            insertSql,
            [
              newUser.id,
              newUser.name,
              newUser.email,
              newUser.googleId,
              newUser.password_hash || null,
            ],
            (err) => {
              if (err) {
                return done(err);
              }
              return done(null, newUser);
            }
          );
        } else {
          // If user exists, return the user
          return done(null, profile);
        }
      });
    }
  )
);

passport.serializeUser((profile, done) => {
  done(null, profile.id);
});

passport.deserializeUser((id, done) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  db.get(sql, [id], (err, profile) => {
    done(err, profile);
  });
});

module.exports = passport;
