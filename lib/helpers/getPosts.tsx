import { formatUnits } from 'ethers/lib/utils';
import { lensHubProxyContract, PROFILE_ID } from '../config';
import { getURILink } from './getURILink';
import { Publication } from './types';


export const getPosts = async (
    startBlock: number,
    endBlock: number,
): Promise<{ posts: Publication[] }> => {

    const postFilter = lensHubProxyContract.filters.PostCreated(PROFILE_ID);
    const events = await lensHubProxyContract.queryFilter(postFilter, startBlock, endBlock);
    const postsBlock: Publication[] = await Promise.all(
        // eslint-disable-next-line
        events.map(async (event: any) => {
            const publicationContent = await fetch(getURILink(event.args.contentURI))
            const publicationContentJson = await publicationContent.json();
            const publication: Publication = { ...event, args: { ...event.args, timestamp: formatUnits(event.args.timestamp, 0), pubId: formatUnits(event.args.pubId, 0), profileId: formatUnits(event.args.profileId, 0) }, ...publicationContentJson };
            return publication;
        })
    );

    return { posts: postsBlock };
}