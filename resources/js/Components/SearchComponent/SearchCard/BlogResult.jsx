import React from "react";
import { ChevronDoubleRightIcon } from "@heroicons/react/20/solid";
import "../../../../css/search.css";
import { Card, Image } from "@nextui-org/react";
import { navigateToSelector } from "@/Components/utils/SearchUtils";
import { useState } from "react";
function BlogResult({ result }) {

    const [open, setIsOpen] = useState();

    const document = result.document;

    const title = document.title || document.position_title;
    const description =
        document.description || document.position_details || document.body;
    const imageUrl = document?.img_url;

    const strapiApiUrl = window.Laravel.strapiAppUrl;

    return (
        <Card
            className="flex justify-start bg-transparent text-left text-white p-0"
            isPressable
            onPress={() => {
                navigateToSelector(
                    result?.document?.selector,
                    result?.document?.url,
                    result,
                    setIsOpen
                )
            }}
        >
            <div className={`flex flex-row gap-10 px-4`}>
                {/* {imageUrl && (
                    <Image
                        alt="HeroUI hero Image"
                        src={strapiApiUrl + imageUrl}
                        width={250}
                        height={200}
                        className="object-cover"
                    />
                )} */}

                <div className="mt-2 flex flex-col justify-between w-full">
                    <div>
                        <div className="text-lg font-bold">{title}</div>
                        <div className="line-clamp-3 text-sm w-3/4">
                            <div
                                className="no-style"
                                dangerouslySetInnerHTML={{
                                    __html: description,
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="text-goldt text-sm cursor-pointer flex items-center mt-4">
                        Read more <ChevronDoubleRightIcon className="h-4 w-4" />
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default BlogResult;
