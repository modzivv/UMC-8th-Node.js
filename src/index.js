import cors from 'cors';
import dotenv from "dotenv";
import express from "express";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";

import { addStoreToRegion } from "./controllers/storeController.js";
import { addReviewToStore } from "./controllers/reviewController.js";
import { challengeMission } from "./controllers/missionController.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
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

// 기본 라우트
app.get("/", (req, res) => {
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