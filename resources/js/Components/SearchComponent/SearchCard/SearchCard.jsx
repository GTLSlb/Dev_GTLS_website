import React from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { Link } from "@inertiajs/react";
function SearchCard({ blog }) {
    const strapiApiUrl = window.Laravel.strapiAppUrl;

    const imageSrc = strapiApiUrl + blog.CoverImage.url;
    const imageAlt = blog.CoverImage.alternativeText;
    const description = blog.Title;
    const date = blog.DatePublished;

    return (
        <Card
            className="flex-1 bg-transparent border-1 rounded-2xl border-goldt p-0"
            isPressable
            key={blog.documentId}
            onPress={() => {
                console.log(blog);
            }}
        >
            <Link
                href={route("newsPage", {
                    slug: blog.Slug,
                })}
                className="flex justify-between flex-col h-full w-full"
            >
                <CardHeader className="flex-col items-start p-3 pb-0 ">
                    <img
                        src={imageSrc}
                        alt={imageAlt}
                        className="w-full h-[200px] object-cover rounded-xl"
                    />
                </CardHeader>
                <CardBody className="overflow-visible px-3 pb-0">
                    <p className="text-tiny text-white line-clamp-3">
                        {description}
                    </p>
                </CardBody>
                <CardFooter className="pt-1">
                    <p className="text-xs mt-2 text-goldt">{date}</p>
                </CardFooter>
            </Link>
        </Card>
    );
}

export default SearchCard;
