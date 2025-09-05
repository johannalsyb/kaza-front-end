import React, { createContext, useContext, useState, ReactNode } from 'react';

// Translation types
export type Language = 'en' | 'fr' | 'pt';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create context
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Header
    explore: 'Explore',
    favourites: 'Favourites', 
    chat: 'Chat',
    signIn: 'Sign In',
    registerYourPlace: 'Register Your Place',
    notifications: 'Notifications',
    myProfile: 'My Profile',
    myPlace: 'My Place',
    swapHistory: 'Swap History',
    adminDashboard: 'Admin Dashboard',
    pushNotifications: 'Push notifications',
    logout: 'Logout',
    
    // Search Filters
    whereWouldYouLikeToGo: 'Where would you like to go?',
    startingDates: 'Starting dates',
    endingDates: 'Ending dates',
    apartment: 'Apartment',
    house: 'House',
    studio: 'Studio',
    room: 'Room',
    bedrooms: 'Bedrooms',
    moreFilters: 'More Filters',
    preferences: 'Preferences',
    swapWithWomenOnly: 'Swap with women only',
    suitableForChildren: 'Suitable for children',
    petFriendly: 'Pet friendly',
    
    // Notifications
    newSwapRequest: 'New swap request',
    someoneWantsToSwap: 'Someone wants to swap with your property in Lisbon',
    messageReceived: 'Message received',
    newMessageFromMaria: 'New message from Maria about your upcoming swap',
    swapConfirmed: 'Swap confirmed',
    swapWithAndyConfirmed: 'Your swap with Andy in Lagos has been confirmed',
    hoursAgo: 'hours ago',
    dayAgo: 'day ago',
    
    // Footer
    allRightsReserved: 'All rights reserved',
    swapYourHomeExploreTheWorld: 'Swap your home, Explore the world',
    followUsOnInstagram: 'Follow us on Instagram',
    followUsOnTwitter: 'Follow us on Twitter',
    connectWithUsOnLinkedIn: 'Connect with us on LinkedIn',
    subscribeToOurYouTube: 'Subscribe to our YouTube channel',
    product: 'Product',
    company: 'Company',
    legal: 'Legal',
    howItWorks: 'How it works',
    rewardProgram: 'Reward Program',
    faqs: 'FAQs',
    blog: 'Blog',
    about: 'About',
    press: 'Press',
    contactSupport: 'Contact/Support',
    termsConditions: 'Terms & Conditions',
    privacyPolicy: 'Privacy Policy',
    cookiePolicy: 'Cookie Policy',
    gdprDataRequests: 'GDPR/Data Requests',
    
    // About Page
    aboutKazaswap: 'About Kazaswap',
    aboutHeroText: 'We believe everyone deserves to explore the world authentically. Kazaswap connects travelers through home exchanges, creating meaningful connections and unforgettable experiences.',
    ourMission: 'Our Mission',
    ourMissionText: 'To make authentic travel accessible to everyone by connecting homeowners worldwide through our trusted exchange platform. We\'re building a community where hospitality, adventure, and cultural exchange thrive.',
    authenticExperiences: 'Authentic Experiences',
    authenticExperiencesText: 'Live like a local in real homes, discovering hidden gems and authentic culture.',
    trustedCommunity: 'Trusted Community',
    trustedCommunityText: 'Join a verified community of travelers who share the same values of respect and adventure.',
    fairExchange: 'Fair Exchange',
    fairExchangeText: 'Our credit system ensures fair exchanges, making travel affordable and accessible.',
    howKazaswapWorks: 'How Kazaswap Works',
    howKazaswapWorksText: 'Our credit-based system makes home exchanges simple, fair, and flexible.',
    hostYourHome: 'Host Your Home',
    hostYourHomeText: 'List your property and earn credits when other members stay. The better your home and location, the more credits you earn.',
    earnCredits: 'Earn Credits',
    earnCreditsText: 'Credits accumulate in your account automatically. Each successful exchange builds your reputation and unlocks premium properties.',
    travelAnywhere: 'Travel Anywhere',
    travelAnywhereText: 'Use your credits to stay in amazing homes worldwide. No direct exchanges needed – travel when and where you want.',
    ourCommunity: 'Our Community',
    ourCommunityText: 'Join thousands of travelers who have discovered a better way to explore the world.',
    activeMembers: 'Active Members',
    countries: 'Countries',
    homeExchanges: 'Home Exchanges',
    yearsOfExperience: 'Years of Experience',
    meetOurTeam: 'Meet Our Team',
    meetOurTeamText: 'We\'re a diverse group of travel enthusiasts, technologists, and community builders.',
    ceoCoFounder: 'CEO & Co-Founder',
    ctoCoFounder: 'CTO & Co-Founder',
    headOfCommunity: 'Head of Community',
    headOfProduct: 'Head of Product',
    sarahBio: 'Former Airbnb executive passionate about authentic travel experiences',
    marcusBio: 'Tech entrepreneur with 15+ years building scalable platforms',
    emilyBio: 'Travel enthusiast dedicated to building trust and safety',
    davidBio: 'UX expert focused on creating seamless user experiences',
    ourValues: 'Our Values',
    trustAndSafety: 'Trust & Safety',
    trustAndSafetyText: 'Every member is verified, and we provide comprehensive insurance and support to ensure safe, worry-free exchanges.',
    communityFirst: 'Community First',
    communityFirstText: 'We prioritize member experience over profits, building features and policies based on community feedback.',
    culturalExchange: 'Cultural Exchange',
    culturalExchangeText: 'We believe travel should foster understanding and connection between people from different cultures and backgrounds.',
    sustainability: 'Sustainability',
    sustainabilityText: 'Home exchanges reduce the environmental impact of travel while supporting local communities instead of large hotel chains.',
    
    // Contact Page
    contactAndSupport: 'Contact & Support',
    getInTouch: 'Get in touch with our support team',
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    sendMessage: 'Send Message',
    generalInquiry: 'General Inquiry',
    technicalSupport: 'Technical Support',
    accountIssue: 'Account Issue',
    billing: 'Billing',
    emergency: 'Emergency',
    emergencyContact: 'Emergency Contact',
    emergencyText: 'If you\'re experiencing an urgent issue during your stay, contact our 24/7 emergency line.',
    
    // How It Works Page
    simpleSteps: 'Simple steps to start your home exchange journey',
    step1Title: 'List Your Home',
    step1Description: 'Create a detailed profile of your property with photos and amenities',
    step2Title: 'Browse & Connect',
    step2Description: 'Explore amazing homes worldwide and connect with like-minded hosts',
    step3Title: 'Plan Your Exchange',
    step3Description: 'Coordinate dates, exchange keys, and prepare for your adventure',
    step4Title: 'Enjoy Your Stay',
    step4Description: 'Experience authentic local living while someone enjoys your home',
    
    // FAQ Page
    frequentlyAskedQuestions: 'Frequently Asked Questions',
    faqSubtitle: 'Find answers to common questions about home exchanges',
    howDoesItWork: 'How does home exchange work?',
    isItSafe: 'Is home exchange safe?',
    howMuchDoesItCost: 'How much does it cost?',
    whatIfSomethingGoesWrong: 'What if something goes wrong?',
    
    // Blog Page
    kazaswapBlog: 'Kazaswap Blog',
    latestStories: 'Latest stories, tips, and insights from our community',
    readMore: 'Read More',
    
    // Property Cards
    swapDates: 'Swap dates',
    
    // Common
    loading: 'Loading...',
    search: 'Search',
    filter: 'Filter',
    map: 'Map',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    learnMore: 'Learn More',
  },
  
  fr: {
    // Header
    explore: 'Explorer',
    favourites: 'Favoris',
    chat: 'Chat',
    signIn: 'Se connecter',
    registerYourPlace: 'Enregistrer votre logement',
    notifications: 'Notifications',
    myProfile: 'Mon profil',
    myPlace: 'Mon logement',
    swapHistory: 'Historique des échanges',
    adminDashboard: 'Tableau de bord admin',
    pushNotifications: 'Notifications push',
    logout: 'Déconnexion',
    
    // Search Filters
    whereWouldYouLikeToGo: 'Où souhaitez-vous aller ?',
    startingDates: 'Dates de début',
    endingDates: 'Dates de fin',
    apartment: 'Appartement',
    house: 'Maison',
    studio: 'Studio',
    room: 'Chambre',
    bedrooms: 'Chambres',
    moreFilters: 'Plus de filtres',
    preferences: 'Préférences',
    swapWithWomenOnly: 'Échanger avec des femmes uniquement',
    suitableForChildren: 'Adapté aux enfants',
    petFriendly: 'Animaux acceptés',
    
    // Notifications
    newSwapRequest: 'Nouvelle demande d\'échange',
    someoneWantsToSwap: 'Quelqu\'un veut échanger avec votre propriété à Lisbonne',
    messageReceived: 'Message reçu',
    newMessageFromMaria: 'Nouveau message de Maria concernant votre prochain échange',
    swapConfirmed: 'Échange confirmé',
    swapWithAndyConfirmed: 'Votre échange avec Andy à Lagos a été confirmé',
    hoursAgo: 'heures',
    dayAgo: 'jour',
    
    // Footer
    allRightsReserved: 'Tous droits réservés',
    swapYourHomeExploreTheWorld: 'Échangez votre maison, Explorez le monde',
    followUsOnInstagram: 'Suivez-nous sur Instagram',
    followUsOnTwitter: 'Suivez-nous sur Twitter',
    connectWithUsOnLinkedIn: 'Connectez-vous avec nous sur LinkedIn',
    subscribeToOurYouTube: 'Abonnez-vous à notre chaîne YouTube',
    product: 'Produit',
    company: 'Société',
    legal: 'Légal',
    howItWorks: 'Comment ça marche',
    rewardProgram: 'Programme de récompenses',
    faqs: 'FAQ',
    blog: 'Blog',
    about: 'À propos',
    press: 'Presse',
    contactSupport: 'Contact/Support',
    termsConditions: 'Conditions générales',
    privacyPolicy: 'Politique de confidentialité',
    cookiePolicy: 'Politique des cookies',
    gdprDataRequests: 'RGPD/Demandes de données',
    
    // About Page
    aboutKazaswap: 'À propos de Kazaswap',
    aboutHeroText: 'Nous croyons que chacun mérite d\'explorer le monde de manière authentique. Kazaswap connecte les voyageurs grâce aux échanges de maisons, créant des connexions significatives et des expériences inoubliables.',
    ourMission: 'Notre Mission',
    ourMissionText: 'Rendre le voyage authentique accessible à tous en connectant les propriétaires du monde entier grâce à notre plateforme d\'échange de confiance. Nous construisons une communauté où l\'hospitalité, l\'aventure et l\'échange culturel prospèrent.',
    authenticExperiences: 'Expériences Authentiques',
    authenticExperiencesText: 'Vivez comme un local dans de vraies maisons, découvrez des joyaux cachés et une culture authentique.',
    trustedCommunity: 'Communauté de Confiance',
    trustedCommunityText: 'Rejoignez une communauté vérifiée de voyageurs qui partagent les mêmes valeurs de respect et d\'aventure.',
    fairExchange: 'Échange Équitable',
    fairExchangeText: 'Notre système de crédits garantit des échanges équitables, rendant le voyage abordable et accessible.',
    howKazaswapWorks: 'Comment fonctionne Kazaswap',
    howKazaswapWorksText: 'Notre système basé sur les crédits rend les échanges de maisons simples, équitables et flexibles.',
    hostYourHome: 'Hébergez votre Maison',
    hostYourHomeText: 'Listez votre propriété et gagnez des crédits quand d\'autres membres séjournent. Plus votre maison et emplacement sont bons, plus vous gagnez de crédits.',
    earnCredits: 'Gagnez des Crédits',
    earnCreditsText: 'Les crédits s\'accumulent automatiquement dans votre compte. Chaque échange réussi renforce votre réputation et débloque des propriétés premium.',
    travelAnywhere: 'Voyagez Partout',
    travelAnywhereText: 'Utilisez vos crédits pour séjourner dans des maisons incroyables dans le monde entier. Aucun échange direct nécessaire – voyagez quand et où vous voulez.',
    ourCommunity: 'Notre Communauté',
    ourCommunityText: 'Rejoignez des milliers de voyageurs qui ont découvert une meilleure façon d\'explorer le monde.',
    activeMembers: 'Membres Actifs',
    countries: 'Pays',
    homeExchanges: 'Échanges de Maisons',
    yearsOfExperience: 'Années d\'Expérience',
    meetOurTeam: 'Rencontrez Notre Équipe',
    meetOurTeamText: 'Nous sommes un groupe diversifié d\'enthousiastes du voyage, de technologues et de créateurs de communauté.',
    ceoCoFounder: 'PDG et Co-Fondatrice',
    ctoCoFounder: 'CTO et Co-Fondateur',
    headOfCommunity: 'Responsable de la Communauté',
    headOfProduct: 'Responsable Produit',
    sarahBio: 'Ancienne dirigeante d\'Airbnb passionnée par les expériences de voyage authentiques',
    marcusBio: 'Entrepreneur tech avec plus de 15 ans d\'expérience dans la construction de plateformes évolutives',
    emilyBio: 'Passionnée de voyage dédiée à la construction de confiance et de sécurité',
    davidBio: 'Expert UX axé sur la création d\'expériences utilisateur fluides',
    ourValues: 'Nos Valeurs',
    trustAndSafety: 'Confiance et Sécurité',
    trustAndSafetyText: 'Chaque membre est vérifié, et nous fournissons une assurance complète et un support pour garantir des échanges sûrs et sans souci.',
    communityFirst: 'La Communauté d\'Abord',
    communityFirstText: 'Nous priorisons l\'expérience des membres par rapport aux profits, construisant des fonctionnalités et des politiques basées sur les retours de la communauté.',
    culturalExchange: 'Échange Culturel',
    culturalExchangeText: 'Nous croyons que le voyage devrait favoriser la compréhension et la connexion entre les personnes de différentes cultures et origines.',
    sustainability: 'Durabilité',
    sustainabilityText: 'Les échanges de maisons réduisent l\'impact environnemental du voyage tout en soutenant les communautés locales au lieu des grandes chaînes hôtelières.',
    
    // Contact Page
    contactAndSupport: 'Contact et Support',
    getInTouch: 'Contactez notre équipe de support',
    name: 'Nom',
    email: 'Email',
    subject: 'Sujet',
    message: 'Message',
    sendMessage: 'Envoyer le message',
    generalInquiry: 'Demande générale',
    technicalSupport: 'Support technique',
    accountIssue: 'Problème de compte',
    billing: 'Facturation',
    emergency: 'Urgence',
    emergencyContact: 'Contact d\'urgence',
    emergencyText: 'Si vous rencontrez un problème urgent pendant votre séjour, contactez notre ligne d\'urgence 24h/24.',
    
    // How It Works Page
    simpleSteps: 'Étapes simples pour commencer votre parcours d\'échange de maisons',
    step1Title: 'Listez votre maison',
    step1Description: 'Créez un profil détaillé de votre propriété avec photos et équipements',
    step2Title: 'Parcourez et connectez',
    step2Description: 'Explorez des maisons incroyables dans le monde entier et connectez-vous avec des hôtes partageant les mêmes idées',
    step3Title: 'Planifiez votre échange',
    step3Description: 'Coordonnez les dates, échangez les clés et préparez-vous pour votre aventure',
    step4Title: 'Profitez de votre séjour',
    step4Description: 'Vivez authentique la vie locale pendant que quelqu\'un profite de votre maison',
    
    // FAQ Page
    frequentlyAskedQuestions: 'Questions Fréquemment Posées',
    faqSubtitle: 'Trouvez des réponses aux questions communes sur les échanges de maisons',
    howDoesItWork: 'Comment fonctionne l\'échange de maisons ?',
    isItSafe: 'Est-ce sûr ?',
    howMuchDoesItCost: 'Combien ça coûte ?',
    whatIfSomethingGoesWrong: 'Que se passe-t-il si quelque chose va mal ?',
    
    // Blog Page
    kazaswapBlog: 'Blog Kazaswap',
    latestStories: 'Dernières histoires, conseils et perspectives de notre communauté',
    readMore: 'Lire plus',
    
    // Property Cards
    swapDates: 'Dates d\'échange',
    
    // Common
    loading: 'Chargement...',
    search: 'Rechercher',
    filter: 'Filtrer',
    map: 'Carte',
    save: 'Enregistrer',
    cancel: 'Annuler',
    submit: 'Soumettre',
    edit: 'Modifier',
    delete: 'Supprimer',
    view: 'Voir',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    close: 'Fermer',
    learnMore: 'En savoir plus',
  },
  
  pt: {
    // Header
    explore: 'Explorar',
    favourites: 'Favoritos',
    chat: 'Chat',
    signIn: 'Entrar',
    registerYourPlace: 'Registar o seu espaço',
    notifications: 'Notificações',
    myProfile: 'Meu perfil',
    myPlace: 'Meu espaço',
    swapHistory: 'Histórico de trocas',
    adminDashboard: 'Painel de administração',
    pushNotifications: 'Notificações push',
    logout: 'Sair',
    
    // Search Filters
    whereWouldYouLikeToGo: 'Para onde gostaria de ir?',
    startingDates: 'Datas de início',
    endingDates: 'Datas de fim',
    apartment: 'Apartamento',
    house: 'Casa',
    studio: 'Estúdio',
    room: 'Quarto',
    bedrooms: 'Quartos',
    moreFilters: 'Mais filtros',
    preferences: 'Preferências',
    swapWithWomenOnly: 'Trocar apenas com mulheres',
    suitableForChildren: 'Adequado para crianças',
    petFriendly: 'Aceita animais',
    
    // Notifications
    newSwapRequest: 'Nova solicitação de troca',
    someoneWantsToSwap: 'Alguém quer trocar com sua propriedade em Lisboa',
    messageReceived: 'Mensagem recebida',
    newMessageFromMaria: 'Nova mensagem da Maria sobre sua próxima troca',
    swapConfirmed: 'Troca confirmada',
    swapWithAndyConfirmed: 'Sua troca com Andy em Lagos foi confirmada',
    hoursAgo: 'horas atrás',
    dayAgo: 'dia atrás',
    
    // Footer
    allRightsReserved: 'Todos os direitos reservados',
    swapYourHomeExploreTheWorld: 'Troque sua casa, Explore o mundo',
    followUsOnInstagram: 'Siga-nos no Instagram',
    followUsOnTwitter: 'Siga-nos no Twitter',
    connectWithUsOnLinkedIn: 'Conecte-se conosco no LinkedIn',
    subscribeToOurYouTube: 'Subscreva o nosso canal YouTube',
    product: 'Produto',
    company: 'Empresa',
    legal: 'Legal',
    howItWorks: 'Como funciona',
    rewardProgram: 'Programa de recompensas',
    faqs: 'Perguntas frequentes',
    blog: 'Blog',
    about: 'Sobre',
    press: 'Imprensa',
    contactSupport: 'Contacto/Suporte',
    termsConditions: 'Termos e Condições',
    privacyPolicy: 'Política de Privacidade',
    cookiePolicy: 'Política de Cookies',
    gdprDataRequests: 'RGPD/Pedidos de dados',
    
    // About Page
    aboutKazaswap: 'Sobre a Kazaswap',
    ourMission: 'Nossa Missão',
    ourMissionText: 'Revolucionar o turismo tornando as trocas de casas autênticas acessíveis, seguras e gratificantes para todos.',
    ourStory: 'Nossa História',
    ourStoryText: 'Fundada em 2024, a Kazaswap nasceu da simples crença de que viajar deve ser mais do que apenas visitar lugares – deve nos conectar com comunidades e culturas locais.',
    meetTheTeam: 'Conheça a equipe',
    ourValues: 'Nossos Valores',
    authenticity: 'Autenticidade',
    authenticityText: 'Acreditamos em conexões genuínas e experiências reais.',
    trust: 'Confiança',
    trustText: 'Construindo uma plataforma segura onde os membros se sentem seguros.',
    community: 'Comunidade',
    communityText: 'Fomentando relacionamentos significativos entre viajantes.',
    
    // Contact Page
    contactAndSupport: 'Contacto e Suporte',
    getInTouch: 'Entre em contacto com nossa equipa de suporte',
    name: 'Nome',
    email: 'Email',
    subject: 'Assunto',
    message: 'Mensagem',
    sendMessage: 'Enviar mensagem',
    generalInquiry: 'Consulta geral',
    technicalSupport: 'Suporte técnico',
    accountIssue: 'Problema de conta',
    billing: 'Faturação',
    emergency: 'Emergência',
    emergencyContact: 'Contacto de emergência',
    emergencyText: 'Se estiver enfrentando um problema urgente durante sua estadia, contacte nossa linha de emergência 24/7.',
    
    // How It Works Page
    howKazaswapWorks: 'Como funciona a Kazaswap',
    simpleSteps: 'Passos simples para começar sua jornada de troca de casas',
    step1Title: 'Liste sua casa',
    step1Description: 'Crie um perfil detalhado da sua propriedade com fotos e comodidades',
    step2Title: 'Navegue e conecte',
    step2Description: 'Explore casas incríveis ao redor do mundo e conecte-se com anfitriões de mentalidade similar',
    step3Title: 'Planeie sua troca',
    step3Description: 'Coordene datas, troque chaves e prepare-se para sua aventura',
    step4Title: 'Desfrute da sua estadia',
    step4Description: 'Experimente uma vida local autêntica enquanto alguém desfruta da sua casa',
    
    // FAQ Page
    frequentlyAskedQuestions: 'Perguntas Frequentes',
    faqSubtitle: 'Encontre respostas para perguntas comuns sobre trocas de casas',
    howDoesItWork: 'Como funciona a troca de casas?',
    isItSafe: 'É seguro?',
    howMuchDoesItCost: 'Quanto custa?',
    whatIfSomethingGoesWrong: 'E se algo der errado?',
    
    // Blog Page
    kazaswapBlog: 'Blog Kazaswap',
    latestStories: 'Últimas histórias, dicas e insights da nossa comunidade',
    readMore: 'Ler mais',
    
    // Property Cards
    swapDates: 'Datas de troca',
    
    // Common
    loading: 'Carregando...',
    search: 'Pesquisar',
    filter: 'Filtrar',
    map: 'Mapa',
    save: 'Guardar',
    cancel: 'Cancelar',
    submit: 'Enviar',
    edit: 'Editar',
    delete: 'Eliminar',
    view: 'Ver',
    back: 'Voltar',
    next: 'Próximo',
    previous: 'Anterior',
    close: 'Fechar',
    learnMore: 'Saber mais',
  }
};

// Translation Provider
interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return "" 
    // translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook to use translation
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};