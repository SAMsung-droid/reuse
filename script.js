// Protótipo local: anúncios, perfil, favoritos e conversas ficam neste navegador.
const dialog = document.querySelector("#action-dialog");
const dialogTitle = dialog.querySelector("#dialog-title");
const dialogContent = dialog.querySelector(".dialog-content");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");
const productGrid = document.querySelector(".product-grid");
const toast = document.querySelector(".toast-message");
const STORAGE_KEY = "reuse-demo-v1";
const CATEGORIES = ["Livros", "Roupas", "Eletrônicos", "Móveis", "Decoração", "Brinquedos", "Acessórios", "Casa", "Esportes"];
const avatar = (name, background = "#d97c32") => {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toLocaleUpperCase("pt-BR");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="${background}"/><text x="64" y="70" fill="#ffffff" font-family="sans-serif" font-size="43" font-weight="600" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};
const demoPeople = {
  "Alex Silva": ["1500648767791-00dcc994a43e", "Gosto de dar novos usos às coisas e encontrar boas histórias pelo caminho."],
  "Marina Costa": ["1534529131774-8ec6a6b0bd12", "Apaixonada por livros, café e por compartilhar boas leituras."],
  "Rafael Martins": ["1506794778202-cad84cf45f1d", "Fotografia, passeios ao ar livre e objetos que ainda têm muita história."],
  "Luiza Nascimento": ["1531123897727-8f129e1688ce", "Adoro moda confortável e consumo com mais intenção."],
  "Thiago Almeida": ["1507003211169-0a1dd7228f2d", "Sempre procurando um jeito novo de deixar a casa mais aconchegante."],
  "Bia Ferreira": ["1524504388940-b1c1722653e1", "Trilhas, viagens e tudo que merece uma segunda aventura."],
  "Pedro Lima": ["1504593811423-6dd665756598", "Música é melhor quando a gente pode compartilhar."],
  "Ana Souza": ["1544005313-94ddf0286df2", "Acredito que uma casa boa é feita de objetos com histórias."],
  "Nina Rocha": ["1488426862026-3ee34a7d66df", "Plantas, cerâmica e pequenos detalhes que fazem a diferença."],
  "Caio Mendes": ["1535713875002-d1d0cf377fde", "Jogos de tabuleiro e tardes longe das telas."],
  "Dani Oliveira": ["1508214751196-bcfd4ca60f91", "Cozinhar fica ainda melhor com bons utensílios e companhia."],
  "João Reis": ["1506794778202-cad84cf45f1d", "Praticidade e simplicidade no dia a dia."],
  "Paula Santos": ["1544005313-94ddf0286df2", "Histórias ilustradas e momentos de leitura em família."],
  "Lucas Alves": ["1500648767791-00dcc994a43e", "Esporte, movimento e diversão ao ar livre."],
  "Malu Vieira": ["1534528741775-53994a69daeb", "Gosto de peças confortáveis que duram por muitas estações."],
  "Gabi Moreira": ["1531123897727-8f129e1688ce", "Decoração simples, reaproveitamento e projetos de fim de semana."],
  "Ivo Carvalho": ["1507003211169-0a1dd7228f2d", "Brincadeiras criativas e brinquedos prontos para outra aventura."],
  "Beatriz Ramos": ["1524504388940-b1c1722653e1", "Adoro plantas e objetos feitos à mão."],
  "Diego Martins": ["1504593811423-6dd665756598", "Curioso por design, fotografia e boas conversas."],
  "Lara Oliveira": ["1534529131774-8ec6a6b0bd12", "Sempre pronta para uma trilha ou para planejar a próxima viagem."],
};
const portraitIds = Object.values(demoPeople).map(([photoId]) => photoId);
const portrait = (name) => {
  const cleanName = name.split(" · ")[0].trim();
  const hash = [...cleanName].reduce((value, character) => (value * 31 + character.charCodeAt(0)) >>> 0, 0);
  const photoId = demoPeople[cleanName]?.[0] || portraitIds[hash % portraitIds.length];
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=240&h=240&q=80`;
};

const demoProducts = [
  ["livros-01", "Coleção de livros", "Livros de ficção, poesia e crônicas em ótimo estado. Quero que continuem sendo lidos e apreciados.", "Livros", "doação", "Muito bom", "Pinheiros", "São Paulo", "SP", "Marina Costa", "1512820790803-83ca734da794"],
  ["camera-01", "Câmera instantânea", "Câmera funcionando perfeitamente, acompanha uma capinha. Estou buscando trocar por um bom fone de ouvido.", "Eletrônicos", "troca", "Bom", "Centro", "Curitiba", "PR", "Rafael Martins", "1516035069371-29a1b244cc32"],
  ["jaqueta-01", "Jaqueta jeans", "Jaqueta jeans azul, tamanho M. Usada poucas vezes e sem avarias.", "Roupas", "doação", "Muito bom", "Boa Viagem", "Recife", "PE", "Luiza Nascimento", "1543076447-215ad9ba6923"],
  ["luminaria-01", "Luminária de mesa", "Luminária articulável em perfeito funcionamento. Tenho interesse em trocar por uma planta ou livros.", "Decoração", "troca", "Bom", "Savassi", "Belo Horizonte", "MG", "Thiago Almeida", "1507473885765-e6ed057f782c"],
  ["mochila-01", "Mochila para aventuras", "Mochila resistente com vários bolsos. Espaçosa e pronta para uma nova viagem.", "Acessórios", "doação", "Bom", "Moinhos de Vento", "Porto Alegre", "RS", "Bia Ferreira", "1553062407-98eeb64c6a62"],
  ["violao-01", "Violão de estudo", "Violão acústico bem cuidado e com cordas novas. Ideal para aprender ou praticar.", "Eletrônicos", "troca", "Bom", "Botafogo", "Rio de Janeiro", "RJ", "Pedro Lima", "1510915361894-db8b60106cb1"],
  ["cadeira-01", "Cadeira de madeira", "Cadeira firme de madeira maciça, com marcas normais de uso. Pode ser retirada no bairro.", "Móveis", "doação", "Usado", "Centro", "Florianópolis", "SC", "Ana Souza", "1503602642458-232111445657"],
  ["vaso-01", "Vaso de cerâmica", "Vaso artesanal em tons neutros, sem trincas. Fica lindo com plantas pequenas.", "Decoração", "troca", "Muito bom", "Cambuí", "Campinas", "SP", "Nina Rocha", "1578500494198-246f612d3b3d"],
  ["quebra-01", "Quebra-cabeça 500 peças", "Todas as peças conferidas e guardadas na caixa original. Para tardes tranquilas.", "Brinquedos", "doação", "Muito bom", "Asa Sul", "Brasília", "DF", "Caio Mendes", "1606092195730-5d7b9af1efc5"],
  ["panela-01", "Panela de ferro", "Panela de ferro fundido conservada, excelente para receitas em família.", "Casa", "troca", "Bom", "Tatuapé", "São Paulo", "SP", "Dani Oliveira", "1556911220-e15b29be8c8f"],
  ["bolsa-01", "Bolsa tiracolo", "Bolsa leve e prática em ótimo estado. Preciso de mais espaço no armário.", "Acessórios", "doação", "Muito bom", "Água Verde", "Curitiba", "PR", "João Reis", "1548036328-c9fa89d128fa"],
  ["livros-02", "Livros infantis ilustrados", "Cinco histórias ilustradas que fizeram sucesso aqui em casa e agora podem encantar outra criança.", "Livros", "doação", "Bom", "Graças", "Recife", "PE", "Paula Santos", "1512820790803-83ca734da794"],
  ["skate-01", "Skate para iniciantes", "Skate completo e funcional. Troco por um capacete infantil ou acessórios de desenho.", "Esportes", "troca", "Usado", "Centro", "Goiânia", "GO", "Lucas Alves", "1547447134-cd3f5c716030"],
  ["casaco-01", "Casaco de lã", "Casaco quentinho, tamanho G. Lavado e pronto para novos dias frios.", "Roupas", "doação", "Bom", "Lourdes", "Belo Horizonte", "MG", "Malu Vieira", "1548126032-079a0fb0099d"],
  ["relogio-01", "Relógio de parede", "Relógio silencioso em madeira clara. Está funcionando e acompanha pilha nova.", "Decoração", "troca", "Muito bom", "Jardins", "São Paulo", "SP", "Gabi Moreira", "1493663284031-b7e3aefcae8e"],
  ["brinquedo-01", "Blocos de montar", "Conjunto colorido de blocos para montar. Completo, higienizado e com caixa.", "Brinquedos", "doação", "Bom", "Centro", "Manaus", "AM", "Ivo Carvalho", "1596461404969-9ae70f2830c1"],
].map(([id, title, description, category, mode, condition, neighborhood, city, state, seller, photo]) => ({
  id, title, description, category, mode, condition, neighborhood, city, state, seller,
  sellerPhoto: portrait(seller),
  photos: [`https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=800&q=80`],
  owner: false,
}));

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { products: demoProducts, favorites: [], chats: {}, profile: { name: "Alex Silva", city: "São Paulo", state: "SP", photo: portrait("Alex Silva") } };
    const state = JSON.parse(saved);
    if (!Array.isArray(state.products) || !Array.isArray(state.favorites) || !state.chats || !state.profile) throw new Error("Formato de dados inválido.");
    if (state.profile.photo?.includes("ui-avatars.com") || state.profile.photo === avatar(state.profile.name)) {
      state.profile.photo = portrait(state.profile.name);
    }
    const demoIds = new Set(demoProducts.map((item) => item.id));
    state.products = [...state.products.filter((item) => !demoIds.has(item.id)), ...demoProducts];
    state.products.filter((item) => item.owner).forEach((item) => {
      item.seller = state.profile.name;
      item.sellerPhoto = state.profile.photo;
    });
    return state;
  } catch (error) {
    console.error("Não foi possível carregar os dados locais do reUSE.", error);
    showToast("Os dados salvos não puderam ser lidos. A demonstração será aberta com anúncios de exemplo.", "error");
    return { products: demoProducts, favorites: [], chats: {}, profile: { name: "Alex Silva", city: "São Paulo", state: "SP", photo: portrait("Alex Silva") } };
  }
}

const state = loadState();
let activeView = "all";
let selectedPhotos = [];
let selectedPhotoFiles = [];
let typingTimer;
let toastTimer;
const pendingReplyTimers = new Set();
let currentPage = "home";
let selectedConversationId = null;
let myItemsFilter = "active";
const DELIVERY_STAGES = ["Negociação aceita", "Aguardando preparação", "Preparado para envio", "Em trânsito", "Saiu para entrega", "Entregue"];
const PRESENTATION_STEPS = [
  {
    page: "explore",
    title: "Explore um anúncio",
    copy: "Abra um produto para ver suas fotos, conservação e localização. Os comentários públicos ficam nos detalhes, separados das conversas privadas.",
  },
  {
    page: "explore",
    title: "Mostre uma proposta",
    copy: "Em um anúncio de doação ou troca, toque em “Tenho interesse” e envie uma solicitação ou proposta. Não há preços nem pagamentos.",
  },
  {
    page: "messages",
    conversationId: "conv-demo-beatriz",
    title: "Acesse as mensagens",
    copy: "Veja a proposta de troca demonstrativa na conversa com Beatriz. É possível aceitar, recusar ou conversar antes de decidir.",
  },
  {
    page: "messages",
    conversationId: "conv-demo-rafael",
    title: "Converse com a reUSE AI",
    copy: "A IA é uma simulação. Pergunte sobre o anúncio ou escreva “aceito a proposta” / “recuso a proposta” para ver a decisão atualizar o protótipo.",
  },
  {
    page: "tracking",
    title: "Acompanhe uma entrega",
    copy: "Veja a negociação aceita e avance uma etapa demonstrativa. O reUSE não realiza transporte; as atualizações são feitas pelos participantes.",
  },
  {
    page: "my-items",
    title: "Gerencie seus anúncios",
    copy: "Finalize mostrando os anúncios do perfil de demonstração. Você pode abrir detalhes, editar, reservar ou marcar um anúncio como concluído.",
  },
];

function makeId(prefix) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`}`;
}

function makeTrackingCode() {
  let code;
  do {
    code = `REU-${new Date().getFullYear()}-${Math.random().toString(10).slice(2, 8)}`;
  } while (state.deliveries.some((delivery) => delivery.code === code));
  return code;
}

function timestamp(minutesAgo = 0) {
  return new Date(Date.now() - minutesAgo * 60000).toISOString();
}

function seedDemoData({ persist = true } = {}) {
  state.profile.id ||= "reuse-demo-user";
  state.products.forEach((item) => {
    item.status ||= "available";
    item.publishedAt ||= timestamp(60 * 24);
  });
  const ownedDemoIds = new Set(["vaso-01", "mochila-01", "bolsa-01"]);
  state.products.filter((item) => ownedDemoIds.has(item.id)).forEach((item) => {
    item.owner = true;
    item.seller = state.profile.name;
    item.sellerPhoto = state.profile.photo;
  });
  state.products.forEach((item) => {
    if (!item.owner) item.sellerPhoto = portrait(item.seller);
  });
  state.comments ||= {};
  const commentSeeds = {
    "livros-01": [["Paula", "Que seleção linda! Ainda estão disponíveis?", 18], ["Marina", "Estão sim, fico feliz que gostou!", 12]],
    "camera-01": [["Bia", "A câmera está funcionando direitinho?", 42], ["Rafael", "Sim! Testei esta semana e está tudo certo.", 35]],
    "jaqueta-01": [["Nina", "Adorei a iniciativa, Luiza!", 76]],
    "vaso-01": [["Lara", "Combina muito com minhas plantas 🌿", 24]],
    "mochila-01": [["Caio", "Ela é confortável para trilhas?", 90], ["Bia", "Usei em algumas viagens, é bem prática!", 83]],
  };
  Object.entries(commentSeeds).forEach(([productId, entries]) => {
    state.comments[productId] ||= entries.map(([name, text, ago]) => ({
      id: makeId("comment"), author: name, photo: portrait(name), text, createdAt: timestamp(ago),
    }));
  });
  Object.values(state.comments).forEach((comments) => comments.forEach((comment) => {
    if (comment.photo?.startsWith("data:image/svg+xml")) comment.photo = portrait(comment.author);
  }));
  state.conversations ||= [];
  if (!state.conversations.length) {
    const seeds = [
      { id: "conv-demo-beatriz", productId: "vaso-01", name: "Beatriz Ramos", ai: false, unread: 2, ago: 8, messages: [["contact", "Oi! Tenho interesse no vaso. Posso oferecer uma suculenta e um cachepô artesanal?", 8]] },
      { id: "conv-demo-diego", productId: "bolsa-01", name: "Diego Martins", ai: false, unread: 1, ago: 22, messages: [["contact", "A bolsa continua disponível para doação?", 22], ["contact", "Oi, Alex! Está sim, está bem conservada.", 20]] },
      { id: "conv-demo-lara", productId: "mochila-01", name: "Lara Oliveira", ai: false, unread: 0, ago: 55, messages: [["contact", "Posso oferecer uma garrafa térmica na troca?", 55], ["contact", "Adorei! Proposta aceita. Combinamos a entrega por aqui.", 53]] },
      { id: "conv-demo-rafael", productId: "camera-01", name: "Rafael Martins · reUSE AI", ai: true, unread: 0, ago: 95, messages: [["me", "Olá! Tenho interesse na câmera. Ainda está disponível?", 95], ["ai", "Oi! Sim, está disponível para troca 😊 Você está procurando algum modelo específico?", 93]] },
    ];
    state.conversations = seeds.map((seed) => ({
      id: seed.id, productId: seed.productId, participantName: seed.name,
      participantPhoto: portrait(seed.name), isAI: seed.ai, unread: seed.unread,
      createdAt: timestamp(seed.ago), updatedAt: timestamp(seed.ago),
      messages: seed.messages.map(([from, text, ago]) => ({ id: makeId("msg"), from, text, author: seed.name, createdAt: timestamp(ago), read: false })),
    }));
  }
  state.conversations.forEach((conversation) => {
    conversation.messages ||= [];
    conversation.unread ||= 0;
    if (conversation.participantPhoto?.startsWith("data:image/svg+xml")) {
      conversation.participantPhoto = portrait(conversation.participantName);
    }
    const item = state.products.find((product) => product.id === conversation.productId);
    if (!conversation.isAI || !item) return;
    conversation.messages.forEach((message, index, messages) => {
      if (message.from !== "ai" || !/não conta esse detalhe|informação não veio|ficção|fictíci|sou uma ia simulada|não sou uma pessoa real|como ia|não tenho experiências próprias|combina com um novo começo numa casa bem acolhedora/i.test(message.text)) return;
      const question = [...messages.slice(0, index)].reverse().find((entry) => entry.from === "me")?.text || "";
      message.text = question
        ? replyFor(question, item, conversation)
        : `Acho que “${item.title}” combina com um novo começo numa casa bem acolhedora 😊`;
      message.author = "reUSE AI · simulação";
    });
  });
  Object.entries(state.chats || {}).forEach(([productId, oldMessages]) => {
    if (!Array.isArray(oldMessages) || state.conversations.some((conversation) => conversation.productId === productId)) return;
    const item = state.products.find((product) => product.id === productId);
    if (!item) return;
    const conversation = findOrCreateConversation(item, item.seller, true);
    conversation.messages = oldMessages.map((message) => ({
      id: makeId("message"), from: message.from === "user" ? "me" : "ai",
      text: message.text, createdAt: message.createdAt || new Date().toISOString(),
    }));
  });
  state.proposals ||= [];
  if (!state.proposals.length) {
    const seedProposals = [
      ["proposal-demo-1", "conv-demo-beatriz", "vaso-01", "Beatriz Ramos", "Troco minha suculenta favorita com cachepô feito à mão.", "pending", 8, "troca", "suculenta com cachepô artesanal"],
      ["proposal-demo-2", "conv-demo-diego", "bolsa-01", "Diego Martins", "Tenho interesse na bolsa, posso combinar a retirada?", "pending", 22, "doação", ""],
      ["proposal-demo-3", "conv-demo-lara", "mochila-01", "Lara Oliveira", "Ofereço uma garrafa térmica conservada pela mochila.", "accepted", 55, "troca", "garrafa térmica"],
      ["proposal-demo-4", "conv-demo-rafael", "camera-01", state.profile.name, "Posso oferecer minha coleção de livros pela câmera?", "pending", 95, "troca", "coleção de livros"],
    ];
    state.proposals = seedProposals.map(([id, conversationId, productId, fromName, message, status, ago, mode, offeredItem]) => ({
      id, conversationId, productId, fromName,
      fromId: fromName === state.profile.name ? state.profile.id : conversationId,
      toName: fromName === state.profile.name ? "Rafael Martins" : state.profile.name,
      toId: fromName === state.profile.name ? "seller-rafael" : state.profile.id,
      message, status, mode, offeredItem, createdAt: timestamp(ago),
    }));
  }
  state.deliveries ||= [];
  if (!state.deliveries.length) {
    const accepted = state.proposals.find((proposal) => proposal.status === "accepted");
    const item = state.products.find((product) => product.id === accepted?.productId);
    if (accepted && item) state.deliveries.push({
      id: "delivery-demo-1", code: "REU-2026-004281", proposalId: accepted.id, productId: item.id,
      sender: accepted.fromName, recipient: accepted.toName, origin: "São Paulo, SP",
      destination: item.city ? `${item.city}, ${item.state}` : "Curitiba, PR",
      method: "Combinação direta entre participantes", stage: 3, externalCode: "",
      updatedAt: timestamp(48),
    });
  }
  state.proposals.filter((proposal) => proposal.status === "accepted").forEach((proposal) => {
    const item = state.products.find((product) => product.id === proposal.productId);
    if (item && item.owner) item.status = "reserved";
  });
  state.notifications ||= [];
  if (!state.notifications.length) {
    state.notifications = [
      ["proposal", "Beatriz enviou uma proposta de troca pelo Vaso de cerâmica.", "conv-demo-beatriz", 8],
      ["proposal", "Diego demonstrou interesse na Bolsa tiracolo.", "conv-demo-diego", 22],
      ["accepted", "A proposta pela Mochila para aventuras foi aceita. Acompanhe o combinado.", "conv-demo-lara", 55],
      ["message", "Rafael enviou uma mensagem sobre Câmera instantânea.", "conv-demo-rafael", 95],
    ].map(([type, text, conversationId, ago]) => ({
      id: makeId("notification"), type, text, conversationId, userId: state.profile.id,
      read: false, createdAt: timestamp(ago),
    }));
  }
  if (persist) saveState();
}

seedDemoData();

let presentationGuideIndex = -1;

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error("Não foi possível salvar os dados. O armazenamento do navegador pode estar cheio.", error);
    showToast("Não foi possível salvar: o armazenamento do navegador pode estar cheio.", "error");
    return false;
  }
}

function showToast(message, type = "success") {
  toast.textContent = message;
  toast.classList.toggle("toast-error", type === "error");
  toast.classList.add("toast-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("toast-visible"), 3600);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function localImageFallback(label = "Objeto reutilizado") {
  const safeLabel = escapeHtml(String(label).slice(0, 34));
  const illustration = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#f7eee3"/><circle cx="650" cy="122" r="95" fill="#f1d7bc"/><circle cx="142" cy="470" r="115" fill="#eee0cf"/><path d="M265 365h270l-26 122H291z" fill="#ed8b32"/><path d="M295 360c12-92 202-92 214 0" fill="none" stroke="#d87520" stroke-width="18" stroke-linecap="round"/><circle cx="350" cy="410" r="15" fill="#fff3e7"/><circle cx="451" cy="410" r="15" fill="#fff3e7"/><text x="400" y="545" text-anchor="middle" fill="#725b45" font-family="sans-serif" font-size="24" font-weight="600">${safeLabel}</text><text x="400" y="578" text-anchor="middle" fill="#9d8267" font-family="sans-serif" font-size="14">IMAGEM ILUSTRATIVA · reUSE</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(illustration)}`;
}

