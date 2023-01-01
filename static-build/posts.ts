import lodash from "lodash";
import { JSONFileSync, LowSync } from "lowdb";
import { join } from "path";
import { BLOCK_LIMIT, polygonProvider, STARTING_BLOCK } from "../lib/config";
import { getPosts } from "../lib/helpers/getPosts";
import { Publication } from "../lib/helpers/types";

class LowWithLodash<T> extends LowSync<T> {
  chain: lodash.ExpChain<this["data"]> = lodash.chain(this).get("data");
}

// Use JSON file for storage
const file = join(process.cwd(), "static-build", "posts.json");
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
    // fallback to empty array
    db.data ||= { posts: [] };
    const provider = polygonProvider;
    // Start indexing from last post in database, or starting block from config
    let latestDbPost = 0;
    if (db.data.posts.length > 0) {
      latestDbPost =
        Number(db.data.posts[db.data.posts.length - 1].args.timestamp) + 1;
    }
    let lastIndexedBlock = Math.max(STARTING_BLOCK, latestDbPost);
    const currentBlock = await provider.getBlockNumber();
    // performed batched event queries until database is synced up until current block
    while (lastIndexedBlock < currentBlock) {
      const { posts } = await getPosts(
        lastIndexedBlock,
        Math.min(currentBlock, lastIndexedBlock + BLOCK_LIMIT)
      );
      posts.forEach((post) => {
        if (db.data && db.data.posts) {
          db.data.posts.push(post);
        } else {
          db.data = { posts: [] };
          db.data.posts.push(post);
        }
        db.write();
      });
      lastIndexedBlock += BLOCK_LIMIT;
    }

    return db.data.posts;
  }
}
