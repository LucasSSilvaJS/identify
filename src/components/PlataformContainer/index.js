import logo from "../../assets/logo.svg";
import { FaSearch } from "react-icons/fa";
import { LuFilter } from "react-icons/lu";
import { GoFileDirectory } from "react-icons/go";
import { BsFillFileEarmarkPlusFill } from "react-icons/bs";
import { MdOutlineHome } from "react-icons/md";
import { Link } from "react-router-dom";
function PlataformContainer({ children }) {
    return (
        <div className="h-screen bg-mediumbeige p-4">
            <div className="mx-auto w-full max-w-screen-lg">
                <header className="flex items-center w-full sm:gap-16 sm:flex-row flex-col gap-4">
                    <div className="flex items-center justify-between w-full sm:w-auto">
                        <img src={logo} alt="logo" className="w-28" />
                        <div className="flex items-center gap-2 sm:hidden">
                            <div className="flex items-center flex-col">
                                <p className="text-darkblue">João da Silva</p>
                                <p className="text-darkblue text-sm">Perito</p>
                            </div>
                            <div className="w-10 h-10 bg-darkblue rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-darkbeige rounded-lg py-2 px-4 border-darkblue border w-full justify-between">
                        <label id="search" className="relative w-full sm:w-1/2 h-10">
                            <input type="text" placeholder="Buscar" className="w-full px-4 py-2 pe-14 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none absolute inset-0" />
                            <FaSearch className="text-darkblue absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer" />
                            <LuFilter className="text-darkblue absolute right-8 top-1/2 -translate-y-1/2 cursor-pointer" />
                        </label>
                        <div className="items-center gap-2 hidden sm:flex">
                            <div className="flex items-center flex-col">
                                <p className="text-darkblue">João da Silva</p>
                                <p className="text-darkblue text-sm">Perito</p>
                            </div>
                            <div className="w-10 h-10 bg-darkblue rounded-full"></div>
                        </div>
                    </div>
                </header>
                <main className="flex gap-4 w-full mt-4">
                    <aside className="flex sm:flex-col gap-12 sm:py-16 sm:w-30 mx-auto sm:mx-0 h-full bg-darkbeige rounded-lg p-4 border-darkblue border">
                        <Link to="/casos" className="flex items-center justify-center gap-1 bg-lightbeige rounded-lg p-2 flex-col h-20">
                            <GoFileDirectory className="text-darkblue" size={24} />
                            <p className="text-darkblue">Casos</p>
                        </Link>
                        <Link to="/casos/novo" className="flex items-center justify-center gap-1 bg-lightbeige rounded-lg p-2 flex-col h-20">
                            <BsFillFileEarmarkPlusFill className="text-darkblue" size={24} />
                            <p className="text-darkblue">Novo Caso</p>
                        </Link>
                        <Link to="/home" className="flex items-center justify-center gap-1 bg-lightbeige rounded-lg p-2 flex-col h-20">
                            <MdOutlineHome className="text-darkblue" size={40} />
                            <p className="text-darkblue">Home</p>
                        </Link>
                    </aside>
                    {children}
                </main>
            </div>
        </div>
    );
}

export default PlataformContainer;