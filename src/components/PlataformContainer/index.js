import logo from "../../assets/logo.svg";
import { FaSearch } from "react-icons/fa";
import { LuFilter } from "react-icons/lu";
import { GoFileDirectory } from "react-icons/go";
import { BsFillFileEarmarkPlusFill } from "react-icons/bs";
import { MdOutlineHome } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

function PlataformContainer({ children, search, setSearch }) {
    const { logout, user } = useContext(AuthContext);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="h-screen bg-mediumbeige p-4">
            <div className="mx-auto w-full max-w-screen-lg">
                <header className="flex items-center justify-between w-full sm:gap-16 sm:flex-row flex-col gap-4 rounded-lg p-4 shadow-lg border border-darkblue bg-darkbeige">
                    <div className="flex items-center justify-between w-full sm:w-auto">
                        <img src={logo} alt="logo" className="w-28" />
                        <div className="flex items-center gap-4 sm:hidden">
                            <div className="flex items-center flex-col">
                                <p className="text-darkblue text-center">{user.username}</p>
                                <p className="text-darkblue text-sm">{user.cargo}</p>
                            </div>
                            <FaSignOutAlt size={20} className="text-darkblue cursor-pointer" onClick={handleLogout} />
                        </div>
                    </div>

                    <label id="search" className="relative w-full sm:w-1/2 h-10">
                        <input type="text" placeholder="Buscar" className="w-full px-4 py-2 pe-14 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none absolute inset-0" value={search} onChange={handleSearch}/>
                        <FaSearch className="text-darkblue absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer" />
                        <LuFilter className="text-darkblue absolute right-8 top-1/2 -translate-y-1/2 cursor-pointer" />
                    </label>
                    <div className="items-center gap-4 hidden sm:flex">
                        <div className="flex items-center flex-col">
                            <p className="text-darkblue text-center">{user.username}</p>
                            <p className="text-darkblue text-sm text-center">{user.cargo}</p>
                        </div>
                        <FaSignOutAlt size={20} className="text-darkblue cursor-pointer" onClick={handleLogout} />
                    </div>
                </header>

                <main className="flex gap-4 mt-4 sm:flex-row flex-col">
                    <aside className="flex sm:flex-col gap-4 sm:gap-12 sm:py-16 sm:w-30 mx-auto sm:mx-0 h-full bg-darkbeige rounded-lg p-4 border-darkblue border">
                        <Link to="/casos" className="flex items-center justify-center gap-1 bg-lightbeige rounded-lg p-2 flex-col sm:h-20 h-16">
                            <GoFileDirectory className="text-darkblue sm:text-2xl text-xl" />
                            <p className="text-darkblue sm:text-base text-sm">Casos</p>
                        </Link>
                        <Link to="/casos/novo" className="flex items-center justify-center gap-1 bg-lightbeige rounded-lg p-2 flex-col sm:h-20 h-16">
                            <BsFillFileEarmarkPlusFill className="text-darkblue sm:text-2xl text-xl" />
                            <p className="text-darkblue sm:text-base text-sm">Novo Caso</p>
                        </Link>
                        <Link to="/home" className="flex items-center justify-center gap-1 bg-lightbeige rounded-lg p-2 flex-col sm:h-20 h-16">
                            <MdOutlineHome className="text-darkblue sm:text-4xl text-3xl" />
                            <p className="text-darkblue sm:text-base text-sm">Home</p>
                        </Link>
                    </aside>
                    <div className="flex-1">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default PlataformContainer;