import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import { getUsers, desativarUsuario, reativarUsuario } from '../../services/user.service';
import PlataformContainer from '../../components/PlataformContainer';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  FaUsers, 
  FaUserCheck, 
  FaUserTimes, 
  FaHome, 
  FaFolder, 
  FaSearch, 
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';

function AdminUsuarios() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [processingUser, setProcessingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Erro ao carregar lista de usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDesativarUsuario = async (userId, username) => {
    if (!window.confirm(`Tem certeza que deseja desativar o usuário "${username}"?`)) {
      return;
    }

    try {
      setProcessingUser(userId);
      await desativarUsuario(userId);
      toast.success(`Usuário "${username}" desativado com sucesso`);
      fetchUsers(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao desativar usuário:', error);
      toast.error('Erro ao desativar usuário');
    } finally {
      setProcessingUser(null);
    }
  };

  const handleReativarUsuario = async (userId, username) => {
    if (!window.confirm(`Tem certeza que deseja reativar o usuário "${username}"?`)) {
      return;
    }

    try {
      setProcessingUser(userId);
      await reativarUsuario(userId);
      toast.success(`Usuário "${username}" reativado com sucesso`);
      fetchUsers(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao reativar usuário:', error);
      toast.error('Erro ao reativar usuário');
    } finally {
      setProcessingUser(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Filtrar usuários
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.cargo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'todos' || user.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    return status === 'ativo' ? 'text-green-600' : 'text-red-600';
  };

  const getCargoColor = (cargo) => {
    switch (cargo) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'perito':
        return 'bg-blue-100 text-blue-800';
      case 'assistente':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <PlataformContainer>
        <LoadingSpinner message="Carregando usuários..." />
      </PlataformContainer>
    );
  }

  return (
    <PlataformContainer>
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <FaUsers className="text-2xl text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Administração de Usuários</h1>
                <p className="text-gray-600">Gerencie as contas dos usuários do sistema</p>
              </div>
            </div>
            
            {/* Botões de navegação */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate('/home')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaHome />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button
                onClick={() => navigate('/casos')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaFolder />
                <span className="hidden sm:inline">Casos</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, email ou cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos os status</option>
                <option value="ativo">Ativos</option>
                <option value="inativo">Inativos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de usuários */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      <FaUsers className="mx-auto text-4xl text-gray-300 mb-4" />
                      <p className="text-lg">Nenhum usuário encontrado</p>
                      <p className="text-sm">Tente ajustar os filtros de busca</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((userItem) => (
                    <tr key={userItem._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {userItem.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {userItem.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCargoColor(userItem.cargo)}`}>
                          {userItem.cargo}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {userItem.status === 'ativo' ? (
                            <FaEye className="text-green-600 mr-2" />
                          ) : (
                            <FaEyeSlash className="text-red-600 mr-2" />
                          )}
                          <span className={`text-sm font-medium ${getStatusColor(userItem.status)}`}>
                            {userItem.status === 'ativo' ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {userItem.status === 'ativo' ? (
                            <button
                              onClick={() => handleDesativarUsuario(userItem._id, userItem.username)}
                              disabled={processingUser === userItem._id}
                              className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50"
                            >
                              {processingUser === userItem._id ? (
                                <FaSpinner className="animate-spin" />
                              ) : (
                                <FaUserTimes />
                              )}
                              Desativar
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReativarUsuario(userItem._id, userItem.username)}
                              disabled={processingUser === userItem._id}
                              className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors disabled:opacity-50"
                            >
                              {processingUser === userItem._id ? (
                                <FaSpinner className="animate-spin" />
                              ) : (
                                <FaUserCheck />
                              )}
                              Reativar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaUserCheck className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'ativo').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaUserTimes className="text-red-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Usuários Inativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'inativo').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlataformContainer>
  );
}

export default AdminUsuarios; 