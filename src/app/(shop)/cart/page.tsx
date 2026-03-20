"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { useCart, useRemoveFromCart, useClearCart } from "@/hooks/useCart";
import { useCheckout } from "@/hooks/useOrders";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function CartPage() {
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();
  const checkout = useCheckout();

  // Proteção de rota — apenas usuários logados
  const { isAuthenticated } = useRequireAuth();

  if (!isAuthenticated) return null;

  // Total calculado no frontend a partir dos itens do carrinho
  const total =
    cart?.items.reduce((sum, item) => {
      return sum + parseFloat(item.product.price) * item.quantity;
    }, 0) ?? 0;

  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleCheckout = () => {
    checkout.mutate(undefined, {
      onSuccess: () => router.push("/orders"),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Carrinho</h1>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* Carrinho vazio */}
        {!isLoading && (!cart || cart.items.length === 0) && (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">Seu carrinho está vazio</p>
            <Link href="/">
              <Button variant="secondary">Ver produtos</Button>
            </Link>
          </div>
        )}

        {/* Itens do carrinho */}
        {cart && cart.items.length > 0 && (
          <div className="flex flex-col gap-4">
            {/* Lista de itens */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {cart.items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between px-5 py-4 ${
                    index < cart.items.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  {/* Info do produto */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatPrice(parseFloat(item.product.price))} ×{" "}
                      {item.quantity}
                    </p>
                  </div>

                  {/* Subtotal + remover */}
                  <div className="flex items-center gap-4 ml-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(
                        parseFloat(item.product.price) * item.quantity,
                      )}
                    </span>
                    <button
                      onClick={() => removeFromCart.mutate(item.productId)}
                      disabled={removeFromCart.isPending}
                      className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                      aria-label="Remover item"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo e ações */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(total)}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleCheckout}
                  loading={checkout.isPending}
                  size="lg"
                  className="w-full"
                >
                  Finalizar compra
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => clearCart.mutate()}
                  disabled={clearCart.isPending}
                >
                  Limpar carrinho
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
