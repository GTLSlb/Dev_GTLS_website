import { pca } from "@/CommonFunctions";
import { LogoutPage } from "gtls-npm-libraries";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function Logout() {
    const [user, setUser] = useState(null);
    const [Token, setToken] = useState(null);

    useEffect(() => {
        axios
            .get("/users")
            .then((res) => {
                if (typeof res.data == "object") {
                    setUser(res.data.user);
                    setToken(res.data.token);
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    // Handle 401 error
                    swal({
                        title: "Session Expired!",
                        text: "Please login again",
                        type: "success",
                        icon: "info",
                        confirmButtonText: "OK",
                    }).then(async function () {
                        await handleSessionExpiration();
                    });
                } else {
                    // Handle other errors
                    console.error(err);
                }
            });
    }, []);
    return (
        <LogoutPage
            pca={pca}
            appUrl={window.Laravel.appUrl}
            appDomain={window.Laravel.appDomain}
            user={user}
            gtamUrl={window.Laravel.gtamUrl}
            setUser={setUser}
            setToken={setToken}
        />
    )
}

Logout.propTypes = {
    user: PropTypes.object,
    setToken: PropTypes.func,
    setUser: PropTypes.func,
}
