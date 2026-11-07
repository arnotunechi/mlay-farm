import React from 'react';
import {
  TrendingUp,
  Utensils,
  HeartPulse,
  Skull,
  Layers,
  ArrowRight,
  DollarSign,
  PlusCircle,
  ShoppingBag,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Batch, BatchCalculations } from '../types/farm';
import { formatTZS } from '../utils/calculations';

interface BatchOverviewCardProps {
  batch: Batch;
  metrics: BatchCalculations;
  onOpenSaleModal: () => void;
  onOpenHomeModal: () => void;
  onOpenInfectionModal: () => void;
  onOpenEditBatchModal: () => void;
  onOpenCureGuide: () => void;
}

export const BatchOverviewCard: React.FC<BatchOverviewCardProps> = ({
  batch,
  metrics,
  onOpenSaleModal,
  onOpenHomeModal,
  onOpenInfectionModal,
  onOpenEditBatchModal,
  onOpenCureGuide,
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden mb-8 transition-all">
      {/* Top Banner: Batch identity, age, and quick status */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                <Layers className="w-3.5 h-3.5" />
                Active Meat Flock
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30">
                {batch.breed}
              </span>
              {batch.shedPenNumber && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700/60 text-slate-300">
                  {batch.shedPenNumber}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              {batch.name}
            </h1>

            <div className="flex items-center gap-4 text-xs text-emerald-200/90 mt-2 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Started: {batch.startDate}
              </span>
              <span className="font-semibold text-amber-300">
                Flock Age: {metrics.ageInDays} Days (Target: {batch.targetHarvestAgeDays} Days)
              </span>
              {metrics.isReadyForSlaughter && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black text-[11px] animate-pulse">
                  <Sparkles className="w-3 h-3" /> READY FOR HARVEST & SLAUGHTER
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenEditBatchModal}
              className="px-3.5 py-2 text-xs font-bold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/90 rounded-xl border border-slate-700 transition-colors"
            >
              Edit Batch Count
            </button>
            <button
              onClick={onOpenCureGuide}
              className="px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-300 hover:bg-amber-200 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <HeartPulse className="w-4 h-4 text-rose-700" />
              Vet Cure Guide
            </button>
          </div>
        </div>
      </div>

      {/* CORE LIVE COUNT SHOWCASE: REMAINING CHICKENS PROMINENT BANNER */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-slate-50 border-b border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Main Hero: Total Chickens Remaining */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-700 to-emerald-900 text-white rounded-2xl p-5 sm:p-6 shadow-lg shadow-emerald-950/20 border-2 border-emerald-500/50 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-emerald-500/20 blur-xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-200">
                  Total Chickens Remaining
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-emerald-500/30 text-emerald-100 border border-emerald-400/30">
                  Live in Batch
                </span>
              </div>

              <div className="flex items-baseline gap-3 my-2">
                <span className="text-5xl sm:text-6xl font-black tracking-tight text-white font-mono-num drop-shadow-sm">
                  {metrics.totalAliveCount}
                </span>
                <span className="text-lg font-bold text-emerald-200">
                  / {metrics.initialCount} Initial
                </span>
              </div>

              <p className="text-xs text-emerald-100/90 font-medium">
                {metrics.remainingActiveCount} healthy in main pen · {metrics.totalInfectedCurrent} in isolation/treatment
              </p>

              {/* Progress bar showing survival percentage */}
              <div className="mt-4 pt-3 border-t border-emerald-600/60">
                <div className="flex justify-between text-xs font-semibold text-emerald-200 mb-1">
                  <span>Current Flock Strength</span>
                  <span className="font-mono-num">{metrics.survivalRatePercent.toFixed(1)}% surviving</span>
                </div>
                <div className="w-full bg-emerald-950/60 h-2.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, metrics.survivalRatePercent))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Equation & Ledger Breakdown: Initial - Sold - Eaten - Died = Remaining */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-600" />
                Live Stock Equation & Ledger for this Batch
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Auto-calculated live</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              {/* Initial Saved Input */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  1. Initial Input
                </span>
                <span className="text-2xl font-black text-slate-800 font-mono-num mt-1 block">
                  {metrics.initialCount}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Saved manual</span>
              </div>

              {/* Minus Sold */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                  2. Sold Chickens
                </span>
                <span className="text-2xl font-black text-emerald-700 font-mono-num mt-1 block">
                  -{metrics.totalSold}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">{formatTZS(metrics.totalSalesRevenueTzs)}</span>
              </div>

              {/* Minus Eaten at Home */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                  3. Eaten at Home
                </span>
                <span className="text-2xl font-black text-amber-700 font-mono-num mt-1 block">
                  -{metrics.totalEatenAtHome}
                </span>
                <span className="text-[10px] text-amber-600 font-medium">By family & staff</span>
              </div>

              {/* Minus Mortality */}
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                  4. Mortality / Died
                </span>
                <span className="text-2xl font-black text-rose-700 font-mono-num mt-1 block">
                  -{metrics.totalMortality}
                </span>
                <span className="text-[10px] text-rose-600 font-medium">
                  {metrics.mortalityRatePercent.toFixed(1)}% rate
                </span>
              </div>
            </div>

            {/* Quick summary line equation */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
              <div className="flex items-center gap-1.5 font-mono-num font-semibold text-slate-700">
                <span>{metrics.initialCount}</span>
                <span className="text-slate-400">-</span>
                <span className="text-emerald-700">{metrics.totalSold} sold</span>
                <span className="text-slate-400">-</span>
                <span className="text-amber-700">{metrics.totalEatenAtHome} eaten</span>
                <span className="text-slate-400">-</span>
                <span className="text-rose-700">{metrics.totalMortality} died</span>
                <span className="text-slate-400">=</span>
                <span className="font-extrabold text-slate-900 bg-emerald-100 px-2 py-0.5 rounded text-sm text-emerald-900">
                  {metrics.totalAliveCount} Remaining
                </span>
              </div>

              <div className="text-[11px] text-slate-500">
                {metrics.totalInfectedCurrent > 0 ? (
                  <span className="text-rose-700 font-bold">
                    ⚠️ {metrics.totalInfectedCurrent} currently isolated in sick pen
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold">
                    ✓ All living chickens healthy
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* QUICK LOG ACTION BUTTONS (BIG, INTUITIVE FOR FARM WORKERS) */}
      <div className="p-4 sm:p-5 bg-white">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Quick Actions for This Batch
          </span>
          <span className="text-xs text-slate-400">Click to record instant transaction</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Action 1: Record Sale */}
          <button
            onClick={onOpenSaleModal}
            className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-md shadow-emerald-900/15 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold">Sell Chickens</div>
                <div className="text-[11px] text-emerald-100">Record customer sale & TZS</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Action 2: Record Eaten at Home */}
          <button
            onClick={onOpenHomeModal}
            className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md shadow-amber-900/15 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold">Eaten at Home</div>
                <div className="text-[11px] text-amber-100">Select who took it (Innocent, Angel...)</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-200 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Action 3: Record Infection & Cure */}
          <button
            onClick={onOpenInfectionModal}
            className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white shadow-md shadow-rose-900/15 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold">Health & Cure Advice</div>
                <div className="text-[11px] text-rose-100">Flu, Injured & Veterinary instructions</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-rose-200 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
