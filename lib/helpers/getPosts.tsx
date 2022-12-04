import { formatUnits } from 'ethers/lib/utils';
import { BLOCK_LIMIT, lensHubProxyContract, PROFILE_ID } from '../config';
import { getURILink } from './getURILink';
import { Publication } from './types';


export const getPosts = async (
    lastIndexedBlock: number,
    currentBlock: number,
): Promise<{ posts: Publication[] }> => {

    const postFilter = lensHubProxyContract.filters.PostCreated(PROFILE_ID);
    const posts: Publication[] = [];

    let blockIterator = lastIndexedBlock;
    while (blockIterator < currentBlock) {
        const events = await lensHubProxyContract.queryFilter(postFilter, blockIterator, Math.min(blockIterator + BLOCK_LIMIT, currentBlock));
        blockIterator += BLOCK_LIMIT;
        const postsBlock: Publication[] = await Promise.all(
            // eslint-disable-next-line
            events.map(async (event: any) => {
                const publicationContent = await fetch(getURILink(event.args.contentURI))
                const publicationContentJson = await publicationContent.json();
                const publication: Publication = { ...event, args: { ...event.args, timestamp: formatUnits(event.args.timestamp, 0), pubId: formatUnits(event.args.pubId, 0), profileId: formatUnits(event.args.profileId, 0) }, ...publicationContentJson };
                return publication;
            })
        );
        posts.concat(postsBlock)
    }

    return { posts };
}