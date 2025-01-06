import aboutcircle from "../../../assets/pictures/aboutcircle.webp";


export default function AboutUs(props) {
    const getAbout = props.getAbout;
    const strapiApi = window.Laravel.strapiAppUrl;
    return (
        <div className="bg-dark py-32" id="aboutus">
            <div className="absolute right-0 ">
                <img src={aboutcircle} alt="circle" />
            </div>
            <div
                id="about"
                className="relative isolate overflow-hidden py-6 sm:py-16 "
            >
                <div className="flex flex-col-reverse lg:flex-row mx-auto max-w-7xl items-center  px-6 lg:px-8 gap-x-28">
                    <div className="mx-auto mt-10 lg:mt-0 w-full relative">
                        <div className="absolute p-4 bg-gradient-to-r from-goldd via-goldt -left-10 bottom-10 -top-10 right-1 hidden lg:block -z-10 rounded-3xl">
                            <div className="h-full  bg-dark rounded-2xl"></div>
                        </div>
                        {/* <img src={aboutimage} alt="truck" className="rounded-3xl"/> */}
                        <img
                            src={strapiApi + getAbout.Image.url}
                            alt="truck"
                            className="rounded-3xl"
                        />
                    </div>
                    <div className="mx-auto  w-full">
                        <p className="mt-2 text-4xl font-bold tracking-tight text-goldt sm:text-5xl">
                            {getAbout ? getAbout.Title : null}
                        </p>

                        <div
                            className="mt-6"
                            dangerouslySetInnerHTML={
                                getAbout
                                    ? { __html: getAbout.Description }
                                    : null
                            }
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
