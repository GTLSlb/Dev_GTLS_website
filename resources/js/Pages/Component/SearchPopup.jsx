import ReactModal from "react-modal";
import { useEffect, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import { XMarkIcon } from '@heroicons/react/20/solid';

export default function SearchPopup({
    results,
    isLoading,
    searchQuery,
    isOpen,
    handlePopUpClose,
    handleSearchChange,
    setIsOpen,
    indices,
    handleClearInput,
    Hit,
    errMsg,
}) {

    const divRef = useRef();
    useEffect(() => {
        const handleScroll = () => {
          if (isOpen) {
            setIsOpen(false);
          }
        };
        const handleClickOutside = (event) => {
          if (!divRef.current?.contains(event.target)) {
            setIsOpen(false);
          }
        };
        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          window.removeEventListener("scroll", handleScroll);
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [setIsOpen, isOpen, divRef]);

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={handlePopUpClose}
            shouldCloseOnEsc={true}
            shouldCloseOnOverlayClick={true}
            appElement={document.getElementById("modal")}
            className="fixed inset-0 flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-60 z-50"
        >
            <div ref={divRef} id="modal" className="w-[80%] h-auto max-h-[30%] pt-3 px-3 flex focus:outline-none bg-white rounded-md z-50">
                {indices?.length > 0 && (
                    <div className="w-full flex flex-col items-center">
                        <div className="w-full flex items-center">
                            <SearchIcon />
                            <input
                                type="text"
                                value={searchQuery}
                                onMouseDown={() => setIsOpen(true)}
                                onClick={() => setIsOpen(true)}
                                onChange={handleSearchChange}
                                placeholder="Search..."
                                className="bg-white border-none h-[20px] w-full text-gray-700 placeholder-gray-600 focus:ring-0"
                            />
                            <XMarkIcon className="h-4 w-4 text-black hover:cursor-pointer" onClick={handleClearInput}/>
                        </div>
                        <div className={`${isOpen && isLoading ? 'block my-2' : 'hidden'} flex items-center gap-x-2 text-sm rounded-sm text-slate-500 w-full bg-white px-4 z-[100]`}>
                            <CircularProgress color="inherit" size={15} />
                            Loading..
                        </div>
                        {
                            !isLoading && errMsg != "" && (
                                <div className="text-sm text-red-600 flex items-center justify-start text-left">
                                    <span>
                                        {errMsg}
                                    </span>
                                </div>
                            )
                        }
                        {isOpen && (
                            <div
                                className={`w-full my-3 pb-3 bg-white z-[100] max-h-[200px] overflow-auto containerscroll`}
                            >
                                {results?.length > 0 && results.map((hit, index) => (
                                    <Hit hit={hit} key={index}/>
                                ))}
                                {!isLoading && results?.length === 0 && (
                                    <div className="text-sm text-gray-600 flex items-center justify-start text-left">
                                        <span>
                                            No results found
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ReactModal>
    );
}
