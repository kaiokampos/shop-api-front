"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAddToCart } from "@/hooks/useCart";
import { useAuthStore } from "@/store/auth.store";
import type { Product } from "@/types";
// Adicionar import no topo
interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuthStore();
  const addToCart = useAddToCart();

  const handleAddToCart = () => {
    addToCart.mutate({ productId: product.id, quantity });
  };

  const price = parseFloat(product.price).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Imagem placeholder */}
      <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
        <svg
          className="w-16 h-16 text-gray-300"
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

      {/* Info — clicável, leva ao detalhe */}
      <Link
        href={`/products/${product.id}`}
        className="flex flex-col gap-1 flex-1"
      >
        <h3 className="font-semibold text-gray-900 text-sm hover:underline">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-gray-900">{price}</span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              product.stock > 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {product.stock > 0 ? `${product.stock} em estoque` : "Esgotado"}
          </span>
        </div>
      </Link>

      {/* Ações */}
      {isAuthenticated && product.stock > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded-l-lg"
            >
              -
            </button>
            <span className="px-3 py-1.5 text-sm font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded-r-lg"
            >
              +
            </button>
          </div>
          <Button
            onClick={handleAddToCart}
            loading={addToCart.isPending}
            className="flex-1"
            size="sm"
          >
            Adicionar
          </Button>
        </div>
      )}

      {!isAuthenticated && (
        <p className="text-xs text-center text-gray-400">
          Faça login para comprar
        </p>
      )}
    </div>
  );
}
