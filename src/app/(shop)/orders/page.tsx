"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { useOrders } from "@/hooks/useOrders";
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
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));

export default function OrdersPage() {
  const { isAuthenticated } = useRequireAuth();
  const { data: orders, isLoading } = useOrders();

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-sm text-gray-500 mt-1">Histórico de compras</p>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-100 rounded w-1/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && orders?.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">
              Você ainda não fez nenhum pedido
            </p>
            <Link
              href="/"
              className="text-sm text-black font-medium hover:underline"
            >
              Ver produtos
            </Link>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div className="flex flex-col gap-3">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow flex items-center justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-gray-900">
                      Pedido #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(order.createdAt)} · {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "itens"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(order.total)}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
