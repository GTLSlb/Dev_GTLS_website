import React from "react";
import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
function SearchCard({ blog }) {
    const imageSrc = blog.image;
    const description = blog.title;
    const date = blog.date;
    return (
        <Card className="flex-1 bg-transparent border-1 rounded-2xl border-goldt p-0">
            <CardHeader className="flex-col items-start p-3 pb-0 ">
                <Image
                    alt="Card background"
                    className="object-cover rounded-xl  w-full"
                    src={imageSrc}
                />
            </CardHeader>
            <CardBody className="overflow-visible py-2 px-3 h-auto pb-3 ">
                <p className="text-tiny text-white uppercase line-clamp-3">
                    {description}
                </p>
                <p className="text-xs mt-2 text-goldt">{date}</p>
            </CardBody>
        </Card>
    );
}

export default SearchCard;
