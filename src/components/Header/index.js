import logo from "../../assets/logo.svg";

function Header({ userName, cargo }) {
    return (
        <header className="w-full flex items-center justify-between p-4 bg-mediumbeige">
            <img src={logo} alt="logo" className="w-28" />
            
            <div className="flex items-center gap-4">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Buscar" 
                        className="w-[300px] px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-darkblue">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="text-right">
                        <p className="text-darkblue">{userName}</p>
                        <p className="text-sm text-darkblue">{cargo}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-darkblue"></div>
                </div>
            </div>
        </header>
    );
}

export default Header; 