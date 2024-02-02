import React, { useState, useEffect } from "react";
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/20/solid'

function Feedback() {
    const [emoji, setEmoji] = useState("");
    const [additionalFeedback, setAdditionalFeedback] = useState("")
    const [submitted, setSubmitted] = useState(false);

    const handleEmojiClick = (emojiType) => {
        setEmoji(emojiType);

    }
    const handleFeedbackChange = (e) => {
        setAdditionalFeedback(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(emoji)
        console.log(additionalFeedback)
        setSubmitted(true);
    }
    return (
        <div className="bg-white w-80 p-[10px] mr-[35px] justify-center rounded-lg">
            {submitted ? (
                <div className="">
                    <div className="flex-shrink-0 inline-block align-middle">
                        <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3  py-4 inline-block ">
                        <p className="text-sm font-medium text-gray-900">Successfully Submited!</p>
                       
                    </div>
                </div>
                
            ) : (
            <form onSubmit={handleSubmit} className="">
                {!emoji ? ( 
                <p className="text-center text-gray-600 px-10 my-5">How likely would you be to recommend Gold Tiger Group of Companies website's to a colleage?</p>
                ) : (                   
                    <p></p>
                )}
                <div className="flex justify-center my-5">
                    <svg
                        className={`fill-current ${emoji === "Annoyed" ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"
                        }  mx-2`}
                        onClick={() => handleEmojiClick("Annoyed")}
                        xmlns="http://www.w3.org/2000/svg"
                        height="30"
                        width="30"
                        viewBox="0 0 512 512">
                        <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm176.5 64.3C196.1 302.1 223.8 288 256 288s59.9 14.1 79.5 32.3C354.5 338.1 368 362 368 384c0 5.4-2.7 10.4-7.2 13.4s-10.2 3.4-15.2 1.3l-17.2-7.5c-22.8-10-47.5-15.1-72.4-15.1s-49.6 5.2-72.4 15.1l-17.2 7.5c-4.9 2.2-10.7 1.7-15.2-1.3s-7.2-8-7.2-13.4c0-22 13.5-45.9 32.5-63.7zm-43-173.6l89.9 47.9c10.7 5.7 10.7 21.1 0 26.8l-89.9 47.9c-7.9 4.2-17.5-1.5-17.5-10.5c0-2.8 1-5.5 2.8-7.6l36-43.2-36-43.2c-1.8-2.1-2.8-4.8-2.8-7.6c0-9 9.6-14.7 17.5-10.5zM396 157.1c0 2.8-1 5.5-2.8 7.6l-36 43.2 36 43.2c1.8 2.1 2.8 4.8 2.8 7.6c0 9-9.6 14.7-17.5 10.5l-89.9-47.9c-10.7-5.7-10.7-21.1 0-26.8l89.9-47.9c7.9-4.2 17.5 1.5 17.5 10.5z" />
                    </svg>

                    <svg
                        className={`fill-current ${emoji === "Dislike" ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"
                            }  mx-2`}
                        onClick={() => handleEmojiClick("Dislike")}
                        xmlns="http://www.w3.org/2000/svg"
                        height="30"
                        width="30"
                        viewBox="0 0 512 512">
                        <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM182.4 382.5c-12.4 5.2-26.5-4.1-21.1-16.4c16-36.6 52.4-62.1 94.8-62.1s78.8 25.6 94.8 62.1c5.4 12.3-8.7 21.6-21.1 16.4c-22.4-9.5-47.4-14.8-73.7-14.8s-51.3 5.3-73.7 14.8zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                    </svg>

                    <svg
                         className={`fill-current ${emoji === "Neutral" ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"
                        }  mx-2`}
                        onClick={() => handleEmojiClick("Neutral")}
                        xmlns="http://www.w3.org/2000/svg"
                        height="30"
                        width="30"
                        viewBox="0 0 512 512">
                        <path d="M256 48a208 208 0 1 0 0 416 208 208 0 1 0 0-416zM512 256A256 256 0 1 1 0 256a256 256 0 1 1 512 0zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                    </svg>

                    <svg
                         className={`fill-current ${emoji === "Like" ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"
                        }  mx-2`}
                        onClick={() => handleEmojiClick("Like")}
                        xmlns="http://www.w3.org/2000/svg"
                        height="30"
                        width="30"
                        viewBox="0 0 512 512">
                        <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm130.7 57.9c-4.2-13.6 7.1-25.9 21.3-25.9H364.5c14.2 0 25.5 12.4 21.3 25.9C369 368.4 318.2 408 258.2 408s-110.8-39.6-127.5-94.1zm86.9-85.1l0 0 0 0-.2-.2c-.2-.2-.4-.5-.7-.9c-.6-.8-1.6-2-2.8-3.4c-2.5-2.8-6-6.6-10.2-10.3c-8.8-7.8-18.8-14-27.7-14s-18.9 6.2-27.7 14c-4.2 3.7-7.7 7.5-10.2 10.3c-1.2 1.4-2.2 2.6-2.8 3.4c-.3 .4-.6 .7-.7 .9l-.2 .2 0 0 0 0 0 0c-2.1 2.8-5.7 3.9-8.9 2.8s-5.5-4.1-5.5-7.6c0-17.9 6.7-35.6 16.6-48.8c9.8-13 23.9-23.2 39.4-23.2s29.6 10.2 39.4 23.2c9.9 13.2 16.6 30.9 16.6 48.8c0 3.4-2.2 6.5-5.5 7.6s-6.9 0-8.9-2.8l0 0 0 0zm160 0l0 0-.2-.2c-.2-.2-.4-.5-.7-.9c-.6-.8-1.6-2-2.8-3.4c-2.5-2.8-6-6.6-10.2-10.3c-8.8-7.8-18.8-14-27.7-14s-18.9 6.2-27.7 14c-4.2 3.7-7.7 7.5-10.2 10.3c-1.2 1.4-2.2 2.6-2.8 3.4c-.3 .4-.6 .7-.7 .9l-.2 .2 0 0 0 0 0 0c-2.1 2.8-5.7 3.9-8.9 2.8s-5.5-4.1-5.5-7.6c0-17.9 6.7-35.6 16.6-48.8c9.8-13 23.9-23.2 39.4-23.2s29.6 10.2 39.4 23.2c9.9 13.2 16.6 30.9 16.6 48.8c0 3.4-2.2 6.5-5.5 7.6s-6.9 0-8.9-2.8l0 0 0 0 0 0z" />
                    </svg>

                    <svg
                         className={`fill-current ${emoji === "Love" ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"
                        }  mx-2`}
                        onClick={() => handleEmojiClick("Love")}
                        xmlns="http://www.w3.org/2000/svg"
                        height="30"
                        width="30"
                        stroke-width="10"

                        viewBox="0 0 512 512">
                        <path
                            d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm349.5 52.4c18.7-4.4 35.9 12 25.5 28.1C350.4 374.6 306.3 400 255.9 400s-94.5-25.4-119.1-63.5c-10.4-16.1 6.8-32.5 25.5-28.1c28.9 6.8 60.5 10.5 93.6 10.5s64.7-3.7 93.6-10.5zM215.3 137.1c17.8 4.8 28.4 23.1 23.6 40.8l-17.4 65c-2.3 8.5-11.1 13.6-19.6 11.3l-65.1-17.4c-17.8-4.8-28.4-23.1-23.6-40.8s23.1-28.4 40.8-23.6l16.1 4.3 4.3-16.1c4.8-17.8 23.1-28.4 40.8-23.6zm122.3 23.6l4.3 16.1 16.1-4.3c17.8-4.8 36.1 5.8 40.8 23.6s-5.8 36.1-23.6 40.8l-65.1 17.4c-8.5 2.3-17.3-2.8-19.6-11.3l-17.4-65c-4.8-17.8 5.8-36.1 23.6-40.8s36.1 5.8 40.9 23.6z" />
                    </svg>

                </div>
                {emoji && (
                    <div className="justify-center">
                        {/* <label>
                            Additional Feedback:

                        </label> */}
                        <textarea className="w-full   bg-gray-200   border-none "
                            value={additionalFeedback}
                            placeholder="Tell us about your experience.."
                            onChange={handleFeedbackChange} />
                            <div className="relative justify-center "> 
                                <button
                                    type="submit"
                                    className="w-full rounded-md bg-goldd px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-goldt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goldt"
                                >
                                    Submit
                                </button>
                            </div>
                        
                    </div>

                )}
            </form>
            )}
        </div>

    )

}
export default Feedback;