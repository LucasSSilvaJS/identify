import Header from "../Header";
import { Link } from "react-router-dom";

function Layout({ children, userName, cargo }) {
    return (
        <div className="min-h-screen bg-mediumbeige">
            <Header userName={userName} cargo={cargo} />
            
            <div className="flex">
                <nav className="w-[250px] h-[calc(100vh-80px)] p-4 flex flex-col gap-4">
                    <Link to="/casos" className="flex flex-col items-center justify-center p-4 bg-lightbeige rounded-lg hover:bg-opacity-80 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-darkblue">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
                        </svg>
                        <span className="text-darkblue">Casos</span>
                    </Link>

                    <Link to="/novo-caso" className="flex flex-col items-center justify-center p-4 bg-lightbeige rounded-lg hover:bg-opacity-80 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-darkblue">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span className="text-darkblue">Novo Caso</span>
                    </Link>

                    <Link to="/home" className="flex flex-col items-center justify-center p-4 bg-lightbeige rounded-lg hover:bg-opacity-80 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-darkblue">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        <span className="text-darkblue">Home</span>
                    </Link>
                </nav>

                <main className="flex-1 p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout; 