function openPresentationMode() {
  openDialog("Modo apresentação", `
    <p>Prepare uma demonstração guiada do reUSE. O roteiro percorre anúncios, propostas, mensagens, a IA simulada e o acompanhamento de entrega.</p>
    <div class="presentation-dialog-actions">
      <button class="button button-primary" type="button" data-presentation-action="start-guide">Iniciar roteiro <span aria-hidden="true">↗</span></button>
      <button class="button button-outline" type="button" data-presentation-action="reset-confirm">Restaurar dados de demonstração</button>
    </div>
    <p class="field-hint">A restauração repõe as interações de exemplo, mas mantém seu perfil, anúncios pessoais e respectivas conversas.</p>`, "dialog-wide");
}

function openDemoResetConfirmation() {
  openDialog("Restaurar os exemplos?", `
    <p>As conversas, propostas, comentários, favoritos e entregas ligados aos anúncios demonstrativos voltarão ao estado inicial.</p>
    <p><strong>Seu perfil e seus anúncios pessoais, incluindo comentários e conversas vinculados a eles, serão preservados.</strong></p>
    <div class="dialog-actions">
      <button class="button button-outline" type="button" data-presentation-action="cancel-reset">Voltar</button>
      <button class="button button-primary" type="button" data-presentation-action="confirm-reset">Restaurar demonstração</button>
    </div>`, "dialog-wide presentation-reset-dialog");
}

