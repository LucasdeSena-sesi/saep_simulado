const App = {
    init() {
        if (!localStorage.getItem('equipamentos')) {
            const eqInicial = [
                { id: 1, nome: 'Prensa Hidráulica PH-500', setor: 'Usinagem' },
                { id: 2, nome: 'Torno CNC Siemens 828D', setor: 'Usinagem' },
                { id: 3, nome: 'Esteira Rolante E-20', setor: 'Logística' },
                { id: 4, nome: 'Compressor de Ar Industrial 100L', setor: 'Manutenção' }
            ];
            localStorage.setItem('equipamentos', JSON.stringify(eqInicial));
        }
        if (!localStorage.getItem('usuarios')) localStorage.setItem('usuarios', JSON.stringify([]));
        if (!localStorage.getItem('chamados')) localStorage.setItem('chamados', JSON.stringify([]));
    },

    getUsuarios() { return JSON.parse(localStorage.getItem('usuarios')) || []; },
    getEquipamentos() { return JSON.parse(localStorage.getItem('equipamentos')) || []; },
    getChamados() { return JSON.parse(localStorage.getItem('chamados')) || []; },

    cadastrarUsuario(nome, email, senha) {
        if (!nome || !email || !senha) {
            return { success: false, message: 'Por favor, preencha todos os campos!' };
        }
        const usuarios = this.getUsuarios();
        if (usuarios.find(u => u.email === email)) {
            return { success: false, message: 'O e-mail indicado já se encontra registado!' };
        }
        const novoUsuario = { id: Date.now(), nome, email, senha };
        usuarios.push(novoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        return { success: true, message: 'Utilizador registado com sucesso!' };
    },

    login(email, senha) {
        if (!email || !senha) {
            return { success: false, message: 'Por favor, preencha o e-mail e a palavra-passe!' };
        }
        const usuarios = this.getUsuarios();
        const user = usuarios.find(u => u.email === email && u.senha === senha);
        if (!user) {
            return { success: false, message: 'E-mail ou palavra-passe incorretos!' };
        }
        localStorage.setItem('usuario_logado', JSON.stringify(user));
        return { success: true };
    },

    logout() {
        localStorage.removeItem('usuario_logado');
        window.location.href = 'index.html';
    },

    checkAuth() {
        const user = JSON.parse(localStorage.getItem('usuario_logado'));
        if (!user) {
            window.location.href = 'index.html';
        }
        return user;
    },

    abrirChamado(equipamento_id, descricao, prioridade) {
        if (!equipamento_id || !descricao || !prioridade) {
            return { success: false, message: 'Por favor, preencha todos os campos do chamado!' };
        }
        const equipamentos = this.getEquipamentos();
        if (!equipamentos.find(e => e.id === equipamento_id)) {
            return { success: false, message: 'Equipamento não encontrado!' };
        }
        const chamados = this.getChamados();
        const novoChamado = {
            id: chamados.length + 1,
            equipamento_id,
            descricao,
            prioridade,
            status: 'Aberto'
        };
        chamados.push(novoChamado);
        localStorage.setItem('chamados', JSON.stringify(chamados));
        return { success: true, message: 'Chamado aberto com sucesso!' };
    },

    getChamadosWithJOIN() {
        const chamados = this.getChamados();
        const equipamentos = this.getEquipamentos();
        return chamados.map(c => {
            const eq = equipamentos.find(e => e.id === c.equipamento_id);
            return {
                ...c,
                equipamento_nome: eq ? eq.nome : 'Desconhecido'
            };
        });
    },

    showAlert(msg, type) {
        const alert = document.getElementById('alert');
        if (alert) {
            alert.textContent = msg;
            alert.className = `alert alert-${type}`;
            alert.classList.remove('hidden');
        }
    }
};

App.init();