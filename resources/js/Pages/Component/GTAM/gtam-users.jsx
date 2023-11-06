
import { useState } from "react";
import GtamButton from "./components/Buttons/GtamButton";
import EmployeesTable from "./components/EmployeesTable";
import { useEffect } from "react";


export default function GtamUsers({activeIndex,currentUser, setActiveIndex,url}) {

    const [employees, setEmployees] = useState();

    useEffect(()=>{
        GetEmployees()
    },[])

    function GetEmployees() {
        axios
            .get(`${url}api/GTAM/Employees`, {
                headers: {
                    UserId: currentUser.user_id,
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
                    setEmployees(parsedData);
                    // setAppsApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

function createUser(){
    setActiveIndex(6)
}

    return (
        <div className="px-6 lg:px-8 p-2">
            <div className="mt-6 sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">
                        Employees
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the users in your account including their
                        name, title, email and role.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    
                    <GtamButton
                    name={"Create Employee"}
                    onClick={createUser}
                    className={"w-[9rem]"}
                    />
                </div>
            </div>
            <EmployeesTable employees={employees}/>
        </div>
    );
}
