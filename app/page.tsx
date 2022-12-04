/* eslint-disable @next/next/no-img-element */
import { formatUnits } from 'ethers/lib/utils';
import { lensHubProxyContract, polygonProvider, PROFILE_ID, STARTING_BLOCK } from '../lib/config';
import { getURILink } from '../lib/helpers/getURILink';
import { Publication } from '../lib/helpers/types';


async function getProfilePublications() {
    const postFilter = lensHubProxyContract.filters.PostCreated(PROFILE_ID);

    // TO-DO: Iterative queryFilter reading from and writing to static-build directory 
    //const latestBlock = polygonProvider.getBlockNumber();
    //const latestQueriedBlock = STARTING_BLOCK;
    const publications: Publication[] = [];
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
    }
    return publications;
}


export default async function HomePage() {
    const posts = await getProfilePublications();
    console.log(posts.length)
    // TO-DO: Fetch with React "use" hook and add next.js loading template page
    return (
        <main>
            <div className="flex justify-center items-center m-auto h-screen p-8">
                {posts.length === 0 && <div className="w-full">
                    <div className="flex justify-center items-center m-auto h-screen">
                        <code className="font-mono text-pastel">Lens publications coming soon</code>
                    </div>
                </div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
                    {
                        posts.map((post, i) => <div className="p-4 bg-gray-400 rounded-md flex items-center justify-center" key={i}>{post.content}</div>)
                    }
                </div>
            </div>
        </main>
    );
}
