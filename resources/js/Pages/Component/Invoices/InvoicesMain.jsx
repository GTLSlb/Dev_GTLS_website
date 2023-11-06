import React, { useState } from "react";
import InvoicesSidebar from "./InvoicesSidebar";
import Dashboard from "./Pages/Dashboard";
import InvoicesPage from "./Pages/InvoicesPage";
import PurchaseOrder from "./Pages/PurchaseOrder";
import Suppliers from "./Pages/Suppliers";
import Services from "./Pages/Services";
import Companies from "./Pages/Companies";
import Invoice from "./Pages/Invoice";
import CreateInvoice from "./Pages/CreateInvoice";
import CreatePO from "./Pages/CreatePO";
import POdetails from "./Pages/POdetails";
import AddSupplier from "./Pages/AddSupplier";
import Categories from "./Pages/Categories";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseReasons from "./Pages/CloseReasons";
import * as signalR from "@microsoft/signalr";

export default function InvoicesMain({
    setActiveIndexInv,
    activeIndexInv,
    loading,
    setLoading,
    currentUser,
    hubConnection,
    invoiceDetails,
    setInvoiceDetails,
    PODetails,
    setPODetails,
    url,
}) {
    const [states, setStates] = useState();
    const [cities, setCities] = useState();
    const [POs, setPOs] = useState([]);
    const [PO, setPO] = useState();
    const [POBack, setPOBack] = useState(2);
    const [services, setServices] = useState();
    const [supplier, setSupplier] = useState();
    const [invoice, setInvoice] = useState();
    const [companies, setCompanies] = useState();
    const [categories, setCategories] = useState([]);
    const [supplierData, setSupplierData] = useState();
    const [invoices, setInvoices] = useState();
    const [fetchPO, setfetchPO] = useState();
    const [POsApi, setPOsApi] = useState(false);
    const [servicesApi, setServicesApi] = useState(false);
    const [categoriesApi, setCategoriesApi] = useState(false);
    const [companiesApi, setCompaniesApi] = useState(false);
    const [supplierDataApi, setSupplierDataApi] = useState(false);
    const [statesApi, setStatesApi] = useState(false);
    const [citiesApi, setCitiesApi] = useState(false);
    const [invoicesApi, setInvoicesApi] = useState(false);
    const [closeReasons, setCloseReasons] = useState();
    const [closeReasonsApi, setCloseReasonsApi] = useState(false);
    const [user, setUser] = useState(currentUser);
    const [loadingInvoices, setLoadingInvoices] = useState(false);
    const [loadingPOs, setLoadingPOs] = useState(false);
    // const [loading, setLoading] = useState(false);

    useEffect(() => {
        setUser(currentUser);
        axios
            .get(`${url}api/GTIS/States`, {
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
                    setStates(parsedData);
                    setStatesApi(true);
                    setStatesApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });

        axios
            .get(`${url}api/GTIS/Services`, {
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
                    setServices(parsedData.reverse());
                    setServicesApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });

        axios
            .get(`${url}api/GTIS/Cities`, {
                headers: {
                    UserId: currentUser.user_id,
                    StateId: null,
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
                    setCities(parsedData);
                    setCitiesApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });
        axios
            .get(`${url}/api/GTIS/Categories`, {
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
                parsedDataPromise
                    .then((parsedData) => {
                        setCategories(parsedData);
                        setCategoriesApi(true);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((err) => {
                console.log(err);
            });

        axios
            .get(`${url}api/GTIS/Invoices`, {
                headers: {
                    UserId: currentUser.user_id,
                    InvoiceId: null,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    setInvoices(parsedData);
                    setInvoicesApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });

        axios
            .get(`${url}api/GTIS/POs`, {
                headers: {
                    UserId: currentUser.user_id,
                    PO_Id: null,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    setPOs(parsedData);
                    setPOsApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });

        axios
            .get(`${url}api/GTIS/Suppliers`, {
                headers: {
                    UserId: currentUser.user_id,
                    SupplierId: null,
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
                    setSupplierData(parsedData);
                    setSupplierDataApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });
        axios
            .get(`${url}api/GTIS/Companies`, {
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
                    setCompanies(parsedData.reverse());
                    setCompaniesApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });
        axios
            .get(`${url}api/GTIS/PoCloseReasons`, {
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
                    setCloseReasons(parsedData.reverse());
                    setCloseReasonsApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    function getInvoices() {
        setLoadingInvoices(true);
        axios
            .get(`${url}api/GTIS/Invoices`, {
                headers: {
                    UserId: currentUser.user_id,
                    InvoiceId: null,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    setInvoices(parsedData);
                    setActiveIndexInv(1);
                    setLoadingInvoices(false);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    function getStates() {
        axios
            .get(`${url}api/GTIS/States`, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    setStates(parsedData);
                    setStatesApi(true);
                    setStatesApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    function getPOs() {
        setLoadingPOs(true);
        axios
            .get(`${url}api/GTIS/POs`, {
                headers: {
                    UserId: currentUser.user_id,
                    PO_Id: null,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    setPOs(parsedData);
                    setActiveIndexInv(2);
                    setLoadingPOs(false);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    function getServices() {
        axios
            .get(`${url}api/GTIS/Services`, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    setServices(parsedData.reverse());
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    function getCompanies() {
        axios
            .get(`${url}api/GTIS/Companies`, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    setCompanies(parsedData.reverse());
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    function getCategories() {
        axios
            .get(`${url}/api/GTIS/Categories`, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    setCategories(parsedData.reverse());
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    function getSuppliers() {
        axios
            .get(`${url}api/GTIS/Suppliers`, {
                headers: {
                    UserId: currentUser.user_id,
                    SupplierId: null,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    setSupplierData(parsedData);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    function AlertToast(msg, status) {
        if (status == 1) {
            toast.success(msg, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else if (status == 2) {
            toast.error(msg, {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }
    function getCloseReasons() {
        axios
            .get(`${url}api/GTIS/PoCloseReasons`, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    setCloseReasons(parsedData.reverse());
                    setCloseReasonsApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    const [activeIndex, setActiveIndex] = useState(0);
    const [lastIndex, setLastIndex] = useState(0);
    const components = [
        <Dashboard />,
        <InvoicesPage
            hubConnection={hubConnection}
            currentUser={currentUser}
            invoice={invoice}
            AlertToast={AlertToast}
            setInvoice={setInvoice}
            setActiveIndexInv={setActiveIndexInv}
            activeIndexInv={activeIndexInv}
            invoices={invoices}
            setInvoices={setInvoices}
            states={states}
            setPODetails={setPODetails}
            url={url}
            POs={POs}
            setPOBack={setPOBack}
            loadingInvoices={loadingInvoices}
            setLoadingInvoices={setLoadingInvoices}
            getInvoices={getInvoices}
            supplierData={supplierData}
            companies={companies}
            categories={categories}
            setInvoiceDetails={setInvoiceDetails}
        />,
        <PurchaseOrder
            loadingPOs={loadingPOs}
            setLoadingPOs={setLoadingPOs}
            fetchPO={fetchPO}
            url={url}
            AlertToast={AlertToast}
            setPOBack={setPOBack}
            setfetchPO={setfetchPO}
            currentUser={currentUser}
            setActiveIndexInv={setActiveIndexInv}
            activeIndexInv={activeIndexInv}
            POs={POs}
            setPOs={setPOs}
            getPOs={getPOs}
            setPO={setPO}
            setPODetails={setPODetails}
            states={states}
            supplierData={supplierData}
            companies={companies}
            categories={categories}
        />,
        <Suppliers
            setActiveIndexInv={setActiveIndexInv}
            url={url}
            AlertToast={AlertToast}
            currentUser={currentUser}
            getSuppliers={getSuppliers}
            states={states}
            supplierData={supplierData} // variable that holds the data so it won't refresh again
            setSupplierData={setSupplierData} // variable that holds the data so it won't refresh again
            services={services}
            setSupplier={setSupplier}
            cities={cities}
        />,
        <Services
            setActiveIndexInv={setActiveIndexInv}
            url={url}
            AlertToast={AlertToast}
            currentUser={currentUser}
            getServices={getServices}
            services={services}
            setServices={setServices}
        />,
        <Companies
            setActiveIndexInv={setActiveIndexInv}
            url={url}
            AlertToast={AlertToast}
            currentUser={currentUser}
            getCompanies={getCompanies}
            companies={companies}
            setCompanies={setCompanies}
            states={states}
        />,
        <Invoice
            hubConnection={hubConnection}
            currentUser={currentUser}
            AlertToast={AlertToast}
            setActiveIndexInv={setActiveIndexInv}
            setInvoiceDetails={setInvoiceDetails}
            invoiceDetails={invoiceDetails}
            states={states}
            url={url}
            getInvoices={getInvoices}
            supplierData={supplierData}
            companies={companies}
            services={services}
            categories={categories}
        />,
        <CreateInvoice
            invoices={invoices}
            hubConnection={hubConnection}
            getInvoices={getInvoices}
            AlertToast={AlertToast}
            currentUser={currentUser}
            setActiveIndexInv={setActiveIndexInv}
            states={states}
            supplierData={supplierData}
            companies={companies}
            url={url}
            invoice={invoice}
            setInvoice={setInvoice}
            categories={categories}
        />,
        <CreatePO
            hubConnection={hubConnection}
            setActiveIndexInv={setActiveIndexInv}
            currentUser={currentUser}
            AlertToast={AlertToast}
            states={states}
            url={url}
            PO={PO}
            getPOs={getPOs}
            setPO={setPO}
            supplierData={supplierData}
            companies={companies}
            categories={categories}
        />,
        <POdetails
            invoices={invoices}
            hubConnection={hubConnection}
            getPOs={getPOs}
            getInvoices={getInvoices}
            currentUser={currentUser}
            AlertToast={AlertToast}
            POBack={POBack}
            setActiveIndexInv={setActiveIndexInv}
            states={states}
            url={url}
            closeReasons={closeReasons}
            PODetails={PODetails}
            setPODetails={setPODetails}
            supplierData={supplierData}
            companies={companies}
            services={services}
            categories={categories}
        />,
        <AddSupplier
            supplierData={supplierData}
            setActiveIndexInv={setActiveIndexInv}
            url={url}
            AlertToast={AlertToast}
            getSuppliers={getSuppliers}
            states={states}
            services={services}
            supplier={supplier}
            setSupplier={setSupplier}
            cities={cities}
        />,
        <Categories
            url={url}
            currentUser={currentUser}
            AlertToast={AlertToast}
            getCategories={getCategories}
            categories={categories}
            setCategories={setCategories}
        />,
        <CloseReasons
            setActiveIndexInv={setActiveIndexInv}
            url={url}
            AlertToast={AlertToast}
            currentUser={currentUser}
            getCloseReasons={getCloseReasons}
            closeReasons={closeReasons}
            setCloseReasons={setCloseReasons}
            states={states}
        />,
    ];

    if (
        citiesApi &&
        servicesApi &&
        invoicesApi &&
        categoriesApi &&
        companiesApi &&
        supplierDataApi &&
        POsApi &&
        statesApi &&
        closeReasonsApi
    ) {
        setLoading(true);
    }
    if (loading) {
        return (
            <div className="bg-smooth">
                <div className=" h-full flex ">
                    {/* Left sidebar & main wrapper */}
                    <div className="min-w-0 flex-1 bg-gray-100 xl:flex">
                        <div className=" xl:w-64 flex-shrink-0 w-full h-auto  md:block mb-4">
                            <div className="h-full  ">
                                {/* Start left column area */}
                                <div
                                    className="relative h-full"
                                    style={{ minHeight: "0rem" }}
                                >
                                    <div className=" inset-0 rounded-lg border-dashed border-gray-200">
                                        <InvoicesSidebar
                                            currentUser={currentUser}
                                            setInvoice={setInvoice}
                                            setPO={setPO}
                                            activeIndexInv={activeIndexInv}
                                            setActiveIndexInv={
                                                setActiveIndexInv
                                            }
                                        />
                                    </div>
                                </div>
                                {/* End left column area */}
                            </div>
                        </div>

                        <div className="bg-smooth lg:min-w-0 lg:flex-1">
                            <div className="h-full">
                                {/* Start main area*/}
                                <div
                                    className="relative h-full"
                                    style={{ minHeight: "36rem" }}
                                >
                                    <div className="absolute inset-0 rounded-lg">
                                        {components[activeIndexInv]}
                                    </div>
                                </div>
                                {/* End main area */}
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>
        );
    } else {
        return (
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
        );
    }
}
