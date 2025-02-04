import React from "react";
import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import SearchCard from "../SearchCard/SearchCard";
function SearchLatest() {
    const blogs = [
        {
            title: "Introducing Gold Tiger’s New B-Triple Solution: Expanding Capacity and Efficiency in Freight",
            date: "2024-12-24",
            image: "http://localhost:1337/uploads/B_Triple_3c69e35556.webp",
        },
        {
            title: "Introducing Gold Tiger’s New B-Triple Solution: Expanding Capacity and Efficiency in Freight",
            date: "2024-12-24",
            image: "http://localhost:1337/uploads/B_Triple_3c69e35556.webp",
        },
        {
            title: "Introducing Gold Tiger’s New B-Triple Solution: Expanding Capacity and Efficiency in Freight",
            date: "2024-12-24",
            image: "http://localhost:1337/uploads/B_Triple_3c69e35556.webp",
        },
    ];
    return (
        <div>
            {" "}
            <div className="border-b-2 border-goldt text-goldt w-fit mb-4 ">
                Latest News
            </div>
            <div className="flex w-full justify-center gap-4">
                {blogs.map((blog) => (
                    <SearchCard blog={blog} />
                ))}
            </div>
        </div>
    );
}

export default SearchLatest;
