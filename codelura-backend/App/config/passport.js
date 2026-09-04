import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const callbackURL =
  process.env.GITHUB_CALLBACK_URL ||
  "http://localhost:3002/api/auth/github/callback";

if (githubClientId && githubClientSecret) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: githubClientId,
        clientSecret: githubClientSecret,
        callbackURL: callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = {
            githubId: profile.id,
            username: profile.username,
            email: profile.emails?.[0]?.value,
          };

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn("⚠️ GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET missing. GitHub OAuth is disabled.");
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default passport;