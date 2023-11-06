import { useState } from "react";
import { useEffect } from "react";
import moment from "moment";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import { ChevronDownIcon, PencilIcon } from "@heroicons/react/20/solid";
import TableStructure from "@/Components/TableStructure";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import KPIModalAddReason from "./KPI/KPImodal";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function KPI({
    url,
    userBody,
    currentUser,
    setActiveIndexGTRS,
    setLastIndex,
    setactiveCon,
    KPIData,
    setKPIData,
    accData,
    kpireasonsData,
}) {
    window.moment = moment;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reason, setReason] = useState();
    useEffect(() => {
        if (!KPIData) {
            setIsFetching(true);
            fetchData();
        }
    }, []); // Empty dependency array ensures the effect runs only once
    const fetchData = async () => {
        try {
            axios
                .post(`${url}api/GTRS/KPI`, userBody, {
                    headers: {
                        RoleId: currentUser.role_id,
                    },
                })
                .then((res) => {
                    const x = JSON.stringify(res.data);
                    const parsedDataPromise = new Promise((resolve, reject) => {
                        const parsedData = JSON.parse(x);
                        resolve(parsedData);
                    });
                    parsedDataPromise.then((parsedData) => {
                        setKPIData(parsedData);
                        setIsFetching(false);
                    });
                });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const handleClick = (coindex) => {
        setActiveIndexGTRS(3);
        setLastIndex(2);
        setactiveCon(coindex);
    };
    const [filteredData, setFilteredData] = useState(KPIData);
    const filterData = () => {
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
        // Filter the data based on the start and end date filters, selected receiver names, and chargeTo values
        const filtered = KPIData?.filter((item) => {
            const chargeToMatch =
                intArray?.length === 0 || intArray?.includes(item.ChargeToID);

            return chargeToMatch;
        });
        return filtered;
    };
    useEffect(() => {
        setFilteredData(filterData());
    }, [accData, KPIData]);
    const [isFetching, setIsFetching] = useState();
    const headers = [
        "Consignment No",
        "Sender Name",
        "Sender Reference",
        "Sender State",
        "Receiver Name",
        "Receiver Reference",
        "Receiver State",
        "Dispatch Date",
        "RDD",
        "Delivery Date",
    ];
    const [selected, setSelected] = useState([]);
    function handleDownloadExcel() {
        // Get the selected columns or use all columns if none are selected
        let selectedColumns = Array.from(
            document.querySelectorAll('input[name="column"]:checked')
        ).map((checkbox) => checkbox.value);

        if (selectedColumns.length === 0) {
            selectedColumns = headers; // Use all columns
        }

        // Extract the data for the selected columns
        const data = filteredData.map((person) =>
            selectedColumns.reduce((acc, column) => {
                const columnKey = column.replace(/\s+/g, "");
                if (columnKey) {
                    if (person[columnKey] === true) {
                        acc[columnKey] = "true";
                    } else if (person[columnKey] === false) {
                        acc[columnKey] = "false";
                    } else if (column.replace(/\s+/g, "") === "DispatchDate") {
                        acc[columnKey] =
                            moment(
                                person["DispatchDate"].replace("T", " "),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY") == "Invalid date"
                                ? ""
                                : moment(
                                      person["DispatchDate"].replace("T", " "),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY");
                    } else if (column.replace(/\s+/g, "") === "MatchRdd") {
                        if (person[columnKey] === 3) {
                            acc[columnKey] = "Pending";
                        } else if (person[columnKey] === 1) {
                            acc[columnKey] = "True";
                        } else if (person[columnKey] === 2) {
                            acc[columnKey] = "False";
                        }
                    } else if (column.replace(/\s+/g, "") === "DeliveryDate") {
                        acc[columnKey] =
                            moment(
                                person["DeliveryDate"].replace("T", " "),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY") == "Invalid date"
                                ? ""
                                : moment(
                                      person["DeliveryDate"].replace("T", " "),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY");
                    } else if (column === "RDD") {
                        acc[columnKey] =
                            moment(
                                person["RDD"].replace("T", " "),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY") == "Invalid date"
                                ? ""
                                : moment(
                                      person["RDD"].replace("T", " "),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY");
                    } else {
                        acc[column.replace(/\s+/g, "")] =
                            person[column.replace(/\s+/g, "")];
                    }
                } else {
                    acc[column.replace(/\s+/g, "")] =
                        person[column.replace(/\s+/g, "")];
                }

                return acc;
            }, {})
        );

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();

        // Add a worksheet to the workbook
        const worksheet = workbook.addWorksheet("Sheet1");

        // Apply custom styles to the header row
        const headerRow = worksheet.addRow(selectedColumns);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2B540" }, // Yellow background color (#e2b540)
        };
        headerRow.alignment = { horizontal: "center" };

        // Add the data to the worksheet
        data.forEach((rowData) => {
            worksheet.addRow(Object.values(rowData));
        });

        // Set column widths
        const columnWidths = selectedColumns.map(() => 15); // Set width of each column
        worksheet.columns = columnWidths.map((width, index) => ({
            width,
            key: selectedColumns[index],
        }));

        // Generate the Excel file
        workbook.xlsx.writeBuffer().then((buffer) => {
            // Convert the buffer to a Blob
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            // Save the file using FileSaver.js or alternative method
            saveAs(blob, "KPI-Report.xlsx");
        });
    }
    const createNewLabelObjects = (data, fieldName) => {
        let id = 1; // Initialize the ID
        const uniqueLabels = new Set(); // To keep track of unique labels
        const newData = [];

        // Map through the data and create new objects
        data?.forEach((item) => {
            const fieldValue = item[fieldName];
            // Check if the label is not already included
            if (!uniqueLabels.has(fieldValue)) {
                uniqueLabels.add(fieldValue);
                const newObject = {
                    id: fieldValue,
                    label: fieldValue,
                };
                newData.push(newObject);
            }
        });
        return newData;
    };
    const senderStateOptions = createNewLabelObjects(KPIData, "SenderState");
    const receiverStateOptions = createNewLabelObjects(
        KPIData,
        "ReceiverState"
    );
    const reasonOptions = kpireasonsData.map((reason) => ({
        id: reason.ReasonId,
        label: reason.ReasonName,
    }));
    function getMinMaxValue(data, fieldName, identifier) {
        // Check for null safety
        if (!data || !Array.isArray(data) || data.length === 0) {
            return null;
        }

        // Filter out entries with empty or invalid dates
        const validData = data.filter(
            (item) => item[fieldName] && !isNaN(new Date(item[fieldName]))
        );

        // If no valid dates are found, return null
        if (validData.length === 0) {
            return null;
        }

        // Sort the valid data based on the fieldName
        const sortedData = [...validData].sort((a, b) => {
            return new Date(a[fieldName]) - new Date(b[fieldName]);
        });

        // Determine the result date based on the identifier
        let resultDate;
        if (identifier === 1) {
            resultDate = new Date(sortedData[0][fieldName]);
        } else if (identifier === 2) {
            resultDate = new Date(sortedData[sortedData.length - 1][fieldName]);
        } else {
            return null;
        }

        // Convert the resultDate to the desired format "01-10-2023"
        const day = String(resultDate.getDate()).padStart(2, "0");
        const month = String(resultDate.getMonth() + 1).padStart(2, "0"); // +1 because months are 0-indexed
        const year = resultDate.getFullYear();

        return `${day}-${month}-${year}`;
    }
    // Usage example remains the same
    const minDispatchDate = getMinMaxValue(KPIData, "DispatchDate", 1);
    const maxDispatchDate = getMinMaxValue(KPIData, "DispatchDate", 2);
    const minRDDDate = getMinMaxValue(KPIData, "RDD", 1);
    const maxRDDDate = getMinMaxValue(KPIData, "RDD", 2);
    const minDeliveryDate = getMinMaxValue(KPIData, "DeliveryDate", 1);
    const maxDeliveryDate = getMinMaxValue(KPIData, "DeliveryDate", 2);
    const minCalcDate = getMinMaxValue(KPIData, "CalculatedDelDate", 1);
    const maxCalcDate = getMinMaxValue(KPIData, "CalculatedDelDate", 2);
    const groups = [
        {
            name: "senderDetails",
            header: "Sender Details",
            headerAlign: "center",
        },
        {
            name: "receiverDetails",
            header: "Receiver Details",
            headerAlign: "center",
        },
    ];
    const filterValue = [
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderState",
            operator: "inlist",
            type: "select",
            value: null,
        },
        {
            name: "ReceiverName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ReceiverReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ReceiverState",
            operator: "inlist",
            type: "select",
            value: null,
        },
        {
            name: "DispatchDate",
            operator: "inrange",
            type: "date",
            value: {
                start: minDispatchDate,
                end: maxDispatchDate,
            },
        },
        {
            name: "ReceiverPostCode",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "RDD",
            operator: "inrange",
            type: "date",
            value: "",
        },
        {
            name: "DeliveryDate",
            operator: "inrange",
            type: "date",
            value: "",
        },
        {
            name: "TransitDays",
            operator: "eq",
            type: "number",
            value: null,
        },
        {
            name: "CalculatedDelDate",
            operator: "inrange",
            type: "date",
            value: "",
        },
        {
            name: "ReasonId",
            operator: "eq",
            type: "select",
            value: null,
        },
    ];
    const Roles = ["1", "3", "4", "5"];
    const handleEditClick = (reason) => {
        setReason(reason);
        setIsModalOpen(!isModalOpen);
    };
    const updateLocalData = (id, reason) => {
        // Find the item in the local data with the matching id
        const updatedData = KPIData.map((item) => {
            if (item.ConsignmentId === id) {
                // Update the reason of the matching item
                return { ...item, ReasonId: reason };
            }
            return item;
        });
        setKPIData(updatedData);
    };
    const columns = [
        {
            name: "ConsignmentNo",
            headerAlign: "center",
            textAlign: "center",
            header: "Cons No",
            group: "personalInfo",
            filterEditor: StringFilter,
            // filterEditorProps: {
            //     placeholder: "Name",
            //     renderSettings: ({ className }) => filterIcon(className),
            // },
            render: ({ value, data }) => {
                return (
                    <span
                        className="underline text-blue-500 hover:cursor-pointer"
                        onClick={() => handleClick(data.ConsignmentId)}
                    >
                        {" "}
                        {value}
                    </span>
                );
            },
        },
        {
            name: "SenderName",
            header: "Name",
            group: "senderDetails",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "SenderReference",
            group: "senderDetails",
            header: "Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "SenderState",
            group: "senderDetails",
            header: "State",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderStateOptions,
            },
            defaultWidth: 200,
        },
        {
            name: "ReceiverName",
            group: "receiverDetails",
            header: "Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "ReceiverReference",
            group: "receiverDetails",
            header: "Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "ReceiverState",
            group: "receiverDetails",
            header: "State",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverStateOptions,
            },
            defaultWidth: 200,
        },
        {
            name: "ReceiverPostCode",
            group: "receiverDetails",
            header: "Post Code",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            // filterEditorProps: {
            //     multiple: true,
            //     wrapMultiple: false,
            //     dataSource: receiverStateOptions,
            // },
            defaultWidth: 200,
        },
        {
            name: "DispatchDate",
            header: "Despatch Date",
            defaultFlex: 1,
            minWidth: 200,
            headerAlign: "center",
            textAlign: "center",
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDispatchDate,
                maxDate: maxDispatchDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "RDD",
            header: "Required Date",
            defaultFlex: 1,
            minWidth: 200,
            headerAlign: "center",
            textAlign: "center",
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minRDDDate,
                maxDate: maxRDDDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "DeliveryDate",
            header: "Delivery Date",
            defaultFlex: 1,
            minWidth: 200,
            dateFormat: "DD-MM-YYYY",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDeliveryDate,
                maxDate: maxDeliveryDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "TransitDays",
            header: "Transit Days",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            type: "number",
            filterEditor: NumberFilter,
        },
        {
            name: "CalculatedDelDate",
            header: "Calculated Delivery Date",
            headerAlign: "center",
            textAlign: "center",
            dateFormat: "DD-MM-YYYY",
            defaultFlex: 1,
            minWidth: 200,
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minCalcDate,
                maxDate: maxCalcDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "ReasonId",
            header: "Reason",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: false,
                wrapMultiple: false,
                dataSource: reasonOptions,
            },
            render: ({ value }) => {
                return (
                    <div>
                        {/* {value} */}
                        {
                            kpireasonsData?.find(
                                (reason) => reason.ReasonId === value
                            )?.ReasonName
                        }
                    </div>
                );
            },
        },
        {
            header: "",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 100,
            render: ({ value, data }) => {
                return (
                    <div>
                        {Roles.includes(currentUser.role_id) ? (
                            <button
                                className={
                                    "rounded text-blue-500 justify-center items-center  "
                                }
                                onClick={() => {
                                    handleEditClick(data);
                                }}
                            >
                                <span className="flex gap-x-1">
                                    <PencilIcon className="h-4" />
                                    Edit
                                </span>
                            </button>
                        ) : (
                            <div></div>
                        )}
                    </div>
                );
            },
        },
    ];
    const newArray = columns.slice(0, -1);
    const [newColumns, setNewColumns] = useState();

    useEffect(() => {
        if (Roles.includes(currentUser.role_id)) {
            setNewColumns(columns);
        } else {
            setNewColumns(newArray);
        }
    }, []);
    const [hoverMessage, setHoverMessage] = useState("");
    const [isMessageVisible, setMessageVisible] = useState(false);
    const handleMouseEnter = () => {
        if (filteredData.length === 0) {
            setHoverMessage("No Data Found");
            setMessageVisible(true);
            setTimeout(() => {
                setMessageVisible(false);
            }, 1000);
        }
    };
    return (
        <div>
            {/* <Sidebar /> */}
            {isFetching && newColumns ? (
                <div className="min-h-screen md:pl-20 pt-16 h-full flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce`}
                        ></div>
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce200`}
                        ></div>
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full animate-bounce400`}
                        ></div>
                    </div>
                    <div className="text-dark mt-4 font-bold">
                        Please wait while we get the data for you.
                    </div>
                </div>
            ) : (
                <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex w-full items-center justify-between mt-6">
                            <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                                KPI Report
                            </h1>

                            <Popover className="relative object-right flex-item md:ml-auto">
                                {Roles.includes(currentUser.role_id) ? (
                                    <button
                                        className={`inline-flex items-center w-[9rem] h-[36px] rounded-md border bg-gray-800 px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                        disabled={filteredData?.length === 0}
                                    >
                                        Caculate KPI Report
                                    </button>
                                ) : null}

                                <button onMouseEnter={handleMouseEnter}>
                                    <Popover.Button
                                        className={`inline-flex items-center w-[5.5rem] h-[36px] rounded-md border ${
                                            filteredData?.length === 0
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : "bg-gray-800"
                                        } px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                        disabled={filteredData?.length === 0}
                                    >
                                        Export
                                        <ChevronDownIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </Popover.Button>
                                </button>
                                {isMessageVisible && (
                                    <div className="absolute top-9.5 text-center left-0 md:-left-14 w-[9rem] right-0 bg-red-200 text-dark z-10 text-xs py-2 px-4 rounded-md opacity-100 transition-opacity duration-300">
                                        {hoverMessage}
                                    </div>
                                )}

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                >
                                    <Popover.Panel className="absolute left-20 lg:left-0 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                        <div className=" max-w-md flex-auto overflow-hidden rounded-lg bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                            <div className="p-4">
                                                <div className="mt-2 flex flex-col">
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="ConsignmentNo"
                                                            className="text-dark focus:ring-goldd rounded "
                                                        />{" "}
                                                        Consignment Number
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="SenderName"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Sender
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="SenderReference"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Sender Reference
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="SenderState"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Sender State
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="ReceiverName"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Receiver
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="ReceiverReference"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Receiver Reference
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Receiver State"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Receiver State
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="DispatchDate"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Despatch Date
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="RDD"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        RDD
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="DeliveryDate"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Delivery Date
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                                                <button
                                                    onClick={
                                                        handleDownloadExcel
                                                    }
                                                    className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                                                >
                                                    Export XLS
                                                </button>
                                            </div>
                                        </div>
                                    </Popover.Panel>
                                </Transition>
                            </Popover>
                        </div>
                    </div>
                    <TableStructure
                        id={"ConsignmentId"}
                        setSelected={setSelected}
                        selected={selected}
                        groupsElements={groups}
                        tableDataElements={filteredData}
                        filterValueElements={filterValue}
                        columnsElements={newColumns}
                    />
                </div>
            )}
            <KPIModalAddReason
                url={url}
                isOpen={isModalOpen}
                kpi={reason}
                setReason={setReason}
                handleClose={handleEditClick}
                updateLocalData={updateLocalData}
                kpiReasons={kpireasonsData}
                currentUser={currentUser}
            />
        </div>
    );
}
