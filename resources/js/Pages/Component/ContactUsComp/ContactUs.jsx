import ContactUsForm from "./ContactUsForm";
import ContactUsInfo from "./ContactUsInfo";
import PropTypes from "prop-types";
import React from "react";

export default function ContatcUs({ getContactUsInfo, getFormSection }) {
    return (
        <div className=" pt-8">
            <div className=" lg:max-w-7xl mx-auto lg:gap-24 flex flex-col-reverse lg:flex-row w-full">
                <ContactUsForm getFormSection={getFormSection} />
                <ContactUsInfo getContactUsInfo={getContactUsInfo} />
            </div>
        </div>
    );
}

ContatcUs.propTypes = {
    getContactUsInfo: PropTypes.object,
    getFormSection: PropTypes.object,
};