function resetDemoData() {
  const snapshot = JSON.parse(JSON.stringify(state));
  const demoIds = new Set(demoProducts.map((item) => item.id));
  const personalProducts = state.products.filter((item) => !demoIds.has(item.id));
  const personalProductIds = new Set(personalProducts.map((item) => item.id));
  const personalConversations = state.conversations.filter((conversation) => !demoIds.has(conversation.productId));
  const personalConversationIds = new Set(personalConversations.map((conversation) => conversation.id));
  const personalProposals = state.proposals.filter((proposal) => personalProductIds.has(proposal.productId));
  const personalProposalIds = new Set(personalProposals.map((proposal) => proposal.id));
  const personalDeliveries = state.deliveries.filter((delivery) => personalProposalIds.has(delivery.proposalId));
  const demoDeliveryCodes = new Set(state.deliveries.filter((delivery) => demoIds.has(delivery.productId)).map((delivery) => delivery.code));
  const demoTitles = demoProducts.map((item) => item.title);
  const personalNotifications = state.notifications.filter((notice) => {
    if (notice.conversationId) return personalConversationIds.has(notice.conversationId);
    return ![...demoDeliveryCodes].some((code) => notice.text.includes(code))
      && !demoTitles.some((title) => notice.text.includes(title));
  });
  const personalComments = Object.fromEntries(
    Object.entries(state.comments).filter(([productId]) => personalProductIds.has(productId)),
  );
  const personalChats = Object.fromEntries(
    Object.entries(state.chats || {}).filter(([productId]) => personalProductIds.has(productId)),
  );

  state.products = [
    ...demoProducts.map((item) => ({
      ...item, photos: [...item.photos], owner: false, status: "available", publishedAt: timestamp(1440),
    })),
    ...personalProducts,
  ];
  state.favorites = state.favorites.filter((id) => personalProductIds.has(id));
  state.chats = {};
  state.comments = personalComments;
  state.conversations = [];
  state.proposals = [];
  state.deliveries = [];
  state.notifications = [];
  seedDemoData({ persist: false });
  state.conversations.push(...personalConversations);
  state.proposals.push(...personalProposals);
  state.deliveries.push(...personalDeliveries);
  state.notifications.push(...personalNotifications);
  state.chats = personalChats;
  Object.entries(personalChats).forEach(([productId, messages]) => {
    if (state.conversations.some((conversation) => conversation.productId === productId)) return;
    const item = state.products.find((product) => product.id === productId);
    if (!item) return;
    const conversation = findOrCreateConversation(item, item.seller, true);
    conversation.messages = messages.map((message) => ({
      id: makeId("message"), from: message.from === "user" ? "me" : "ai",
      text: message.text, createdAt: message.createdAt || new Date().toISOString(),
    }));
  });

  if (!saveState()) {
    Object.assign(state, snapshot);
    return false;
  }
  pendingReplyTimers.forEach((timer) => clearTimeout(timer));
  pendingReplyTimers.clear();
  selectedConversationId = personalConversations[0]?.id || "conv-demo-beatriz";
  renderProducts();
  renderMyItems();
  renderMessages();
  renderTracking();
  renderProfilePage();
  updateNotificationBadge();
  return true;
}

function renderPresentationGuide() {
  const panel = document.querySelector("#presentation-guide");
  if (presentationGuideIndex < 0) {
    panel.hidden = true;
    return;
  }
  const step = PRESENTATION_STEPS[presentationGuideIndex];
  panel.hidden = false;
  panel.querySelector("[data-guide-count]").textContent = `ETAPA ${presentationGuideIndex + 1} DE ${PRESENTATION_STEPS.length}`;
  panel.querySelector("[data-guide-title]").textContent = step.title;
  panel.querySelector("[data-guide-copy]").textContent = step.copy;
  panel.querySelector("[data-guide-progress]").style.width = `${((presentationGuideIndex + 1) / PRESENTATION_STEPS.length) * 100}%`;
  panel.querySelector('[data-guide-action="previous"]').disabled = presentationGuideIndex === 0;
  panel.querySelector('[data-guide-action="next"]').textContent = presentationGuideIndex === PRESENTATION_STEPS.length - 1 ? "Concluir" : "Próxima etapa";
}

function goToPresentationStep(index) {
  if (index >= PRESENTATION_STEPS.length) {
    presentationGuideIndex = -1;
    renderPresentationGuide();
    showToast("Roteiro concluído. Boa apresentação!");
    return;
  }
  presentationGuideIndex = Math.max(0, index);
  const step = PRESENTATION_STEPS[presentationGuideIndex];
  if (step.page === "explore") clearFilters("all");
  if (step.conversationId) selectedConversationId = step.conversationId;
  enterPage(step.page);
  if (step.conversationId) renderMessages();
  renderPresentationGuide();
}

function startPresentationGuide() {
  dialog.close();
  goToPresentationStep(0);
}

function locationText(item) {
  return [item.neighborhood, item.city, item.state].filter(Boolean).join(", ");
}

function categoryLabel(value) {
  return escapeHtml(value).toLocaleUpperCase("pt-BR");
}

function renderProducts() {
  const search = document.querySelector('[data-filter="search"]').value.trim().toLocaleLowerCase("pt-BR");
  const category = document.querySelector('[data-filter="category"]').value;
  const mode = document.querySelector('[data-filter="mode"]').value;
  const city = document.querySelector('[data-filter="city"]').value.trim().toLocaleLowerCase("pt-BR");
  const results = state.products.filter((item) => {
    const matchesSearch = `${item.title} ${item.description}`.toLocaleLowerCase("pt-BR").includes(search);
    const matchesCategory = !category || item.category === category;
    const matchesMode = !mode || item.mode === mode;
    const matchesCity = !city || item.city.toLocaleLowerCase("pt-BR").includes(city);
    const matchesView = activeView !== "favorites" || state.favorites.includes(item.id);
    return matchesSearch && matchesCategory && matchesMode && matchesCity && matchesView;
  });
  productGrid.innerHTML = results.map((item) => {
    const isFavorite = state.favorites.includes(item.id);
    const isOwner = item.owner;
    return `
      <article class="product-card" data-product="${escapeHtml(item.id)}">
        <button class="product-photo" type="button" data-action="details" data-id="${escapeHtml(item.id)}" aria-label="Ver detalhes de ${escapeHtml(item.title)}">
          <img src="${escapeHtml(item.photos[0])}" alt="${escapeHtml(item.title)}" loading="lazy">
          <span class="product-tag ${item.mode === "doação" ? "tag-donation" : "tag-trade"}">${item.mode === "doação" ? "DOAÇÃO" : "TROCA"}</span>
          <span class="photo-arrow" aria-hidden="true">↗</span>
        </button>
        <button class="favorite-toggle ${isFavorite ? "is-favorite" : ""}" type="button" data-action="favorite" data-id="${escapeHtml(item.id)}" aria-label="${isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}" aria-pressed="${isFavorite}">${isFavorite ? "♥" : "♡"}</button>
        <div class="product-info">
          <div class="product-title-line"><h3>${escapeHtml(item.title)}</h3><span class="product-category">${categoryLabel(item.category)}</span></div>
          <p class="product-location"><span aria-hidden="true">⌖</span> ${escapeHtml(locationText(item))}</p>
          <button class="interest-link" type="button" data-action="details" data-id="${escapeHtml(item.id)}">Ver anúncio <span aria-hidden="true">→</span></button>
          ${isOwner ? `<span class="product-status">${statusLabel(item.status)}</span>` : ""}
        </div>
      </article>`;
  }).join("");
  document.querySelector(".catalog-empty").hidden = results.length > 0;
  document.querySelector("[data-listing-count]").textContent = `${results.length} ${results.length === 1 ? "anúncio" : "anúncios"}`;
  document.querySelector("[data-favorite-count]").textContent = state.favorites.length;
  updateCategoryOptions();
}

function statusLabel(status = "available") {
  return ({ available: "Disponível", reserved: "Reservado", completed: "Concluído" })[status] || "Disponível";
}

function updateCategoryOptions() {
  const select = document.querySelector('[data-filter="category"]');
  const selected = select.value;
  const categories = [...new Set(state.products.map((item) => item.category))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  select.innerHTML = `<option value="">Todas as categorias</option>${categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("")}`;
  select.value = categories.includes(selected) ? selected : "";
}

function openDialog(title, content, className = "") {
  clearTimeout(typingTimer);
  delete dialog.dataset.chatProduct;
  dialog.className = `action-dialog ${className}`.trim();
  dialogTitle.textContent = title;
  dialogContent.innerHTML = content;
  if (!dialog.open) dialog.showModal();
  dialog.querySelector(".dialog-close").focus();
}

function openAnnouncement() {
  selectedPhotos = [];
  selectedPhotoFiles = [];
  openDialog("Anunciar um objeto", `
    <p>Compartilhe algo que merece um novo começo. Anunciar é gratuito e a combinação de retirada fica entre as pessoas.</p>
    <form class="dialog-form listing-form">
      <label>Nome do produto<input name="title" type="text" placeholder="Ex.: cadeira de madeira" required maxlength="70"></label>
      <label>Descrição<textarea name="description" rows="3" placeholder="Conte sobre o objeto, seus detalhes e o que a outra pessoa precisa saber." required maxlength="500"></textarea></label>
      <div class="form-pair">
        <label>Categoria<select name="category" required><option value="">Selecione</option>${CATEGORIES.map((item) => `<option>${item}</option>`).join("")}</select></label>
        <label>Modalidade<select name="mode" required><option value="">Selecione</option><option value="doação">Doação</option><option value="troca">Troca</option></select></label>
      </div>
      <div class="form-pair">
        <label>Conservação<select name="condition" required><option value="">Selecione</option><option>Como novo</option><option>Muito bom</option><option>Bom</option><option>Usado</option></select></label>
        <label>Estado (UF)<select name="state" required><option value="">UF</option>${["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((uf) => `<option>${uf}</option>`).join("")}</select></label>
      </div>
      <label>Cidade<input name="city" type="text" placeholder="Ex.: Salvador" required maxlength="60"></label>
      <label>Fotografias <span class="field-hint">Selecione de 1 a 3 imagens. São redimensionadas para caber no armazenamento local.</span><input name="photos" type="file" accept="image/*" multiple required></label>
      <div class="photo-previews" aria-live="polite"></div>
      <button class="button button-primary" type="submit">Publicar anúncio <span aria-hidden="true">↗</span></button>
    </form>`, "dialog-wide");
}

function openPublicProfile(name, photo = "") {
  const publicName = name.replace(/ · reUSE AI$/i, "").trim();
  if (!publicName) return;
  const listings = state.products
    .filter((item) => item.seller === publicName)
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
  const firstListing = listings[0];
  const isCurrentUser = publicName === state.profile.name;
  const location = isCurrentUser
    ? [state.profile.city, state.profile.state].filter(Boolean).join(" — ")
    : firstListing ? locationText(firstListing) : "Brasil";
  const profilePhoto = isCurrentUser ? state.profile.photo : photo || firstListing?.sellerPhoto || portrait(publicName);
  const bio = demoPeople[publicName]?.[1] || "Compartilhando objetos e descobrindo novas histórias na comunidade reUSE.";
  const cards = listings.length ? listings.map((item) => `
    <button class="public-listing-card" type="button" data-action="details" data-id="${escapeHtml(item.id)}">
      <img src="${escapeHtml(item.photos[0])}" alt="${escapeHtml(item.title)}">
      <span class="public-listing-copy"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.category)} · ${escapeHtml(locationText(item))}</small></span>
      <span class="product-tag ${item.mode === "doação" ? "tag-donation" : "tag-trade"}">${item.mode.toUpperCase()}</span>
    </button>`).join("") : `<p class="field-hint">Esta pessoa ainda não publicou anúncios.</p>`;
  openDialog(`Perfil de ${publicName}`, `
    <section class="public-profile">
      <header class="public-profile-heading">
        <img src="${escapeHtml(profilePhoto)}" data-profile-photo alt="Foto de ${escapeHtml(publicName)}">
        <div><h2>${escapeHtml(publicName)}</h2><p>${escapeHtml(location)}</p><small>${escapeHtml(bio)}</small></div>
      </header>
      <div class="public-profile-stats"><strong>${listings.length}</strong><span>${listings.length === 1 ? "anúncio publicado" : "anúncios publicados"}</span></div>
      <section class="public-profile-listings"><h3>Anúncios de ${escapeHtml(publicName)}</h3>${cards}</section>
    </section>`, "dialog-wide");
}

function openDetails(id) {
  const item = state.products.find((product) => product.id === id);
  if (!item) return;
  const photos = item.photos.map((photo) => `<img src="${escapeHtml(photo)}" alt="${escapeHtml(item.title)}">`).join("");
  const comments = state.comments[id] || [];
  openDialog(item.title, `
    <div class="detail-photos">${photos}</div>
    <div class="detail-tags"><span class="product-tag ${item.mode === "doação" ? "tag-donation" : "tag-trade"}">${item.mode.toUpperCase()}</span><span>${escapeHtml(item.category)}</span></div>
    <p class="detail-description">${escapeHtml(item.description)}</p>
    <dl class="detail-facts"><div><dt>Conservação</dt><dd>${escapeHtml(item.condition)}</dd></div><div><dt>Localização</dt><dd>${escapeHtml(locationText(item))}</dd></div></dl>
    <button class="seller-card" type="button" data-open-profile data-name="${escapeHtml(item.seller)}" data-photo="${escapeHtml(item.sellerPhoto || portrait(item.seller))}">
      <img src="${escapeHtml(item.sellerPhoto || portrait(item.seller))}" data-profile-photo alt="Foto de ${escapeHtml(item.seller)}">
      <span><small>Anunciante · ver perfil</small><strong>${escapeHtml(item.seller)}</strong></span><span class="profile-chevron" aria-hidden="true">↗</span>
    </button>
    <p class="field-hint">A entrega ou retirada é combinada diretamente entre as pessoas.</p>
    <section class="comments-section"><h3>Comentários <span>${comments.length}</span></h3>
      <div class="comment-list">${comments.map(commentMarkup).join("") || `<p class="field-hint">Seja a primeira pessoa a comentar.</p>`}</div>
      <form class="comment-form" data-product-id="${escapeHtml(item.id)}"><input name="comment" maxlength="280" placeholder="Escreva um comentário público..." aria-label="Escreva um comentário" required><button class="button button-primary" type="submit">Publicar</button></form>
    </section>
    ${item.owner ? `<button class="button button-outline" type="button" data-app-action="my-items">Gerenciar meus anúncios</button>` : `<button class="button button-primary" type="button" data-action="proposal" data-id="${escapeHtml(item.id)}">Tenho interesse <span aria-hidden="true">↗</span></button>`}`,
  "dialog-wide");
  dialog.dataset.detailProduct = id;
}

function commentMarkup(comment) {
  return `<article class="public-comment"><button class="comment-profile" type="button" data-open-profile data-name="${escapeHtml(comment.author)}" data-photo="${escapeHtml(comment.photo || portrait(comment.author))}" aria-label="Ver perfil de ${escapeHtml(comment.author)}"><img src="${escapeHtml(comment.photo || portrait(comment.author))}" data-profile-photo alt=""></button><div><div class="comment-author"><button type="button" data-open-profile data-name="${escapeHtml(comment.author)}" data-photo="${escapeHtml(comment.photo || portrait(comment.author))}">${escapeHtml(comment.author)}</button><time>${formatTime(comment.createdAt)}</time></div><p>${escapeHtml(comment.text)}</p></div></article>`;
}

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "agora";
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  if (minutes < 1440) return `há ${Math.floor(minutes / 60)} h`;
  return date.toLocaleDateString("pt-BR");
}

