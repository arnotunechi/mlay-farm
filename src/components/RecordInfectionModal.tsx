import React, { useState } from 'react';
import { X, HeartPulse, AlertTriangle, ShieldCheck, Pill, Thermometer, Check } from 'lucide-react';
import { InfectionCategory, InfectionRecord } from '../types/farm';
import { INFECTION_GUIDE_CATALOG } from '../data/infectionGuide';

interface RecordInfectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: InfectionRecord) => void;
  batchId: string;
  batchName: string;
  maxAvailable: number;
}

export const RecordInfectionModal: React.FC<RecordInfectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  batchId,
  batchName,
  maxAvailable,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);

  const [infectionType, setInfectionType] = useState<InfectionCategory>('flu');
  const [affectedCount, setAffectedCount] = useState<number>(2);
  const [isIsolated, setIsIsolated] = useState<boolean>(true);
  const [symptomsObserved, setSymptomsObserved] = useState<string>('');
  const [treatmentApplied, setTreatmentApplied] = useState<string>('');
  const [date, setDate] = useState<string>(todayStr);
  const [status, setStatus] = useState<InfectionRecord['status']>('under_treatment');
  const [notes, setNotes] = useState<string>('');
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const currentAdvice = INFECTION_GUIDE_CATALOG[infectionType] || INFECTION_GUIDE_CATALOG.other;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!affectedCount || affectedCount <= 0) {
      setError('Please specify the number of affected chickens');
      return;
    }
    if (affectedCount > maxAvailable) {
      setError(`Cannot record ${affectedCount} affected chickens! Only ${maxAvailable} remaining live in this batch.`);
      return;
    }

    const defaultTreatment = treatmentApplied.trim() || 
      (currentAdvice.recommendedMeds[0] 
        ? `${currentAdvice.recommendedMeds[0].name} (${currentAdvice.recommendedMeds[0].dosage})`
        : 'Veterinary care applied');

    const defaultSymptoms = symptomsObserved.trim() || currentAdvice.commonSymptoms.join(', ');

    const record: InfectionRecord = {
      id: `inf-${Date.now()}`,
      batchId,
      date,
      infectionType,
      affectedCount: Number(affectedCount),
      symptomsObserved: defaultSymptoms,
      isIsolated,
      treatmentApplied: defaultTreatment,
      status,
      recoveredCount: status === 'recovered' ? Number(affectedCount) : 0,
      mortalityCount: status === 'died' ? Number(affectedCount) : 0,
      notes: notes.trim(),
    };

    onSave(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-rose-700 via-rose-600 to-amber-700 text-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-500/50 rounded-xl">
              <HeartPulse className="w-5 h-5 text-rose-100" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Health Issue & Infection Treatment</h2>
              <p className="text-xs text-rose-100">{batchName} · Live Flock: {maxAvailable} birds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-rose-100 hover:text-white hover:bg-rose-600/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Infection Dropdown & Count */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-rose-900 mb-1 flex items-center justify-between">
                <span>Select Infection / Injury (Dropdown) *</span>
                <span className="text-[11px] font-normal text-slate-500">Includes Flu, Injured, Coccidiosis...</span>
              </label>
              <select
                value={infectionType}
                onChange={(e) => setInfectionType(e.target.value as InfectionCategory)}
                className="w-full px-3.5 py-2.5 bg-rose-50/60 border-2 border-rose-300 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-900 font-bold text-base"
              >
                <option value="flu">Flu / Infectious Coryza / CRD (Mafua ya Kuku)</option>
                <option value="injured">Injured / Pecking Wound / Broken Leg (Aliyejeruhiwa)</option>
                <option value="coccidiosis">Coccidiosis / Bloody Diarrhea (Koksidiosi)</option>
                <option value="newcastle">Newcastle Disease / Kideri / Mdondo</option>
                <option value="fowl_pox">Fowl Pox / Ndui ya Kuku</option>
                <option value="gumboro">Gumboro / IBD (White Diarrhea)</option>
                <option value="heat_stress">Heat Stress & Dehydration (Joto Kali)</option>
                <option value="bumblefoot">Bumblefoot / Foot Abscess (Mguu Kuvimba)</option>
                <option value="pecking_cannibalism">Cannibalism & Feather Pecking (Kudonoana)</option>
                <option value="other">Other Health Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-rose-900 mb-1">
                Chickens Affected *
              </label>
              <input
                type="number"
                min="1"
                max={maxAvailable}
                required
                value={affectedCount}
                onChange={(e) => setAffectedCount(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 bg-rose-50 border-2 border-rose-400 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-900 font-black text-xl"
              />
            </div>
          </div>

          {/* VETERINARY CURE ADVICE DIRECTING BOX (HIGHLIGHT REQUIREMENT) */}
          <div className="bg-gradient-to-br from-amber-50/90 via-emerald-50/50 to-teal-50/70 border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-200/80">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-600 text-white rounded-lg">
                  <Pill className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wider">
                    Veterinary Directing Advice & Treatment Protocol
                  </h3>
                  <p className="text-xs text-emerald-800 font-semibold">
                    {language === 'en' ? currentAdvice.nameEn : currentAdvice.nameSw}
                  </p>
                </div>
              </div>

              {/* Language toggle for the advice */}
              <div className="flex items-center bg-white rounded-lg border border-emerald-300 p-0.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 rounded ${language === 'en' ? 'bg-emerald-700 text-white' : 'text-slate-600'}`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('sw')}
                  className={`px-2 py-0.5 rounded ${language === 'sw' ? 'bg-emerald-700 text-white' : 'text-slate-600'}`}
                >
                  Kiswahili
                </button>
              </div>
            </div>

            {/* Immediate Action / First Aid */}
            <div className="mb-3 p-2.5 bg-rose-100/80 border border-rose-300 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-extrabold text-rose-900 uppercase tracking-wide">
                    {language === 'en' ? 'Immediate Urgent Action:' : 'Hatua ya Haraka ya Kuchukua:'}
                  </p>
                  <p className="text-xs text-rose-950 font-medium mt-0.5">
                    {language === 'en' ? currentAdvice.immediateAction : currentAdvice.immediateActionSw}
                  </p>
                </div>
              </div>
            </div>

            {/* Directed Step-by-Step Cure Directions */}
            <div className="space-y-1.5 mb-3">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                {language === 'en' ? 'How to Cure / Treatment Instructions:' : 'Maelekezo ya Tiba & Jinsi ya Kutibu:'}
              </p>
              <ul className="text-xs text-slate-800 space-y-1 pl-1">
                {(language === 'en' ? currentAdvice.directedCure : currentAdvice.directedCureSw).map((step, idx) => (
                  <li key={idx} className="leading-relaxed bg-white/70 p-2 rounded-lg border border-emerald-100">
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Medications Grid */}
            <div className="mb-3">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                {language === 'en' ? 'Recommended Medicines & Dosages:' : 'Dawa Zinazopendekezwa & Vipimo:'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentAdvice.recommendedMeds.map((med, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-xl border border-emerald-200 text-xs shadow-2xs">
                    <div className="font-bold text-emerald-900">{med.name}</div>
                    <div className="text-slate-600 font-medium text-[11px] mt-0.5">Dose: {med.dosage}</div>
                    <div className="text-slate-500 text-[10px] mt-0.5">{med.purpose}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slaughter Withdrawal Warning for Meat Birds */}
            {currentAdvice.slaughterWithdrawalDays > 0 ? (
              <div className="flex items-center gap-2 p-2 bg-amber-100/80 border border-amber-300 rounded-xl text-xs text-amber-950 font-semibold">
                <Thermometer className="w-4 h-4 text-amber-800 shrink-0" />
                <span>
                  Meat Slaughter Withdrawal Warning: Wait at least <strong>{currentAdvice.slaughterWithdrawalDays} days</strong> after the last dose before selling or slaughtering for meat.
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 bg-emerald-100/80 border border-emerald-300 rounded-xl text-xs text-emerald-950 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>Zero slaughter withdrawal period for this treatment. Safe for meat when healed.</span>
              </div>
            )}
          </div>

          {/* Isolation & Status Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-800 block">
                  Isolate to Quarantine Hospital Pen?
                </label>
                <span className="text-[11px] text-slate-500">Separates from healthy flock to stop spread</span>
              </div>
              <input
                type="checkbox"
                checked={isIsolated}
                onChange={(e) => setIsIsolated(e.target.checked)}
                className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Current Health Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InfectionRecord['status'])}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-900 font-medium"
              >
                <option value="under_treatment">Under Treatment (In Isolation)</option>
                <option value="recovered">Recovered (Cured & Healthy)</option>
                <option value="died">Died (Record as Mortality)</option>
              </select>
            </div>
          </div>

          {/* Treatment Given & Symptoms input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Specific Treatment / Medicine Given
              </label>
              <input
                type="text"
                value={treatmentApplied}
                onChange={(e) => setTreatmentApplied(e.target.value)}
                placeholder="e.g. Tylodox 1g/2L water for 5 days or Gentian Violet"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Date Discovered *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-900 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Clinical Symptoms & Notes
            </label>
            <input
              type="text"
              value={symptomsObserved}
              onChange={(e) => setSymptomsObserved(e.target.value)}
              placeholder="e.g. Swollen eye on left side, pecking cut on back, sneezing."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-900 text-sm"
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
              className="px-6 py-2.5 text-sm font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl shadow-md shadow-rose-900/20 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Health Log & Apply Cure
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
