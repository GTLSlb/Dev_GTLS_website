import React from "react";
import { Input } from "@nextui-org/react";
import { useState } from "react";
import axios from "axios";

function Subscribe() {
    const [email, setEmail] = useState();
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState();
    const [success, setSuccess] = useState(false);
    const [status, setStatus] = useState();
    function handleEmail(e) {
        setEmail(e.target.value);
    }

    const isValidEmail = (email) => {
        // Simple regex for email validation
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    function handleSubmit(e) {
        e.preventDefault();
        if (isValidEmail(email)) {
            addSubscriber(email);
            setEmailError();
        } else {
            setEmailError("Please enter a valid email address");
        }
    }

    function addSubscriber() {
        setLoading(true);
        axios
            .get(`/api/add-subscriber/${email}`)
            .then((response) => {
                console.log(response)
                setLoading(false);
                setSuccess(response.data.message);
                setStatus(response.data.success);
            })
            .catch((error) => {
                console.log(error)
                setLoading(false);
                setSuccess(error.response.data.message);
                setStatus(response.response.data.success);
            });
    }

    return (
        <div className="bg-dark">
            <div className="mx-auto max-w-7xl px-6 pb-16 sm:pb-24 lg:px-8">
                <div className="mt-20">
                    <dl className="space-y-16 sm:grid sm:grid-cols-4  sm:gap-x-6 sm:gap-y-16 sm:space-y-0 md:grid-cols-4 lg:grid-cols-4 lg:gap-x-10 ">
                        <div className="col-span-4">
                            <div className=" text-4xl font-semibold leading-10 text-goldt">
                                Subscribe to our traffic notifications
                            </div>
                            <div className="md:flex items-center justify-center">
                                <form
                                    onSubmit={(e) => handleSubmit(e)}
                                    className="flex max-md:flex-col w-full gap-5 justify-center"
                                >
                                    <div className=" relative w-full group mt-8 border-b border-goldt">
                                        <input
                                            type="text"
                                            required
                                            autoComplete="off"
                                            id="name"
                                            name="name"
                                            onChange={handleEmail}
                                            value={email}
                                            className="w-full h-10 px-4 text-sm text-white peer appearance-none bg-transparent outline-none border-dark form-input"
                                        />
                                        <label
                                            htmlFor="name"
                                            className="text-white transform transition-all absolute top-0 left-0 h-full flex items-center pl-2 text-lg group-focus-within:text-xs peer-valid:text-xs group-focus-within:h-1/2 peer-valid:h-1/2 group-focus-within:-translate-y-full peer-valid:-translate-y-full group-focus-within:pl-0 peer-valid:pl-0"
                                        >
                                            Email
                                        </label>
                                        {emailError && (
                                            <p className="text-red-500">
                                                {emailError}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex w-full justify-start items-end ">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="block w-[200px]  rounded-3xl bg-gradient-to-r from-goldl to-goldd hover:from-goldd hover:to-goldl px-3.5 py-2.5 text-center text-md font-bold text-dark shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goldt"
                                        >
                                            {loading ? (
                                                <div className="inset-0 flex justify-center items-center bg-opacity-50">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-dark" />
                                                </div>
                                            ) : (
                                                "Subscribe"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                            {success && (
                                <div className="flex w-full justify-end relative mt-5">
                                    <div className="absolute">
                                        <div
                                            className="bg-goldt mx-8 border  mt-2 w-full border-goldd text-dark px-4 py-3 rounded relative mb-4 sm:col-span-2"
                                            role="alert"
                                        >
                                            <strong className="font-bold">{status ? "Success" : "Error"}</strong>
                                            <span className="block">
                                                {success}
                                            </span>
                                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                                <svg
                                                    onClick={() => {
                                                        setSuccess(false);
                                                        setStatus();
                                                    }}
                                                    className="fill-current h-6 w-6 text-dark cursor-pointer"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 1024 1024"
                                                >
                                                    <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />{" "}
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}

export default Subscribe;
