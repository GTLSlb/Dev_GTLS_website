import React, { useState, useEffect, useContext } from "react";
import tiger from "../assets/pictures/LogoWhite.webp";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import goldmap from "../assets/backgrounds/goldmap.webp";
import {
    QuestionMarkCircleIcon,
    ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import {
    ChatBubbleLeftEllipsisIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import Footer from "./Component/landingPage/Footer";
export default function LandingPage({}) {
    const [apps, setApps] = useState();
    const [currentUser, setcurrentUser] = useState(null);
    const [isClicked, setIsClicked] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [greeting, setGreeting] = useState("morning");
    const [filteredApps, setFilteredApps] = useState();
    const [appsApi, setAppsApi] = useState();
    const gtamUrl = window.Laravel.gtamUrl;
    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }
    
    useEffect(() => {
        console.log(window.location.href);
        document.cookie = "previous_page=" + encodeURIComponent(window.location.href);
    },[]);

    useEffect(() => {
        axios
            .get("/users")
            .then((res) => {
                setcurrentUser(res.data);
            })
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        if (currentUser) {
            axios
                .get(`${gtamUrl}User/Permissions`, {
                    headers: {
                        UserId: currentUser.UserId,
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
                        setFilteredApps(parsedData);
                        setApps(parsedData);
                        setAppsApi(true);
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [currentUser]);

    function getGreeting() {
        const currentHour = new Date().getHours();

        if (currentHour >= 5 && currentHour < 12) {
            return "Good morning";
        } else if (currentHour >= 12 && currentHour < 18) {
            return "Good afternoon";
        } else {
            return "Good evening";
        }
    }

    const handleEditClick = () => {
        const isModalCurrentlyOpen = !isModalOpen;
        document.body.style.overflow = isModalCurrentlyOpen ? "hidden" : "auto";
        setIsModalOpen(isModalCurrentlyOpen);
        setMobileMenuOpen(false);
    };

    const handleSearch = (event) => {
        const searchInput = event.target.value.toLowerCase();
        setSearchTerm(searchInput);
        const filtered = apps.filter(
            (app) =>
                app.AppName.toLowerCase().includes(searchInput) ||
                app.AppAbv.toLowerCase().includes(searchInput)
        );
        setFilteredApps(filtered);
    };

    const GoAppPage = (app) => {
        window.open(app.AppURL, "_blank");
    };
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activePage, setactivePage] = useState(null);
    const [activeIndexGtam, setActiveIndexGtam] = useState(1);
    const [activeCon, setactiveCon] = useState(0);
    const [loadingGtrs, setLoadingGtrs] = useState(false);
    const [activeIndexGTRS, setActiveIndexGTRS] = useState(0);
    const [activeHeader, setactiveHeader] = useState("null");
    const [currentComponent, setcurrentComponent] = useState([]);
    const [activeIndexInv, setActiveIndexInv] = useState(1);
    const [invoiceDetails, setInvoiceDetails] = useState();
    const [PODetails, setPODetails] = useState();

    useEffect(() => {
        setGreeting(getGreeting());
    }, []);

    const handleGTAMIndexChange = (e) => {
        setActiveIndexGtam(e);
    };
    useEffect(() => {
        axios
            .get("/users")
            .then((res) => {
                setcurrentUser(res.data);
            })
            .catch((error) => console.log(error));
    }, []);

    const handleLogout = () => {
        const isLoggingOut = true;
        axios
            .post("/logoutAPI", isLoggingOut)
            .then((response) => {
                if (response.status == 200) {
                    window.location.href = "/login";
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const [getfooter, setfooter] = useState([]);

    // ********************************************************* 
    // ********************* All requests  ********************* 
    // ********************************************************* 

    useEffect(() => {
        axios.get('/footer')
          .then(response => {
              // console.log('fetching data:',response.data);
              setfooter(response.data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }, []);
      // ********************************************************* 
      // ********************* End requests  ********************* 
      // ********************************************************* 

    return (
        <div className=" w-full relative min-h-screen bg-gray-200">
            {appsApi && currentUser ? (
                <div className="w-full h-full ">
                    <div className="flex flex-row w-full h-full">
                        <div className="flex flex-col relative w-full min-h-screen bg-gradient-to-br from-gray-800 via-dark to-dark">
                            <img
                                src={goldmap}
                                className="absolute right-0 top-32"
                                alt=""
                            />
                            {/* navbar */}
                            <div className="relative border-b-2 border-goldt flex lg:flex-row flex-row justify-between lg:items-center sm:px-8 w-full h-30 text-white md:text-3xl py-4 mx-auto max-w-7xl ">
                                <p className="flex  md:mt-0">
                                    <a href="/">
                                        <img
                                            src={tiger}
                                            className="h-14"
                                            alt="Image"
                                        />
                                    </a>
                                </p>

                                <div className=" right-5 top-3 lg:relative lg:right-0 lg:top-0 flex justify-center gap-x-6 sm:gap-x-10 items-center">
                                    <div className="flex flex-row items-center gap-x-2 ">
                                        <div
                                            className={`text-smooth text-sm rounded-full border-2 border-goldt bg-gray-700 flex justify-center items-center w-10  h-10`}
                                        >
                                            <p>
                                                {" "}
                                                {currentUser.FirstName.substring(
                                                    0,
                                                    1
                                                ).toUpperCase()}
                                                {currentUser.LastName.substring(
                                                    0,
                                                    1
                                                ).toUpperCase()}
                                            </p>
                                        </div>
                                        <p className="text-sm text-white w-24 hidden sm:block">
                                            {currentUser.FirstName}{" "}
                                            {currentUser.LastName}
                                        </p>
                                    </div>
                                    <a
                                        href="https://support.gtls.com.au/help/2703577665"
                                        target="_blank"
                                        className="flex justify-center"
                                    >
                                        {" "}
                                        <button
                                            className={classNames(
                                                "text-gray-400  hover:text-white",
                                                "group w-auto p-3 rounded-md flex flex-row items-center text-xs font-medium"
                                            )}
                                            // aria-current={item.current ? 'page' : undefined}
                                        >
                                            <ChatBubbleLeftEllipsisIcon
                                                className={classNames(
                                                    "text-gray-400 group-hover:text-goldt",
                                                    "h-6 w-6"
                                                )}
                                                aria-hidden="true"
                                            />

                                            <span className="hidden sm:block ml-2">
                                                Support
                                            </span>
                                        </button>
                                    </a>

                                    <ResponsiveNavLink
                                        method="post"
                                        // href={route("logout")}
                                        as="button"
                                        onClick={handleLogout}
                                        className="flex flex-row items-center hover:bg-gray-700 hover:text-white"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-7 ml-2 text-goldt" />
                                        <span className="text-xs text-gray-400 ml-2 hidden sm:block">
                                            LOGOUT
                                        </span>
                                    </ResponsiveNavLink>
                                </div>
                            </div>
                            {/* border */}

                            <div className=" flex flex-col w-full mx-auto max-w-7xl px-6 py-12 sm:py-10 lg:px-8">
                                <div className="text-white md:text-3xl  py-4 my-4 ">
                                    {" "}
                                    <span>{greeting} </span>
                                    <span className="text-goldd">
                                        <span className="text-white">, </span>
                                        {currentUser.FirstName}{" "}
                                        {currentUser.LastName}
                                    </span>
                                </div>

                                <h1 className="text-4xl text-white font-bold">
                                    {/* Built for Growth the future of{" "} */}
                                    <span className="text-goldd">Gold </span>
                                    Tiger Group of Companies: Spearheading The
                                    Future
                                </h1>
                                <div className="w-4/12 bg-goldt h-[0.005rem] my-3"></div>
                                <p className="text-goldl text-2xl font-bold ">
                                    GTLS Software Development Department
                                </p>
                                <p className="text-white text-md">
                                    Enhancing Your Software Experience,
                                    Continuously.
                                </p>
                            </div>

                            {/* main content */}
                            <div className="mx-auto max-w-7xl  px-6 py-16 sm:py-24 lg:px-8">
                                <p className="text-goldt text-3xl pb-10 font-bold ">
                                    Discover our Applications:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3  lg:px-8 gap-x-10 gap-y-8">
                                    {filteredApps?.length > 0
                                        ? filteredApps.map((app) => (
                                              <div
                                                  id={app.AppName}
                                                  className={`bg-gradient-to-tr sm:w-96 border border-goldl from-dark via-dark to-[#373B3D] transition hover:scale-105 relative rounded-3xl shadow-md shadow-goldd p-5 h-[18rem] hover:cursor-pointer  hover:shadow-lg hover:shadow-goldd overflow-hidden`}
                                                  onClick={() => {
                                                      GoAppPage(app);
                                                  }}
                                              >
                                                  <div className="flex flex-row gap-x-6 items-end">
                                                      <div
                                                          className={` rounded-3xl w-auto`}
                                                      >
                                                          <img
                                                              src={`${app.AppPic}`}
                                                              alt=""
                                                              className="h-14 w-14"
                                                          />
                                                      </div>
                                                      <div className="flex flex-col gap-y-1">
                                                          <div className="flex gap-x-3">
                                                              <h1 className="font-bold text-2xl text-white">
                                                                  <span className="text-goldd">
                                                                      {app.AppAbv.substring(
                                                                          0,
                                                                          1
                                                                      ).toUpperCase()}
                                                                  </span>
                                                                  <span className="">
                                                                      {app.AppAbv.substring(
                                                                          1,
                                                                          4
                                                                      ).toUpperCase()}
                                                                  </span>
                                                              </h1>{" "}
                                                          </div>
                                                      </div>
                                                  </div>
                                                  <div className="py-4 text-left">
                                                      <h1 className="font-bold text-white">
                                                          {app.AppName}
                                                      </h1>
                                                      <p className="mt-2 text-gray-300">
                                                          {app.AppDesc}
                                                      </p>
                                                  </div>
                                                  <div className="absolute bottom-0 right-0 overflow-hidden flex flex-col justify-end opacity-20">
                                                      <div className="flex justify-end">
                                                          <div className="w-10 h-10 bg-goldl"></div>
                                                          <div className="w-10 h-10 bg-goldt ellipse-right"></div>
                                                      </div>
                                                      <div className="flex">
                                                          <div className="w-10 h-10 bg-goldd ellipse-left"></div>
                                                          <div className="w-10 h-10 bg-goldl halfcircle-left"></div>
                                                          <div className="w-10 h-10 bg-goldd rounded-full"></div>
                                                          <div className="w-10 h-10 bg-goldt"></div>
                                                      </div>
                                                  </div>
                                              </div>
                                          ))
                                        : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
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
                </div>
            )}
            <div className="">
                <Footer getfooter={getfooter}/>
            </div>
        </div>
    );
}
