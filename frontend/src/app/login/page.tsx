import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'
import { t } from '@/lib/i18n'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            CaboAi
          </h1>
          <h2 className="mt-2 text-xl text-gray-700">
            {t('auth.loginTitle')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-xl">
          <LoginForm />
          
          <div className="mt-6 text-center">
            <Link 
              href="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>
          
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              {t('auth.noAccount')}{' '}
            </span>
            <Link 
              href="/register" 
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              {t('auth.register')}
            </Link>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            AI-powered email assistant for Los Cabos businesses
          </p>
        </div>
      </div>
    </div>
  )
}