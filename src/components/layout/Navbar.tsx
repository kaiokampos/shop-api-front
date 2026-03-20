'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import { useCartStore } from '@/store/cart.store'
import { useLogout } from '@/hooks/useAuth'

export function Navbar() {
  const { user, isAuthenticated } = useAuthStore()
  const { itemCount } = useCartStore()
  const logout = useLogout()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gray-900">
            ShopAPI
          </Link>

          {/* Links centrais */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
              Produtos
            </Link>
            {isAuthenticated && (
              <Link href="/orders" className="text-gray-600 hover:text-gray-900 text-sm">
                Pedidos
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin/products" className="text-gray-600 hover:text-gray-900 text-sm">
                Admin
              </Link>
            )}
          </div>

          {/* Ações */}
          <div className="flex items-center gap-4">
            {/* Carrinho */}
            <Link href="/cart" className="relative text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{user?.name}</span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
