export default function Branches(props) {
    const getBranch = props.getBranch;
    return (
        <div className="bg-dark py-8 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="">
                    <h2 className="text-3xl  font-bold tracking-tight text-goldt sm:text-4xl ">
                        {getBranch?.Title}
                    </h2>
                    <div
                        className="mt-2 text-lg text-white font-bold"
                        dangerouslySetInnerHTML={{
                            __html: getBranch?.Description,
                        }}
                    ></div>
                </div>
                <ul
                    role="list"
                    className=" !list-none mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-20 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
                >
                    {getBranch?.branches?.map((branch) => (
                        <li key={branch.BranchName}>
                            <iframe
                                title={branch.BranchName}
                                src={branch.BranchMapUrl}
                                width="600"
                                height="450"
                                allowFullScreen=""
                                maptype="satellite"
                                loading="lazy"
                                className=" aspect-[3/2] w-full shadow-xl rounded-2xl object-cover"
                            ></iframe>
                            <div className="">
                                <h3 className=" mt-2 text-lg font-bold leading-8 tracking-tight text-center text-white">
                                    {branch.BranchName}
                                </h3>
                            </div>
                            <ul role="list" className="mt-6 flex gap-x-6"></ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
