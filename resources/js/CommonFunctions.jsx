import Cookies from "js-cookie";
import { PublicClientApplication } from "@azure/msal-browser";


const msalConfig = {
    auth: {
        clientId: "05f70999-6ca7-4ee8-ac70-f2d136c50288",
        authority:
            "https://login.microsoftonline.com/647bf8f1-fc82-468e-b769-65fd9dacd442",
        redirectUri: window.Laravel.azureCallback,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true, // Set this to true if dealing with IE11 or issues with sessionStorage
    },
};
const pca = new PublicClientApplication(msalConfig);

export async function handleSessionExpiration() {
    const appUrl = window.Laravel.appUrl;
    axios
        .post("/logoutWithoutRequest")
        .then(async (response) => {
            if (response.status === 200 && response.data.status === 'success') {
                const isMicrosoftLogin = Cookies.get('msal.isMicrosoftLogin');
                clearMSALLocalStorage();
    
                if (isMicrosoftLogin === 'true') {
                    window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${appUrl}/login`;
                } else {
                    window.location.href = `/login`;
                }
            } else {
                console.log("Logout error:", response);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export function clearMSALLocalStorage() {
    const appDomain = window.Laravel.appDomain;
    const msalKeys = Object.keys(localStorage).filter(key => key.startsWith("msal"));
    
    // Loop through each MSAL-related key and remove it from localStorage
    msalKeys.forEach(key => {
        localStorage.removeItem(key);
    });

    Cookies.set('msal.isMicrosoftLogin', '', { expires: -1, domain: appDomain });
}  