function messageMarkup(message) {
  return `<div class="chat-bubble ${message.from === "me" ? "chat-user" : "chat-ai"}"><span>${escapeHtml(message.text)}</span><small>${message.from === "me" ? "Você" : escapeHtml(message.author || "Participante demonstrativo")}</small></div>`;
}

function normalizeText(value = "") {
  return value.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function itemAttribute(item, attribute) {
  const description = item.description || "";
  const normalized = normalizeText(description);
  if (attribute === "tamanho") {
    const match = description.match(/\b(?:tamanho|numera[cç][aã]o)\s*(?:[ée:]|de)?\s*([a-z0-9]+(?:\s*(?:\/|-|a)\s*[a-z0-9]+)?)/i);
    return match?.[1] ? `O anúncio informa tamanho ${match[1].trim()}.` : null;
  }
  if (attribute === "cor") {
    const colors = ["preta", "preto", "branca", "branco", "azul", "vermelha", "vermelho", "verde", "amarela", "amarelo", "rosa", "roxa", "roxo", "marrom", "bege", "cinza", "laranja", "colorida", "colorido"];
    const found = colors.find((color) => new RegExp(`\\b${color}\\b`, "i").test(normalized));
    return found ? `A descrição indica que o objeto é ${found}.` : null;
  }
  if (attribute === "material") {
    const materials = ["madeira", "metal", "plástico", "plastico", "cerâmica", "ceramica", "algodão", "algodao", "couro", "jeans", "ferro", "vidro", "lã", "la", "tecido"];
    const found = materials.find((material) => new RegExp(`\\b${normalizeText(material)}\\b`, "i").test(normalized));
    return found ? `A descrição informa que é de ${found.replace("plastico", "plástico").replace("ceramica", "cerâmica")}.` : null;
  }
  if (attribute === "medidas") {
    const match = description.match(/\b\d+(?:[,.]\d+)?\s*(?:cm|mm|m|metros?|polegadas?)\b/i);
    return match ? `A medida indicada na descrição é ${match[0]}.` : null;
  }
  if (attribute === "marca") {
    const match = description.match(/\b(?:marca|modelo)\s*(?:[ée:]|da|do)?\s*([A-Z0-9][\w-]*)/i);
    return match?.[1] ? `A descrição menciona ${match[1]}.` : null;
  }
  return null;
}

function chooseAIReply(options, conversation) {
  const recent = (conversation?.messages || [])
    .filter((entry) => entry.from === "ai")
    .slice(-3)
    .map((entry) => entry.text);
  const freshOptions = options.filter((option) => !recent.includes(option));
  const choices = freshOptions.length ? freshOptions : options;
  return choices[Math.floor(Math.random() * choices.length)];
}

function imaginedDetail(item, detail, conversation) {
  const imagined = {
    cor: {
      Livros: ["um tom azul-marinho", "um verde-oliva bem discreto"],
      Roupas: ["um tom terracota", "um azul clássico"],
      Eletrônicos: ["um tom grafite", "um branco perolado"],
      Móveis: ["um caramelo de madeira", "um tom areia"],
      Decoração: ["um verde-sálvia", "um terracota suave"],
      Brinquedos: ["um amarelo bem alegre", "um azul vibrante"],
      Acessórios: ["um tom caramelo", "um verde-musgo"],
      Casa: ["um tom creme", "um azul profundo"],
      Esportes: ["um grafite com detalhes laranja", "um azul vivo"],
    },
    tamanho: ["um tamanho médio, fácil de acomodar", "um tamanho compacto, bem prático"],
    material: ["um acabamento resistente e agradável ao toque", "um material leve, pensado para o uso do dia a dia"],
    medidas: ["algo em torno de 30 cm, só como palpite", "um tamanho que cabe numa prateleira comum, imaginando aqui"],
    marca: ["uma marca conhecida por produtos duráveis", "uma marca simples, mas com cara de bom custo-benefício"],
  };
  const categoryIdeas = imagined[detail];
  const ideas = Array.isArray(categoryIdeas)
    ? categoryIdeas
    : categoryIdeas[item.category] || ["um tom neutro e fácil de combinar", "uma opção clássica e discreta"];
  const detailIdea = ideas[Math.floor(Math.random() * ideas.length)];
  return chooseAIReply([
    `Eu diria que é ${detailIdea}. Acho que combina bastante com “${item.title}”, não acha?`,
    `Meu palpite é ${detailIdea} — fica bem a cara de “${item.title}”!`,
  ], conversation);
}

function imaginedStory(item, conversation) {
  const stories = {
    Livros: [
      `Já imaginei “${item.title}” numa tarde chuvosa, acompanhando alguém com uma xícara de chá. Tem tudo a ver, né?`,
      `Esse merece uma estante nova e alguém descobrindo uma história favorita. Qual tipo de livro você mais gosta?`,
    ],
    Roupas: [
      `Consigo ver “${item.title}” virando a peça favorita de um passeio de fim de semana. Com um tênis confortável, fica perfeito!`,
      `“${item.title}” tem cara de peça versátil, daquelas que combinam com várias coisas. Você usaria mais no dia a dia ou numa ocasião especial?`,
    ],
    Eletrônicos: [
      `Aí você me pegou! Já imaginei “${item.title}” registrando um passeio especial e virando assunto depois. Você costuma fotografar mais paisagens ou pessoas?`,
      `“${item.title}” combina com uma mesa arrumada e uma próxima aventura. Já tem algum passeio em mente?`,
    ],
    Móveis: [
      `Já coloquei “${item.title}” num cantinho aconchegante, com uma planta por perto. Acho que ia ficar lindo!`,
      `“${item.title}” vai deixar qualquer casa mais acolhedora. Você já sabe onde colocaria?`,
    ],
    Decoração: [
      `“${item.title}” ficaria um charme num cantinho cheio de plantas e luz da manhã. Você curte decoração mais natural?`,
      `Já consigo imaginar “${item.title}” num lugar especial da casa, combinando com tudo. Onde você colocaria?`,
    ],
    Brinquedos: [
      `“${item.title}” parece perfeito para uma tarde de brincadeiras e muitas risadas. Qual brincadeira está fazendo mais sucesso por aí?`,
      `Esse está pronto para uma nova aventura! Aposto que vai render boas histórias na próxima casa.`,
    ],
    Acessórios: [
      `“${item.title}” tem cara de companhia para uma saída improvisada e boas lembranças. Você costuma levar esse tipo de coisa em viagem?`,
      `Já imaginei “${item.title}” numa caminhada por aí, descobrindo lugares novos. Qual foi seu passeio favorito?`,
    ],
    Casa: [
      `“${item.title}” combina com uma receita de domingo e boas conversas à mesa. O que você gosta de cozinhar?`,
      `Já consigo imaginar “${item.title}” deixando a cozinha mais prática. Você tem alguma receita favorita?`,
    ],
    Esportes: [
      `“${item.title}” parece pronto para acompanhar uma aventura ao ar livre. Você prefere trilha ou pedal?`,
      `Aposto que “${item.title}” vai render uma manhã ativa e cheia de energia. Já tem algum passeio planejado?`,
    ],
  };
  return chooseAIReply(stories[item.category] || [
    `Essa me pegou! Já imaginei “${item.title}” ganhando um novo começo numa casa cheia de boas histórias.`,
    `“${item.title}” está pronto para uma nova aventura. Aposto que vai encontrar um lugar especial!`,
  ], conversation);
}

function imaginedSmallTalk(message, item, conversation) {
  const text = normalizeText(message);
  if (/\b(viajar|viagem|viajaria|ferias)\b/.test(text)) {
    return chooseAIReply([
      `Eu escolheria uma viagem de trem pela serra, sem pressa e com uma playlist tranquila. E você, para onde iria?`,
      `Uma viagem sem pressa, parando para conhecer cada cidade, seria perfeita. “${item.title}” combina com essa aventura, não acha?`,
    ], conversation);
  }
  if (/\b(comida|comer|prato|receita|cozinhar|doce|comida favorita)\b/.test(text)) {
    return chooseAIReply([
      `Um bolo quentinho combina com uma conversa boa sobre “${item.title}”. Qual seria sua escolha?`,
      `Eu iria de comida caseira, daquelas que deixam a casa toda cheirosa. Você gosta de cozinhar?`,
    ], conversation);
  }
  if (/\b(musica|cancao|cantor|banda|playlist)\b/.test(text)) {
    return chooseAIReply([
      `Para “${item.title}”, eu escolheria uma trilha leve, daquelas que dão vontade de pegar a estrada. Que estilo você colocaria?`,
      `Uma música tranquila combina com um novo começo para “${item.title}”. O que você está ouvindo ultimamente?`,
    ], conversation);
  }
  if (/\b(nome|quem e voce|quem e vc|voce e humana|voce e real)\b/.test(text)) {
    return "Pode me chamar de Rafa 😊 Gosto de conversar e ajudar a encontrar um novo começo para as coisas. E você, como prefere que eu te chame?";
  }
  return chooseAIReply([
    `Essa pergunta saiu um pouquinho do anúncio, haha! Eu escolheria um dia tranquilo, um café gostoso e uma boa conversa. E você, o que imagina?`,
    `Aí você me pegou! Acho que “${item.title}” combina com uma tarde tranquila e boas conversas. O que mais você gosta de fazer no tempo livre?`,
  ], conversation);
}

function replyFor(message, item, conversation) {
  const text = normalizeText(message);
  const description = item.description.trim();
  const location = locationText(item);
  const answers = [];
  const add = (answer) => { if (answer && !answers.includes(answer)) answers.push(answer); };
  const asks = (pattern) => pattern.test(text);
  const asksSeveralThings = /,|\btambem\b|\balem disso\b|\be\s+(?:onde|como|qual|quando|quanto|se|esta|fica|funciona|tamanho|cor|material|medida|localizacao)\b/.test(text);

  if (/\b(gatinho|gatinha|querid[oa]|lind[oa]|fof[oa])\b/.test(text)) {
    return chooseAIReply([
      `Oi! Chegou com simpatia, hein? 😊 Sou a reUSE AI, mas posso conversar sobre “${item.title}” e ajudar com o anúncio.`,
      `Haha, gostei do bom humor! 😊 O que você quer descobrir sobre “${item.title}”?`,
    ], conversation);
  }
  if (/^(oi|ola|bom dia|boa tarde|boa noite|e ai)\b/.test(text)) {
    return `Oi! Posso ajudar com “${item.title}”. Quer saber sobre a conservação, localização ou sobre ${item.mode}?`;
  }
  if (/\b(obrigad[oa]s?|valeu|agrade[cç]o)\b/.test(text)) {
    return "Por nada! Se surgir outra dúvida sobre o anúncio, é só perguntar.";
  }
  if (/\b(reuse|plataforma|projeto|comunidade)\b/.test(text) && /\b(o que|como|qual|reuse|plataforma|projeto|comunidade)\b/.test(text)) {
    return "O reUSE é uma plataforma gratuita para conectar pessoas que querem doar ou trocar objetos usados. Não há vendas, preços ou pagamentos, e a entrega é combinada diretamente entre as pessoas.";
  }
  if (asks(/\b(preco|custa|valor|pagar|pagamento|dinheiro|frete)\b/)) {
    add("Aqui não há venda, preço, pagamento ou cobrança de frete: o anúncio é somente para doação ou troca.");
  }
  if (asks(/\b(disponivel|disponibilidade|ainda tem|ainda esta|ainda ta|ja foi|reservado|reservada|concluido|concluida)\b/)) {
    add(item.status === "reserved"
      ? "O anúncio está marcado como reservado."
      : item.status === "completed"
        ? "O anúncio está marcado como concluído."
        : `O anúncio está disponível para ${item.mode}.`);
  }
  if (asks(/\b(onde|local|localizacao|cidade|bairro|perto|mora|fica)\b/)) {
    add(`A localização informada é ${location}.`);
  }
  if (asks(/\b(entrega|entregar|retirada|retirar|buscar|busco|combinar|encontro|encontrar|receber|envio|enviar)\b/)) {
    add("A entrega ou retirada é combinada diretamente entre vocês; o reUSE não faz transporte.");
  }
  if (asks(/\b(funciona|funcionando|ligando|testado|testada|defeito|avaria|quebrado|quebrada)\b/)) {
    const normalizedDescription = normalizeText(description);
    if (/\b(nao funciona|nao esta funcionando|com defeito|quebrado|quebrada|avariado|avariada)\b/.test(normalizedDescription)) {
      add(`A descrição informa um problema: ${description}`);
    } else if (/\b(funciona|funcionando|em perfeito funcionamento|testado|testada)\b/.test(normalizedDescription)) {
      add(`Sim. A descrição informa: ${description}`);
    } else {
      add(`Parece estar bem cuidado. Está marcado como “${item.condition}”, então eu perguntaria ao anunciante se já foi testado recentemente.`);
    }
  }
  if (asks(/\b(conservacao|conservado|conservada|estado|usado|usada)\b/) && !asks(/\b(funciona|funcionando|defeito|avaria)\b/)) {
    add(`O estado informado é “${item.condition}”.`);
  }
  if (asks(/\b(tamanho|numero|numeracao)\b/)) {
    add(itemAttribute(item, "tamanho") || imaginedDetail(item, "tamanho", conversation));
  }
  if (asks(/\b(cor|colorido|colorida)\b/)) {
    add(itemAttribute(item, "cor") || imaginedDetail(item, "cor", conversation));
  }
  if (asks(/\b(material|feito de|feita de)\b/)) {
    add(itemAttribute(item, "material") || imaginedDetail(item, "material", conversation));
  }
  if (asks(/\b(medida|medidas|dimensao|dimensoes|altura|largura|comprimento)\b/)) {
    add(itemAttribute(item, "medidas") || imaginedDetail(item, "medidas", conversation));
  }
  if (asks(/\b(marca|modelo)\b/)) {
    add(itemAttribute(item, "marca") || imaginedDetail(item, "marca", conversation));
  }
  if (asks(/\b(acompanha|inclui|vem com|tem junto)\b/)) {
    add(`Sobre os itens incluídos, a descrição diz: ${description}`);
  }
  if (asks(/\b(doacao|troca|modalidade|ofereco|oferta|proposta)\b/)) {
    add(item.mode === "troca"
      ? "Este anúncio é para troca. Para enviar uma oferta, use “Tenho interesse” no anúncio."
      : "Este anúncio é para doação, não para venda. Você pode demonstrar interesse pelo botão “Tenho interesse”.");
  }
  if (asks(/\b(gostei|interessado|interessada|quero|tenho interesse)\b/)) {
    add(item.mode === "troca"
      ? "Para propor uma troca, toque em “Tenho interesse” no anúncio e informe o que oferece."
      : "Para registrar seu interesse na doação, toque em “Tenho interesse” no anúncio.");
  }
  if (asks(/\b(curiosidade|curiosidades|historia|historiazinha|imaginar|imagine|aventura|sonho)\b/)) {
    return imaginedStory(item, conversation);
  }
  if (asks(/\b(descricao|me fale|me fala|me conte|descreva|o que e|qual objeto|do que se trata|detalhes do produto)\b/)) {
    add(`O anúncio oferece “${item.title}” para ${item.mode}, em ${location}. Conservação: ${item.condition}. ${description}`);
  }
  if (!answers.length && asksSeveralThings) {
    return `Você trouxe vários assuntos de uma vez, haha! Vamos por partes: o que você quer saber primeiro sobre “${item.title}”?`;
  }
  if (!answers.length && /\b(gosta|curte|prefere|favorito|favorita|voce|vc|viajar|viagem|comida|musica|filme|sent[e]?|acha|opina)\b/.test(text)) {
    return imaginedSmallTalk(message, item, conversation);
  }
  if (!answers.length) {
    return imaginedSmallTalk(message, item, conversation);
  }
  return answers.join(" ");
}

function findConversation(id) {
  return state.conversations.find((conversation) => conversation.id === id);
}

function findOrCreateConversation(item, participantName = item.seller, isAI = false) {
  let conversation = state.conversations.find((entry) =>
    entry.productId === item.id && (entry.participantName === participantName || (isAI && entry.isAI)));
  if (!conversation) {
    conversation = {
      id: makeId("conversation"), productId: item.id, participantName,
      participantPhoto: item.sellerPhoto || avatar(participantName),
      isAI, unread: 0, createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(), messages: [],
    };
    state.conversations.unshift(conversation);
  }
  return conversation;
}

function getConversationProposal(conversationId) {
  return state.proposals.find((proposal) => proposal.conversationId === conversationId && proposal.status === "pending");
}

function notify(userId, type, text, conversationId = "") {
  state.notifications.unshift({
    id: makeId("notification"), userId, type, text, conversationId,
    read: userId !== state.profile.id, createdAt: new Date().toISOString(),
  });
  updateNotificationBadge();
}

function updateNotificationBadge() {
  const unread = state.notifications.filter((notice) => notice.userId === state.profile.id && !notice.read).length;
  document.querySelectorAll("[data-notification-count]").forEach((badge) => {
    badge.textContent = unread;
    badge.hidden = unread === 0;
  });
}

function enterPage(name) {
  currentPage = name;
  document.querySelectorAll("[data-app-page]").forEach((section) => {
    section.hidden = section.dataset.appPage !== name;
  });
  document.querySelectorAll("[data-page]").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === name);
    button.setAttribute("aria-current", button.dataset.page === name ? "page" : "false");
  });
  mainNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (name === "messages") renderMessages();
  if (name === "my-items") renderMyItems();
  if (name === "tracking") renderTracking();
  if (name === "profile") renderProfilePage();
}

