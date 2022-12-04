import { Post } from "./posts";

export async function populateCache() {
  const postFetcher = new Post();
  await postFetcher.populate();
}
populateCache().then(() => console.log("finished"));
