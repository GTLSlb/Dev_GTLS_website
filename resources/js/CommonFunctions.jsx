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
    
    // Ensure CSRF token is set in Axios for the logout request
    axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    axios
        .post("/logoutWithoutRequest")
        .then(async (response) => {
            if (response.status === 200) {
                const isMicrosoftLogin = Cookies.get('msal.isMicrosoftLogin');

                // Clear MSAL-related data from localStorage
                clearMSALLocalStorage();

                if (isMicrosoftLogin === 'true') {
                    // Redirect to Microsoft logout URL
                    window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${appUrl}/login`;
                } else {
                    // Redirect to the local login page
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
    
    // Find all keys in localStorage starting with 'msal' and remove them
    const msalKeys = Object.keys(localStorage).filter(key => key.startsWith("msal"));
    msalKeys.forEach(key => {
        localStorage.removeItem(key);
    });

    // Remove the msal.isMicrosoftLogin cookie
    Cookies.set('msal.isMicrosoftLogin', '', { expires: -1, domain: appDomain });
}