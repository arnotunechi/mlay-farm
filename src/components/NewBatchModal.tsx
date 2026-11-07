import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { Batch } from '../types/farm';

interface NewBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (batch: Batch) => void;
  existingBatchCount: number;
}

export const NewBatchModal: React.FC<NewBatchModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingBatchCount,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  
  const [name, setName] = useState(`Batch #${existingBatchCount + 1} - Cobb 500 Meat Broilers`);
  const [initialCount, setInitialCount] = useState<number>(300);
  const [startDate, setStartDate] = useState<string>(todayStr);
  const [breed, setBreed] = useState<string>('Cobb 500 (White Broiler Meat)');
  const [shedPenNumber, setShedPenNumber] = useState<string>('Shed 1 - Main Broiler Unit');
  const [costPerChickTzs, setCostPerChickTzs] = useState<number>(1850);
  const [targetHarvestAgeDays, setTargetHarvestAgeDays] = useState<number>(42);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a batch name');
      return;
    }
    if (!initialCount || initialCount <= 0) {
      setError('Please enter a valid starting number of chickens (greater than 0)');
      return;
    }

    const newBatch: Batch = {
      id: `batch-${Date.now()}`,
      name: name.trim(),
      initialCount: Number(initialCount),
      startDate,
      breed,
      shedPenNumber: shedPenNumber.trim(),
      costPerChickTzs: Number(costPerChickTzs) || 0,
      targetHarvestAgeDays: Number(targetHarvestAgeDays) || 42,
      notes: notes.trim(),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newBatch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-600/50 rounded-xl">
              <Plus className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Start New Meat Chicken Batch</h2>
              <p className="text-xs text-emerald-200">Manual input of starting chick count & flock setup</p>
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

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Batch Name / Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Batch #2 - Cobb 500 Meat Broilers"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
                Total Initial Chickens (Manual Input) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  required
                  value={initialCount}
                  onChange={(e) => setInitialCount(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 bg-emerald-50/60 border-2 border-emerald-500 rounded-xl focus:ring-2 focus:ring-emerald-600 text-slate-900 font-bold text-lg"
                />
                <span className="absolute right-3 top-3 text-xs font-bold text-emerald-700">
                  Birds
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Starting number saved for remaining ledger</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Start / Arrival Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Meat Breed / Variety
              </label>
              <select
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
              >
                <option value="Cobb 500 (White Broiler Meat)">Cobb 500 (White Broiler Meat)</option>
                <option value="Ross 308 (Heavy Broiler Meat)">Ross 308 (Heavy Broiler Meat)</option>
                <option value="Sasso Dual/Meat (Color Broiler)">Sasso Dual/Meat (Color Broiler)</option>
                <option value="Kuroiler Meat Flock">Kuroiler Meat Flock</option>
                <option value="Local Kienyeji Meat Broiler">Local Kienyeji Meat Broiler</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Shed / Pen Location
              </label>
              <input
                type="text"
                value={shedPenNumber}
                onChange={(e) => setShedPenNumber(e.target.value)}
                placeholder="e.g. Shed 1, Pen B"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Cost Per Chick (TZS)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={costPerChickTzs}
                onChange={(e) => setCostPerChickTzs(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Total investment: {(initialCount * costPerChickTzs).toLocaleString()} TZS
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Target Harvest Age (Days)
              </label>
              <input
                type="number"
                min="28"
                max="90"
                value={targetHarvestAgeDays}
                onChange={(e) => setTargetHarvestAgeDays(Math.max(20, parseInt(e.target.value) || 42))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
              />
              <p className="text-[11px] text-slate-500 mt-1">Standard broiler meat is ready in 35-42 days</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Batch Notes / Supplier Info
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Supplied by Silverlands / Interchick, vaccinated for Marek's at hatchery."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-normal text-sm"
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
              <Plus className="w-4 h-4" />
              Save & Activate Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
