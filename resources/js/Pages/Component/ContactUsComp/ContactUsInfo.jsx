import {
    BuildingOffice2Icon,
    PhoneIcon,
    InboxStackIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import PropTypes from "prop-types";

export default function ContactUsInfo({ getContactUsInfo }) {
    return (
        <div className="max-lg:px-8 pb-4 pt-20 sm:pb-32 lg:py-24 z-10  w-full">
            <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg py-8 w-full">
                <div
                    className=""
                    dangerouslySetInnerHTML={{
                        __html: getContactUsInfo.Title,
                    }}
                />
                <dl className="mt-10 space-y-4 text-base leading-7 text-gray-300  w-full">
                    <div className="flex gap-x-6">
                        <dt className="flex-none">
                            <span className="sr-only">Telephone</span>
                            <PhoneIcon
                                className="h-7 w-6 text-goldt"
                                aria-hidden="true"
                            />
                        </dt>
                        <dd>
                            <a
                                className="hover:text-goldt text-lg"
                                href={`tel:+${getContactUsInfo.PhoneNumber}`}
                            >
                                {getContactUsInfo.PhoneNumber}
                            </a>
                        </dd>
                    </div>
                    <div className="flex gap-x-6">
                        <dt className="flex-none">
                            <span className="sr-only">Box Address</span>
                            <InboxStackIcon
                                className="h-7 w-6 text-goldt"
                                aria-hidden="true"
                            />
                        </dt>
                        <dd>
                            <a className=" text-lg" href="#">
                                {getContactUsInfo.POBox}
                            </a>
                        </dd>
                    </div>
                    {getContactUsInfo.branches.map((branch, index) => (
                        <div className="flex gap-x-6 w-full" key={index}>
                            <dt className="flex-none">
                                <span className="sr-only">
                                    {branch.BranchName.toUpperCase()}
                                </span>
                                <BuildingOffice2Icon
                                    className="h-7 w-6 text-goldt"
                                    aria-hidden="true"
                                />
                            </dt>
                            <dd className="text-lg w-full">
                                {branch.BranchName.toUpperCase()}
                                <br />
                                <div className="flex items-center gap-2">
                                    {branch.BranchLocation}
                                    <a
                                        href={branch.BranchMapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <MapPinIcon className="h-7 w-6 text-goldt" />
                                    </a>
                                </div>
                                <a
                                    className="hover:text-goldt text-lg"
                                    href={`tel:+${branch.BranchPhoneNb}`}
                                >
                                    {branch.BranchPhoneNb}
                                </a>
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}

ContactUsInfo.propTypes = {
    getContactUsInfo: PropTypes.object,
};