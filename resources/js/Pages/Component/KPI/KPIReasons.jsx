import React from "react";
import { useEffect, useState } from "react";
import GtamButton from "../GTAM/components/Buttons/GtamButton";
import SmallTableKPI from "./Components/KPISmallTable";

export default function KPIReasons({
    url,
    currentUser,
    kpireasonsData,
    setkpireasonsData
}) {
    function fromModel() {
        return 3;
    }
    const addurl = `${url}api/GTRS/Add/KpiReason`;
    const [editIndex, setEditIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [filteredData, setFilteredData] = useState(kpireasonsData);
    const [showAddRow, setShowAddRow] = useState(false);
    function handleShowHideAddButton() {
        if (
            currentUser.role_id == 8 ||
            currentUser.role_id == 10 ||
            currentUser.role_id == 1
        ) {
            return true;
        } else {
            return false;
        }
    }
    function getKPIReasons() {
        axios
            .get(`${url}api/GTRS/KpiReasons`, {
                headers: {
                    RoleId: currentUser.role_id,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    try {
                        const parsedData = JSON.parse(x);
                        resolve(parsedData || []); // Use an empty array if parsedData is null
                    } catch (error) {
                        reject(error);
                    }
                });
                parsedDataPromise.then((parsedData) => {
                    console.log(parsedData);
                    setkpireasonsData(parsedData);
                    // setAppsApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    const dynamicHeaders = [
        { label: "Reason", key: "ReasonName" },
        { label: "Status", key: "ReasonStatus" },
    ];
    useEffect(() => {
        setFilteredData(kpireasonsData);
    }, [kpireasonsData]);
    return (
        <div className="">
            <div className="p-8">
                <div className="flex gap-x-1">
                    <h1 className="font-bold text-dark text-xl">Reasons</h1>{" "}
                    <p className="mt-auto text-gray-400">({kpireasonsData?.length})</p>
                </div>
                <div className="flex justify-between flex-col sm:flex-row gap-y-3 my-5">
                    <div className="">
                        <div className="relative border rounded">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute top-0 bottom-0 w-4 h-4 my-auto text-gray-400 left-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search"
                                onChange={(e) => {
                                    onChangeFilter(e.target.value);
                                }}
                                className="w-full py-0.5 h-[25px] pl-12 pr-4 text-gray-500 border-none rounded-md outline-none "
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-x-5 gap-y-3">
                        {editIndex != null ? (
                            <div className="col-span-2">
                                <GtamButton
                                    name={"Cancel"}
                                    onClick={() => setEditIndex(null)}
                                    className="w-full "
                                />
                            </div>
                        ) : null}
                        {handleShowHideAddButton() ? (
                            <div className="col-span-2">
                                <GtamButton
                                    name={showAddRow ? "Cancel" : "Add Reason"}
                                    onClick={() => {
                                        setEditIndex(null);
                                        setShowAddRow(!showAddRow);
                                    }}
                                    className="w-full "
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
                <SmallTableKPI
                    fromModel={fromModel}
                    showAddRow={showAddRow}
                    setShowAddRow={setShowAddRow}
                    objects={filteredData}
                    currentUser={currentUser}
                    editIndex={editIndex}
                    setEditIndex={setEditIndex}
                    getfunction={getKPIReasons}
                    setObjects={setFilteredData}
                    dynamicHeaders={dynamicHeaders}
                    addurl={addurl}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    );
}
