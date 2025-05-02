import * as storeRepository from "../repositories/storeRepository.js";

export const addStore = async (storeData) => {
  // 지역이 존재하는지 확인
  const region = await storeRepository.findRegionById(storeData.regionId);
  if (!region) {
    throw new Error("해당 지역이 존재하지 않습니다.");
  }
  
  // 가게 추가
  const store = await storeRepository.createStore(storeData);
  return store;
};