const url1 = "https://botafogo-atletas.mange.li/2024-1/";
const url2 = 'https://botafogo-atletas.mange.li/2024-1/all';

// Função para buscar e processar os dados
async function fetchData() {
    try {
        // Fazendo a requisição HTTP usando fetch
        const response = await fetch(url2);

        // Verificando se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.status);
        }

        // Convertendo a resposta para JSON
        const data = await response.json();

        // Agora, você pode trabalhar com os dados
        console.log(data);

        // Exemplo de como integrar os dados ao seu código
        // Se você precisar exibir as informações em algum lugar no HTML:
        const listaAtletas = document.getElementById('listaAtletas');
        data.forEach(atleta => {
            const item = document.createElement('li');
            item.textContent = `${atleta.nome} - ${atleta.posicao}`;
            listaAtletas.appendChild(item);
        });
    } catch (error) {
        console.error('Erro ao obter dados:', error);
    }
}

// Chama a função para buscar os dados
fetchData();
// Seleciona o contêiner onde os cards serão exibidos
const container = document.getElementById("container");

// Cria o contêiner de botões
const buttonContainer = document.getElementById("button-container") || document.createElement("div");
buttonContainer.style.position = 'absolute';
buttonContainer.style.top = '7px';
buttonContainer.style.right = '1000px';

// Função para lidar com o clique nos cards de atleta
const manipulaCLick = (e) => {
    const id = e.currentTarget.dataset.id; // Obtém o ID do atleta
    const url1 = `atleta.html?id=${id}`; // Cria a URL para a página de detalhes do atleta
    
    // Armazena informações do atleta em diferentes métodos de armazenamento
    document.cookie = `id=${id}; path=/`;  // Armazenando ID no cookie
    document.cookie = `nJogos=${e.currentTarget.dataset.nJogos}; path=/`;  // Número de jogos no cookie
    localStorage.setItem('id', id);  // Armazenando ID no localStorage
    localStorage.setItem('dados', JSON.stringify(e.currentTarget.dataset));  // Dados completos no localStorage
    sessionStorage.setItem('id', id);  // Armazenando ID no sessionStorage
    sessionStorage.setItem('dados', JSON.stringify(e.currentTarget.dataset));  // Dados completos no sessionStorage
    
    window.location.href = url1; // Redireciona para a página de detalhes
    console.log(e.currentTarget);
};


// Função para calcular o hash SHA-256 de uma senha usando SubtleCrypto
async function calculaHashSHA256(senha) {
    const encoder = new TextEncoder(); // Codifica a string da senha em bytes
    const data = encoder.encode(senha); // Codifica a senha
    const hashBuffer = await crypto.subtle.digest('SHA-256', data); // Calcula o hash SHA-256
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // Converte o ArrayBuffer para array de bytes
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join(''); // Converte para uma string hexadecimal
    return hashHex;
}

// Senha armazenada (hash SHA-256 da senha 'botafogo')
const hashSenhaCorreta = 'ded6a687514227ff822d40bd397f30f5ae9132487ad6c846599131c740d784f0'; // Este é o hash SHA-256 da senha 'botafogo'

// Criação do formulário de login
const loginForm = document.createElement('form');
loginForm.innerHTML = `
  <label for="password">Senha:</label>
  <input type="password" id="password" required>
  <p id="passwordHint" style="margin-top: 10px; font-size: 14px; color: #555;">Senha: botafogo</p>
  <button type="submit">Login</button>
`;

const passwordInput = loginForm.querySelector('#password');

// Função que lida com o envio do formulário de login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const senhaInserida = passwordInput.value;
    
    // Calcula o hash da senha inserida
    const hashInserido = await calculaHashSHA256(senhaInserida);

    // Compara o hash calculado com o hash da senha correta
    if (hashInserido === hashSenhaCorreta) {  // Verifica se os hashes são iguais
        sessionStorage.setItem('logado', true); // Marca como logado no sessionStorage
        checkLogin(); 
    } else {
        alert('Senha inválida'); // Alerta se a senha for incorreta
    }
});

// Adiciona o formulário de login ao corpo da página
document.body.appendChild(loginForm);

container.style.display = 'none'; 
buttonContainer.style.display = 'none'; 
document.body.appendChild(buttonContainer);

