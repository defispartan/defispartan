/* eslint-disable @next/next/no-img-element */
import { formatUnits } from 'ethers/lib/utils';
import { EXCLUDE_PUB_IDS, lensHubProxyContract, polygonProvider, PROFILE_ID, STARTING_BLOCK } from '../lib/config';
import { PostBlock } from '../lib/display/PostBlock';
import { getURILink } from '../lib/helpers/getURILink';
import Markup from '../lib/helpers/Markup';
import { Publication } from '../lib/helpers/types';
import { Post } from '../static-build/posts';


async function getProfilePublications() {
    const postFilter = lensHubProxyContract.filters.PostCreated(PROFILE_ID);

    const staticPostFetcher = new Post();
    const posts = (await staticPostFetcher.get()).posts.filter((post) => !EXCLUDE_PUB_IDS.includes(post.args.pubId));
    /* const publications: Publication[] = [];
    try {
        const events = await lensHubProxyContract.queryFilter(postFilter, 36149422, 36159422);
        for (const event of events) {
            if (event && event.args) {
                const publicationContent = await fetch(getURILink(event.args.contentURI))
                const publicationContentJson = await publicationContent.json();
                const publication: Publication = { ...event, args: { ...event.args, timestamp: formatUnits(event.args.timestamp, 0), pubId: formatUnits(event.args.pubId, 0), profileId: formatUnits(event.args.profileId, 0) }, ...publicationContentJson };
                publications.push(publication)
            }
        }
    } catch (e) {
        console.log(e)
    } */
    return posts;
}


export default async function HomePage() {
    const posts = await getProfilePublications();
    return (
        <main>
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-wrap -m-4 justify-center">
                    {
                        posts.map((post, i) => {
                            return (<PostBlock post={post} key={i} />)
                        })
                    }
                </div>
            </div>
        </main>
    );
}
