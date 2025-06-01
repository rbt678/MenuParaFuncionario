
# Menu para funcionários de restaurantes

Um aplicativo web para visualização de cardápio, montagem e gerenciamento de pedidos para o Menu para funcionários de restaurantes. Desenvolvido com React, TypeScript e Tailwind CSS, focado em uma experiência de usuário intuitiva e eficiente para o ponto de venda.

## ✨ Features

*   **Visualização de Cardápio Dinâmico**: Navegue por categorias de produtos com descrições e preços.
*   **Montagem de Pedidos (Comanda Atual)**:
    *   Adicione itens ao pedido com facilidade.
    *   Selecione adicionais para itens configuráveis através de um modal interativo.
    *   Ajuste a quantidade dos itens no pedido.
    *   Remova itens do pedido.
    *   Visualize o resumo do pedido com o total calculado em tempo real.
*   **Gerenciamento de Comandas**:
    *   Finalize novas comandas, com opção de adicionar nome do cliente.
    *   Visualize uma lista de comandas finalizadas, ordenadas pela mais recente.
    *   Veja detalhes de cada comanda, incluindo itens, status, timestamps e total.
    *   Atualize o status de uma comanda (Pendente, Em Preparo, Pronto para Retirada, Concluído, Cancelado).
    *   Adicione mais itens a uma comanda existente.
    *   Exclua comandas.
*   **Persistência de Dados**:
    *   A comanda atual e o histórico de comandas finalizadas são salvos no `localStorage` do navegador, permitindo que os dados persistam entre sessões.
*   **Importação e Exportação de Comandas**:
    *   Exporte todas as comandas para um formato de texto para backup ou compartilhamento.
    *   Importe comandas a partir de um texto previamente exportado.
*   **Interface Responsiva**: Adaptável a diferentes tamanhos de tela, de desktops a dispositivos móveis.
*   **Notificações (Toasts)**: Feedback visual para ações do usuário (sucesso, erro, informação).
*   **Modais Interativos**: Para confirmações, seleção de adicionais, entrada de dados (nome do cliente, importação/exportação).
*   **Tematização Customizada**: Paleta de cores e fontes consistentes aplicadas em toda a interface.

## 🛠️ Tech Stack

