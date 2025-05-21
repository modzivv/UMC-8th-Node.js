import { StatusCodes } from "http-status-codes";
import * as storeService from "../services/storeService.js";

// 특정 지역에 가게 추가하기 API
export const addStoreToRegion = async (req, res) => {
  /*
    #swagger.summary = '지역에 가게 추가하기 API';
    #swagger.description = '특정 지역에 새로운 가게를 추가합니다.';
    #swagger.parameters['regionId'] = {
      in: 'path',
      description: '가게를 추가할 지역 ID',
      required: true,
      type: 'integer'
    };
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", description: "가게 이름" },
              address: { type: "string", description: "가게 주소" },
              phone: { type: "string", description: "가게 전화번호" },
              category: { type: "string", description: "가게 카테고리" },
              ownerCode: { type: "string", description: "사장님 코드" }
            },
            required: ["name", "address"]
          }
        }
      }
    };
    #swagger.responses[201] = {
      description: "가게 추가 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: { type: "string", example: "success" },
              message: { type: "string", example: "가게가 성공적으로 추가되었습니다." },
              data: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  name: { type: "string" },
                  address: { type: "string" },
                  phone: { type: "string" },
                  category: { type: "string" },
                  regionId: { type: "integer" },
                  createdAt: { type: "string", format: "date-time" }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "가게 추가 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: { type: "string", example: "error" },
              message: { type: "string" }
            }
          }
        }
      }
    };
  */
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