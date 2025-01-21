export default function Safety(props) {
    const getSafety = props.getSafety;
    const strapiApi = window.Laravel.strapiAppUrl;

    const Safetybackground = {
        backgroundImage: `url("${strapiApi + getSafety.Image.url}")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
    };

    return (
        <div
            className=" bg-fixed bg-cover"
            id="technologies"
            style={Safetybackground}
        >
            <div className="relative">
                <div className="bg-black opacity-70  absolute w-full top-0 bottom-0"></div>

                <div className=" mx-auto max-w-2xl  py-24 px-4 sm:py-32 sm:px-6 lg:max-w-7xl ">
                    <div className="relative w-full  border-goldt ">
                        <div className=" pb-2">
                            <div className=" text-4xl font-bold tracking-tight text-goldt sm:text-5xl">
                                {getSafety.Title}
                            </div>
                            <div
                                className="text-gray-100 mt-2 font-bold"
                                dangerouslySetInnerHTML={{
                                    __html: getSafety.Description,
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