*   **Frontend**:
    *   [React](https://reactjs.org/) (v19)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Tailwind CSS](https://tailwindcss.com/)
*   **Mecanismo de Módulos**: ES6 Modules com `esm.sh` para importações diretas no navegador.
*   **Ícones**: [Font Awesome](https://fontawesome.com/)
*   **Fontes**: Google Fonts (Inter, Lilita One)
*   **(Potencial Futuro) API**: Google Gemini API (para funcionalidades avançadas como sugestões de cardápio, análise de pedidos, etc. - conforme a expertise do engenheiro e diretrizes do projeto).

## 📁 Project Structure

O projeto é organizado da seguinte forma:

```
.
├── public/
│   └── images/
│       └── Logo.png        # Logotipo da aplicação
├── src/
│   ├── components/         # Componentes React reutilizáveis
│   │   ├── AddonsSelectionModal.tsx
│   │   ├── ComandaDetail.tsx
│   │   ├── ComandaList.tsx
│   │   ├── ComandaListItem.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Logo.tsx
│   │   ├── ManageComandasView.tsx
│   │   ├── MenuItemCard.tsx
│   │   ├── MenuSection.tsx
│   │   ├── Modal.tsx
│   │   ├── OrderItemCard.tsx
│   │   ├── OrderSummary.tsx
│   │   ├── Toast.tsx
│   │   └── ViewSwitcher.tsx
│   ├── constants/
│   │   └── texts.ts        # Constantes de texto para internacionalização/centralização
│   ├── data/
│   │   └── menu.ts         # Definição dos itens do cardápio e sua estrutura
│   ├── hooks/
│   │   ├── useComandas.ts      # Lógica de gerenciamento de comandas
│   │   ├── useCurrentOrder.ts  # Lógica de gerenciamento da comanda atual
│   │   ├── useModal.ts       # Lógica para controle de modais
│   │   └── useToasts.ts      # Lógica para exibição de toasts
│   ├── styles/
│   │   └── theme.ts        # Configurações de tema (cores, fontes)
│   ├── types/
│   │   └── types.ts        # Definições de tipos TypeScript
│   ├── utils/
│   │   └── comandaTextExporterImporter.ts # Funções para exportar/importar comandas
│   ├── App.tsx             # Componente principal da aplicação
│   └── index.tsx           # Ponto de entrada do React, renderiza o App
├── index.html              # Arquivo HTML principal
├── metadata.json           # Metadados da aplicação
└── README.md               # Este arquivo
```

**Principais Diretórios e Arquivos:**

*   `public/`: Contém ativos estáticos como imagens.
*   `src/`: Contém todo o código fonte da aplicação React.
    *   `components/`: Cada componente UI tem seu próprio arquivo, promovendo modularidade e reutilização.
    *   `constants/`: `texts.ts` centraliza todos os textos da UI, facilitando a manutenção e futuras traduções.
    *   `data/`: `menu.ts` define a estrutura e os itens do cardápio, separando os dados da lógica de apresentação.
    *   `hooks/`: Custom Hooks encapsulam lógica de estado complexa e efeitos colaterais, tornando os componentes mais limpos e a lógica reutilizável (ex: `useComandas`, `useCurrentOrder`).
    *   `styles/`: `theme.ts` define a paleta de cores, fontes e outros aspectos visuais, garantindo consistência.
    *   `types/`: `types.ts` contém todas as interfaces e tipos TypeScript, garantindo type-safety e clareza nas estruturas de dados.
    *   `utils/`: Funções utilitárias, como `comandaTextExporterImporter.ts` para a funcionalidade de importação/exportação.
    *   `App.tsx`: Orquestra os principais componentes, visualizações e a lógica de navegação entre elas.
    *   `index.tsx`: Ponto de entrada que monta o componente `App` no DOM.
*   `index.html`: Estrutura HTML base, importa Tailwind CSS, fontes e o script principal `index.tsx`.
*   `metadata.json`: Informações sobre o aplicativo, incluindo nome, descrição e permissões (se necessárias).

## 🚀 Getting Started

Como o projeto utiliza importações diretas de `esm.sh` e Tailwind CSS via CDN, a configuração é simplificada.

1.  **Clone o repositório (se aplicável) ou certifique-se de ter todos os arquivos listados acima.**
2.  **Abra o arquivo `index.html` diretamente em um navegador web moderno que suporte ES Modules.**

    Alternativamente, para uma melhor experiência de desenvolvimento (com hot-reloading, por exemplo), você pode servir os arquivos usando um servidor estático simples:
    ```bash
    # Se você tiver Node.js instalado, pode usar 'npx serve'
    npx serve .
    ```
    E então acesse `http://localhost:3000` (ou a porta indicada pelo `serve`).

**Variáveis de Ambiente (para integração com Gemini API):**

Se o projeto for estendido para usar a API Google Gemini (conforme as diretrizes `@google/genai`), uma variável de ambiente `API_KEY` será necessária.

*   `API_KEY`: Sua chave de API para o Google GenAI.
    *   **Importante**: Esta chave deve ser configurada no ambiente de execução e acessada via `process.env.API_KEY`. **Não inclua a chave diretamente no código fonte.** A aplicação assume que `process.env.API_KEY` está disponível.

## ⚙️ Key Functionalities & Logic Details

### State Management

*   O estado local dos componentes é gerenciado com `React.useState`.
*   Efeitos colaterais e lógica de ciclo de vida são tratados com `React.useEffect`.
*   **Custom Hooks** (`src/hooks/`) são extensivamente utilizados para encapsular e reutilizar lógicas de estado complexas:
    *   `useCurrentOrder`: Gerencia os itens do pedido atual, incluindo adição, remoção, atualização de quantidade e persistência no `localStorage` (`OrderReact`).
    *   `useComandas`: Gerencia a lista de comandas finalizadas, incluindo criação, atualização de status, adição de itens a comandas existentes, exclusão, importação/exportação e persistência no `localStorage` (`Comandas`). Lida também com a migração de estruturas de dados antigas.
    *   `useModal`: Fornece uma maneira padronizada de exibir e controlar modais.
    *   `useToasts`: Gerencia a exibição e o desaparecimento de notificações (toasts).

### Modals e Toasts

*   **Modals (`src/components/Modal.tsx`)**: Um componente genérico de modal é usado para diálogos de confirmação, entrada de dados e exibição de informações. Sua configuração é controlada pelo hook `useModal`.
*   **Toasts (`src/components/Toast.tsx`)**: Notificações flutuantes fornecem feedback imediato ao usuário. O hook `useToasts` gerencia a fila de toasts.
*   **AddonsSelectionModal (`src/components/AddonsSelectionModal.tsx`)**: Um modal especializado para permitir que o usuário selecione e quantifique adicionais para um item do cardápio.

### Comanda Management (`useComandas.ts`, `ManageComandasView.tsx`)

*   **Criação**: Novas comandas são criadas a partir da "Comanda Atual", recebendo um número sequencial e timestamp. Opcionalmente, um nome de cliente pode ser associado.
*   **Persistência**: As comandas são salvas no `localStorage`. O hook `useComandas` também inclui lógica de migração para adaptar comandas de formatos mais antigos para a estrutura atual com `sessions`.
*   **Atualização de Status**: O status de uma comanda pode ser alterado através de um seletor no `ComandaDetail.tsx`.
*   **Adição de Itens a Comandas Existentes**: O usuário pode selecionar uma comanda existente e entrar em um modo de "adição", onde novos itens do cardápio podem ser acrescentados àquela comanda. Esses novos itens são adicionados como uma nova "sessão" dentro da comanda.
*   **Importação/Exportação (`comandaTextExporterImporter.ts`)**:
    *   **Exportação**: Converte a lista de comandas em uma string de texto formatada, fácil de copiar.
    *   **Importação**: Parseia uma string de texto (no formato exportado) para recriar objetos de comanda. Lida com a detecção de duplicatas (baseado no ID da comanda) e reporta erros de parsing.

### Estrutura de Dados (`types.ts`)

*   **`MenuItem`**: Representa um item do cardápio.
*   **`OrderItem`**: Estende `MenuItem` para incluir quantidade e adicionais selecionados, representando um item em um pedido.
*   **`ComandaSession`**: Representa um conjunto de `OrderItem`s adicionados em um momento específico, com seu próprio timestamp. Uma comanda pode ter múltiplas sessões.
*   **`Comanda`**: Representa um pedido completo, contendo um ID, número sequencial, nome do cliente (opcional), múltiplas `ComandaSession`s, status, total e timestamps.
*   **`ModalConfig`**: Define a estrutura de configuração para o componente Modal.
*   **`ToastConfig`**: Define a estrutura para notificações toast.

## 🎨 Styling

*   **Tailwind CSS**: Utilizado para estilização rápida e utilitária diretamente no HTML/JSX. A configuração padrão do Tailwind é usada via CDN.
*   **Custom Theme (`src/styles/theme.ts`)**: Um objeto de tema define cores primárias, secundárias, de acento, de texto, de fundo, fontes e tamanhos de fonte. Esses valores são referenciados nos componentes para garantir consistência visual.
    *   As cores do tema são injetadas nos `className` do Tailwind como `bg-[${theme.colors.primary}]`, etc.
    *   Fontes (`Lilita One` para títulos, `Inter` para corpo) são importadas via Google Fonts no `index.html`.
*   **Scrollbar Personalizada**: Estilos para uma scrollbar customizada são definidos no `index.html` usando as cores do tema.

## 🔄 Manutenibilidade e Escalabilidade

O projeto foi estruturado visando a facilidade de manutenção e a capacidade de expansão futura:

*   **Arquitetura Baseada em Componentes**: A UI é dividida em componentes React pequenos e reutilizáveis (`src/components/`), facilitando o desenvolvimento e a manutenção isolada de partes da interface.
*   **TypeScript**: O uso de TypeScript em todo o projeto garante type-safety, melhora a legibilidade do código e auxilia na refatoração, reduzindo a probabilidade de erros em tempo de execução.
*   **Custom Hooks**: A extração de lógica complexa para custom hooks (`src/hooks/`) mantém os componentes mais limpos (focados na UI) e promove a reutilização da lógica de negócios e de estado.
*   **Centralização de Constantes e Tipos**:
    *   Textos da UI são centralizados em `src/constants/texts.ts`, facilitando atualizações e futuras traduções.
    *   Tipos e interfaces são definidos em `src/types/types.ts`, fornecendo uma fonte única da verdade para as estruturas de dados.
*   **Separação de Preocupações (Separation of Concerns)**:
    *   Dados do cardápio (`src/data/`) estão separados da lógica da UI.
    *   Estilos e tema (`src/styles/`) são gerenciados separadamente.
    *   Utilitários (`src/utils/`) são modularizados.
*   **Configuração de Tema**: O uso de um arquivo de tema (`theme.ts`) permite que as alterações visuais globais (cores, fontes) sejam feitas de forma centralizada.
*   **Código Legível e Organizado**: A estrutura de pastas e a nomeação de arquivos e variáveis seguem convenções que visam a clareza.

## 🔮 Possíveis Melhorias Futuras

*   **Integração com Backend**:
    *   Substituir `localStorage` por um banco de dados real para persistência de dados mais robusta e compartilhamento entre múltiplos dispositivos/usuários.
    *   **Google Gemini API**: Integrar para funcionalidades como:
        *   Sugestões de itens populares ou combinações.
        *   Chatbot para assistência ao cliente ou ao operador.
        *   Análise de tendências de pedidos.
        *   Geração de descrições de itens do cardápio.
*   **Autenticação de Usuários**: Permitir diferentes níveis de acesso (ex: operador, administrador).
*   **Atualizações em Tempo Real**: Se múltiplas instâncias do app precisarem sincronizar dados (ex: cozinha e caixa), usar WebSockets ou serviços como Firebase Realtime Database.
*   **Testes**: Implementar testes unitários e de integração para garantir a estabilidade do código.
*   **Progressive Web App (PWA)**: Adicionar Service Workers para funcionalidade offline aprimorada e capacidade de "instalação" do app.
*   **Analytics**: Coletar dados de uso para entender quais são os itens mais populares, horários de pico, etc.
*   **Otimizações de Performance**: Para cardápios muito extensos ou grande volume de comandas, otimizar renderizações e manipulação de dados.
*   **Internacionalização (i18n)**: Embora os textos estejam centralizados, implementar um sistema de i18n completo para suportar múltiplos idiomas.
*   **Impressão de Comandas**: Funcionalidade para imprimir comandas para a cozinha ou para o cliente.

---

Este README fornece uma visão geral do projeto "Menu para funcionários de restaurantes", sua estrutura, funcionalidades e potencial de crescimento.
