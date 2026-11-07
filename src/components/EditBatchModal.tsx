import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Edit3 } from 'lucide-react';
import { Batch } from '../types/farm';

interface EditBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedBatch: Batch) => void;
  batch: Batch;
}

export const EditBatchModal: React.FC<EditBatchModalProps> = ({
  isOpen,
  onClose,
  onSave,
  batch,
}) => {
  const [name, setName] = useState(batch.name);
  const [initialCount, setInitialCount] = useState<number>(batch.initialCount);
  const [startDate, setStartDate] = useState<string>(batch.startDate);
  const [breed, setBreed] = useState<string>(batch.breed);
  const [shedPenNumber, setShedPenNumber] = useState<string>(batch.shedPenNumber || '');
  const [costPerChickTzs, setCostPerChickTzs] = useState<number>(batch.costPerChickTzs);
  const [targetHarvestAgeDays, setTargetHarvestAgeDays] = useState<number>(batch.targetHarvestAgeDays);
  const [status, setStatus] = useState<Batch['status']>(batch.status);
  const [notes, setNotes] = useState<string>(batch.notes || '');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (batch) {
      setName(batch.name);
      setInitialCount(batch.initialCount);
      setStartDate(batch.startDate);
      setBreed(batch.breed);
      setShedPenNumber(batch.shedPenNumber || '');
      setCostPerChickTzs(batch.costPerChickTzs);
      setTargetHarvestAgeDays(batch.targetHarvestAgeDays);
      setStatus(batch.status);
      setNotes(batch.notes || '');
    }
  }, [batch]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a batch name');
      return;
    }
    if (!initialCount || initialCount <= 0) {
      setError('Initial count must be at least 1');
      return;
    }

    const updated: Batch = {
      ...batch,
      name: name.trim(),
      initialCount: Number(initialCount),
      startDate,
      breed,
      shedPenNumber: shedPenNumber.trim(),
      costPerChickTzs: Number(costPerChickTzs) || 0,
      targetHarvestAgeDays: Number(targetHarvestAgeDays) || 42,
      status,
      notes: notes.trim(),
      updatedAt: new Date().toISOString(),
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-800 rounded-xl">
              <Edit3 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Edit Batch Information</h2>
              <p className="text-xs text-slate-400">Update initial manual count or batch settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
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
              Batch Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
                Initial Chicken Count (Manual Input) *
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
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Start Date *
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
                Breed / Variety
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Pen Location
              </label>
              <input
                type="text"
                value={shedPenNumber}
                onChange={(e) => setShedPenNumber(e.target.value)}
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
                value={costPerChickTzs}
                onChange={(e) => setCostPerChickTzs(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Batch['status'])}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
              >
                <option value="active">Active (Currently in Coop)</option>
                <option value="completed">Completed / Fully Sold</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              className="px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
