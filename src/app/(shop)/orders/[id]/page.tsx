"use client";

import { use } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { useOrder } from "@/hooks/useOrders";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import type { OrderStatus } from "@/types";

const statusConfig: Record<OrderStatus, { label: string; className: string }> =
  {
    pending: { label: "Pendente", className: "bg-yellow-100 text-yellow-700" },
    paid: { label: "Pago", className: "bg-blue-100 text-blue-700" },
    shipped: { label: "Enviado", className: "bg-purple-100 text-purple-700" },
    delivered: { label: "Entregue", className: "bg-green-100 text-green-700" },
    cancelled: { label: "Cancelado", className: "bg-red-100 text-red-700" },
  };

const formatPrice = (value: string) =>
  parseFloat(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(iso));

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { isAuthenticated } = useRequireAuth();
  const { data: order, isLoading, isError } = useOrder(id);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/orders"
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
          Voltar para pedidos
        </Link>

        {isLoading && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-gray-100 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="h-4 bg-gray-100 rounded mb-3" />
              ))}
            </div>
          </div>
        )}

        {isError && (
          <div className="text-center py-20">
            <p className="text-red-500">Pedido não encontrado.</p>
          </div>
        )}

        {order && (
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    Pedido #{order.id.slice(0, 8)}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1.5 rounded-full font-medium ${statusConfig[order.status].className}`}
                >
                  {statusConfig[order.status].label}
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">Itens</h2>
              </div>
              {order.items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between px-6 py-4 ${
                    index < order.items.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(
                      String(parseFloat(item.price) * item.quantity),
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total do pedido</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
