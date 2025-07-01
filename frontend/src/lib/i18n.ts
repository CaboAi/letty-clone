export const locales = ['en', 'es'] as const
export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'en'

export const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.chat': 'AI Chat',
    'nav.compose': 'Compose',
    'nav.analytics': 'Analytics',
    'nav.subscription': 'Subscription',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Authentication
    'auth.login': 'Login',
    'auth.register': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.loginTitle': 'Welcome Back to CaboAi',
    'auth.loginSubtitle': 'Sign in to your account to continue',
    'auth.registerTitle': 'Join CaboAi',
    'auth.registerSubtitle': 'Create your account to get started',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.overview': 'Overview',
    'dashboard.totalMessages': 'Total Messages',
    'dashboard.tokensUsed': 'Tokens Used',
    'dashboard.costThisMonth': 'Cost This Month',
    'dashboard.recentActivity': 'Recent Activity',
    
    // Chat
    'chat.title': 'AI Email Assistant',
    'chat.placeholder': 'Type your email inquiry here...',
    'chat.send': 'Send',
    'chat.tone': 'Tone',
    'chat.industry': 'Industry',
    'chat.language': 'Language',
    'chat.professional': 'Professional',
    'chat.casual': 'Casual',
    'chat.friendly': 'Friendly',
    'chat.hospitality': 'Hospitality',
    'chat.realEstate': 'Real Estate',
    'chat.tourism': 'Tourism',
    'chat.general': 'General',
    'chat.auto': 'Auto-detect',
    'chat.english': 'English',
    'chat.spanish': 'Spanish',
    
    // Subscription
    'subscription.title': 'Choose Your Plan',
    'subscription.basic': 'Basic',
    'subscription.professional': 'Professional',
    'subscription.enterprise': 'Enterprise',
    'subscription.month': 'month',
    'subscription.mostPopular': 'Most Popular',
    'subscription.currentPlan': 'Current Plan',
    'subscription.upgrade': 'Upgrade',
    'subscription.features': 'Features',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
  },
  es: {
    // Navigation
    'nav.dashboard': 'Panel',
    'nav.chat': 'Chat IA',
    'nav.compose': 'Redactar',
    'nav.analytics': 'Análisis',
    'nav.subscription': 'Suscripción',
    'nav.settings': 'Configuración',
    'nav.logout': 'Cerrar Sesión',
    
    // Authentication
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Registrarse',
    'auth.email': 'Correo Electrónico',
    'auth.password': 'Contraseña',
    'auth.firstName': 'Nombre',
    'auth.lastName': 'Apellido',
    'auth.loginTitle': 'Bienvenido de Vuelta a CaboAi',
    'auth.loginSubtitle': 'Inicia sesión en tu cuenta para continuar',
    'auth.registerTitle': 'Únete a CaboAi',
    'auth.registerSubtitle': 'Crea tu cuenta para comenzar',
    'auth.forgotPassword': '¿Olvidaste tu Contraseña?',
    'auth.noAccount': '¿No tienes una cuenta?',
    'auth.hasAccount': '¿Ya tienes una cuenta?',
    
    // Dashboard
    'dashboard.welcome': 'Bienvenido de vuelta',
    'dashboard.overview': 'Resumen',
    'dashboard.totalMessages': 'Mensajes Totales',
    'dashboard.tokensUsed': 'Tokens Utilizados',
    'dashboard.costThisMonth': 'Costo Este Mes',
    'dashboard.recentActivity': 'Actividad Reciente',
    
    // Chat
    'chat.title': 'Asistente de Email IA',
    'chat.placeholder': 'Escribe tu consulta de email aquí...',
    'chat.send': 'Enviar',
    'chat.tone': 'Tono',
    'chat.industry': 'Industria',
    'chat.language': 'Idioma',
    'chat.professional': 'Profesional',
    'chat.casual': 'Casual',
    'chat.friendly': 'Amigable',
    'chat.hospitality': 'Hospitalidad',
    'chat.realEstate': 'Bienes Raíces',
    'chat.tourism': 'Turismo',
    'chat.general': 'General',
    'chat.auto': 'Auto-detectar',
    'chat.english': 'Inglés',
    'chat.spanish': 'Español',
    
    // Subscription
    'subscription.title': 'Elige Tu Plan',
    'subscription.basic': 'Básico',
    'subscription.professional': 'Profesional',
    'subscription.enterprise': 'Empresarial',
    'subscription.month': 'mes',
    'subscription.mostPopular': 'Más Popular',
    'subscription.currentPlan': 'Plan Actual',
    'subscription.upgrade': 'Actualizar',
    'subscription.features': 'Características',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.close': 'Cerrar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
  }
}

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.')
  let value: any = translations[locale]
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  return value || key
}

export function t(key: string, locale: Locale = defaultLocale): string {
  return getTranslation(locale, key)
}