function renderMessages() {
  const list = document.querySelector(".conversation-list");
  const panel = document.querySelector(".conversation-panel");
  const conversations = [...state.conversations].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  if (!selectedConversationId || !findConversation(selectedConversationId)) selectedConversationId = conversations[0]?.id || null;
  list.innerHTML = conversations.length ? conversations.map((conversation) => {
    const item = state.products.find((product) => product.id === conversation.productId);
    const last = conversation.messages.at(-1);
    return `<button type="button" class="conversation-item ${selectedConversationId === conversation.id ? "selected" : ""}" data-conversation="${escapeHtml(conversation.id)}">
      <img src="${escapeHtml(conversation.participantPhoto)}" alt="">
      <span class="conversation-copy"><strong>${escapeHtml(conversation.participantName)}</strong><small>${escapeHtml(item?.title || "Anúncio")}</small><span>${escapeHtml(last?.text || "Inicie a conversa")}</span></span>
      <span class="conversation-meta"><time>${formatTime(conversation.updatedAt)}</time>${conversation.unread ? `<b>${conversation.unread}</b>` : ""}</span>
    </button>`;
  }).join("") : `<p class="field-hint inbox-empty">Suas conversas aparecerão aqui.</p>`;
  if (selectedConversationId) renderConversationThread(selectedConversationId);
  else panel.innerHTML = `<div class="conversation-placeholder"><span>↻</span><h2>Suas conversas começam aqui</h2><p>Abra um anúncio e envie uma proposta para iniciar uma conversa.</p></div>`;
  renderNotifications();
  updateNotificationBadge();
}

function renderConversationThread(id) {
  const conversation = findConversation(id);
  const item = state.products.find((product) => product.id === conversation?.productId);
  if (!conversation || !item) return;
  conversation.unread = 0;
  state.notifications.forEach((notice) => {
    if (notice.conversationId === id && notice.userId === state.profile.id) notice.read = true;
  });
  const pending = state.proposals.filter((proposal) => proposal.conversationId === id && proposal.status === "pending");
  const proposals = state.proposals.filter((proposal) => proposal.conversationId === id);
  const proposalCard = (proposal) => `<article class="proposal-card proposal-${proposal.status}">
    <div><span class="eyebrow">${proposal.mode === "troca" ? "PROPOSTA DE TROCA" : "INTERESSE EM DOAÇÃO"}</span><strong>${proposal.mode === "troca" ? `Oferece: ${escapeHtml(proposal.offeredItem || "objeto a combinar")}` : "Solicita este objeto"}</strong>${proposal.message ? `<p>${escapeHtml(proposal.message)}</p>` : ""}<small>Status: ${escapeHtml(proposal.status.toLocaleUpperCase("pt-BR"))}</small></div>
    ${proposal.status === "accepted" ? `<button type="button" class="catalog-action" data-app-action="tracking">Ver entrega</button>` : ""}
    ${proposal.status === "pending" && proposal.toId === state.profile.id ? `<div class="proposal-actions"><button class="button button-primary" type="button" data-proposal-action="accept" data-id="${escapeHtml(proposal.id)}">Aceitar</button><button class="button button-outline" type="button" data-proposal-action="decline" data-id="${escapeHtml(proposal.id)}">Recusar</button><button class="text-button" type="button" data-proposal-action="talk" data-id="${escapeHtml(proposal.id)}">Conversar antes de decidir</button></div>` : ""}
  </article>`;
  const status = item.status === "reserved" ? `<div class="system-message">Este anúncio está reservado enquanto a entrega é combinada.</div>` : "";
  const aiNote = conversation.isAI
    ? `<div class="ai-notice"><span>✳</span> Conversa com a <strong>reUSE AI simulada</strong>. As decisões sobre propostas atualizam o protótipo.</div>`
    : `<div class="ai-notice"><span>✳</span> Conversa demonstrativa vinculada a este anúncio. A entrega é combinada diretamente entre as pessoas.</div>`;
  const publicParticipantName = conversation.isAI ? item.seller : conversation.participantName;
  const publicParticipantPhoto = conversation.isAI ? item.sellerPhoto : conversation.participantPhoto;
  document.querySelector(".conversation-panel").innerHTML = `
    <header class="conversation-header"><button class="conversation-person" type="button" data-open-profile data-name="${escapeHtml(publicParticipantName)}" data-photo="${escapeHtml(publicParticipantPhoto)}"><img src="${escapeHtml(conversation.participantPhoto)}" data-profile-photo alt=""><span><strong>${escapeHtml(conversation.participantName)}</strong><small>Ver perfil · ${escapeHtml(item.title)} · ${item.mode.toUpperCase()}</small></span></button><button class="catalog-action" type="button" data-action="details" data-id="${escapeHtml(item.id)}">Ver anúncio</button></header>
    <div class="inbox-thread">${aiNote}${status}${proposals.map(proposalCard).join("")}${conversation.messages.map((message) => messageMarkup({ ...message, from: message.from === "me" ? "me" : "contact", author: conversation.isAI ? "reUSE AI · simulação" : conversation.participantName })).join("")}<div class="inbox-typing" hidden><span></span><span></span><span></span><small>${conversation.isAI ? "reUSE AI" : "Participante"} está digitando</small></div></div>
    <form class="inbox-compose" data-conversation-id="${escapeHtml(id)}"><input name="message" maxlength="400" autocomplete="off" placeholder="Escreva sua mensagem..." aria-label="Escreva sua mensagem" required><button class="button button-primary" type="submit" aria-label="Enviar mensagem">↑</button></form>
    <p class="field-hint inbox-disclaimer">${conversation.isAI ? "Inteligência artificial simulada; não é uma pessoa real." : "Protótipo escolar: interlocutores e mensagens demonstrativos."}</p>`;
  const thread = document.querySelector(".inbox-thread");
  thread.scrollTop = thread.scrollHeight;
  saveState();
}

