import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3002/api/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {

    const user = {
      githubId: profile.id,
      username: profile.username,
      email: profile.emails?.[0]?.value
    };

    return done(null, user);
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default passport;