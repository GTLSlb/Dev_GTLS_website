import LogoWhite from "../assets/pictures/LogoWhite.webp";
import "../../../resources/css/app.css";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import { Button, Textarea } from "@heroui/react";
import { useState } from "react";

export default function Unsubsribe() {
    const { id } = usePage().props;
    const number = Number(id.replace(/[\[\]]/g, ""));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [note, setNote] = useState(null);
    const [value, setValue] = useState("");

    function unsubscribefunc() {
        setLoading(true);
        axios
            .post("/api/unsubscribe", {
                id: number,
                note: note,
            })
            .then((response) => {
                setLoading(false);
                setSuccess(true);
            })
            .catch((error) => {
                setLoading(false);
                setError(error);
            });
    }
    return (
        <main className="relative isolate h-full items-center  bg-dark bg-header">
            <div className="bg-tiremark bg-cover min-h-screen  flex flex-col h-full items-center  justify-center ">
                <div className="flex flex-col h-full items-center gap-y-24  justify-center">
                    <div className="w-full flex justify-center">
                        <img
                            src={LogoWhite}
                            alt=""
                            className="items-center w-1/4"
                        />
                    </div>
                    <div className="w-full flex flex-col items-center justify-center gap-5">
                        <div className="text-3xl sm:text-3xl text-smooth  font-bold flex justify-center">
                            Are you sure you want to unsubscribe ?
                        </div>
                        {!success ? (
                            <form className="flex flex-col w-full items-center gap-24">
                                <Textarea
                                    variant="underlined"
                                    label="Reason"
                                    labelPlacement="outside"
                                    placeholder="Why are you unsubscribing ?"
                                    className="max-w-lg text-white"
                                    value={note}
                                    onValueChange={setNote}
                                />
                                <Button
                                    radius="full"
                                    isLoading={loading}
                                    disabled={loading}
                                    onPress={unsubscribefunc}
                                    className="bg-gradient-to-r p-6 font-semibold from-goldl to-goldd text-black shadow-lg"
                                >
                                    Unsubscribe
                                </Button>
                            </form>
                        ) : (
                            <div className="text-2xl text-smooth  font-bold">
                                You have unsubscribed from our flood
                                notifications
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
