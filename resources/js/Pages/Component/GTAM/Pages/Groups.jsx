import { useState } from "react";
import TwoGridView from "../components/Groups/TwoGridView";
import { useEffect } from "react";

export default function Groups({
    activeIndex,
    setActiveIndex,
    AlertToast,
    currentUser,
    url,
}) {
    const [groups, setGroups] = useState();
    const [appRoles, setappRoles] = useState();
    const [activeGroup, setActiveGroup] = useState(0);

    useEffect(() => {
        getGroups();
        getRoles()
    }, []);


    const [allApps, setAllApps] = useState();

    useEffect(()=>{
        axios
        .get(`${url}api/GTAM/Applications`, {
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
                console.log(parsedData)
                setAllApps(parsedData);
            });
        })
        .catch((err) => {
            console.log(err);
        });
    },[])

    function getGroups() {
        axios
            .get(`${url}api/GTAM/GroupRoles`, {
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
                    console.log(parsedData);
                    setGroups(parsedData);
                    // setAppsApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getRoles() {
        axios
            .get(`${url}api/GTAM/AppRoles`, {
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
                    console.log(parsedData);
                    setappRoles(parsedData);
                    // setAppsApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className="p-8">
            <div className="pb-5">
                <h1 className="text-xl text-dark font-bold ">Groups</h1>
                
            </div>
            <div className="bg-white rounded-xl">
                <TwoGridView
                    url={url}
                    appRoles={appRoles}
                    AlertToast={AlertToast}
                    allApps={allApps}
                    activeGroup={activeGroup}
                    setActiveGroup={setActiveGroup}
                    groups={groups}
                    getGroups={getGroups}
                    currentUser={currentUser}
                />
            </div>
        </div>
    );
}
