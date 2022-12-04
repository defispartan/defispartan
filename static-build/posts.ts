import lodash from "lodash";
import { JSONFileSync, LowSync } from "lowdb";
import { join } from "path";
import { polygonProvider, STARTING_BLOCK } from "../lib/config";
import { getPosts } from "../lib/helpers/getPosts";
import { Publication } from "../lib/helpers/types";

class LowWithLodash<T> extends LowSync<T> {
  chain: lodash.ExpChain<this["data"]> = lodash.chain(this).get("data");
}

// Use JSON file for storage
const file = join(process.cwd(), "src/static-build", "votes.json");
const adapter = new JSONFileSync<{ posts: Publication[] }>(file);
const db = new LowWithLodash(adapter);
db.read();

export class Post {
  async get() {
    const cache = db.data;
    if (!cache) throw new Error(`could not resolve posts`);
    return cache;
  }

  async populate() {
    const provider = polygonProvider;
    const lastIndexedBlock = STARTING_BLOCK;
    const currentBlock = await provider.getBlockNumber();
    const { posts } = await getPosts(lastIndexedBlock, currentBlock);

    posts.forEach((post) => {
      db.data?.posts.push(post);
    });

    await db.write();
  }
}
