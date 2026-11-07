import React, { useState } from 'react';
import { X, CheckCircle2, DollarSign, AlertCircle, ShoppingBag } from 'lucide-react';
import { SaleRecord } from '../types/farm';

interface RecordSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sale: SaleRecord) => void;
  batchId: string;
  batchName: string;
  maxAvailable: number;
  defaultPriceTzs: number;
}

export const RecordSaleModal: React.FC<RecordSaleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  batchId,
  batchName,
  maxAvailable,
  defaultPriceTzs,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);

  const [quantity, setQuantity] = useState<number>(10);
  const [unitPriceTzs, setUnitPriceTzs] = useState<number>(defaultPriceTzs || 9500);
  const [buyerName, setBuyerName] = useState<string>('');
  const [buyerPhone, setBuyerPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<SaleRecord['paymentMethod']>('Cash');
  const [isPaid, setIsPaid] = useState<boolean>(true);
  const [avgWeightKg, setAvgWeightKg] = useState<number>(1.9);
  const [recordedBy, setRecordedBy] = useState<string>('Juma');
  const [date, setDate] = useState<string>(todayStr);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const totalPrice = quantity * unitPriceTzs;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || quantity <= 0) {
      setError('Please enter a valid quantity of chickens sold');
      return;
    }
    if (quantity > maxAvailable) {
      setError(`Cannot sell ${quantity} chickens! Only ${maxAvailable} remaining live in this batch.`);
      return;
    }
    if (!buyerName.trim()) {
      setError('Please specify buyer or customer name');
      return;
    }

    const sale: SaleRecord = {
      id: `sale-${Date.now()}`,
      batchId,
      date,
      quantity: Number(quantity),
      unitPriceTzs: Number(unitPriceTzs),
      totalPriceTzs: totalPrice,
      buyerName: buyerName.trim(),
      buyerPhone: buyerPhone.trim(),
      paymentMethod,
      isPaid,
      averageWeightKg: Number(avgWeightKg) || undefined,
      recordedBy: recordedBy.trim(),
      notes: notes.trim(),
    };

    onSave(sale);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-600/50 rounded-xl">
              <ShoppingBag className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Record Chicken Sale</h2>
              <p className="text-xs text-emerald-200">{batchName} · Available: {maxAvailable} birds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-emerald-200 hover:text-white hover:bg-emerald-600/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quantity & Unit Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-1">
                Number of Chickens Sold *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={maxAvailable}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 bg-emerald-50 border-2 border-emerald-500 rounded-xl focus:ring-2 focus:ring-emerald-600 text-slate-900 font-black text-xl"
                />
                <span className="absolute right-3 top-3 text-xs font-bold text-emerald-700">
                  Chickens
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Remaining after sale: {Math.max(0, maxAvailable - quantity)}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Price Per Chicken (TZS) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1000"
                  step="500"
                  required
                  value={unitPriceTzs}
                  onChange={(e) => setUnitPriceTzs(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-bold text-lg"
                />
                <span className="absolute right-3 top-3 text-xs font-bold text-slate-500">
                  TZS
                </span>
              </div>
            </div>
          </div>

          {/* Total Revenue Highlight Box */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-amber-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">Total Sale Amount:</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-emerald-800 font-mono-num">
                {totalPrice.toLocaleString()} TZS
              </span>
            </div>
          </div>

          {/* Buyer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Buyer / Customer Name *
              </label>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="e.g. Mama Mary Butchery / Local Hotel"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Buyer Phone (Optional)
              </label>
              <input
                type="tel"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                placeholder="e.g. +255 754 123 456"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Payment Method & Average Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as SaleRecord['paymentMethod'])}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
              >
                <option value="Cash">Cash (Pesa Taslimu)</option>
                <option value="M-Pesa">Vodacom M-Pesa</option>
                <option value="Tigo Pesa">Tigo Pesa / Mixx by Yas</option>
                <option value="Airtel Money">Airtel Money</option>
                <option value="Bank">Bank Transfer / CRDB / NMB</option>
                <option value="Credit">Credit / Deni (Unpaid)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Average Weight per Bird (kg)
              </label>
              <input
                type="number"
                step="0.05"
                min="0.5"
                max="5"
                value={avgWeightKg}
                onChange={(e) => setAvgWeightKg(parseFloat(e.target.value) || 1.8)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Sale Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Recorded By
              </label>
              <input
                type="text"
                value={recordedBy}
                onChange={(e) => setRecordedBy(e.target.value)}
                placeholder="e.g. Innocent / Juma"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Notes / Delivery Remarks
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Collected live in crates, customer satisfied with weight."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md shadow-emerald-900/20 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Sale ({totalPrice.toLocaleString()} TZS)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
