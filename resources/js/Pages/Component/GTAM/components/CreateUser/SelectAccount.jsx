import React from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import notFound from "../../../../../assets//pictures/NotFound.png";

const employees = [
    {
        id: 0,
        name: "Lindsay Walton",
        title: "Front-end Developer",
        department: "Optimization",
        email: "lindsay.walton@example.com",
        role: "Member",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
        id: 1,
        name: "Lindsay Walton",
        title: "Front-end Developer",
        department: "Optimization",
        email: "lindsay.walton@example.com",
        role: "Member",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
        id: 2,
        name: "Lindsay Walton",
        title: "Front-end Developer",
        department: "Optimization",
        email: "lindsay.walton@example.com",
        role: "Member",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    // More people...
];

export default function SelectAccount({setCheckStep1}) {
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedRow, setSelectedRow] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const handleRowSelect = (row) => {
        setCheckStep1(true)
        setSelectedRow(row.id); // Set the ID of the clicked row as the selected row
    };
console.log(selectedRow)
    const PER_PAGE = 5;
    const OFFSET = currentPage * PER_PAGE;
    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };
    const pageCount = Math.ceil(employees?.length / PER_PAGE);
    return (
        <div>
            <div className="">
                <div className="relative border rounded w-96">
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
            <div className=" mt-4 border rounded-xl overflow-auto  lg:max-h-full">
                <table className="w-full rounded-xl py-2 overflow-x-scroll">
                    <thead className="bg-gray-100 border h-8">
                        <tr className="items-center">
                            <th className="border-r">
                                {/* <input
                                    type="checkbox"
                                    className="rounded text-green-500"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                /> */}
                            </th>
                            <th className=" px-2  text-left text-sm font-semibold text-gray-600 ">
                                Name
                            </th>
                            <th className=" px-2  text-left text-sm font-semibold text-gray-600 ">
                                Job Title
                            </th>
                            <th className=" px-2  text-left text-sm font-semibold text-gray-600 ">
                                Email
                            </th>
                            <th className=" px-2  text-left text-sm font-semibold text-gray-600 ">
                                Phone Number
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {employees?.length > 0 ? (
                            employees
                                ?.slice(OFFSET, OFFSET + PER_PAGE)
                                .map((row) => (
                                    <tr
                                        className="border-r border-b "
                                        key={row.id}
                                    >
                                        <td className="w-10  px-3 border">
                                        <input
                                        type="checkbox"
                                        className="rounded text-green-500"
                                        checked={selectedRow === row.id} // Check if the current row is selected
                                        onChange={() => handleRowSelect(row)}
                                    />
                                        </td>
                                        <td className="p-2">
                                            <h1 className="text-dark font-bold">
                                                {row.name}
                                            </h1>
                                        </td>
                                        <td className="p-2">
                                            <h1 className="text-gray-400 ">
                                                {row.name}
                                            </h1>
                                        </td>
                                        <td className="p-2">
                                            <h1 className="text-gray-600 ">
                                                {row.name}
                                            </h1>
                                        </td>
                                        <td className="p-2">
                                            <h1 className="text-gray-400">
                                                {row.name}
                                            </h1>
                                        </td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td colSpan="18">
                                    <div class=" h-72 flex items-center justify-center mt-5">
                                        <div class="text-center flex justify-center flex-col">
                                            <img
                                                src={notFound}
                                                alt=""
                                                className="w-52 h-auto "
                                            />
                                            <h1 class="text-3xl font-bold text-gray-900">
                                                No Data Found
                                            </h1>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>{" "}
            <div className="pt-4 pb-10 text-xs text-gray-400">
                <ReactPaginate
                    previousLabel={"← Previous"}
                    nextLabel={"Next →"}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    containerClassName={"flex justify-center items-center mt-4"}
                    pageClassName={"mx-2 rounded-full hover:bg-gray-100"}
                    previousLinkClassName={
                        "px-3 py-2 bg-gray-100 text-gray-700 rounded-l hover:bg-gray-200"
                    }
                    nextLinkClassName={
                        "px-3 py-2 bg-gray-100 text-gray-700 rounded-r hover:bg-gray-200"
                    }
                    disabledClassName={"opacity-50 cursor-not-allowed"}
                    activeClassName={"text-blue-500 font-bold"}
                />
            </div>
        </div>
    );
}
