import React from 'react';
import { Printer, X, Download } from 'lucide-react';
import { Batch, BatchCalculations, HomeConsumptionRecord, InfectionRecord, SaleRecord } from '../types/farm';
import { formatTZS } from '../utils/calculations';
import { REQUIRED_PEOPLE } from '../data/defaults';

interface PrintableBatchReportProps {
  isOpen: boolean;
  onClose: () => void;
  batch: Batch;
  metrics: BatchCalculations;
  sales: SaleRecord[];
  homeRecords: HomeConsumptionRecord[];
  infectionRecords: InfectionRecord[];
}

export const PrintableBatchReport: React.FC<PrintableBatchReportProps> = ({
  isOpen,
  onClose,
  batch,
  metrics,
  sales,
  homeRecords,
  infectionRecords,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[95vh] flex flex-col">
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Printable Batch Report & Stock Audit</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE CONTENT SHEET */}
        <div id="printable-report" className="p-8 overflow-y-auto flex-1 bg-white text-slate-900 font-sans space-y-6">
          {/* Header */}
          <div className="border-b-2 border-emerald-800 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black tracking-wider text-emerald-950 font-['Plus_Jakarta_Sans',sans-serif]">
                MLAY <span className="text-emerald-700">FARM</span>
              </h1>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mt-0.5">
                Specialized Broiler & Meat Poultry Management System
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Tanzania · Meat Flocks & Broiler Production · Official Stock Audit
              </p>
            </div>

            <div className="text-right text-xs">
              <div className="font-bold text-slate-900 text-sm">FLOCK REPORT</div>
              <div className="text-slate-500 mt-0.5">Generated: {todayStr}</div>
              <div className="text-slate-500">Status: {batch.status.toUpperCase()}</div>
            </div>
          </div>

          {/* Batch Metadata Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block uppercase text-[10px] font-bold">Batch Name</span>
              <span className="font-bold text-slate-900 text-sm">{batch.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px] font-bold">Breed / Variety</span>
              <span className="font-bold text-slate-900">{batch.breed}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px] font-bold">Start Date & Age</span>
              <span className="font-bold text-slate-900">{batch.startDate} ({metrics.ageInDays} Days Old)</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px] font-bold">Shed / Pen Location</span>
              <span className="font-bold text-slate-900">{batch.shedPenNumber || 'Main Unit'}</span>
            </div>
          </div>

          {/* CORE STOCK BALANCE SUMMARY */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-3">
              Official Stock Balance & Chick Ledger
            </h2>
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">1. Initial Input</span>
                <span className="text-xl font-black text-slate-900 font-mono-num">{metrics.initialCount}</span>
                <span className="text-[10px] text-slate-400 block">Day-Old Started</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 block uppercase">2. Total Sold</span>
                <span className="text-xl font-black text-emerald-700 font-mono-num">-{metrics.totalSold}</span>
                <span className="text-[10px] text-emerald-600 block">{formatTZS(metrics.totalSalesRevenueTzs)}</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 block uppercase">3. Eaten at Home</span>
                <span className="text-xl font-black text-amber-700 font-mono-num">-{metrics.totalEatenAtHome}</span>
                <span className="text-[10px] text-amber-600 block">Family & staff</span>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                <span className="text-[10px] font-bold text-rose-800 block uppercase">4. Mortality</span>
                <span className="text-xl font-black text-rose-700 font-mono-num">-{metrics.totalMortality}</span>
                <span className="text-[10px] text-rose-600 block">{metrics.mortalityRatePercent.toFixed(1)}% rate</span>
              </div>
              <div className="p-3 bg-emerald-700 text-white rounded-xl shadow-xs">
                <span className="text-[10px] font-bold text-emerald-200 block uppercase">Remaining Live</span>
                <span className="text-xl font-black font-mono-num">{metrics.totalAliveCount}</span>
                <span className="text-[10px] text-emerald-100 block">Chickens in Coop</span>
              </div>
            </div>
          </div>

          {/* HOME CONSUMPTION BREAKDOWN */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
              Chickens Eaten at Home Breakdown (Who Took It)
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center text-xs">
              {REQUIRED_PEOPLE.map((person) => {
                const count = homeRecords
                  .filter((r) => r.whoTookIt === person)
                  .reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
                return (
                  <div key={person} className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-semibold text-slate-700 text-[11px] block truncate">{person}</span>
                    <span className="font-black text-amber-900 text-base font-mono-num">{count}</span>
                    <span className="text-[9px] text-slate-400 block">birds</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SALES TRANSACTIONS SUMMARY */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
              Recent Sales Summary
            </h2>
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2 border-b">Date</th>
                  <th className="p-2 border-b">Buyer</th>
                  <th className="p-2 border-b text-center">Birds</th>
                  <th className="p-2 border-b text-right">Price/Bird</th>
                  <th className="p-2 border-b text-right">Total TZS</th>
                  <th className="p-2 border-b">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.slice(0, 8).map((s) => (
                  <tr key={s.id}>
                    <td className="p-2 font-mono-num">{s.date}</td>
                    <td className="p-2 font-bold">{s.buyerName}</td>
                    <td className="p-2 text-center font-mono-num">{s.quantity}</td>
                    <td className="p-2 text-right font-mono-num">{s.unitPriceTzs.toLocaleString()} TZS</td>
                    <td className="p-2 text-right font-mono-num font-bold text-emerald-800">{s.totalPriceTzs.toLocaleString()} TZS</td>
                    <td className="p-2">{s.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* HEALTH INCIDENTS SUMMARY */}
          {infectionRecords.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
                Health & Infection Treatments
              </h2>
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2 border-b">Date</th>
                    <th className="p-2 border-b">Condition</th>
                    <th className="p-2 border-b text-center">Affected</th>
                    <th className="p-2 border-b">Treatment Applied</th>
                    <th className="p-2 border-b">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {infectionRecords.map((inf) => (
                    <tr key={inf.id}>
                      <td className="p-2 font-mono-num">{inf.date}</td>
                      <td className="p-2 font-bold uppercase">{inf.infectionType}</td>
                      <td className="p-2 text-center font-mono-num">{inf.affectedCount}</td>
                      <td className="p-2 text-slate-600">{inf.treatmentApplied}</td>
                      <td className="p-2 font-semibold">
                        {inf.status === 'recovered' ? 'Recovered' : inf.status === 'died' ? 'Died' : 'Under Treatment'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Official Sign-off block */}
          <div className="pt-6 border-t-2 border-slate-300 grid grid-cols-2 gap-8 text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-8">
                Prepared by Farm Attendant / Manager:
              </p>
              <div className="border-b border-slate-400 w-48 mb-1" />
              <p>Name & Signature</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-8">
                Approved by Farm Owner / Director (Mlay):
              </p>
              <div className="border-b border-slate-400 w-48 ml-auto mb-1" />
              <p>Signature & Date</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
