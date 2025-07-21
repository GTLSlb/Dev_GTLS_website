import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { Select, SelectItem } from "@nextui-org/react";
import { useEffect } from "react";
import PropTypes from "prop-types";

function ContactUsForm({ getFormSection }) {
    const [enquiryValue, setEnquiryValue] = useState(new Set([]));
    const [heardOfUsValue, setHeardOfUsValue] = useState(new Set([]));
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        message: "",
        phone: "",
        enquiry: "",
        heardofUs: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [recaptchaValue, setRecaptchaValue] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRecaptchaChange = () => {
        setRecaptchaValue(true);
    };

    const handleRecaptchaExpired = () => {
        setRecaptchaValue(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach((key) => data.append(key, formData[key]));

        // Simulate API submission and reset form
        axios
            .post("/contactus", data)
            .then((response) => {
                setFormData({
                    name: "",
                    company: "",
                    email: "",
                    message: "",
                    phone: "",
                    enquiry: "",
                    heardofUs: "",
                });
                setEnquiryValue(""); // Reset enquiry state
                setHeardOfUsValue(""); // Reset heardOfUs state
                setErrors({});
                setIsLoading(false);
                setSuccess(true);
                setSuccess(response.status === 200);
            })
            .catch((error) => {
                console.error(error.response);
                setErrors(error.response?.data?.errors || {});
                setIsLoading(false);
            });
    };

    const typeOfEnquiry = [
        { key: "feedback", label: "Feedback" },
        { key: "compliant", label: "Compliant" },
        { key: "services", label: "Product and Services" },
        { key: "sales", label: "Sales Enquiry" },
    ];
    const heardofUs = [
        { key: "google", label: "Google Search" },
        { key: "social", label: "Social Media" },
        { key: "ads", label: "Online Ads" },
        { key: "wordofmouth", label: "Word of mouth referral" },
        { key: "email", label: "Email Marketing" },
        { key: "print", label: "Print Media" },
        { key: "customer", label: "Existing Customer" },
    ];

    useEffect(() => {
        const enqvalue = typeOfEnquiry.find(
            (item) => item.key == enquiryValue.currentKey
        );
        const heardvalue = heardofUs.find(
            (item) => item.key == heardOfUsValue.currentKey
        );

        setFormData((prev) => ({
            ...prev,
            enquiry: enqvalue?.label,
            heardofUs: heardvalue?.label,
        }));
    }, [enquiryValue, heardOfUsValue]);

    return (
        <div className=" w-full">
            <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="py-4 sm:pb-32 lg:py-24 z-10 w-full"
            >
                <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg rounded-3xl">
                    <div className="grid grid-cols-1 gap-y-3 gap-x-8 p-8">
                        <div
                            className=""
                            dangerouslySetInnerHTML={{
                                __html: getFormSection.Title,
                            }}
                        />
                        <div
                            className=""
                            dangerouslySetInnerHTML={{
                                __html: getFormSection.Body,
                            }}
                        />

                        {["name", "company", "email", "phone"].map((field) => (
                            <div key={field}>
                                <div className="relative group mt-3 border-b w-full border-goldt">
                                    <input
                                        type={
                                            field === "email"
                                                ? "email"
                                                : field === "phone"
                                                ? "tel"
                                                : "text"
                                        }
                                        required
                                        autoComplete="off"
                                        id={field}
                                        name={field}
                                        onChange={handleChange}
                                        value={formData[field]}
                                        pattern={
                                            field === "phone"
                                                ? "[0-9]*"
                                                : undefined
                                        } // Allow only numbers for phone
                                        onInput={
                                            field === "phone"
                                                ? (e) =>
                                                      (e.target.value =
                                                          e.target.value.replace(
                                                              /[^0-9]/g,
                                                              ""
                                                          ))
                                                : undefined
                                        } // Prevent non-numeric input
                                        className="w-full h-10 text-sm text-white !p-0 peer appearance-none bg-transparent outline-none border-dark form-input"
                                    />
                                    <label
                                        htmlFor={field}
                                        className={`text-white transform transition-all absolute top-0 left-0 flex items-center text-sm ${
                                            formData[field]
                                                ? "text-xs !h-1/4 -translate-y-full pl-0"
                                                : ""
                                        } group-focus-within:text-xs group-focus-within:h-1/2 group-focus-within:-translate-y-full group-focus-within:pl-0`}
                                    >
                                        {field.charAt(0).toUpperCase() +
                                            field.slice(1)}
                                        <span className="text-red-500">*</span>
                                    </label>
                                </div>
                                {errors[field] && (
                                    <div className="error">
                                        {errors[field][0]}
                                    </div>
                                )}
                            </div>
                        ))}

                        <Select
                            variant="bordered"
                            label="Type of enquiry"
                            selectedKeys={enquiryValue}
                            isRequired
                            onSelectionChange={(value) => {
                                setEnquiryValue(value); // Update the state
                                setFormData({
                                    ...formData,
                                    enquiry: enquiryValue.currentKey,
                                });
                            }}
                            className="w-full text-white border-b border-goldt"
                            classNames={{
                                trigger: "border-0 p-0",
                                popoverContent:
                                    "bg-white border-1 text-black border-goldt",
                                inputWrapper: "!text-white",
                                innerWrapper: "!text-white",
                                value: "!text-white",
                                label: "text-white  group-data-[filled=true]:text-white group-data-[filled=true]:mb-2",
                            }}
                        >
                            {getFormSection.Enquries.enquiries_types.map(
                                (type) => (
                                    <SelectItem
                                        key={type.id}
                                        className="text-black"
                                    >
                                        {type.Name}
                                    </SelectItem>
                                )
                            )}
                        </Select>

                        <Select
                            variant="bordered"
                            isRequired
                            label="How did you hear about us?"
                            selectedKeys={heardOfUsValue}
                            onSelectionChange={(value) => {
                                setHeardOfUsValue(value); // Update the state
                                setFormData({
                                    ...formData,
                                    heardofUs: heardOfUsValue.currentKey,
                                });
                            }}
                            className="w-full text-white border-b border-goldt"
                            classNames={{
                                trigger: "border-0 p-0",
                                popoverContent:
                                    "bg-white border-1 text-black border-goldt",
                                inputWrapper: "!text-white",
                                innerWrapper: "!text-white",
                                value: "!text-white",
                                label: "text-white  group-data-[filled=true]:text-white group-data-[filled=true]:mb-2",
                            }}
                        >
                            {getFormSection.HeardFrom.heared_froms.map(
                                (type) => (
                                    <SelectItem
                                        key={type.id}
                                        className="text-black"
                                    >
                                        {type.Name}
                                    </SelectItem>
                                )
                            )}
                        </Select>

                        <div className="mt-2.5">
                            <label
                                htmlFor="message"
                                className="block text-sm mb-2 leading-6 text-white"
                            >
                                Message<span className="text-red-500">*</span>
                            </label>
                            <div className="border rounded border-goldt">
                                <textarea
                                    required
                                    id="message"
                                    name="message"
                                    onChange={handleChange}
                                    value={formData.message}
                                    className="h-24 appearance-none text-gray-100 placeholder:text-gray-300 bg-transparent border-none w-full mr-3 py-1 px-2 leading-tight focus:outline-none"
                                />
                            </div>
                        </div>
                        {errors.message && (
                            <div className="error">{errors.message[0]}</div>
                        )}
                        <div className="flex items-center justify-between">
                            <ReCAPTCHA
                                sitekey="6Lf30MEmAAAAAA4_iPf9gTM1VMNO9iSFKyaAC1P0"
                                onChange={handleRecaptchaChange}
                                onExpired={handleRecaptchaExpired}
                                className="mt-4 flex justify-center"
                                size="normal"
                                render="explicit"
                                theme="dark"
                                style={{
                                    transform: "scale(0.8)",
                                    transformOrigin: "left",
                                }}
                            />
                            <div className="mt-8 flex justify-right w-full">
                                <button
                                    type="submit"
                                    disabled={!recaptchaValue || isLoading}
                                    className={`block w-full md:ml-auto md:w-full rounded-3xl
                                    px-3.5 py-2.5 text-center text-md font-bold shadow-sm
                                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                                    ${
                                        !recaptchaValue || isLoading
                                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                                            : "bg-gradient-to-r from-goldl to-goldd hover:from-goldd hover:to-goldl text-dark"
                                    }`}
                                >
                                    {isLoading ? (
                                        <div className="inset-0 flex justify-center items-center bg-opacity-50">
                                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-dark"></div>
                                        </div>
                                    ) : (
                                        "Send"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    {success && (
                        <div
                            className="bg-goldt mx-8 border border-goldd text-dark px-4 py-3 rounded relative mb-4 sm:col-span-2"
                            role="alert"
                        >
                            <strong className="font-bold">Success! </strong>
                            <span className="block sm:inline">
                                {" "}
                                Your message has been sent.
                            </span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                <svg
                                    onClick={() => setSuccess(false)}
                                    className="fill-current h-6 w-6 text-dark cursor-pointer"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 1024 1024"
                                >
                                    <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
                                </svg>
                            </span>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}

export default ContactUsForm;

ContactUsForm.propTypes = {
    getFormSection: PropTypes.func.isRequired,
};