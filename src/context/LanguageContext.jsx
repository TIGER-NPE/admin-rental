import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const languages = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇬🇧'
  },
  rw: {
    code: 'rw',
    name: 'Kinyarwanda',
    flag: '🇷🇼'
  },
  fr: {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷'
  }
}

export const translations = {
  en: {
    // Header
    backToCars: 'Back to Cars',
    drivers: 'DRIVERS',
    terms: 'TERMS',
    // Home page
    findYourPerfectRide: 'Find Your Perfect Ride',
    browseCars: 'Browse Cars',
    carsAvailable: 'Cars Available',
    // Search
    searchPlaceholder: 'Search cars by name or model...',
    search: 'Search',
    // Date Picker
    checkAvailability: 'Check Availability',
    pickupDate: 'Pickup Date',
    returnDate: 'Return Date',
    check: 'Check',
    // Filters
    allPrices: 'All Prices',
    underPrice: 'Under RWF 50,000',
    priceRange: 'RWF 50,000 - 100,000',
    priceRange2: 'RWF 100,000 - 200,000',
    overPrice: 'Over RWF 200,000',
    allSeats: 'All Seats',
    seats: 'Seats',
    allTypes: 'All Types',
    automatic: 'Automatic',
    manual: 'Manual',
    clearFilters: 'Clear Filters',
    carsAvailableCount: 'cars available',
    carAvailableCount: 'car available',
    noCarsFound: 'No cars found matching your criteria',
    // Car details
    pricePerDay: 'Price per day',
    seatsLabel: 'Seats',
    transmissionLabel: 'Transmission',
    features: 'Features',
    rentNow: 'Rent via WhatsApp',
    viewDetails: 'View Details',
    // CTA
    readyToHitRoad: 'Ready to Hit the Road?',
    bookYourCar: 'Book your perfect car today and start your journey!',
    // Footer
    location: 'Kigali, Rwanda',
    phone: '+250 788 123 456',
    quickLinks: 'Quick Links',
    followUs: 'Follow Us',
    copyright: '2024 RentACar. All rights reserved.',
    // FAQ
    frequentlyAskedQuestions: 'Frequently Asked Questions',
    faqSubtitle: 'Quick answers to common questions about renting a car',
    // Terms
    fullTermsConditions: 'Full Terms & Conditions',
    // Drivers
    ourDrivers: 'Our Drivers',
    driverSubtitle: 'Professional and experienced drivers',
    contactDriver: 'Contact via WhatsApp',
    experience: 'Years experience',
    languages: 'Languages',
  },
  rw: {
    // Header
    backToCars: 'Subira inzira',
    drivers: 'ABASHAKIRI',
    terms: 'AMATEGEKO',
    // Home page
    findYourPerfectRide: 'Shaka imodoka yemewe',
    browseCars: 'Reba imodoka',
    carsAvailable: 'Imodoka zibonetse',
    // Search
    searchPlaceholder: 'Shaka imodoka ukurikije izina cyangwa modeli...',
    search: 'Shakisha',
    // Date Picker
    checkAvailability: 'Reba availability',
    pickupDate: 'Itariki yo gufata',
    returnDate: 'Itariki yo gutanga',
    check: 'Reba',
    // Filters
    allPrices: "Byose by'ishuri",
    underPrice: 'Munsi ya RWF 50,000',
    priceRange: 'RWF 50,000 - 100,000',
    priceRange2: 'RWF 100,000 - 200,000',
    overPrice: 'Hejuru ya RWF 200,000',
    allSeats: 'Byose imitungo',
    seats: 'imitungo',
    allTypes: 'Byose ubwoko',
    automatic: 'Otomatiki',
    manual: 'Mano',
    clearFilters: 'Curukura filiteri',
    carsAvailableCount: 'imodoka zibonetse',
    carAvailableCount: 'imodoka ibonetse',
    noCarsFound: 'Nta modoka zabonetse ukurikije ibyo ushaka',
    // Car details
    pricePerDay: 'Ishuri ryo ku munsi',
    seatsLabel: 'imitungo',
    transmissionLabel: 'Ubwoko bw ingendo',
    features: 'Ibyiza',
    rentNow: 'Kodesha ukoresheje WhatsApp',
    viewDetails: 'Reba ibisobanuro',
    // CTA
    readyToHitRoad: 'Witeguye gusohoka?',
    bookYourCar: 'Kodesha imodoka yemewe uyumunsi utangire utembere!',
    // Footer
    location: 'Kigali, Rwanda',
    phone: '+250 788 123 456',
    quickLinks: 'Amahuza yihuse',
    followUs: 'Tukurikire',
    copyright: '2024 RentACar. Buri rights ibitswe.',
    // FAQ
    frequentlyAskedQuestions: 'Ibibazo Bikunze kubaza',
    faqSubtitle: 'Igisubizo cyihuse ku bibazo bijyanye na kodesha imodoka',
    // Terms
    fullTermsConditions: 'Amategeko yose n\'amabwiriza',
    // Drivers
    ourDrivers: 'Abasakari',
    driverSubtitle: 'Abasakari abahanga n\'abahendayi',
    contactDriver: 'Hamagara ukoresheje WhatsApp',
    experience: 'imyaka y\'akazi',
    languages: 'Indimi',
  },
  fr: {
    // Header
    backToCars: 'Retour aux voitures',
    drivers: 'CHAUFFEURS',
    terms: 'CONDITIONS',
    // Home page
    findYourPerfectRide: 'Trouvez votre voiture idéale',
    browseCars: 'Voir les voitures',
    carsAvailable: 'Voitures disponibles',
    // Search
    searchPlaceholder: 'Rechercher une voiture par nom ou modèle...',
    search: 'Rechercher',
    // Date Picker
    checkAvailability: 'Vérifier la disponibilité',
    pickupDate: 'Date de prise en charge',
    returnDate: 'Date de retour',
    check: 'Vérifier',
    // Filters
    allPrices: 'Tous les prix',
    underPrice: 'Moins de RWF 50,000',
    priceRange: 'RWF 50,000 - 100,000',
    priceRange2: 'RWF 100,000 - 200,000',
    overPrice: 'Plus de RWF 200,000',
    allSeats: 'Tous les sièges',
    seats: 'sièges',
    allTypes: 'Tous les types',
    automatic: 'Automatique',
    manual: 'Manuelle',
    clearFilters: 'Effacer les filtres',
    carsAvailableCount: 'voitures disponibles',
    carAvailableCount: 'voiture disponible',
    noCarsFound: 'Aucune voiture trouvée correspondant à vos critères',
    // Car details
    pricePerDay: 'Prix par jour',
    seatsLabel: 'sièges',
    transmissionLabel: 'Boîte de vitesses',
    features: 'Équipements',
    rentNow: 'Louer via WhatsApp',
    viewDetails: 'Voir les détails',
    // CTA
    readyToHitRoad: 'Prêt à prendre la route?',
    bookYourCar: 'Réservez votre voiture idéale aujourd\'hui et commencez votre voyage!',
    // Footer
    location: 'Kigali, Rwanda',
    phone: '+250 788 123 456',
    quickLinks: 'Liens rapides',
    followUs: 'Suivez-nous',
    copyright: '2024 RentACar. Tous droits réservés.',
    // FAQ
    frequentlyAskedQuestions: 'Questions Fréquemment Posées',
    faqSubtitle: 'Réponses rapides aux questions courantes sur la location de voiture',
    // Terms
    fullTermsConditions: 'Conditions Générales Complètes',
    // Drivers
    ourDrivers: 'Nos Chauffeurs',
    driverSubtitle: 'Chauffeurs professionnels et expérimentés',
    contactDriver: 'Contacter via WhatsApp',
    experience: "années d'expérience",
    languages: 'Langues',
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language')
    return saved && languages[saved] ? saved : 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const t = translations[language] || translations.en

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export default LanguageContext
