import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronUpDownIcon,
    ChevronLeftIcon,
} from "@heroicons/react/20/solid";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const branches = [
    {
        id: 0,
        branchName: "test1",
    },
    {
        id: 1,
        branchName: "test2",
    },
    {
        id: 2,
        branchName: "test3",
    },
];

export default function CompleteProfile() {
    const [selectedBranch, setSelectedBranch] = useState(branches[0]);
    return (
        <div className="py-2">
            <h1 className="font-bold text-dark">Personal Information</h1>
            <p className="text-gray-500">
                This information will be displayed publicly so be careful what
                you share.
            </p>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-x-20 gap-y-2 py-5">
                <div>
                    <label
                        htmlFor="FullName"
                        className="block text-sm font-bold leading-6 text-gray-900"
                    >
                        Full name
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="Fullname"
                            id="Fullname"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="JobTitle"
                        className="block text-sm font-bold leading-6 text-gray-900"
                    >
                        Job Title
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="JobTitle"
                            id="JobTitle"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="Phone"
                        className="block text-sm font-bold leading-6 text-gray-900"
                    >
                        Phone
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="Phone"
                            id="Phone"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="Email"
                        className="block text-sm font-bold leading-6 text-gray-900"
                    >
                        Email
                    </label>
                    <div className="mt-3 items-center">test@gtls.com.au</div>
                </div>
                <div>
                    <label
                        htmlFor="Phone"
                        className="block text-sm font-bold leading-6 text-gray-900"
                    >
                        Phone
                    </label>
                    <div className="mt-2">
                        <div>
                            <Listbox
                                value={selectedBranch}
                                onChange={(e) => {
                                    setSelectedBranch(e);
                                }}
                            >
                                {({ open }) => (
                                    <>
                                        <div className="relative ">
                                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.39rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                <span className="block truncate">
                                                    {selectedBranch?.branchName}
                                                </span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                    <ChevronUpDownIcon
                                                        className="h-5 w-5 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            </Listbox.Button>

                                            <Transition
                                                show={open}
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {branches?.map((branch) => (
                                                        <Listbox.Option
                                                            key={branch.id}
                                                            className={({
                                                                active,
                                                            }) =>
                                                                classNames(
                                                                    active
                                                                        ? "bg-indigo-600 text-white"
                                                                        : "text-gray-900",
                                                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                )
                                                            }
                                                            value={branch}
                                                        >
                                                            {({
                                                                selected,
                                                                active,
                                                            }) => (
                                                                <>
                                                                    <span
                                                                        className={classNames(
                                                                            selected
                                                                                ? "font-semibold"
                                                                                : "font-normal",
                                                                            "block truncate"
                                                                        )}
                                                                    >
                                                                        {
                                                                            branch.branchName
                                                                        }
                                                                    </span>

                                                                    {selected ? (
                                                                        <span
                                                                            className={classNames(
                                                                                active
                                                                                    ? "text-white"
                                                                                    : "text-indigo-600",
                                                                                "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                            )}
                                                                        >
                                                                            <CheckIcon
                                                                                className="h-5 w-5"
                                                                                aria-hidden="true"
                                                                            />
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    ))}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Listbox>
                        </div>
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="Phone"
                        className="block text-sm font-bold leading-6 text-gray-900"
                    >
                        Phone
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="Phone"
                            id="Phone"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
