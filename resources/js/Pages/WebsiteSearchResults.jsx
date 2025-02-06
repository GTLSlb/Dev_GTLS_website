import React, {useEffect, useState} from "react";

function WebsiteSearchResults({
}) {
    const content = window.history.state;
    console.log("content", content);
    return (
        <div>
            {
                content?.length > 0 && (
                    content.map((hit, index) => {
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
    );
}

export default WebsiteSearchResults;