function openChat(productId) {
  const item = state.products.find((product) => product.id === productId);
  if (!item) return;
  const conversation = findOrCreateConversation(item, item.seller, productId === "camera-01");
  if (!conversation.messages.length) {
    conversation.messages.push({
      id: makeId("message"), from: conversation.isAI ? "ai" : "contact",
      author: conversation.participantName,
      text: conversation.isAI
        ? `Oi! Que bom que se interessou por “${item.title}” 😊 Está disponível para ${item.mode}. Como posso ajudar?`
        : `Olá! Esta conversa demonstrativa é sobre ${item.title}.`,
      createdAt: new Date().toISOString(),
    });
  }
  selectedConversationId = conversation.id;
  saveState();
  enterPage("messages");
  renderMessages();
}

function renderNotifications() {
  const panel = document.querySelector(".notifications-panel");
  if (panel.hidden) return;
  const notices = state.notifications.filter((notice) => notice.userId === state.profile.id);
  panel.innerHTML = `<div class="notifications-heading"><h2>Notificações</h2><button class="text-button" type="button" data-app-action="mark-notifications">Marcar todas como lidas</button></div>${notices.length ? notices.map((notice) => `<button type="button" class="notification-row ${notice.read ? "" : "unread"}" data-open-notice="${escapeHtml(notice.id)}" data-conversation="${escapeHtml(notice.conversationId)}"><span class="notification-icon">${notice.type === "delivery" ? "↻" : notice.type === "comment" ? "✎" : "♡"}</span><span><strong>${escapeHtml(notice.text)}</strong><small>${formatTime(notice.createdAt)}</small></span></button>`).join("") : `<p class="field-hint">Você está em dia.</p>`}`;
}

function renderMyItems() {
  const items = state.products.filter((item) => item.owner);
  const filtered = items.filter((item) => myItemsFilter === "completed" ? item.status === "completed" : item.status !== "completed");
  document.querySelector(".my-items-grid").innerHTML = filtered.map((item) => {
    const interestCount = state.proposals.filter((proposal) => proposal.productId === item.id).length;
    return `<article class="my-item-card"><img src="${escapeHtml(item.photos[0])}" alt="${escapeHtml(item.title)}"><div class="my-item-body"><div class="product-title-line"><h3>${escapeHtml(item.title)}</h3><span class="product-tag ${item.mode === "doação" ? "tag-donation" : "tag-trade"}">${item.mode.toUpperCase()}</span></div><p>${escapeHtml(locationText(item))}</p><div class="my-item-meta"><span class="product-status">${statusLabel(item.status)}</span><span>${new Date(item.publishedAt).toLocaleDateString("pt-BR")}</span><span>${interestCount} interessado${interestCount === 1 ? "" : "s"}</span></div><div class="my-item-actions"><button class="text-button" type="button" data-action="details" data-id="${escapeHtml(item.id)}">Ver detalhes</button><button class="text-button" type="button" data-app-action="edit-item" data-id="${escapeHtml(item.id)}">Editar</button>${item.status !== "completed" ? `<button class="text-button" type="button" data-app-action="toggle-status" data-id="${escapeHtml(item.id)}">${item.status === "reserved" ? "Disponibilizar" : "Reservar"}</button><button class="text-button" type="button" data-app-action="complete-item" data-id="${escapeHtml(item.id)}">Marcar concluído</button>` : ""}<button class="manage-link" type="button" data-action="delete" data-id="${escapeHtml(item.id)}">Excluir</button></div></div></article>`;
  }).join("");
  document.querySelector(".my-items-empty").hidden = filtered.length > 0;
  document.querySelectorAll("[data-items-filter]").forEach((button) => button.classList.toggle("active", button.dataset.itemsFilter === myItemsFilter));
}

function renderTracking() {
  const tracking = document.querySelector(".tracking-list");
  tracking.innerHTML = state.deliveries.map((delivery) => {
    const item = state.products.find((product) => product.id === delivery.productId);
    const stages = DELIVERY_STAGES.map((stage, index) => `<li class="${index <= delivery.stage ? "complete" : ""}"><span>${index < delivery.stage ? "✓" : index + 1}</span><div><strong>${stage}</strong>${index === delivery.stage ? `<small>Etapa atual</small>` : ""}</div></li>`).join("");
    return `<article class="delivery-card" data-delivery="${escapeHtml(delivery.id)}"><header class="delivery-heading"><div><span class="eyebrow">CÓDIGO DE ACOMPANHAMENTO</span><h2>${escapeHtml(delivery.code)}</h2></div><span class="delivery-stage">${escapeHtml(DELIVERY_STAGES[delivery.stage] || DELIVERY_STAGES[0])}</span></header><div class="delivery-summary"><img src="${escapeHtml(item?.photos[0] || "")}" alt=""><div><strong>${escapeHtml(item?.title || "Objeto da negociação")}</strong><p>${escapeHtml(delivery.sender)} <span aria-hidden="true">→</span> ${escapeHtml(delivery.recipient)}</p><small>${escapeHtml(delivery.origin)} → ${escapeHtml(delivery.destination)}</small><small>${escapeHtml(delivery.method)}</small></div></div><ol class="delivery-timeline">${stages}</ol><div class="delivery-controls"><button class="button button-outline" type="button" data-delivery-step="-1" data-id="${escapeHtml(delivery.id)}" ${delivery.stage === 0 ? "disabled" : ""}>Etapa anterior</button><button class="button button-primary" type="button" data-delivery-step="1" data-id="${escapeHtml(delivery.id)}" ${delivery.stage === DELIVERY_STAGES.length - 1 ? "disabled" : ""}>${delivery.stage === DELIVERY_STAGES.length - 1 ? "Entrega concluída" : "Avançar etapa"}</button></div><form class="external-code-form" data-id="${escapeHtml(delivery.id)}"><label>Código externo (opcional)<input name="externalCode" value="${escapeHtml(delivery.externalCode || "")}" placeholder="Anotação complementar, sem integração externa"></label><button class="text-button" type="submit">Salvar anotação</button></form><p class="field-hint">O reUSE não realiza transporte. As etapas são atualizadas manualmente pelos participantes.</p></article>`;
  }).join("");
  document.querySelector(".tracking-empty").hidden = state.deliveries.length > 0;
}

function renderProfilePage() {
  const owned = state.products.filter((item) => item.owner);
  const unread = state.notifications.filter((notice) => notice.userId === state.profile.id && !notice.read).length;
  document.querySelector(".profile-page-content").innerHTML = `
    <div class="profile-page-card">
      <form class="dialog-form profile-form">
          <div class="profile-heading"><img src="${escapeHtml(state.profile.photo)}" data-profile-photo alt="Foto de perfil"><span><strong>${escapeHtml(state.profile.name)}</strong><small>${escapeHtml(state.profile.city)} — ${escapeHtml(state.profile.state)}</small></span></div>
        <label>Nome<input name="name" value="${escapeHtml(state.profile.name)}" required maxlength="60"></label>
        <div class="form-pair">
          <label>Cidade<input name="city" value="${escapeHtml(state.profile.city)}" required maxlength="60"></label>
          <label>Estado<select name="state" required>${["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((uf) => `<option ${state.profile.state === uf ? "selected" : ""}>${uf}</option>`).join("")}</select></label>
        </div>
        <label>Foto do perfil<input name="photo" type="file" accept="image/*"></label>
        <button class="button button-primary" type="submit">Salvar perfil</button>
      </form>
      <div class="profile-stat-grid"><article><strong>${owned.length}</strong><span>Anúncios publicados</span></article><article><strong>${state.favorites.length}</strong><span>Favoritos</span></article><article><strong>${unread}</strong><span>Notificações não lidas</span></article></div>
      <button class="catalog-action" type="button" data-app-action="own-profile">Ver meu perfil público →</button>
      <button class="catalog-action" type="button" data-page="my-items">Gerenciar meus anúncios →</button>
      <button class="catalog-action" type="button" data-app-action="messages-notifications">Ver notificações →</button>
    </div>`;
}

function proposeInterest(productId) {
  const item = state.products.find((product) => product.id === productId);
  if (!item || item.owner) return;
  const exchangeItems = state.products.filter((product) => product.owner && product.status !== "completed");
  const content = `<p>${item.mode === "troca" ? "Envie uma proposta de troca para o anunciante." : "Demonstre interesse na doação. A retirada será combinada diretamente."}</p><form class="dialog-form proposal-form" data-product-id="${escapeHtml(item.id)}">${item.mode === "troca" ? `<label>O que você oferece?<select name="offeredItem" required><option value="">Escolha um dos seus anúncios</option>${exchangeItems.map((product) => `<option value="${escapeHtml(product.title)}">${escapeHtml(product.title)}</option>`).join("")}<option value="Outro objeto a combinar">Outro objeto a combinar</option></select></label>` : ""}<label>Mensagem (opcional)<textarea name="message" rows="3" maxlength="300" placeholder="Escreva uma mensagem para o anunciante"></textarea></label><button class="button button-primary" type="submit">${item.mode === "troca" ? "Enviar proposta" : "Enviar interesse"} <span aria-hidden="true">↗</span></button></form>`;
  openDialog(item.mode === "troca" ? "Propor uma troca" : "Demonstrar interesse", content, "dialog-wide");
}

function submitProposal(form) {
  const item = state.products.find((product) => product.id === form.dataset.productId);
  if (!item) return;
  const conversation = findOrCreateConversation(item, item.seller, item.id === "camera-01");
  const formData = new FormData(form);
  const proposal = {
    id: makeId("proposal"), conversationId: conversation.id, productId: item.id,
    fromName: state.profile.name, fromId: state.profile.id, toName: item.seller,
    toId: item.owner ? state.profile.id : `seller-${item.id}`,
    mode: item.mode, offeredItem: formData.get("offeredItem") || "",
    message: formData.get("message").trim(), status: "pending", createdAt: new Date().toISOString(),
  };
  state.proposals.unshift(proposal);
  conversation.messages.push({ id: makeId("message"), from: "me", text: item.mode === "troca" ? `Enviei uma proposta de troca: ${proposal.offeredItem}. ${proposal.message}`.trim() : `Tenho interesse na doação. ${proposal.message}`.trim(), createdAt: proposal.createdAt });
  conversation.updatedAt = proposal.createdAt;
  notify(proposal.toId, "proposal", `${state.profile.name} enviou uma ${item.mode === "troca" ? "proposta de troca" : "solicitação de interesse"} por ${item.title}.`, conversation.id);
  if (conversation.isAI) {
    notify(state.profile.id, "message", `A reUSE AI recebeu sua proposta por ${item.title}.`, conversation.id);
  }
  saveState();
  dialog.close();
  enterPage("messages");
  selectedConversationId = conversation.id;
  renderMessages();
  showToast(item.mode === "troca" ? "Proposta enviada à central de mensagens." : "Interesse registrado na central de mensagens.");
}

