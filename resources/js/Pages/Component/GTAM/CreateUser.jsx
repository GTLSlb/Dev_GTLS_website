import Steps from "@/Components/GTAM/Steps";
import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import SelectAccount from "./components/CreateUser/SelectAccount";
import { useEffect } from "react";
import CompleteProfile from "./components/CreateUser/CompleteProfile";

const notificationMethods = [
    { id: "Customer", title: "Customer" },
    { id: "Employee", title: "Employee" },
    { id: "Driver", title: "Driver" },
];
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
export default function CreateUser({setActiveIndex}) {
    const [checkStep1, setCheckStep1] = useState(false);
    const [step, setStep] = useState(1);
    const [width, setWidth] = useState(5);
    useEffect(() => {
        if (step == 1) {
            setWidth(5);
        } else if (step == 2) {
            setWidth(38);
        } else if (step == 3) {
            setWidth(63);
        } else if (step == 4) {
            setWidth(100);
        }
    }, [step]);

    const nextStep = () => {
        setStep(step + 1);
    };

    const previousStep = () => {
        setStep(step - 1);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <CSSTransition
                        key={1}
                        classNames="slide"
                        timeout={300}
                        exit={false}
                    >
                        <div>
                            <SelectAccount setCheckStep1={setCheckStep1}/>
                            <div className="flex justify-between">
                            <button
                                    className=  {  
                                    classNames(
                                        "  text-white px-5 py-1 rounded bg-dark"
                                    )}
                                    onClick={()=>setActiveIndex(1)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className=  {  
                                    classNames(
                                        checkStep1
                                            ? "bg-dark"
                                            : "bg-gray-400",
                                        "  text-white px-5 py-1 rounded "
                                    )}
                                    onClick={nextStep}
                                    disabled={!checkStep1}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </CSSTransition>
                );
            case 2:
                return (
                    <CSSTransition
                        key={2}
                        classNames="slide"
                        timeout={300}
                        exit={false}
                    >
                        <div className="relative my-5">
                            <CompleteProfile/>
                            <div className="flex justify-between">
                                <button
                                    className=" bg-dark text-white px-5 py-1 rounded"
                                    onClick={previousStep}
                                >
                                    Previous
                                </button>
                                <button
                                    className=" bg-dark text-white px-5 py-1 rounded"
                                    onClick={nextStep}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </CSSTransition>
                );
            case 3:
                return (
                    <CSSTransition
                        key={3}
                        classNames="slide"
                        timeout={300}
                        exit={false}
                    >
                        <div>
                            <h2>Step 3: Confirmation</h2>
                            {/* Your Step 3 form fields here */}
                            <div className="flex justify-between">
                                <button
                                    className=" bg-dark text-white px-5 py-1 rounded"
                                    onClick={previousStep}
                                >
                                    Previous
                                </button>
                                <button
                                    className=" bg-dark text-white px-5 py-1 rounded"
                                    onClick={nextStep}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </CSSTransition>
                );
                case 4:
                return (
                    <CSSTransition
                        key={4}
                        classNames="slide"
                        timeout={300}
                        exit={false}
                    >
                        <div>
                            <h2>Step 4: Create</h2>
                            {/* Your Step 3 form fields here */}
                            <div className="flex justify-between">
                                <button
                                    className=" bg-dark text-white px-5 py-1 rounded"
                                    onClick={previousStep}
                                >
                                    Previous
                                </button>
                                <button
                                    className=" bg-dark text-white px-5 py-1 rounded"
                                    onClick={nextStep}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </CSSTransition>
                );
            default:
                return null;
        }
    };

    return (
        <div className="px-6 lg:px-8 p-10">
            <div className=" max-h-[45rem] overflow-y-scroll border-2 border-white rounded-xl max-w-full mx-auto  bg-white shadow-xl">
                <div className="mx-5 my-5">
                    <div className=" rounded-lg p-6 max-w-full mx-auto overflow-x-hidden">
                        <p className="font-bold text-lg my-4">
                            Create New Employee
                        </p>
                        <div className="my-4">
                            <div
                                className="mt-6 hidden md:block"
                                aria-hidden="true"
                            >
                                <div className="overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-3 rounded-full bg-gray-400"
                                        style={{
                                            width: `${width}%`,
                                            transition:
                                                "width 0.5s ease-in-out", // Add a transition for the width property
                                        }}
                                    />
                                </div>
                                <div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid">
                                    <div className="text-black font-bold">
                                        Select Account
                                    </div>
                                    <div
                                        className={`text-center ${
                                            width >= 38
                                                ? "text-black font-bold"
                                                : "text-gray-400"
                                        } text-center `}
                                    >
                                        Complete Profile
                                    </div>
                                    <div
                                        className={`text-center ${
                                            width >= 63
                                                ? "text-black font-bold"
                                                : "text-gray-400"
                                        } text-center `}
                                    >
                                        Assign To Group Policy
                                    </div>
                                    <div
                                        className={`text-center ${
                                            width >= 100
                                                ? "text-black font-bold"
                                                : "text-gray-400"
                                        } text-right `}
                                    >
                                        Created Successfully
                                    </div>
                                </div>
                            </div>
                        </div>

                        <TransitionGroup>{renderStep()}</TransitionGroup>
                    </div>
                </div>
            </div>
        </div>
    );
}
