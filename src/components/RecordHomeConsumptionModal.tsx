import React, { useState } from 'react';
import { X, Utensils, Check, AlertCircle, UserCheck } from 'lucide-react';
import { HomeConsumptionRecord, PersonName } from '../types/farm';
import { COMMON_PURPOSES, REQUIRED_PEOPLE } from '../data/defaults';

interface RecordHomeConsumptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: HomeConsumptionRecord) => void;
  batchId: string;
  batchName: string;
  maxAvailable: number;
}

export const RecordHomeConsumptionModal: React.FC<RecordHomeConsumptionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  batchId,
  batchName,
  maxAvailable,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);

  const [quantity, setQuantity] = useState<number>(1);
  const [whoTookIt, setWhoTookIt] = useState<PersonName>('Innocent');
  const [customPerson, setCustomPerson] = useState<string>('');
  const [isOtherPerson, setIsOtherPerson] = useState<boolean>(false);
  const [purpose, setPurpose] = useState<string>('Family meal / Chakula cha familia');
  const [customPurpose, setCustomPurpose] = useState<string>('');
  const [isOtherPurpose, setIsOtherPurpose] = useState<boolean>(false);
  const [date, setDate] = useState<string>(todayStr);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handlePersonSelect = (person: PersonName) => {
    setIsOtherPerson(false);
    setWhoTookIt(person);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || quantity <= 0) {
      setError('Please specify the quantity of chickens taken for home');
      return;
    }
    if (quantity > maxAvailable) {
      setError(`Cannot take ${quantity} chickens! Only ${maxAvailable} remaining live in this batch.`);
      return;
    }

    const finalPerson = isOtherPerson ? customPerson.trim() : whoTookIt;
    if (!finalPerson) {
      setError('Please specify who took the chicken');
      return;
    }

    const finalPurpose = isOtherPurpose ? customPurpose.trim() : purpose;
    if (!finalPurpose) {
      setError('Please specify the home consumption purpose');
      return;
    }

    const record: HomeConsumptionRecord = {
      id: `home-${Date.now()}`,
      batchId,
      date,
      quantity: Number(quantity),
      whoTookIt: finalPerson,
      purpose: finalPurpose,
      notes: notes.trim(),
      recordedBy: finalPerson,
    };

    onSave(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/50 rounded-xl">
              <Utensils className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Record Chicken Taken for Home</h2>
              <p className="text-xs text-amber-100">{batchName} · Available: {maxAvailable} birds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-amber-100 hover:text-white hover:bg-amber-600/50 rounded-lg transition-colors"
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

          {/* Quantity */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
              Quantity of Chickens Taken *
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max={maxAvailable}
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 bg-amber-50/70 border-2 border-amber-500 rounded-xl focus:ring-2 focus:ring-amber-600 text-slate-900 font-black text-xl"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-amber-800">
                Birds for Home
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Remaining in pen after this: {Math.max(0, maxAvailable - quantity)}</p>
          </div>

          {/* Who Took It: Required Dropdown and Quick Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-600" />
                Who Took It? (Dropdown & Quick Select) *
              </label>
              <span className="text-[11px] text-amber-700 font-medium">Required Dropdown</span>
            </div>

            {/* Standard HTML Select Dropdown as requested */}
            <div className="mb-2">
              <select
                value={isOtherPerson ? 'OTHER_CUSTOM' : whoTookIt}
                onChange={(e) => {
                  if (e.target.value === 'OTHER_CUSTOM') {
                    setIsOtherPerson(true);
                  } else {
                    setIsOtherPerson(false);
                    setWhoTookIt(e.target.value);
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900 font-bold text-base"
              >
                <optgroup label="Farm & Family Members">
                  {REQUIRED_PEOPLE.map((person) => (
                    <option key={person} value={person}>
                      {person}
                    </option>
                  ))}
                </optgroup>
                <option value="OTHER_CUSTOM">+ Other / Write In Name...</option>
              </select>
            </div>

            {/* Visual Quick-Select Chips */}
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-1.5 pt-1">
              {REQUIRED_PEOPLE.map((person) => {
                const isSelected = !isOtherPerson && whoTookIt === person;
                return (
                  <button
                    key={person}
                    type="button"
                    onClick={() => handlePersonSelect(person)}
                    className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border text-center transition-all flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 shrink-0" />}
                    <span className="truncate">{person}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom person input if needed */}
            {isOtherPerson && (
              <div className="mt-2">
                <input
                  type="text"
                  required
                  value={customPerson}
                  onChange={(e) => setCustomPerson(e.target.value)}
                  placeholder="Enter person's name..."
                  className="w-full px-3.5 py-2 bg-amber-50 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900 font-medium text-sm"
                />
              </div>
            )}
          </div>

          {/* Purpose of Consumption */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Purpose / Sababu ya Kuchukua *
            </label>
            <select
              value={isOtherPurpose ? 'OTHER_PURPOSE' : purpose}
              onChange={(e) => {
                if (e.target.value === 'OTHER_PURPOSE') {
                  setIsOtherPurpose(true);
                } else {
                  setIsOtherPurpose(false);
                  setPurpose(e.target.value);
                }
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900 font-medium"
            >
              {COMMON_PURPOSES.map((purp) => (
                <option key={purp} value={purp}>
                  {purp}
                </option>
              ))}
              <option value="OTHER_PURPOSE">+ Custom Purpose / Nyingine...</option>
            </select>

            {isOtherPurpose && (
              <div className="mt-2">
                <input
                  type="text"
                  required
                  value={customPurpose}
                  onChange={(e) => setCustomPurpose(e.target.value)}
                  placeholder="Describe purpose..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900 text-sm"
                />
              </div>
            )}
          </div>

          {/* Date & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Date Taken *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Additional Remarks
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Prepared for weekend visitors"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900 text-sm"
              />
            </div>
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
              className="px-6 py-2.5 text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-md shadow-amber-900/20 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Home Consumption
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