function acceptProposalDecision(proposal, accepted, decidedByAI = false) {
  if (!proposal || proposal.status !== "pending") return;
  proposal.status = accepted ? "accepted" : "declined";
  proposal.decidedAt = new Date().toISOString();
  const item = state.products.find((product) => product.id === proposal.productId);
  const conversation = findConversation(proposal.conversationId);
  const decisionText = accepted
    ? `A proposta para ${item?.title || "o anúncio"} foi aceita. Agora vocês podem combinar a entrega diretamente.`
    : `A proposta para ${item?.title || "o anúncio"} foi recusada.`;
  if (accepted && item) {
    item.status = "reserved";
    if (!state.deliveries.some((delivery) => delivery.proposalId === proposal.id)) {
      const delivery = {
        id: makeId("delivery"), code: makeTrackingCode(),
        proposalId: proposal.id, productId: item.id,
        sender: proposal.fromName, recipient: proposal.toName,
        origin: item.city ? `${item.city}, ${item.state}` : "A combinar",
        destination: proposal.fromId === state.profile.id ? `${state.profile.city}, ${state.profile.state}` : "A combinar",
        method: "Combinação direta entre participantes", stage: 0, externalCode: "",
        updatedAt: new Date().toISOString(),
      };
      state.deliveries.unshift(delivery);
    }
  }
  conversation?.messages.push({ id: makeId("message"), from: decidedByAI ? "ai" : "system", text: decisionText, createdAt: new Date().toISOString() });
  if (proposal.fromId !== state.profile.id) notify(proposal.fromId, accepted ? "accepted" : "declined", decisionText, proposal.conversationId);
  if (proposal.toId !== state.profile.id) notify(proposal.toId, accepted ? "accepted" : "declined", decisionText, proposal.conversationId);
  if (proposal.fromId === state.profile.id || proposal.toId === state.profile.id) notify(state.profile.id, accepted ? "accepted" : "declined", decisionText, proposal.conversationId);
  if (conversation) conversation.updatedAt = new Date().toISOString();
  saveState();
  if (currentPage === "messages") renderMessages();
  if (currentPage === "tracking") renderTracking();
  if (currentPage === "my-items") renderMyItems();
  showToast(accepted ? "Proposta aceita! A combinação da entrega foi liberada." : "Proposta recusada. A outra pessoa será notificada.");
}

function handleIncomingText(conversation, text) {
  const product = state.products.find((item) => item.id === conversation.productId);
  if (!product) return;
  const pending = getConversationProposal(conversation.id);
  const normalized = normalizeText(text);
  if (pending && conversation.isAI) {
    const refusal = /\b(nao aceito|nao aprovo|recuso|recusar|rejeito|rejeitar|pode recusar|recuse)\b/.test(normalized);
    const acceptance = !refusal && /\b(aceito|aceitar|aprovado|aprovo|pode aceitar|aceite)\b/.test(normalized);
    if (refusal) {
      acceptProposalDecision(pending, false, true);
      return;
    }
    if (acceptance) {
      acceptProposalDecision(pending, true, true);
      return;
    }
  }
  const reply = conversation.isAI
    ? replyFor(text, product, conversation)
    : `Mensagem recebida! Esta conversa com ${conversation.participantName} é demonstrativa; você pode acompanhar o anúncio e combinar a entrega diretamente.`;
  conversation.messages.push({
    id: makeId("message"), from: conversation.isAI ? "ai" : "contact", text: reply,
    author: conversation.isAI ? "reUSE AI · simulação" : conversation.participantName,
    createdAt: new Date().toISOString(),
  });
  conversation.updatedAt = new Date().toISOString();
  notify(state.profile.id, "message", `Nova mensagem sobre ${product.title}.`, conversation.id);
  saveState();
  if (currentPage === "messages") renderMessages();
}

function openEditItem(id) {
  const item = state.products.find((product) => product.id === id && product.owner);
  if (!item) return;
  openDialog("Editar anúncio", `<form class="dialog-form edit-item-form" data-product-id="${escapeHtml(id)}"><label>Nome do produto<input name="title" value="${escapeHtml(item.title)}" maxlength="70" required></label><label>Descrição<textarea name="description" rows="3" maxlength="500" required>${escapeHtml(item.description)}</textarea></label><div class="form-pair"><label>Categoria<select name="category">${CATEGORIES.map((category) => `<option ${item.category === category ? "selected" : ""}>${category}</option>`).join("")}</select></label><label>Modalidade<select name="mode"><option value="doação" ${item.mode === "doação" ? "selected" : ""}>Doação</option><option value="troca" ${item.mode === "troca" ? "selected" : ""}>Troca</option></select></label></div><label>Conservação<select name="condition">${["Como novo","Muito bom","Bom","Usado"].map((condition) => `<option ${item.condition === condition ? "selected" : ""}>${condition}</option>`).join("")}</select></label><button class="button button-primary" type="submit">Salvar alterações</button></form>`, "dialog-wide");
}

function openProfile() {
  const owned = state.products.filter((item) => item.owner);
  openDialog("Meu perfil", `
    <form class="dialog-form profile-form">
      <div class="profile-heading"><img src="${escapeHtml(state.profile.photo)}" data-profile-photo alt="Foto de perfil"><span><strong>${escapeHtml(state.profile.name)}</strong><small>${escapeHtml([state.profile.city, state.profile.state].filter(Boolean).join(" — "))}</small></span></div>
      <label>Nome<input name="name" value="${escapeHtml(state.profile.name)}" required maxlength="60"></label>
      <div class="form-pair"><label>Cidade<input name="city" value="${escapeHtml(state.profile.city)}" required maxlength="60"></label><label>Estado (UF)<select name="state" required>${["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((uf) => `<option ${state.profile.state === uf ? "selected" : ""}>${uf}</option>`).join("")}</select></label></div>
      <label>Foto do perfil<input name="photo" type="file" accept="image/*"></label>
      <button class="button button-primary" type="submit">Salvar perfil</button>
    </form>
    <div class="owned-list"><h3>Meus anúncios <span>${owned.length}</span></h3>${owned.length ? owned.map((item) => `<div class="owned-item"><img src="${escapeHtml(item.photos[0])}" alt=""><span><strong>${escapeHtml(item.title)}</strong><small>${item.mode.toUpperCase()} · ${escapeHtml(locationText(item))}</small></span><button type="button" class="manage-link" data-action="delete" data-id="${escapeHtml(item.id)}">Excluir</button></div>`).join("") : `<p class="field-hint">Você ainda não publicou anúncios.</p>`}</div>`,
  "dialog-wide");
}

function showFavorites() {
  clearFilters("favorites");
  document.querySelector("#explorar").scrollIntoView({ behavior: "smooth" });
}

function clearFilters(view = "all") {
  activeView = view;
  document.querySelector('[data-filter="search"]').value = "";
  document.querySelector('[data-filter="category"]').value = "";
  document.querySelector('[data-filter="mode"]').value = "";
  document.querySelector('[data-filter="city"]').value = "";
  renderProducts();
}

async function optimizeImage(file, maxDimension = 1200, quality = 0.78) {
  if (!file.type.startsWith("image/")) throw new Error("Selecione somente arquivos de imagem.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Cada imagem deve ter menos de 8 MB.");
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();
    const ratio = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Não foi possível processar esta imagem.");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

document.querySelectorAll("[data-dialog]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.dialog === "login") openProfile();
    else openAnnouncement();
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-page]").forEach((button) => {
  button.addEventListener("click", () => enterPage(button.dataset.page));
});

document.querySelectorAll('a[href="#inicio"], a[href="#explorar"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    enterPage(link.getAttribute("href") === "#explorar" ? "explore" : "home");
  });
});

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.view === "favorites") showFavorites();
    else if (button.dataset.view === "profile") enterPage("profile");
    else clearFilters("all");
  });
});

document.querySelectorAll("[data-filter]").forEach((field) => {
  field.addEventListener("input", renderProducts);
  field.addEventListener("change", renderProducts);
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) {
    const card = event.target.closest(".product-card");
    if (card) openDetails(card.dataset.product);
    return;
  }
  const { action, id } = button.dataset;
  if (action === "details") openDetails(id);
  if (action === "favorite") {
    state.favorites = state.favorites.includes(id) ? state.favorites.filter((favorite) => favorite !== id) : [...state.favorites, id];
    saveState();
    renderProducts();
  }
  if (action === "chat") openChat(id);
  if (action === "proposal") proposeInterest(id);
  if (action === "delete") confirmDelete(id);
});

document.querySelector(".conversation-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-conversation]");
  if (!button) return;
  selectedConversationId = button.dataset.conversation;
  renderMessages();
});

document.querySelector("main").addEventListener("click", (event) => {
  const profileButton = event.target.closest("[data-open-profile]");
  if (profileButton) {
    openPublicProfile(profileButton.dataset.name, profileButton.dataset.photo);
    return;
  }
  const itemsFilterButton = event.target.closest("[data-items-filter]");
  if (itemsFilterButton) {
    myItemsFilter = itemsFilterButton.dataset.itemsFilter;
    renderMyItems();
    return;
  }
  const actionButton = event.target.closest("[data-action]");
  if (actionButton?.dataset.action === "details") {
    openDetails(actionButton.dataset.id);
    return;
  }
  if (actionButton?.dataset.action === "delete") {
    confirmDelete(actionButton.dataset.id);
    return;
  }
  const pageButton = event.target.closest("[data-page]");
  if (pageButton) {
    enterPage(pageButton.dataset.page);
    return;
  }
  const conversationButton = event.target.closest("[data-conversation]");
  if (conversationButton && conversationButton.closest(".notification-row")) {
    selectedConversationId = conversationButton.dataset.conversation;
    document.querySelector(".notifications-panel").hidden = true;
    renderMessages();
    return;
  }
  const proposalButton = event.target.closest("[data-proposal-action]");
  if (proposalButton) {
    const proposal = state.proposals.find((entry) => entry.id === proposalButton.dataset.id);
    if (proposalButton.dataset.proposalAction === "accept") acceptProposalDecision(proposal, true);
    if (proposalButton.dataset.proposalAction === "decline") acceptProposalDecision(proposal, false);
    if (proposalButton.dataset.proposalAction === "talk") {
      const conversation = findConversation(proposal?.conversationId);
      if (conversation) {
        conversation.messages.push({ id: makeId("message"), from: "me", text: "Quero conversar um pouco antes de decidir sobre a proposta.", createdAt: new Date().toISOString() });
        conversation.updatedAt = new Date().toISOString();
        saveState();
        renderMessages();
      }
    }
    return;
  }
  const stepButton = event.target.closest("[data-delivery-step]");
  if (stepButton) {
    const delivery = state.deliveries.find((entry) => entry.id === stepButton.dataset.id);
    if (!delivery) return;
    delivery.stage = Math.max(0, Math.min(DELIVERY_STAGES.length - 1, delivery.stage + Number(stepButton.dataset.deliveryStep)));
    delivery.updatedAt = new Date().toISOString();
    notify(state.profile.id, "delivery", `Entrega ${delivery.code}: ${DELIVERY_STAGES[delivery.stage]}.`);
    saveState();
    renderTracking();
    showToast(`Acompanhamento atualizado: ${DELIVERY_STAGES[delivery.stage]}.`);
    return;
  }
  const appAction = event.target.closest("[data-app-action]");
  if (!appAction) return;
  const { appAction: action, id } = appAction.dataset;
  if (action === "presentation-mode") openPresentationMode();
  if (action === "my-items") enterPage("my-items");
  if (action === "own-profile") openPublicProfile(state.profile.name, state.profile.photo);
  if (action === "tracking") enterPage("tracking");
  if (action === "edit-item") openEditItem(id);
  if (action === "toggle-status") {
    const item = state.products.find((product) => product.id === id);
    if (item) item.status = item.status === "reserved" ? "available" : "reserved";
    saveState();
    renderMyItems();
    renderProducts();
  }
  if (action === "complete-item") {
    const item = state.products.find((product) => product.id === id);
    if (item) item.status = "completed";
    saveState();
    renderMyItems();
    renderProducts();
    showToast("Anúncio marcado como concluído.");
  }
  if (action === "show-notifications") {
    const panel = document.querySelector(".notifications-panel");
    panel.hidden = !panel.hidden;
    renderNotifications();
  }
  if (action === "messages-notifications") {
    enterPage("messages");
    document.querySelector(".notifications-panel").hidden = false;
    renderNotifications();
  }
  if (action === "mark-notifications") {
    state.notifications.forEach((notice) => {
      if (notice.userId === state.profile.id) notice.read = true;
    });
    saveState();
    updateNotificationBadge();
    renderNotifications();
  }
  if (action === "open-notice") {
    const notice = state.notifications.find((entry) => entry.id === id);
    if (notice) {
      notice.read = true;
      if (notice.conversationId) selectedConversationId = notice.conversationId;
      saveState();
      renderMessages();
    }
  }
});

