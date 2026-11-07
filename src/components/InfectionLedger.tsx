import React, { useState } from 'react';
import { HeartPulse, Plus, ShieldCheck, AlertTriangle, Pill, ChevronDown, ChevronUp, Check, Trash2 } from 'lucide-react';
import { InfectionCategory, InfectionRecord } from '../types/farm';
import { INFECTION_GUIDE_CATALOG } from '../data/infectionGuide';

interface InfectionLedgerProps {
  records: InfectionRecord[];
  onOpenAddModal: () => void;
  onUpdateStatus: (id: string, status: InfectionRecord['status'], recovered: number, mortality: number) => void;
  onDeleteRecord: (id: string) => void;
  onOpenCureGuide: (initialCategory?: InfectionCategory) => void;
}

export const InfectionLedger: React.FC<InfectionLedgerProps> = ({
  records,
  onOpenAddModal,
  onUpdateStatus,
  onDeleteRecord,
  onOpenCureGuide,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const currentlySick = records
    .filter((r) => r.status === 'under_treatment')
    .reduce((acc, curr) => acc + Math.max(0, curr.affectedCount - curr.recoveredCount - curr.mortalityCount), 0);

  const totalRecovered = records.reduce((acc, curr) => acc + (Number(curr.recoveredCount) || 0), 0);
  const totalDied = records.reduce((acc, curr) => acc + (Number(curr.mortalityCount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner with Health Metrics */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-rose-600" />
              Flock Health, Infections & Cure Direction
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Flu, injuries, and common infections with directed veterinary cure protocols
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenCureGuide()}
              className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Pill className="w-4 h-4 text-emerald-700" /> All Diseases Cure Guide
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Report Infection / Injury
            </button>
          </div>
        </div>

        {/* Health Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
              Currently Under Treatment
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-rose-900 font-mono-num">
                {currentlySick}
              </span>
              <span className="text-xs font-semibold text-rose-700">chickens</span>
            </div>
            <span className="text-[10px] text-rose-600 font-medium">In quarantine hospital cage</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              Successfully Cured & Recovered
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-900 font-mono-num">
                {totalRecovered}
              </span>
              <span className="text-xs font-semibold text-emerald-700">chickens</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">Returned to healthy pen</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Mortality from Illness
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-800 font-mono-num">
                {totalDied}
              </span>
              <span className="text-xs font-semibold text-slate-600">birds died</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Tracked in flock balance</span>
          </div>
        </div>
      </div>

      {/* List of Health & Infection Records */}
      <div className="space-y-3">
        {records.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No health issues logged</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Your chicken flock is currently free of recorded infections or injuries. Click above to log if flu or wounds occur.
            </p>
          </div>
        ) : (
          records.map((record) => {
            const advice = INFECTION_GUIDE_CATALOG[record.infectionType] || INFECTION_GUIDE_CATALOG.other;
            const isExpanded = expandedId === record.id;
            const isUnderTreatment = record.status === 'under_treatment';

            return (
              <div
                key={record.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-slate-300"
              >
                {/* Record Main Row */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-3 rounded-2xl shrink-0 ${
                        record.status === 'recovered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : record.status === 'died'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      <HeartPulse className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-slate-900">
                          {advice.nameEn}
                        </h4>
                        <span className="text-xs text-slate-500">
                          ({advice.nameSw})
                        </span>

                        {/* Status badge */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            record.status === 'recovered'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : record.status === 'died'
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                          }`}
                        >
                          {record.status === 'recovered'
                            ? '✓ Recovered / Cured'
                            : record.status === 'died'
                            ? 'Died (Mortality)'
                            : '⚡ Under Active Treatment'}
                        </span>

                        {record.isIsolated && isUnderTreatment && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                            Quarantined
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap">
                        <span>Date: <strong className="text-slate-700">{record.date}</strong></span>
                        <span>
                          Affected: <strong className="text-rose-700 font-bold">{record.affectedCount} chickens</strong>
                        </span>
                        {record.recoveredCount > 0 && (
                          <span className="text-emerald-700 font-bold">
                            Recovered: {record.recoveredCount}
                          </span>
                        )}
                        {record.mortalityCount > 0 && (
                          <span className="text-slate-700 font-bold">
                            Mortality: {record.mortalityCount}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-700 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <strong className="text-slate-900">Treatment Applied:</strong> {record.treatmentApplied}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Cure details toggle */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {/* Mark as recovered button if still sick */}
                    {isUnderTreatment && (
                      <button
                        onClick={() => onUpdateStatus(record.id, 'recovered', record.affectedCount, 0)}
                        className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors flex items-center gap-1"
                        title="Mark all as cured and returned to pen"
                      >
                        <Check className="w-3.5 h-3.5" /> Mark Cured
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : record.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>Hide Cure Advice <ChevronUp className="w-3.5 h-3.5" /></>
                      ) : (
                        <>View Cure Advice <ChevronDown className="w-3.5 h-3.5" /></>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('Delete this health record?')) {
                          onDeleteRecord(record.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expandable Cure Advice Drawer */}
                {isExpanded && (
                  <div className="bg-gradient-to-r from-amber-50/80 via-emerald-50/50 to-teal-50/50 p-4 sm:p-5 border-t border-slate-200 text-xs text-slate-800 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-emerald-700" />
                        <span className="font-extrabold uppercase tracking-wider text-emerald-950">
                          Veterinary Treatment Protocol for {advice.nameEn}
                        </span>
                      </div>
                      <button
                        onClick={() => onOpenCureGuide(record.infectionType)}
                        className="text-[11px] font-bold text-emerald-800 hover:underline"
                      >
                        Open Full Disease Guide →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Step by step cure */}
                      <div className="space-y-1.5">
                        <div className="font-bold text-slate-900 uppercase tracking-wide">
                          How to Cure / Hatua za Tiba:
                        </div>
                        <ul className="space-y-1">
                          {advice.directedCure.map((step, idx) => (
                            <li key={idx} className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Recommended medicines */}
                      <div className="space-y-2">
                        <div className="font-bold text-slate-900 uppercase tracking-wide">
                          Recommended Medicines & Dosage:
                        </div>
                        <div className="space-y-1.5">
                          {advice.recommendedMeds.map((med, idx) => (
                            <div key={idx} className="bg-white p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                              <span className="font-bold text-emerald-900">{med.name}</span>
                              <p className="text-slate-600 font-medium text-[11px] mt-0.5">Dose: {med.dosage}</p>
                              <p className="text-slate-500 text-[10px]">{med.purpose}</p>
                            </div>
                          ))}
                        </div>

                        {advice.slaughterWithdrawalDays > 0 && (
                          <div className="p-2 bg-amber-100/80 border border-amber-300 rounded-xl text-amber-950 font-bold text-[11px]">
                            ⚠️ Meat Withdrawal: Wait {advice.slaughterWithdrawalDays} days after final dose before slaughter/sale!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