// Função para verificar se o usuário está logado
const checkLogin = () => {
    if (!sessionStorage.getItem('logado')) {  // Se não estiver logado
        container.style.display = 'none';
        loginForm.style.display = 'block'; // Exibe o formulário de login
        buttonContainer.style.display = 'none'; // Esconde os botões
    } else {
        container.style.display = 'block';  // Exibe o conteúdo principal
        loginForm.style.display = 'none';
        buttonContainer.style.display = 'block'; // Exibe os botões de navegação
        renderPlayerList(currentPlayerList); // Renderiza a lista de jogadores
    }
};

// Verifica o login assim que a página for carregada
document.addEventListener('DOMContentLoaded', () => {
    checkLogin();  
});

// Função assíncrona para pegar dados JSON de uma URL
const pega_json = async (caminho) => {
    const resposta = await fetch(caminho); // Faz uma requisição para a URL
    const dados = await resposta.json(); // Converte a resposta para JSON
    return dados; // Retorna os dados obtidos
};

// Função para montar os cards dos atletas
const montaCard = (atleta) => {
    const cartao = document.createElement("article");
    const nome = document.createElement("h1");
    const imagem = document.createElement("img");
    const descricao = document.createElement("p");
    
    nome.innerText = atleta.nome;  // Nome do atleta
    nome.style.fontFamily = 'sans-serif';  // Define a fonte do nome
    cartao.appendChild(nome);
    
    imagem.src = atleta.imagem;  // Imagem do atleta
    cartao.appendChild(imagem);
    
    descricao.innerHTML = atleta.detalhes;  // Detalhes sobre o atleta
    cartao.appendChild(descricao);

    cartao.dataset.id = atleta.id;  // Armazena o ID do atleta no card
    cartao.dataset.nJogos = atleta.n_jogos;  // Armazena o número de jogos no card
    
    cartao.onclick = manipulaCLick;
    
    // Estilos do card
    cartao.style.display = 'flex';
    cartao.style.flexDirection = 'column';
    cartao.style.alignItems = 'center';
    cartao.style.padding = '20px';
    cartao.style.border = '1px solid #ccc';
    cartao.style.borderRadius = '10px';
    cartao.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    cartao.style.margin = '10px'; 
    cartao.style.width = '200px'; 
    
    return cartao;
};

let currentPlayerList = 'male';

// Função para renderizar a lista de jogadores
const renderPlayerList = (list) => {
    container.innerHTML = ''; 

    // Estilos de layout usando Flexbox
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap'; 
    container.style.justifyContent = 'flex-start';
    container.style.gap = '20px'; 

    // Renderiza os jogadores com base no filtro
    if (list === 'male') {
        pega_json(`${url1}masculino`).then((r) => {
            r.forEach((ele) => {
                const card = montaCard(ele);
                container.appendChild(card);
            });
        });
    } else if (list === 'female') {
        pega_json(`${url1}feminino`).then((r) => {
            r.forEach((ele) => {
                const card = montaCard(ele);
                container.appendChild(card);
            });
        });
    } else if (list === 'all') {
        pega_json(`${url1}masculino`).then((r) => {
            r.forEach((ele) => {
                const card = montaCard(ele);
                container.appendChild(card); 
            });
            pega_json(`${url1}feminino`).then((r) => {
                r.forEach((ele) => {
                    const card = montaCard(ele);
                    container.appendChild(card);
                });
            });
        });
    }
};

// Função para carregar os dados dos jogadores masculinos inicialmente
pega_json(`${url1}masculino`).then(
    (r) => {
        r.forEach(
            (ele) => container.appendChild(montaCard(ele))  // Cria e adiciona o card de cada atleta
        );
    }
);

// Criação do botão para alternar entre masculino e feminino
const switchButton = document.createElement('button');
switchButton.textContent = 'Feminino'; 
switchButton.classList.add('switch-button');

// Adiciona funcionalidade de alternar entre listas de jogadores e jogadoras
switchButton.addEventListener('click', () => {
    currentPlayerList = currentPlayerList === 'male' ? 'female' : 'male';
    renderPlayerList(currentPlayerList);
    switchButton.textContent = currentPlayerList === 'male' ? 'Masculino' : 'Masculino';
});

// Criação do botão para exibir todos os jogadores
const showAllButton = document.createElement('button');
showAllButton.textContent = 'Mostrar todos';
showAllButton.classList.add('show-all-button');

// Exibe todos os jogadores (masculinos e femininos)
showAllButton.addEventListener('click', () => {
    currentPlayerList = 'all';
    renderPlayerList(currentPlayerList);  // Atualiza a lista para mostrar todos
});

// Adiciona os botões ao contêiner
buttonContainer.appendChild(switchButton);
buttonContainer.appendChild(showAllButton);
document.body.appendChild(buttonContainer);
