import React from "react";
import { ChevronDoubleRightIcon } from "@heroicons/react/20/solid";
import { Card } from "@nextui-org/react";
function BlogResult() {
    return (
        <Card className="flex justify-start bg-transparent text-left text-white p-0" isPressable>
            <div className="flex flex-row gap-10 px-4">
                <div className="h-[150px] w-[250px]">
                    <img
                        src={
                            "https://admin.gtls.store/uploads/Safety_Cover_9437f9ec0c.webp"
                        }
                        alt={"Test"}
                        className="object-cover rounded-xl h-full w-full"
                    />
                </div>
                <div className="mt-2 flex flex-col justify-between">
                    <div>
                        <div className="text-lg font-bold">
                            Building a Safety-Conscious Workforce with Fire &
                            Safety Australia
                        </div>
                        <div className="line-clamp-3 text-sm w-3/4">
                            Building a Safety-Conscious Workforce with Fire &
                            Safety Australia At Gold Tiger Logistics Company,
                            safety is at the heart of our operations. Recently,
                            our team participated in an essential firefighting
                            training session, facilitated by Fire and Safety
                            Australia, as part of our ongoing commitment to
                            safety and compliance.
                        </div>
                    </div>

                    <div className="text-goldt text-sm cursor-pointer flex items-center">
                        Read more <ChevronDoubleRightIcon className="h-4 w-4" />
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default BlogResult;
