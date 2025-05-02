import { StatusCodes } from "http-status-codes";
import * as storeService from "../services/storeService.js";

// 특정 지역에 가게 추가하기 API
export const addStoreToRegion = async (req, res) => {
  try {
    const { regionId } = req.params;
    const storeData = {
      ...req.body,
      regionId: parseInt(regionId)
    };
    
    const result = await storeService.addStore(storeData);
    
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "가게가 성공적으로 추가되었습니다.",
      data: result
    });
  } catch (error) {
    console.error("가게 추가 실패:", error);
    res.status(StatusCodes.BAD_REQUEST).json({
      status: "error",
      message: error.message
    });
  }
};