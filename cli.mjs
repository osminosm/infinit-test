import { getRepositoryFiles } from "./repo-loader.mjs"
import { getStats } from "./stats.mjs";

await getRepositoryFiles();
await getStats()