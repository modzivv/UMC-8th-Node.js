import { prisma } from "../db.config.js";

export const findRegionById = async (regionId) => {
  return prisma.region.findUnique({
    where: { id: regionId }
  });
};

export const findStoreById = async (storeId) => {
  return prisma.store.findUnique({
    where: { id: storeId }
  });
};

export const createStore = async (storeData) => {
  const store = await prisma.store.create({
    data: {
      name: storeData.name,
      address: storeData.address,
      description: storeData.description || null,
      region_id: storeData.regionId
    }
  });
  
  return store;
};