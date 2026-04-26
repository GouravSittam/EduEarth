import { articlesRepository } from "../repositories/articles.repository.js";
import { cacheService } from "./cache.service.js";

const ARTICLES_CACHE_PREFIX = "articles:list:";
const ARTICLES_STATS_KEY = "articles:stats";

export const articlesService = {
  getListCacheKey(keyInput: string) {
    return `${ARTICLES_CACHE_PREFIX}${keyInput}`;
  },
  async getCachedList<T>(cacheKey: string) {
    return cacheService.get<T>(cacheKey);
  },
  async setCachedList(cacheKey: string, payload: unknown, ttlSeconds = 60) {
    await cacheService.set(cacheKey, payload, ttlSeconds);
  },
  async invalidateListCache() {
    await cacheService.delByPrefix(ARTICLES_CACHE_PREFIX);
    await cacheService.delByPrefix(ARTICLES_STATS_KEY);
  },
  repository: articlesRepository,
};
