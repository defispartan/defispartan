import { Interweave } from 'interweave';
import type { FC, MouseEvent } from 'react';
import { CodeMatcher } from './CodeMatcher';
import { LinkMatcher } from './LinkMatcher';

interface Props {
    children: string;
    className?: string;
    matchOnlyUrl?: boolean;
}

const trimify = (value: string): string => value?.replace(/\n\s*\n/g, '\n\n').trim();

const Markup: FC<Props> = ({ children, className = '' }) => {
    const defaultMatchers = [
        new CodeMatcher('mdCode'),
        new LinkMatcher('mdLink'),
    ];

    return (
        <Interweave
            className={className}
            content={trimify(children)}
            escapeHtml
            allowList={['b', 'i', 'a', 'br', 'code', 'span']}
            matchers={defaultMatchers}
            onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
        />
    );
};

export default Markup;
