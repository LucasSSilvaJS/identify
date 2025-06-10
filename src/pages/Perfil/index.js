import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import PlataformContainer from "../../components/PlataformContainer";
import api from "../../api";
import { IoPerson, IoMail, IoLockClosed, IoCamera } from "react-icons/io5";

function Perfil() {
    const { user, logout } = useContext(AuthContext);
    
    // Estados para alteração de senha
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [loadingSenha, setLoadingSenha] = useState(false);
    const [messageSenha, setMessageSenha] = useState("");
    
    // Estados para alteração de email
    const [novoEmail, setNovoEmail] = useState("");
    const [loadingEmail, setLoadingEmail] = useState(false);
    const [messageEmail, setMessageEmail] = useState("");
    
    // Estados para alteração de foto
    const [selectedFile, setSelectedFile] = useState(null);
    const [loadingFoto, setLoadingFoto] = useState(false);
    const [messageFoto, setMessageFoto] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");

    const handleAlterarSenha = async (e) => {
        e.preventDefault();
        
        if (novaSenha !== confirmarSenha) {
            setMessageSenha({ type: "error", text: "As senhas não coincidem" });
            return;
        }
        
        if (novaSenha.length < 6) {
            setMessageSenha({ type: "error", text: "A nova senha deve ter pelo menos 6 caracteres" });
            return;
        }
        
        setLoadingSenha(true);
        setMessageSenha("");
        
        try {
            const response = await api.post("/users/alterar-senha", {
                senhaAtual,
                novaSenha
            });
            
            setMessageSenha({ type: "success", text: response.data.message });
            setSenhaAtual("");
            setNovaSenha("");
            setConfirmarSenha("");
        } catch (error) {
            setMessageSenha({ 
                type: "error", 
                text: error.response?.data?.error || "Erro ao alterar senha" 
            });
        } finally {
            setLoadingSenha(false);
        }
    };

    const handleAlterarEmail = async (e) => {
        e.preventDefault();
        
        if (!novoEmail || !novoEmail.includes("@")) {
            setMessageEmail({ type: "error", text: "Email inválido" });
            return;
        }
        
        setLoadingEmail(true);
        setMessageEmail("");
        
        try {
            const response = await api.post("/users/alterar-email", {
                email: novoEmail
            });
            
            setMessageEmail({ type: "success", text: response.data.message });
            setNovoEmail("");
            
            // Atualizar o contexto com o novo email
            const updatedUser = { ...user, email: response.data.user.email };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            window.location.reload(); // Recarregar para atualizar o contexto
        } catch (error) {
            setMessageEmail({ 
                type: "error", 
                text: error.response?.data?.error || "Erro ao alterar email" 
            });
        } finally {
            setLoadingEmail(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB
                setMessageFoto({ type: "error", text: "A imagem deve ter menos de 5MB" });
                return;
            }
            
            if (!file.type.startsWith("image/")) {
                setMessageFoto({ type: "error", text: "Por favor, selecione apenas imagens" });
                return;
            }
            
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setMessageFoto("");
        }
    };

    const handleAlterarFoto = async (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            setMessageFoto({ type: "error", text: "Por favor, selecione uma imagem" });
            return;
        }
        
        setLoadingFoto(true);
        setMessageFoto("");
        
        try {
            const formData = new FormData();
            formData.append("foto", selectedFile);
            
            const response = await api.post("/users/atualizar-foto", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            
            setMessageFoto({ type: "success", text: response.data.message });
            setSelectedFile(null);
            setPreviewUrl("");
            
            // Atualizar o contexto com a nova foto
            const updatedUser = { ...user, fotoPerfil: response.data.user.fotoPerfil };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            window.location.reload(); // Recarregar para atualizar o contexto
        } catch (error) {
            setMessageFoto({ 
                type: "error", 
                text: error.response?.data?.error || "Erro ao atualizar foto" 
            });
        } finally {
            setLoadingFoto(false);
        }
    };

    const getMessageStyle = (type) => {
        return type === "success" 
            ? "text-green-600 bg-green-100 border-green-300" 
            : "text-red-600 bg-red-100 border-red-300";
    };

    return (
        <PlataformContainer>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Cabeçalho do Perfil */}
                <div className="bg-gradient-to-r from-lightbeige to-white rounded-xl p-6 border border-darkblue shadow-lg">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 bg-darkblue rounded-full flex items-center justify-center overflow-hidden">
                                {user?.fotoPerfil ? (
                                    <img 
                                        src={user.fotoPerfil} 
                                        alt="Foto de perfil" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <IoPerson className="text-mediumbeige text-4xl" />
                                )}
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-darkblue">{user?.username}</h1>
                            <p className="text-gray-600">{user?.email}</p>
                            <span className="inline-block px-3 py-1 bg-darkblue text-mediumbeige rounded-full text-sm font-medium mt-2">
                                {user?.cargo}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Seção de Alteração de Foto */}
                <div className="bg-white rounded-xl p-6 border border-darkblue shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <IoCamera className="text-darkblue text-xl" />
                        <h2 className="text-xl font-semibold text-darkblue">Alterar Foto de Perfil</h2>
                    </div>
                    
                    <form onSubmit={handleAlterarFoto} className="space-y-4">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                    {previewUrl ? (
                                        <img 
                                            src={previewUrl} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : user?.fotoPerfil ? (
                                        <img 
                                            src={user.fotoPerfil} 
                                            alt="Foto atual" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <IoPerson className="text-gray-400 text-2xl" />
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Selecionar Nova Imagem
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-darkblue focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
                                </p>
                            </div>
                        </div>
                        
                        {messageFoto && (
                            <div className={`p-3 rounded-lg border ${getMessageStyle(messageFoto.type)}`}>
                                {messageFoto.text}
                            </div>
                        )}
                        
                        <button
                            type="submit"
                            disabled={loadingFoto || !selectedFile}
                            className="w-full bg-darkblue text-mediumbeige py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingFoto ? "Enviando..." : "Alterar Foto"}
                        </button>
                    </form>
                </div>

                {/* Seção de Alteração de Email */}
                <div className="bg-white rounded-xl p-6 border border-darkblue shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <IoMail className="text-darkblue text-xl" />
                        <h2 className="text-xl font-semibold text-darkblue">Alterar Email</h2>
                    </div>
                    
                    <form onSubmit={handleAlterarEmail} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Atual
                            </label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                disabled
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Novo Email
                            </label>
                            <input
                                type="email"
                                value={novoEmail}
                                onChange={(e) => setNovoEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-darkblue focus:border-transparent"
                                required
                            />
                        </div>
                        
                        {messageEmail && (
                            <div className={`p-3 rounded-lg border ${getMessageStyle(messageEmail.type)}`}>
                                {messageEmail.text}
                            </div>
                        )}
                        
                        <button
                            type="submit"
                            disabled={loadingEmail}
                            className="w-full bg-darkblue text-mediumbeige py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingEmail ? "Alterando..." : "Alterar Email"}
                        </button>
                    </form>
                </div>

                {/* Seção de Alteração de Senha */}
                <div className="bg-white rounded-xl p-6 border border-darkblue shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <IoLockClosed className="text-darkblue text-xl" />
                        <h2 className="text-xl font-semibold text-darkblue">Alterar Senha</h2>
                    </div>
                    
                    <form onSubmit={handleAlterarSenha} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Senha Atual
                            </label>
                            <input
                                type="password"
                                value={senhaAtual}
                                onChange={(e) => setSenhaAtual(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-darkblue focus:border-transparent"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nova Senha
                            </label>
                            <input
                                type="password"
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-darkblue focus:border-transparent"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirmar Nova Senha
                            </label>
                            <input
                                type="password"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-darkblue focus:border-transparent"
                                required
                            />
                        </div>
                        
                        {messageSenha && (
                            <div className={`p-3 rounded-lg border ${getMessageStyle(messageSenha.type)}`}>
                                {messageSenha.text}
                            </div>
                        )}
                        
                        <button
                            type="submit"
                            disabled={loadingSenha}
                            className="w-full bg-darkblue text-mediumbeige py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingSenha ? "Alterando..." : "Alterar Senha"}
                        </button>
                    </form>
                </div>
            </div>
        </PlataformContainer>
    );
}

export default Perfil; 