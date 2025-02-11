import { Link } from "@inertiajs/react";
import React from "react";

function NewsCard({ post }) {

    const strapiApiUrl = window.Laravel.strapiAppUrl;

    return (
        <div key={post.documentId} className="">
            <Link
                href={route("newsPage", {
                    slug: post.Slug,
                })}
                className=""
            >
                <div className="h-full ">
                    <div className="relative w-full www">
                        <img
                            src={strapiApiUrl + post.CoverImage.url}
                            alt={post.CoverImage.alternativeText}
                            className=" aspect-[16/9] rounded-2xl bg-gray-100 object-cover object-center  w-full "
                        />

                        <div className="absolute rounded-2xl inset-0 bg-gradient-to-b from-transparent to-goldt opacity-40"></div>
                    </div>
                    <article
                        key={post.documentId}
                        className="flex flex-col items-start justify-between border border-yellow-200 border-opacity-20 rounded-2xl h-72"
                    >
                        <div className="max-w-xl mx-4 mb-6  mt-12">
                            <div className="mt-5 flex items-center gap-x-4 text-xs">
                                <time
                                    dateTime={post.DatePublished}
                                    className="text-goldl font-bold"
                                >
                                    {/* {post.date} */}
                                    {post?.DatePublished?.split("T")[0]}
                                </time>
                            </div>
                            <div className="group relative">
                                <h3 className="mt-3 text-lg leading-6 text-white group-hover:text-gray-600 font-bold line-clamp-2">
                                    <span className="absolute inset-0" />
                                    {post?.Title}
                                </h3>

                                <div
                                    className="mt-5 leading-6 text-gray-400 !text-sm line-clamp-3 blogDescription"
                                    dangerouslySetInnerHTML={{
                                        __html: post.Body,
                                    }}
                                    style={{
                                        fontSize: "14px",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </article>
                </div>
            </Link>
        </div>
    );
}

export default NewsCard;
