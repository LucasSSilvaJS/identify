import { useState } from "react";
import SignContainer from "../../components/SignContainer";

function Cadastro() {
    //States para o email e senha do administrador
    const [emailAdmin, setEmailAdmin] = useState("");
    const [passwordAdmin, setPasswordAdmin] = useState("");

    //States para a validação do email e senha do administrador
    const [isEmailAdminValid, setIsEmailAdminValid] = useState(true);
    const [isPasswordAdminValid, setIsPasswordAdminValid] = useState(true);

    //States para a validação do email e senha do usuário
    const [isUserEmailValid, setIsUserEmailValid] = useState(true);
    const [isUserPasswordValid, setIsUserPasswordValid] = useState(true);
    const [isCargoValid, setIsCargoValid] = useState(true);

    //Verificar se é administrador
    const [isAdmin, setIsAdmin] = useState(false);

    //States para o cadastro de usuário
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [cargo, setCargo] = useState("");
    const [userPassword, setUserPassword] = useState("");

    function verifyEmail(stateEmail, setStateIsEmailValid) {
        if (validateEmail(stateEmail)) {
            setStateIsEmailValid(true);
        } else {
            setStateIsEmailValid(false);
        }
    }

    function validatePassword(statePassword, setStateIsPasswordValid) {
        if (statePassword === "") {
            setStateIsPasswordValid(false);
        } else {
            setStateIsPasswordValid(true);
        }
    }

    function validateCargo(stateCargo, setStateIsCargoValid) {
        if (stateCargo === "perito" || stateCargo === "assistente") {
            setStateIsCargoValid(true);
        } else {
            setStateIsCargoValid(false);
        }
    }

    function validateEmail(stateEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(stateEmail);
    }

    async function handleAuthentication(e) {
        e.preventDefault();

        verifyEmail(emailAdmin, setIsEmailAdminValid);
        validatePassword(passwordAdmin, setIsPasswordAdminValid);

        const isEmailOkay = isEmailAdminValid === true && emailAdmin !== "";
        const isPasswordOkay = isPasswordAdminValid === true && passwordAdmin !== "";

        if (!isEmailOkay || !isPasswordOkay) {
            alert("E-mail ou senha inválidos");
            return;
        }

        setIsAdmin(true);
        alert("Autenticação realizada com sucesso");
        // Limpa todos os campos
        setEmailAdmin("");
        setPasswordAdmin("");
    }

    function handleUserRegistration(e) {
        e.preventDefault();

        verifyEmail(userEmail, setIsUserEmailValid);
        validatePassword(userPassword, setIsUserPasswordValid);
        validateCargo(cargo, setIsCargoValid);

        const isEmailOkay = isUserEmailValid === true && userEmail !== "";
        const isPasswordOkay = isUserPasswordValid === true && userPassword !== "";
        const isCargoOkay = isCargoValid === true && cargo !== "";

        if (!isEmailOkay || !isPasswordOkay || !isCargoOkay) {
            if (!isEmailOkay) {
                alert("Por favor, insira um e-mail válido");
            }
            if (!isPasswordOkay) {
                alert("Por favor, insira uma senha válida");
            }
            if (!isCargoOkay) {
                alert("Por favor, insira um cargo válido");
            }
            return;
        }

        // Aqui você implementaria a lógica de cadastro com o backend
        alert("Usuário cadastrado com sucesso!");

        // Limpa os campos após o cadastro
        setUserName("");
        setUserEmail("");
        setUserPassword("");
    }

    return (
        <SignContainer active={false}>
            {
                isAdmin ? (
                    <>
                        <h1 className="text-lg font-medium mb-8">Cadastro de usuário</h1>
                        <form className="flex flex-col items-center justify-center" onSubmit={handleUserRegistration}>
                            <select
                                className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none mb-4"
                                value={cargo}
                                onChange={(e) => setCargo(e.target.value)}
                            >
                                <option value="perito">Perito</option>
                                <option value="assistente">Assistente</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Digite o nome do usuário"
                                className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none mb-4"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Digite o email do usuário"
                                className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none mb-4"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Digite a senha do usuário"
                                className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none mb-8"
                                value={userPassword}
                                onChange={(e) => setUserPassword(e.target.value)}
                            />
                            <button className="px-4 py-2 rounded-lg bg-mediumbeige text-darkblue border border-darkblue" onClick={handleUserRegistration}>Cadastrar</button>
                        </form>
                    </>
                ) : (
                    <>
                        <h1 className="text-lg font-medium mb-8">Autenticação de administrador</h1>
                        <form className="flex flex-col items-center justify-center" onSubmit={handleAuthentication}>
                            <input
                                type="email"
                                placeholder="Digite seu email"
                                className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none mb-4"
                                value={emailAdmin}
                                onChange={(e) => setEmailAdmin(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Digite sua senha"
                                className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none mb-8"
                                value={passwordAdmin}
                                onChange={(e) => setPasswordAdmin(e.target.value)}
                            />
                            <button className="px-4 py-2 rounded-lg bg-mediumbeige text-darkblue border border-darkblue" onClick={handleAuthentication}>Autenticar</button>
                        </form>
                    </>
                )
            }
        </SignContainer>
    );
}

export default Cadastro;