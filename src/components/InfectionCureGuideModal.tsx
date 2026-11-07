import React, { useState } from 'react';
import { X, HeartPulse, Pill, Search, ShieldCheck, AlertTriangle, AlertCircle, Thermometer } from 'lucide-react';
import { INFECTION_GUIDE_CATALOG } from '../data/infectionGuide';
import { InfectionCategory } from '../types/farm';

interface InfectionCureGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: InfectionCategory;
}

export const InfectionCureGuideModal: React.FC<InfectionCureGuideModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'flu',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<InfectionCategory>(initialCategory);
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const currentAdvice = INFECTION_GUIDE_CATALOG[selectedCategory] || INFECTION_GUIDE_CATALOG.flu;

  const categories = Object.keys(INFECTION_GUIDE_CATALOG) as InfectionCategory[];

  const filteredCategories = categories.filter((cat) => {
    const item = INFECTION_GUIDE_CATALOG[cat];
    const query = searchQuery.toLowerCase();
    return (
      item.nameEn.toLowerCase().includes(query) ||
      item.nameSw.toLowerCase().includes(query) ||
      item.recommendedMeds.some((m) => m.name.toLowerCase().includes(query))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600/50 rounded-2xl">
              <HeartPulse className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-xl font-black">Poultry Disease & Cure Directing Guide</h2>
              <p className="text-xs text-emerald-200">MLAY FARM Broiler Health & Veterinary First Aid</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <div className="flex items-center bg-emerald-950/40 rounded-xl p-1 text-xs font-bold border border-emerald-500/30">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  language === 'en' ? 'bg-white text-emerald-950 shadow-xs' : 'text-emerald-200'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('sw')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  language === 'sw' ? 'bg-white text-emerald-950 shadow-xs' : 'text-emerald-200'
                }`}
              >
                Kiswahili
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-600/50 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Disease Selector */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search diseases or medicines..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Quick Category Buttons Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none">
            {filteredCategories.map((cat) => {
              const item = INFECTION_GUIDE_CATALOG[cat];
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
                  }`}
                >
                  {cat === 'flu' && '🤧 '}
                  {cat === 'injured' && '🩹 '}
                  {cat === 'coccidiosis' && '🩸 '}
                  {cat === 'newcastle' && '⚠️ '}
                  {cat === 'heat_stress' && '☀️ '}
                  {language === 'en' ? item.nameEn.split('/')[0] : item.nameSw.split('/')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Disease Details & Cure Guide Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Header Title with Severity */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-2xl font-black text-slate-900">
                {language === 'en' ? currentAdvice.nameEn : currentAdvice.nameSw}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'en' ? currentAdvice.nameSw : currentAdvice.nameEn}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  currentAdvice.severity === 'critical'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : currentAdvice.severity === 'high'
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                Severity: {currentAdvice.severity}
              </span>

              {currentAdvice.slaughterWithdrawalDays > 0 ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Withdrawal: {currentAdvice.slaughterWithdrawalDays} days
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  0 days withdrawal
                </span>
              )}
            </div>
          </div>

          {/* Immediate First Aid Box */}
          <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-black text-rose-900 uppercase tracking-wide">
                  {language === 'en' ? 'Immediate Action / First Aid' : 'Hatua ya Haraka ya Kwanza'}
                </h4>
                <p className="text-xs font-medium text-rose-950 mt-1 leading-relaxed">
                  {language === 'en' ? currentAdvice.immediateAction : currentAdvice.immediateActionSw}
                </p>
              </div>
            </div>
          </div>

          {/* Common Symptoms */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              {language === 'en' ? 'Common Symptoms Observed' : 'Dalili Zinazojitokeza'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentAdvice.commonSymptoms.map((symp, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium">
                  • {symp}
                </div>
              ))}
            </div>
          </div>

          {/* Step by Step Treatment & Cure */}
          <div className="p-5 bg-gradient-to-br from-emerald-50/70 to-teal-50/70 border-2 border-emerald-500/30 rounded-2xl">
            <h4 className="text-sm font-black text-emerald-950 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              {language === 'en' ? 'Directed Step-by-Step Cure Instructions' : 'Maelekezo Kamili ya Tiba & Jinsi ya Kuponya'}
            </h4>
            <div className="space-y-2">
              {(language === 'en' ? currentAdvice.directedCure : currentAdvice.directedCureSw).map((step, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-slate-800 leading-relaxed font-medium">
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Medicines */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-emerald-600" />
              {language === 'en' ? 'Recommended Medicines & Dosages (Veterinary Pharmacy)' : 'Dawa na Vipimo (Duka la Mifugo)'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentAdvice.recommendedMeds.map((med, idx) => (
                <div key={idx} className="p-4 bg-white border-2 border-emerald-100 rounded-2xl shadow-xs">
                  <div className="font-bold text-sm text-emerald-900">{med.name}</div>
                  <div className="mt-1 text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded inline-block">
                    {med.dosage}
                  </div>
                  <p className="mt-2 text-xs text-slate-600">{med.purpose}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Prevention & Coop Management */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-teal-600" />
              {language === 'en' ? 'Long-term Prevention & Coop Management' : 'Kinga ya Baadaye & Utunzaji wa Banda'}
            </h4>
            <p className="text-xs text-slate-700 font-medium">
              {language === 'en' ? currentAdvice.preventionAdvice : currentAdvice.preventionAdviceSw}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
