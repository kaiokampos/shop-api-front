"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { useProduct } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useAuthStore } from "@/store/auth.store";

const formatPrice = (value: string) =>
  parseFloat(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { isAuthenticated } = useAuthStore();
  const { data: product, isLoading, isError } = useProduct(id);
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart.mutate({ productId: id, quantity });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar para produtos
        </Link>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 animate-pulse">
            <div className="h-6 bg-gray-100 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-100 rounded w-full mb-2" />
            <div className="h-4 bg-gray-100 rounded w-2/3 mb-8" />
            <div className="h-8 bg-gray-100 rounded w-1/4" />
          </div>
        )}

        {/* Erro */}
        {isError && (
          <div className="text-center py-20">
            <p className="text-red-500">Produto não encontrado.</p>
          </div>
        )}

        {/* Conteúdo */}
        {product && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Imagem placeholder */}
            <div className="bg-gray-100 h-64 flex items-center justify-center">
              <svg
                className="w-24 h-24 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div className="p-8">
              {/* Nome e badge de estoque */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <span
                  className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${
                    product.stock > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} em estoque`
                    : "Esgotado"}
                </span>
              </div>

              {/* Descrição */}
              {product.description && (
                <p className="text-gray-500 text-sm mb-6">
                  {product.description}
                </p>
              )}

              {/* Preço */}
              <p className="text-3xl font-bold text-gray-900 mb-8">
                {formatPrice(product.price)}
              </p>

              {/* Ações */}
              {isAuthenticated && product.stock > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-l-lg"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    loading={addToCart.isPending}
                    size="lg"
                    className="flex-1"
                  >
                    Adicionar ao carrinho
                  </Button>
                </div>
              )}

              {!isAuthenticated && (
                <p className="text-sm text-gray-400">
                  <Link
                    href="/login"
                    className="text-black font-medium hover:underline"
                  >
                    Faça login
                  </Link>{" "}
                  para comprar
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
