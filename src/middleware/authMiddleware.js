import { StatusCodes } from "http-status-codes";

// 로그인이 필요한 API에 사용하는 미들웨어
export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: "error",
      message: "로그인이 필요합니다.",
      code: "AUTH_REQUIRED"
    });
  }
  next();
};

// 선택적 인증 (로그인하면 사용자 정보 사용, 안 하면 익명)
export const optionalAuth = (req, res, next) => {
  // req.user가 있으면 사용, 없으면 그냥 통과
  next();
};