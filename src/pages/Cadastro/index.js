import { useState } from "react";
import SignContainer from "../../components/SignContainer";
import { toast } from 'react-toastify';
import api from "../../api";
import { useNavigate } from "react-router-dom";

function Cadastro() {
    const navigate = useNavigate()

    //States para o cadastro de usuário
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [cargo, setCargo] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    async function handleUserRegistration(e) {
        e.preventDefault();

        if (username && email && cargo && password) {
            setIsLoading(true)
            try{
                const response = await api.post('/auth/register', {
                    username,
                    email,
                    cargo,
                    password
                })

                if(response.status === 201){
                    toast.success('Usuário cadastrado com sucesso')
                    navigate('/home')
                }
            }catch(err){
                console.log('Erro ao cadastrar', err)
                
                // Tratamento específico de erros baseado na resposta da API
                if (err.response) {
                    // Erro com resposta do servidor
                    const status = err.response.status;
                    const message = err.response.data?.message || "Erro desconhecido";
                    
                    if (status === 400) {
                        toast.error("Dados inválidos. Verifique as informações fornecidas.");
                    } else if (status === 409) {
                        toast.error("Usuário ou e-mail já existe no sistema.");
                    } else if (status === 403) {
                        toast.error("Você não tem permissão para cadastrar usuários.");
                    } else if (status >= 500) {
                        toast.error("Erro no servidor. Tente novamente mais tarde.");
                    } else {
                        toast.error(message);
                    }
                } else if (err.request) {
                    // Erro de rede
                    toast.error("Erro de conexão. Verifique sua internet e tente novamente.");
                } else {
                    // Outros erros
                    toast.error("Erro ao cadastrar usuário");
                }
            }finally{
                setIsLoading(false)
            }
        } else {
            toast.error("Preencha todos os campos obrigatórios");
        }
    }

    return (
        <SignContainer active={false}>
            <h1 className="text-lg font-medium mb-8">Cadastro de usuário</h1>
            <form className="flex flex-col items-center justify-center" onSubmit={handleUserRegistration}>
                <select
                    className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none mb-4"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                >
                    <option value="" selected disabled>Selecione um cargo</option>
                    <option value="perito">Perito</option>
                    <option value="assistente">Assistente</option>
                    <option value="admin">Admin</option>
                </select>
                <input
                    type="text"
                    placeholder="Digite um username"
                    className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none mb-4"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Digite um email "
                    className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Digite uma senha"
                    className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none mb-8"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="px-4 py-2 rounded-lg bg-mediumbeige text-darkblue border border-darkblue" onClick={handleUserRegistration}>{isLoading ? 'Cadastrando...' : 'Cadastrar'}</button>
            </form>
        </SignContainer>
    );
}

export default Cadastro;



