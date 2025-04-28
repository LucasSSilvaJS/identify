import logo from "../../assets/logo.svg";

function SignContainer({ children}) {
    return (
        <div className="flex flex-col items-center justify-center bg-mediumbeige h-screen p-4">
            <img src={logo} alt="logo" className="w-28 absolute top-4 left-4" />
            <section className="flex flex-col items-center justify-center bg-darkbeige rounded-lg p-6 mb-8">
                {children}
            </section>
        </div>
    );
}

export default SignContainer;

