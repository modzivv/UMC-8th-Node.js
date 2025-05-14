import { error } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).json(
      error(err.errorCode, err.message, err.statusCode)
    );
  }
  
  if (err.code === 'P2002') {
    return res.status(409).json(
      error('DUPLICATE_ENTRY', '이미 존재하는 데이터입니다', 409)
    );
  }
  
  if (err.code === 'P2025') {
    return res.status(404).json(
      error('NOT_FOUND', '레코드를 찾을 수 없습니다', 404)
    );
  }
  
  console.error('Unexpected error:', err);
  return res.status(500).json(
    error('INTERNAL_SERVER_ERROR', '서버 내부 오류가 발생했습니다', 500)
  );
};