import React, { useState } from 'react';
import { ShoppingBag, Download, Plus, Search, Calendar, Phone, Trash2, CheckCircle } from 'lucide-react';
import { SaleRecord } from '../types/farm';
import { formatTZS } from '../utils/calculations';

interface SalesLedgerProps {
  sales: SaleRecord[];
  onOpenAddModal: () => void;
  onDeleteSale: (id: string) => void;
  onExportCSV: () => void;
}

export const SalesLedger: React.FC<SalesLedgerProps> = ({
  sales,
  onOpenAddModal,
  onDeleteSale,
  onExportCSV,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');

  const totalSold = sales.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
  const totalRevenue = sales.reduce((acc, curr) => acc + (Number(curr.totalPriceTzs) || 0), 0);
  const avgPrice = totalSold > 0 ? Math.round(totalRevenue / totalSold) : 0;

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      searchQuery === '' ||
      sale.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sale.buyerPhone && sale.buyerPhone.includes(searchQuery)) ||
      (sale.notes && sale.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPayment = paymentFilter === 'ALL' || sale.paymentMethod === paymentFilter;
    return matchesSearch && matchesPayment;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Sales Metrics */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              Chicken Meat Sales & Revenue Ledger
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live customer orders, commercial buyers, and payments
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportCSV}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Record New Sale
            </button>
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              Total Chickens Sold
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-900 font-mono-num">
                {totalSold}
              </span>
              <span className="text-xs font-semibold text-emerald-700">birds</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">Across {sales.length} transactions</span>
          </div>

          <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">
              Total Sales Revenue
            </span>
            <div className="text-2xl font-black font-mono-num mt-1">
              {formatTZS(totalRevenue)}
            </div>
            <span className="text-[10px] text-emerald-200 font-medium">Cash & mobile payments</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Average Selling Price
            </span>
            <div className="text-2xl font-black text-slate-800 font-mono-num mt-1">
              {formatTZS(avgPrice)}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Per live chicken</span>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search buyer, phone, or notes..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Payments</option>
            <option value="Cash">Cash</option>
            <option value="M-Pesa">M-Pesa</option>
            <option value="Tigo Pesa">Tigo Pesa</option>
            <option value="Airtel Money">Airtel Money</option>
            <option value="Credit">Credit (Unpaid)</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing {filteredSales.length} of {sales.length} sales
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredSales.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No chicken sales found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Click "Record New Sale" to log customer purchases.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Buyer / Customer</th>
                  <th className="py-3 px-4 text-center">Quantity</th>
                  <th className="py-3 px-4 text-right">Price / Bird</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                  <th className="py-3 px-4 text-center">Payment</th>
                  <th className="py-3 px-4">Recorded By</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono-num text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{sale.date}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{sale.buyerName}</div>
                      {sale.buyerPhone && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-normal mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{sale.buyerPhone}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-full font-black text-emerald-800 bg-emerald-50 border border-emerald-200 font-mono-num text-sm">
                        {sale.quantity} birds
                      </span>
                      {sale.averageWeightKg && (
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                          ~{sale.averageWeightKg} kg/bird
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono-num text-slate-600">
                      {formatTZS(sale.unitPriceTzs)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-black text-emerald-800 font-mono-num text-sm whitespace-nowrap">
                      {formatTZS(sale.totalPriceTzs)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        {sale.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {sale.recordedBy || '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete sale of ${sale.quantity} chicken(s) to ${sale.buyerName}?`)) {
                            onDeleteSale(sale.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete sale"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