function confirmDelete(id) {
  const item = state.products.find((product) => product.id === id);
  if (!item || !item.owner) return;
  openDialog("Excluir anúncio?", `<p>Deseja remover <strong>${escapeHtml(item.title)}</strong>? Essa ação não pode ser desfeita.</p><div class="dialog-actions"><button class="button button-outline" type="button" data-close-dialog>Cancelar</button><button class="button button-primary" type="button" data-action="confirm-delete" data-id="${escapeHtml(id)}">Excluir anúncio</button></div>`);
}

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
  if (event.target.closest("[data-close-dialog]")) dialog.close();
  const profileButton = event.target.closest("[data-open-profile]");
  if (profileButton) {
    openPublicProfile(profileButton.dataset.name, profileButton.dataset.photo);
    return;
  }
  const presentationAction = event.target.closest("[data-presentation-action]");
  if (presentationAction) {
    const { presentationAction: action } = presentationAction.dataset;
    if (action === "start-guide") startPresentationGuide();
    if (action === "reset-confirm") openDemoResetConfirmation();
    if (action === "cancel-reset") openPresentationMode();
    if (action === "confirm-reset" && resetDemoData()) {
      dialog.close();
      showToast("Dados demonstrativos restaurados. Seu perfil e anúncios pessoais foram preservados.");
    }
    return;
  }
  const action = event.target.closest("[data-action]");
  if (!action) return;
  const { id } = action.dataset;
  if (action.dataset.action === "details") openDetails(id);
  if (action.dataset.action === "chat") openChat(id);
  if (action.dataset.action === "proposal") proposeInterest(id);
  if (action.dataset.action === "delete") confirmDelete(id);
  if (action.dataset.action === "confirm-delete") {
    state.products = state.products.filter((item) => item.id !== id);
    state.favorites = state.favorites.filter((favorite) => favorite !== id);
    delete state.chats[id];
    saveState();
    renderProducts();
    openProfile();
    showToast("Anúncio removido.");
  }
});

dialog.addEventListener("change", async (event) => {
  const input = event.target;
  if (input.name !== "photos" && input.name !== "photo") return;
  const files = [...input.files];
  if (input.name === "photo") {
    if (!files.length) return;
    try {
      state.profile.photo = await optimizeImage(files[0], 500, 0.75);
      dialog.querySelector(".profile-heading img").src = state.profile.photo;
    } catch (error) {
      showToast(error.message, "error");
    }
    return;
  }
  if (files.length > 3) {
    input.value = "";
    selectedPhotos = [];
    selectedPhotoFiles = [];
    input.required = true;
    dialog.querySelector(".photo-previews").innerHTML = "";
    showToast("Selecione até 3 fotografias.", "error");
    return;
  }
  try {
    if (selectedPhotoFiles.length + files.length > 3) {
      input.value = "";
      showToast("Você pode adicionar até 3 fotografias.", "error");
      return;
    }
    selectedPhotoFiles = [...selectedPhotoFiles, ...files];
    selectedPhotos = await Promise.all(selectedPhotoFiles.map((file) => optimizeImage(file)));
    dialog.querySelector(".photo-previews").innerHTML = selectedPhotos.map((photo, index) => `<div class="preview-image"><img src="${photo}" alt="Pré-visualização ${index + 1}"><button type="button" data-remove-photo="${index}" aria-label="Remover fotografia ${index + 1}">×</button></div>`).join("");
    input.required = selectedPhotos.length === 0;
    input.value = "";
  } catch (error) {
    selectedPhotos = [];
    selectedPhotoFiles = [];
    input.value = "";
    input.required = true;
    dialog.querySelector(".photo-previews").innerHTML = "";
    showToast(error.message, "error");
  }
});

dialog.addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove-photo]");
  if (!remove) return;
  const index = Number(remove.dataset.removePhoto);
  selectedPhotos.splice(index, 1);
  selectedPhotoFiles.splice(index, 1);
  const input = dialog.querySelector('[name="photos"]');
  input.required = selectedPhotos.length === 0;
  dialog.querySelector(".photo-previews").innerHTML = selectedPhotos.map((photo, previewIndex) => `<div class="preview-image"><img src="${photo}" alt="Pré-visualização ${previewIndex + 1}"><button type="button" data-remove-photo="${previewIndex}" aria-label="Remover fotografia ${previewIndex + 1}">×</button></div>`).join("");
});

dialog.addEventListener("submit", async (event) => {
  const form = event.target;
  if (form.matches(".proposal-form")) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    submitProposal(form);
    return;
  }
  if (form.matches(".comment-form")) {
    event.preventDefault();
    const item = state.products.find((product) => product.id === form.dataset.productId);
    const text = form.elements.comment.value.trim();
    if (!item || !text) return;
    const comment = { id: makeId("comment"), author: state.profile.name, photo: state.profile.photo, text, createdAt: new Date().toISOString() };
    state.comments[item.id] ||= [];
    state.comments[item.id].push(comment);
    const recipient = item.owner ? state.profile.id : `seller-${item.id}`;
    notify(recipient, "comment", `Novo comentário em ${item.title}.`);
    saveState();
    openDetails(item.id);
    showToast("Comentário publicado.");
    return;
  }
  if (form.matches(".edit-item-form")) {
    event.preventDefault();
    const item = state.products.find((product) => product.id === form.dataset.productId && product.owner);
    if (!item || !form.reportValidity()) return;
    const data = new FormData(form);
    ["title", "description", "category", "mode", "condition"].forEach((key) => { item[key] = data.get(key).toString().trim(); });
    saveState();
    dialog.close();
    renderMyItems();
    renderProducts();
    showToast("Anúncio atualizado.");
    return;
  }
  if (form.matches(".listing-form")) {
    event.preventDefault();
    if (!form.reportValidity() || selectedPhotos.length < 1) {
      showToast("Preencha todos os campos e selecione ao menos uma fotografia.", "error");
      return;
    }
    const formData = new FormData(form);
    const product = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: formData.get("title").trim(),
      description: formData.get("description").trim(),
      category: formData.get("category"),
      mode: formData.get("mode"),
      condition: formData.get("condition"),
      neighborhood: "",
      city: formData.get("city").trim(),
      state: formData.get("state"),
      seller: state.profile.name,
      sellerPhoto: state.profile.photo,
      photos: [...selectedPhotos],
      owner: true,
      status: "available",
      publishedAt: new Date().toISOString(),
    };
    state.products.unshift(product);
    if (!saveState()) {
      state.products.shift();
      return;
    }
    selectedPhotos = [];
    selectedPhotoFiles = [];
    clearFilters("all");
    dialog.close();
    document.querySelector("#explorar").scrollIntoView({ behavior: "smooth" });
    showToast("Anúncio publicado e salvo neste dispositivo!");
  }

  if (form.matches(".profile-form")) {
    event.preventDefault();
    const data = new FormData(form);
    state.profile.name = data.get("name").trim();
    state.profile.city = data.get("city").trim();
    state.profile.state = data.get("state");
    state.products.filter((item) => item.owner).forEach((item) => {
      item.seller = state.profile.name;
      item.sellerPhoto = state.profile.photo;
    });
    saveState();
    renderProducts();
    if (currentPage === "profile") renderProfilePage();
    else openProfile();
    showToast("Perfil atualizado.");
  }
});

document.body.addEventListener("submit", (event) => {
  const form = event.target;
  if (form.matches(".inbox-compose")) {
    event.preventDefault();
    const conversation = findConversation(form.dataset.conversationId);
    const text = form.elements.message.value.trim();
    if (!conversation || !text) return;
    conversation.messages.push({ id: makeId("message"), from: "me", text, createdAt: new Date().toISOString() });
    conversation.updatedAt = new Date().toISOString();
    form.elements.message.value = "";
    saveState();
    renderMessages();
    const thread = document.querySelector(".inbox-thread");
    const typing = document.createElement("div");
    typing.className = "inbox-typing";
    typing.innerHTML = `<span></span><span></span><span></span><small>${conversation.isAI ? "reUSE AI" : "Participante"} está digitando</small>`;
    thread.append(typing);
    thread.scrollTop = thread.scrollHeight;
    const replyTimer = setTimeout(() => {
      pendingReplyTimers.delete(replyTimer);
      if (findConversation(conversation.id) !== conversation) return;
      handleIncomingText(conversation, text);
    }, 750 + Math.floor(Math.random() * 450));
    pendingReplyTimers.add(replyTimer);
    return;
  }
  if (form.matches(".external-code-form")) {
    event.preventDefault();
    const delivery = state.deliveries.find((entry) => entry.id === form.dataset.id);
    if (!delivery) return;
    delivery.externalCode = form.elements.externalCode.value.trim();
    delivery.updatedAt = new Date().toISOString();
    notify(state.profile.id, "delivery", `Informação complementar salva para ${delivery.code}.`);
    saveState();
    renderTracking();
    showToast("Anotação de rastreamento salva.");
    return;
  }
  if (form.matches(".profile-page-content .profile-form")) {
    event.preventDefault();
    const data = new FormData(form);
    state.profile.name = data.get("name").trim();
    state.profile.city = data.get("city").trim();
    state.profile.state = data.get("state");
    state.products.filter((item) => item.owner).forEach((item) => {
      item.seller = state.profile.name;
      item.sellerPhoto = state.profile.photo;
    });
    saveState();
    renderProfilePage();
    renderProducts();
    showToast("Perfil atualizado.");
  }
});

document.querySelector("main").addEventListener("change", async (event) => {
  const input = event.target;
  if (input.name !== "photo" || !input.files?.length) return;
  try {
    state.profile.photo = await optimizeImage(input.files[0], 500, 0.75);
    const preview = document.querySelector(".profile-page-content .profile-heading img");
    if (preview) preview.src = state.profile.photo;
  } catch (error) {
    showToast(error.message, "error");
  }
});

dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => {
  clearTimeout(typingTimer);
  delete dialog.dataset.chatProduct;
});

document.querySelector("#presentation-guide").addEventListener("click", (event) => {
  const button = event.target.closest("[data-guide-action]");
  if (!button) return;
  if (button.dataset.guideAction === "close") {
    presentationGuideIndex = -1;
    renderPresentationGuide();
  }
  if (button.dataset.guideAction === "previous") goToPresentationStep(presentationGuideIndex - 1);
  if (button.dataset.guideAction === "next") goToPresentationStep(presentationGuideIndex + 1);
});

window.addEventListener("error", (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || image.dataset.localFallback) return;
  image.dataset.localFallback = "true";
  const profileName = image.closest("[data-open-profile]")?.dataset.name;
  image.src = image.hasAttribute("data-profile-photo")
    ? avatar(image.alt.replace(/^Foto de /, "") || profileName || "reUSE")
    : localImageFallback(image.alt || "Objeto reutilizado");
}, true);

menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  menuToggle.setAttribute("aria-label", expanded ? "Abrir menu" : "Fechar menu");
  mainNav.classList.toggle("is-open", !expanded);
});

mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  mainNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
}));

renderProducts();
updateNotificationBadge();
enterPage("home");
