import React, {useEffect, useState} from "react";
import {
    highlightRelevantWords,
    navigateToSelector,
} from "@/Components/utils/SearchUtils";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import MainLayout from "@/Layouts/MainLayout";

function WebsiteSearchResults({
}) {
    const storedContent = JSON.parse(localStorage.getItem("searchState"));
    return (
        <MainLayout>
        <div className="mt-4 py-6">
            {
                storedContent?.content?.length > 0 && (
                    storedContent?.content.map((hit, index) => {
                        const parser = new DOMParser();
                        const hitKey = hit?.highlights?.[0]?.field;
                        const doc = parser.parseFromString(hit?.document[hitKey], "text/html");

                        // Extract the text content from the HTML
                        const textContent = doc.body.textContent;
                        const description = highlightRelevantWords(textContent, storedContent?.searchQuery);

                        return (
                            <div
                                className="flex gap-x-2 py-1.5 hover:bg-goldt/50 hover:cursor-pointer"
                                key={hit.text_match}
                                onClick={() =>
                                    navigateToSelector(
                                        hit?.document?.selector,
                                        hit?.document?.url,
                                        hit,
                                        setIsOpen,
                                    )
                                }
                            >
                                <ArrowRightAltIcon height={20} width={20} />
                                <p className="line-clamp-1">{description}</p>
                            </div>
                        )
                    })
                )
            }
        </div>
        </MainLayout>
    );
}

export default WebsiteSearchResults;
