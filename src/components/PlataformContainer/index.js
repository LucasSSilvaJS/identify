import logo from "../../assets/logo.svg";
import { LuFilter, LuUserPlus } from "react-icons/lu";
import { GoFileDirectory } from "react-icons/go";
import { BsFillFileEarmarkPlusFill } from "react-icons/bs";
import { MdOutlineHome } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { IoMdCloseCircleOutline } from "react-icons/io";

function PlataformContainer({ children, search = "", setSearch, showStatusSelect = false, setShowStatusSelect, selectedStatus = "", setSelectedStatus}) {
    const location = useLocation();
    const disabled = location.pathname !== "/casos";

    const { logout, user } = useContext(AuthContext);
    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleLogout = () => {
        logout();
    };

    const handleStatusSelect = (status) => {
        setSelectedStatus(status);
        setShowStatusSelect(false);
    };

    return (
        <div className="h-screen bg-mediumbeige p-4">
            <div className="mx-auto w-full max-w-screen-lg relative">
                {user.cargo === "admin" && <Link to={'/cadastro'} className="fixed bottom-4 right-4 w-16 h-16 flex items-center justify-center gap-2 rounded-full p-4 shadow-lgmediumbeige bg-darkblue">
                    <LuUserPlus size={24} className="text-mediumbeige"/>
                </Link>}
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
                        <input disabled={disabled} type="text" placeholder="Buscar por título ou descrição" className={`w-full px-4 py-2 pe-14 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none absolute inset-0 ${disabled ? "cursor-not-allowed" : ""}`} value={search} onChange={handleSearch}/>
                        <IoMdCloseCircleOutline className={`text-darkblue absolute right-2 top-1/2 -translate-y-1/2 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`} onClick={disabled ? () => {} : () => setSearch("")}/>
                        <LuFilter className={`text-darkblue absolute right-8 top-1/2 -translate-y-1/2 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`} onClick={disabled ? () => {} :    () => setShowStatusSelect(!showStatusSelect)}/>
                        {showStatusSelect && (
                            <div className="absolute right-0 top-10 bg-lightbeige rounded-lg p-2 shadow-lg z-10">
                                <select className="w-full px-4 py-2 rounded-lg bg-lightbeige text-darkblue border border-darkblue outline-none" value={selectedStatus} onChange={(e) => handleStatusSelect(e.target.value)}>
                                    <option value="" disabled>Selecione um status</option>
                                    <option value="">Todos</option>
                                    <option value="Em andamento">Em andamento</option>
                                    <option value="Finalizado">Finalizado</option>
                                    <option value="Arquivado">Arquivado</option>
                                </select>
                            </div>
                        )}
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
