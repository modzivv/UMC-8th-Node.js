import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { prisma } from "./db.config.js";

dotenv.config();

// 기존 Google Strategy
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/oauth2/callback/google",
    scope: ["email", "profile"],
    state: true,
  },
  (accessToken, refreshToken, profile, cb) => {
    return googleVerify(profile)
      .then((user) => cb(null, user))
      .catch((err) => cb(err));
  }
);

// 새로 추가하는 GitHub Strategy
export const githubStrategy = new GitHubStrategy(
  {
    clientID: process.env.PASSPORT_GITHUB_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/oauth2/callback/github",
    scope: ["user:email"],
  },
  (accessToken, refreshToken, profile, cb) => {
    return githubVerify(profile)
      .then((user) => cb(null, user))
      .catch((err) => cb(err));
  }
);

// 기존 Google 검증 함수
const googleVerify = async (profile) => {
  const email = profile.emails?.[0]?.value;
  if (!email) {
    throw new Error(`profile.email was not found: ${profile}`);
  }

  const user = await prisma.user.findFirst({ where: { email } });
  if (user !== null) {
    return { id: user.id, email: user.email, name: user.name };
  }

  const created = await prisma.user.create({
    data: {
      email,
      name: profile.displayName,
      gender: "추후 수정",
      birth: new Date(1970, 0, 1),
      address: "추후 수정",
      detailAddress: "추후 수정",
      phoneNumber: "추후 수정",
    },
  });

  return { id: created.id, email: created.email, name: created.name };
};

// 새로 추가하는 GitHub 검증 함수
const githubVerify = async (profile) => {
  const email = profile.emails?.[0]?.value;
  const username = profile.username || profile.displayName || "GitHub User";
  
  if (!email) {
    throw new Error(`profile.email was not found: ${profile}`);
  }

  const user = await prisma.user.findFirst({ where: { email } });
  if (user !== null) {
    return { id: user.id, email: user.email, name: user.username };
  }

  const created = await prisma.user.create({
    data: {
      email,
      username: username,
      gender: "추후 수정",
      birth_date: new Date(1970, 0, 1),
      address: "추후 수정",
      detail_address: "추후 수정",
    },
  });

  return { id: created.id, email: created.email, name: created.username };
};