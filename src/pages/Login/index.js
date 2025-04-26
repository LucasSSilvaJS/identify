import { useContext, useState } from "react";
import SignContainer from "../../components/SignContainer";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

function Login() {
    //States para o cadastro de usuário
    const { login } = useContext(AuthContext);
    //States para o login
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //States para a validação dos inputs
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);

    //States para o botão de recuperação de senha
    const [isBtnMissPasswordActive, setIsBtnMissPasswordActive] = useState(false);

    function verifyEmail() {
        if (validateEmail()) {
            setIsEmailValid(true);
        } else {
            setIsEmailValid(false);
        }
    }

    function validatePassword() {
        if (password === "") {
            setIsPasswordValid(false);
        } else {
            setIsPasswordValid(true);
        }
    }

    //Função para o login
    const handleSubmit = async (e) => {
        e.preventDefault();

        verifyEmail();
        validatePassword();

        if (isEmailValid === true && isPasswordValid === true && email !== "" && password !== "") {
            try {
                await login(email, password);
                toast.success("Login realizado com sucesso");
            } catch (error) {
                console.error("Erro ao realizar login:", error);
                toast.error("Erro ao realizar login, tente novamente mais tarde");
            }
        }
    }

    //Função para o botão de recuperação de senha
    function handleMissPassword() {
        setIsBtnMissPasswordActive(!isBtnMissPasswordActive);
    }

    //Função para a validação do e-mail
    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    //Função para o envio do e-mail
    function handleSubmitMissPassword(e) {
        e.preventDefault();
        if (validateEmail()) {
            toast.success("Link de recuperação de senha enviado para o seu e-mail");
        } else {
            toast.error("E-mail inválido");
        }
    }

    return (
        <>
            <SignContainer handleMissPassword={handleMissPassword} isBtnMissPasswordActive={isBtnMissPasswordActive}>
                {
                    isBtnMissPasswordActive ? (
                        <>
                            <h1 className="text-lg font-medium mb-8">Recuperar senha</h1>
                            <form className="flex flex-col items-center justify-center">
                                <input type="email" placeholder="Digite seu email" className={`w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none mb-2`} onChange={(e) => setEmail(e.target.value)} />
                                <p className="text-sm text-darkblue mb-8">
                                    Ao clicar em 'Próximo', um link de recuperação de senha será enviado para o seu e-mail.
                                </p>
                                <button type="submit" className="self-end px-4 py-2 rounded-lg bg-mediumbeige text-darkblue border border-darkblue" onClick={handleSubmitMissPassword}>Enviar</button>
                            </form>
                        </>
                    ) :
                        (
                            <>
                                <h1 className="text-lg font-medium mb-8">Login</h1>
                                <form className="flex flex-col items-center justify-center">
                                    <input type="email" placeholder="Digite seu email" className={`w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none ${!isEmailValid ? "" : "mb-4"}`} onChange={(e) => setEmail(e.target.value)} />
                                    {!isEmailValid && <p className="text-red-500 text-sm self-start py-2">*E-mail inválido</p>}
                                    <input type="password" placeholder="Digite sua senha" className={`w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none ${!isPasswordValid ? "" : "mb-8"}`} onChange={(e) => setPassword(e.target.value)} />
                                    {!isPasswordValid && <p className="text-red-500 text-sm self-start py-2">*Senha inválida</p>}
                                    <button type="submit" className="self-end px-4 py-2 rounded-lg bg-mediumbeige text-darkblue border border-darkblue" onClick={handleSubmit}>Entrar</button>
                                </form>
                            </>
                        )
                }
            </SignContainer>
        </>
    );
}

export default Login;

