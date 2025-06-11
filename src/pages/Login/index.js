import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import SignContainer from "../../components/SignContainer";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email === "" || password === "") {
            toast.error("E-mail ou senha inválidos");
            return;
        }

        setIsLoading(true);
        try {
            const userData = await login(email, password);
            toast.success("Login realizado com sucesso");
            
            // Redireciona baseado no cargo do usuário
            if (userData.cargo === 'admin') {
                navigate("/admin/usuarios");
            } else {
                navigate("/home");
            }
        } catch (error) {
            console.error("Erro ao realizar login:", error);
            
            // Tratamento específico de erros baseado na resposta da API
            if (error.response) {
                // Erro com resposta do servidor
                const status = error.response.status;
                const message = error.response.data?.message || "Erro desconhecido";
                
                if (status === 401) {
                    toast.error("E-mail ou senha incorretos");
                } else if (status === 403) {
                    toast.error("Conta não autorizada. Entre em contato com o administrador.");
                } else if (status === 404) {
                    toast.error("Usuário não encontrado");
                } else if (status >= 500) {
                    toast.error("Erro no servidor. Tente novamente mais tarde.");
                } else {
                    toast.error(message);
                }
            } else if (error.request) {
                // Erro de rede
                toast.error("Erro de conexão. Verifique sua internet e tente novamente.");
            } else {
                // Outros erros
                toast.error("Erro ao realizar login, tente novamente mais tarde");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SignContainer>
            <h1 className="text-lg font-medium mb-8">Login</h1>
            <form className="flex flex-col items-center justify-center">
                <input type="email" placeholder="Digite seu email" className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none mb-4" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Digite sua senha" className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none mb-8" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className="self-end px-4 py-2 rounded-lg bg-mediumbeige text-darkblue border border-darkblue" onClick={handleSubmit}>{isLoading ? "Carregando..." : "Entrar"}</button>
            </form>
        </SignContainer>
    );
}

export default Login;

