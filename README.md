
# Aplicação Web para Gestão de Atletas Tricolor Mirins

## PAC - Projeto de Aprendizagem Colaborativa Extensionista do Curso de Engenharia de Software da Católica de Santa Catarina

**Autores:** Dereck Conink e Pâmela Baron


**Professores orientadores**: Luiz Carlos Camargo e Claudinei Dias

---

## 1.Introdução
A justificativa para o desenvolvimento do projeto reside na necessidade de resolver problemas críticos gerados pela ausência de um sistema informatizado em ambientes esportivos, como falhas de comunicação, perda de dados e dificuldades no controle dos atletas. Em particular, a falta de acesso rápido a informações médicas em emergências comprometia a segurança e o atendimento imediato aos alunos. A solução proposta teve como objetivo desenvolver uma aplicação web para a gestão completa dos alunos , visando centralizar informações essenciais , reduzir a carga operacional e minimizar erros administrativos para os gestores. A entidade diretamente beneficiada pelas ações de extensão foi o Projeto Tricolor Mirins, localizado em Joinville.


---

## 1.2 Descrição da aplicação

O sistema desenvolvido é uma aplicação web com o objetivo geral de gerenciar alunos de escolas e projetos de formação esportivas, proporcionando maior eficiência administrativa, segurança na tomada de decisões e acesso rápido a informações médicas e cadastrais. O sistema visa centralizar e organizar dados dos alunos, gerenciamento de jogos e treinos. As funcionalidades essenciais estabelecidas incluem:
- Controle de Alunos e Dados: Gerenciamento de cadastro, edição, visualização e remoção de alunos, incluindo o cadastro de dados médicos e anamnese.
- Gestão de Turmas e Atividades: Cadastro de turmas, agendamentos de jogos (com escalação e registro de resultados) e horários de treinos.
- Segurança e Acesso: O sistema requer uma tela de login com autenticação por senha, sendo restrito apenas a colaboradores e administradores.


---

## 2. Descrição do Público Beneficiado pelas Ações de Extensão
O público beneficiado é composto por:  
- **Gestores e treinadores:** maior controle administrativo e acesso rápido a informações.  
- **Alunos (crianças e adolescentes):** ambiente esportivo mais seguro e organizado.  

O sistema será implementado em um projeto de formação de atletas em Joinville, atendendo demandas reais da comunidade esportiva.  

---

## 3. Objetivos

### 3.1 Objetivo Geral
Desenvolver e implementar uma **aplicação web** promovendo:  
- Eficiência administrativa.  
- Segurança na tomada de decisões.  
- Acesso rápido a informações médicas e cadastrais.  
- Melhor comunicação entre treinadores, gestores e responsáveis.  

### 3.2 Objetivos Específicos
- Estruturar um sistema eficiente para gestão de informações.  
- Desenvolver módulo de gerenciamento de jogos (escalação e resultados).  
- Implementar sistema para organização de jogos, treinos e campeonatos.  
- Desenvolver gerenciamento de categorias (faixa etária).  
- Garantir interface web intuitiva e eficiente.  

---

## 4. Descrição das Principais Atividades Realizadas

### 4.1 Definição da Proposta
Criação de um sistema que substitui métodos manuais de gestão de:  
- Dados de alunos.  
- Jogos.  
- Categorias.  
- Informações médicas.  

### 4.2 Estabelecimento dos Objetivos e Funcionalidades
Principais funcionalidades:  
- Login.  
- Gerenciamento de alunos (cadastro, edição, visualização, remoção).  
- Anamnese.  
- Cadastro de jogos, escalação e resultados.  
- Cadastro de categorias.
- Calendário de eventos (treinos, campeonatos, jogos).  
- Lembretes r acesso rápido no painel inicial.  
- Filtros de busca de alunos (categoria, nome, posição).  


### 4.3 Tecnologias Utilizadas
- **Frontend:** React, HTML, CSS, JavaScript.  
- **Backend:** Node.js com Express.  
- **Autenticação:** JWT (JSON Web Token).  
- **Versionamento:** GitHub.  
- **Gestão de Tarefas:** JIRA - [Acesse aqui](https://pbaron.atlassian.net/jira/software/projects/PACJEC/summary)
- **Prototipagem:** Figma.
- **Banco de Dados:** MongoDB Atlas.

---

## 5. Configuração do Ambiente e Inicialização
Para preparar o ambiente de desenvolvimento e executar a aplicação, a equipe definiu a utilização de arquivos .env para o gerenciamento de variáveis sensíveis, além da execução dos módulos Front-end e Back-end separadamente.

Abaixo está o procedimento necessário para baixar as dependências e iniciar o projeto em um ambiente de desenvolvimento, conforme a arquitetura que utiliza Node.js (Back-end) e React (Front-end):

### 5.1 Instalação de Dependências
Tanto o módulo de Backend quanto o módulo de Frontend precisarão ter suas dependências baixadas individualmente.
 - No diretório do Backend abra o terminal e execute: npm install
 - No diretório do Frontend abra o terminal e execute: npm install

### 5.2 Inicialização dos Módulos
Após a instalação das dependências, os módulos devem ser iniciados em terminais separados para que a comunicação entre Frontend e Backend seja estabelecida.
- No terminal do diretório Backend, execute: npm start
- No terminal do diretório Frontend, execute: npm run dev
