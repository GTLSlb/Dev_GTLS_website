import LogoWhite from "../assets/pictures/LogoWhite.webp";
import notFound from "../assets/pictures/404.webp";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import { Button } from "@nextui-org/react";
import { useState } from "react";

export default function Subsribe() {
    const { id } = usePage().props;
    const number = Number(id.replace(/[\[\]]/g, ""));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    function subscribefunc() {
        setLoading(true);
        axios
            .get(`/api/subscribe/${number}`)
            .then((response) => {
                setLoading(false);
                setSuccess(true);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                setError(error);
            });
    }
    return (
        <main className="relative isolate h-full items-center  bg-dark bg-header">
            <div className="bg-tiremark bg-cover min-h-screen  flex flex-col ">
                <div className="flex flex-col   items-center gap-y-24 mt-32">
                    <div className="w-full flex justify-center">
                        <img
                            src={LogoWhite}
                            alt=""
                            className="items-center w-1/4"
                        />
                    </div>
                    <div className="w-full flex flex-col items-center justify-center gap-5">
                        <div className="text-3xl sm:text-3xl text-smooth  font-bold flex justify-center">
                            Subscribe to our news 
                        </div>
                        {!success ? (
                            <Button
                                radius="full"
                                isLoading={loading}
                                disabled={loading}
                                onPress={subscribefunc}
                                className="bg-gradient-to-r p-6 font-semibold from-goldl to-goldd text-black shadow-lg"
                            >
                                Subscribe
                            </Button>
                        ) : (
                            <div className="text-2xl text-smooth  font-bold">
                                You have successfully subscribe to our flood
                                notifications
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
