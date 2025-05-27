import cors from 'cors';
import dotenv from "dotenv";
import express from "express";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import session from "express-session";
import passport from "passport";
import { googleStrategy } from "./auth.config.js";
import { prisma } from "./db.config.js";

import { addStoreToRegion } from "./controllers/storeController.js";
import { addReviewToStore } from "./controllers/reviewController.js";
import { challengeMission } from "./controllers/missionController.js";

dotenv.config();

// Passport 설정
passport.use(googleStrategy);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session 설정
app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

// OAuth 로그인 라우트
app.get("/oauth2/login/google", passport.authenticate("google"));
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
    failureRedirect: "/oauth2/login/google",
    failureMessage: true,
  }),
  (req, res) => res.redirect("/")
);

// API 라우트들
app.post("/api/regions/:regionId/stores", addStoreToRegion);
app.post("/api/reviews", addReviewToStore);
app.post("/api/missions/:missionId/verify", challengeMission);

// Swagger UI 설정
app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
);

// Swagger JSON 파일 생성을 위한 라우트
app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null";
  const routes = ["./src/index.js"];
  const doc = {
    info: {
      title: "UMC 8th",
      description: "UMC 8th Node.js 테스트 프로젝트입니다.",
    },
    host: "localhost:3000",
  };
  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

// 기본 라우트 (테스트용 - req.user 확인)
app.get("/", (req, res) => {
  // #swagger.ignore = true
  console.log(req.user); // 로그인된 사용자 정보 확인
  res.send("Hello World!");
});

// 특정 지역에 가게 추가하기 API
app.post("/api/regions/:regionId/stores", addStoreToRegion);

// 가게에 리뷰 추가하기 API
app.post("/api/reviews", addReviewToStore);

// 3번 가게에 미션 추가하기 API는 나중에...

// 가게의 미션을 도전 중인 미션에 추가(미션 도전하기) API
app.post("/api/missions/:missionId/verify", challengeMission);

// 404 핸들러 추가
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: '요청한 리소스를 찾을 수 없습니다',
      statusCode: 404,
      timestamp: new Date().toISOString()
    }
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});