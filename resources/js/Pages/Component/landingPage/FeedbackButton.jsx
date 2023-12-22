import React, { useState } from "react";
import Feedback from "./Feedback";
import { XMarkIcon } from '@heroicons/react/20/solid'

function FeedbackButton() {
    const [showFeedback, setShowFeedback] = useState(false);

    const handleFeedbackButtonClick = () => {
        setShowFeedback(!showFeedback);
    };
    const closeFeedback = () => {
        setShowFeedback(false);
    };

    return (
        <div className="fixed right-[-35px] bottom-[30%]">
            {showFeedback ? (
                <button
                    className="bg-black text-white p-2 rounded-full absolute left-5 -top-[24px]"
                    onClick={closeFeedback}
                >
                    <XMarkIcon className="h-6 w-6 text-white-400" aria-hidden="true"/>
                </button>
            ) : (
                <button 
                    className="bg-goldd text-black p-2 px-5 rounded -rotate-90 font-bold"
                    onClick={handleFeedbackButtonClick}
                >
                    Feedback
                </button>
            )}
            {showFeedback && <Feedback />}
        </div>
    );
}

export default FeedbackButton;