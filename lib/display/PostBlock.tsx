"use client"

import { Publication } from "../helpers/types"
import dayjs from 'dayjs';
import Markup from "../helpers/Markup";
import sampleCodeBlock from './test.json';
import Highlight from "prism-react-renderer";



export const PostBlock = ({ post }: { post: Publication }) => {


    return (
        <div className="p-4 lg:w-1/3">
            <div className="h-full bg-gray-700 bg-opacity-40 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                <h2 className="tracking-widest text-xs title-font font-medium text-gray-300 mb-1">{dayjs.unix(Number(post.args.timestamp)).format('D MMM YYYY, HH:mm')}</h2>
                <h1 className="text-white sm:text-2xl text-xl font-medium mb-3">{post.name}</h1>
                <p className="leading-relaxed mb-3"><Markup>{sampleCodeBlock.text || ''}</Markup></p>
                <a className="text-pastel inline-flex items-center">Learn More
                </a>
            </div>
        </div>
    )
}