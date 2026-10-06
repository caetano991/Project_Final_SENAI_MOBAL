🎵 MELO

Aplicativo mobile de música desenvolvido como projeto final do curso de Desenvolvimento de Sistemas do SENAI.

O MELO é uma aplicação mobile inspirada em plataformas de streaming de música, desenvolvida com foco em uma experiência simples, moderna e intuitiva para descoberta e reprodução de músicas.

O projeto foi desenvolvido utilizando React Native, Expo e TypeScript, explorando conceitos de desenvolvimento mobile, componentização, gerenciamento de estado e construção de interfaces responsivas.

📱 Sobre o projeto

O MELO foi desenvolvido como projeto final do SENAI, simulando a experiência de um aplicativo de streaming de música.

A aplicação permite ao usuário navegar por diferentes áreas do aplicativo, visualizar músicas, pesquisar artistas e faixas e utilizar uma interface de reprodução com controles básicos.

O projeto possui uma interface minimalista, utilizando uma identidade visual baseada em tons claros, gradientes e elementos inspirados em aplicativos modernos de música.

✨ Funcionalidades


🔐 Autenticação
Tela de boas-vindas
Cadastro de usuário
Login
Validação de e-mail
Validação de senha
Confirmação de senha durante o cadastro
Navegação entre login e cadastro


🏠 Página inicial
Saudação ao usuário
Músicas em destaque
Músicas reproduzidas recentemente
Seção de recomendações
Acesso rápido às músicas
Navegação inferior entre as principais áreas do aplicativo


🔎 Biblioteca
Listagem de músicas
Pesquisa por nome da música
Pesquisa por artista
Contagem de resultados
Estado para quando nenhuma música é encontrada
Acesso direto ao player


▶️ Player
Exibição da capa da música
Nome da música
Nome do artista
Nome do álbum
Barra de progresso
Controle de reprodução e pausa
Música anterior
Próxima música
Controle de progresso manual
Sistema de favoritos
Avanço automático para a próxima música


🛠️ Tecnologias utilizadas
Tecnologia	Utilização
React Native	Desenvolvimento da interface mobile
Expo	Ambiente e ferramentas para desenvolvimento mobile
TypeScript	Tipagem e organização do código
React	Construção dos componentes e gerenciamento da interface
Expo Linear Gradient	Gradientes utilizados na interface
Expo Vector Icons	Ícones da aplicação
React Native Community Slider	Controle de progresso do player

A maior parte da interface e da lógica atual da aplicação está concentrada no App.tsx, que contém os componentes das diferentes telas e os fluxos de navegação entre elas.


🚀 Como executar o projeto

Pré-requisitos

Antes de executar o projeto, é necessário possuir:

Node.js
Expo
Um dispositivo Android/iOS ou emulador
Ou um navegador para execução via Expo Web

1. Clone o repositório
git clone https://github.com/caetano991/Project_Final_SENAI.git

3. Acesse a pasta
cd Project_Final_SENAI

5. Instale as dependências
npm install

7. Inicie o projeto
npx expo start

Depois disso, o Expo disponibilizará as opções para executar o projeto em um dispositivo físico, emulador ou navegador.


📱 Executando no Android

Para iniciar diretamente utilizando o Android:

npm run android

Também é possível iniciar o projeto com:

npx expo start

e posteriormente selecionar a opção desejada no Expo.


🌐 Executando na Web

O projeto também possui suporte para execução através do Expo Web.

npm run web


🧪 Verificação do código

Para executar o lint do projeto:

npm run lint


🎨 Interface

O MELO utiliza uma proposta visual minimalista, com:

Interface limpa
Tipografia com destaque para títulos
Gradientes
Cards para músicas
Navegação inferior
Player dedicado
Tela de autenticação com imagem de fundo
Elementos de interação com feedback visual

A tela inicial utiliza a identidade MELO, enquanto as capas das músicas são representadas por gradientes e elementos gráficos próprios da aplicação.


📚 Conceitos praticados

Durante o desenvolvimento do projeto foram aplicados conceitos importantes de desenvolvimento mobile, como:

Componentização
React Hooks
useState
useEffect
useMemo
useRef
Tipagem com TypeScript
Gerenciamento de estado
Renderização condicional
Listagem e filtragem de dados
Formulários
Validação de dados
Navegação entre telas
Eventos de interação
Interfaces responsivas
Estilização com StyleSheet
Desenvolvimento multiplataforma


⚠️ Observação

Este projeto possui caráter acadêmico e demonstrativo.

As músicas utilizadas na aplicação são representadas por dados locais para simular o funcionamento de uma plataforma de streaming. O player implementado simula o progresso e os controles de reprodução dentro da aplicação.

O projeto não possui atualmente uma infraestrutura de backend ou banco de dados conectado.


🎓 Projeto Final SENAI

Projeto desenvolvido como parte da formação em Desenvolvimento de Sistemas – SENAI.

O objetivo foi aplicar, em um único projeto, conhecimentos adquiridos durante o curso relacionados ao desenvolvimento de aplicações mobile e construção de interfaces utilizando tecnologias modernas.


👨‍💻 Autor

Miguel Caetano

Desenvolvido como projeto acadêmico para conclusão das atividades do curso de Desenvolvimento de Sistemas do SENAI.

Todos os direitos reservados.

📄 Licença

Este projeto está sob a licença e permisão de Miguel Caetano.
