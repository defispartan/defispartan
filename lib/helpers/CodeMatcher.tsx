import type { ChildrenNode } from 'interweave';
import { Matcher } from 'interweave';
import Highlight, { defaultProps } from 'prism-react-renderer';
import dracula from 'prism-react-renderer/themes/dracula';

export class CodeMatcher extends Matcher {
    replaceWith(children: ChildrenNode, props: any) {
        console.log(props)
        return (
            <code>{props.match}</code>
        );
    }

    asTag(): string {
        return 'code';
    }

    match(value: string) {
        return this.doMatch(
            value,
            /`(.*?)`/u,
            (matches) => ({
                match: matches[1]
            }),
            true
        );
    }
}
