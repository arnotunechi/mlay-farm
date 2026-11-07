import React, { useState, useEffect } from 'react';
import {
  Layers,
  ShoppingBag,
  Utensils,
  HeartPulse,
  Plus,
  Printer,
  Download,
  Upload,
  RefreshCw,
  FileText,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { MlayFarmLogo } from './components/MlayFarmLogo';
import { BatchOverviewCard } from './components/BatchOverviewCard';
import { SalesLedger } from './components/SalesLedger';
import { HomeConsumptionLedger } from './components/HomeConsumptionLedger';
import { InfectionLedger } from './components/InfectionLedger';
import { NewBatchModal } from './components/NewBatchModal';
import { EditBatchModal } from './components/EditBatchModal';
import { RecordSaleModal } from './components/RecordSaleModal';
import { RecordHomeConsumptionModal } from './components/RecordHomeConsumptionModal';
import { RecordInfectionModal } from './components/RecordInfectionModal';
import { InfectionCureGuideModal } from './components/InfectionCureGuideModal';
import { PrintableBatchReport } from './components/PrintableBatchReport';
import { SeparateProjectsModal } from './components/SeparateProjectsModal';
import { CarWashApp } from './components/carwash/CarWashApp';
import { CarWashLogo } from './components/carwash/CarWashLogo';
import {
  Batch,
  HomeConsumptionRecord,
  InfectionCategory,
  InfectionRecord,
  SaleRecord,
} from './types/farm';
import { calculateBatchMetrics, formatTZS } from './utils/calculations';
import {
  exportFarmDataAsJSON,
  exportHomeConsumptionToCSV,
  exportSalesToCSV,
  FarmState,
  loadFarmState,
  saveFarmState,
} from './utils/storage';
import { getInitialSeedData } from './data/defaults';

export const App: React.FC = () => {
  // Master system toggle: General Car Wash vs MLAY Farm
  const [currentSystem, setCurrentSystem] = useState<'carwash' | 'farm'>(() => {
    const savedSys = localStorage.getItem('active_system_selected');
    return 'farm';
  });

  const [showGitHelp, setShowGitHelp] = useState(false);
  const [isSeparateProjectsOpen, setIsSeparateProjectsOpen] = useState(false);

  // Load local state
  const [farmState, setFarmState] = useState<FarmState>(() => loadFarmState());

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sales' | 'home' | 'health' | 'batches'>('dashboard');

  // Modals state
  const [isNewBatchOpen, setIsNewBatchOpen] = useState(false);
  const [isEditBatchOpen, setIsEditBatchOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isHomeModalOpen, setIsHomeModalOpen] = useState(false);
  const [isInfectionModalOpen, setIsInfectionModalOpen] = useState(false);
  const [isCureGuideOpen, setIsCureGuideOpen] = useState(false);
  const [cureGuideInitialCategory, setCureGuideInitialCategory] = useState<InfectionCategory>('flu');
  const [isPrintReportOpen, setIsPrintReportOpen] = useState(false);

  // Sync state to local storage on changes
  useEffect(() => {
    saveFarmState(farmState);
  }, [farmState]);

  // Current active batch
  const currentBatch = farmState.batches.find((b) => b.id === farmState.activeBatchId) || farmState.batches[0];

  // Current calculations
  const metrics = currentBatch
    ? calculateBatchMetrics(
        currentBatch,
        farmState.sales,
        farmState.homeConsumption,
        farmState.infections,
        farmState.mortalities
      )
    : null;

  // Handlers for Batch
  const handleSaveNewBatch = (newBatch: Batch) => {
    setFarmState((prev) => ({
      ...prev,
      batches: [newBatch, ...prev.batches],
      activeBatchId: newBatch.id,
    }));
  };

  const handleUpdateBatch = (updated: Batch) => {
    setFarmState((prev) => ({
      ...prev,
      batches: prev.batches.map((b) => (b.id === updated.id ? updated : b)),
    }));
  };

  const handleSelectBatch = (batchId: string) => {
    setFarmState((prev) => ({
      ...prev,
      activeBatchId: batchId,
    }));
  };

  // Handlers for Sales
  const handleSaveSale = (sale: SaleRecord) => {
    setFarmState((prev) => ({
      ...prev,
      sales: [sale, ...prev.sales],
    }));
  };

  const handleDeleteSale = (saleId: string) => {
    setFarmState((prev) => ({
      ...prev,
      sales: prev.sales.filter((s) => s.id !== saleId),
    }));
  };

  // Handlers for Home Consumption (Who took it: Innocent, Angel, Fridah, Juma, Gwineth, Dada 1, Dada 2)
  const handleSaveHomeConsumption = (record: HomeConsumptionRecord) => {
    setFarmState((prev) => ({
      ...prev,
      homeConsumption: [record, ...prev.homeConsumption],
    }));
  };

  const handleDeleteHomeRecord = (recordId: string) => {
    setFarmState((prev) => ({
      ...prev,
      homeConsumption: prev.homeConsumption.filter((h) => h.id !== recordId),
    }));
  };

  // Handlers for Infections & Cure Guidance
  const handleSaveInfection = (record: InfectionRecord) => {
    setFarmState((prev) => ({
      ...prev,
      infections: [record, ...prev.infections],
    }));
  };

  const handleUpdateInfectionStatus = (
    id: string,
    status: InfectionRecord['status'],
    recovered: number,
    mortality: number
  ) => {
    setFarmState((prev) => ({
      ...prev,
      infections: prev.infections.map((inf) =>
        inf.id === id
          ? {
              ...inf,
              status,
              recoveredCount: recovered,
              mortalityCount: mortality,
              isIsolated: status === 'under_treatment',
            }
          : inf
      ),
    }));
  };

  const handleDeleteInfection = (id: string) => {
    setFarmState((prev) => ({
      ...prev,
      infections: prev.infections.filter((i) => i.id !== id),
    }));
  };

  // Reset to seed data
  const handleResetSeedData = () => {
    if (window.confirm('Reset MLAY FARM demo data? This will reinitialize sample batches and records.')) {
      const seed = getInitialSeedData();
      const newState: FarmState = {
        batches: seed.batches,
        activeBatchId: seed.batches[0].id,
        sales: seed.sales,
        homeConsumption: seed.homeConsumption,
        infections: seed.infections,
        mortalities: seed.mortalities,
        settings: farmState.settings,
      };
      setFarmState(newState);
      saveFarmState(newState);
    }
  };

  const activeBatchSales = farmState.sales.filter((s) => s.batchId === currentBatch?.id);
  const activeBatchHome = farmState.homeConsumption.filter((h) => h.batchId === currentBatch?.id);
  const activeBatchInfections = farmState.infections.filter((i) => i.batchId === currentBatch?.id);

  if (!currentBatch || !metrics) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md text-center border border-slate-200">
          <MlayFarmLogo className="justify-center mb-4" size="lg" />
          <h2 className="text-xl font-bold text-slate-800">Welcome to MLAY FARM</h2>
          <p className="text-sm text-slate-500 mt-2 mb-6">
            No active chicken batch found. Start your first meat flock to begin tracking.
          </p>
          <button
            onClick={() => setIsNewBatchOpen(true)}
            className="w-full py-3 bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:bg-emerald-800 transition-colors"
          >
            Create Starting Batch
          </button>
        </div>
        <NewBatchModal
          isOpen={isNewBatchOpen}
          onClose={() => setIsNewBatchOpen(false)}
          onSave={handleSaveNewBatch}
          existingBatchCount={0}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* GLOBAL MULTI-SYSTEM SELECTOR & RECOVERY BANNER */}
      <div className="bg-slate-950 text-white px-4 py-2 text-xs border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-slate-400 uppercase tracking-widest text-[10px]">
              Select Active System:
            </span>
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setCurrentSystem('carwash');
                  localStorage.setItem('active_system_selected', 'carwash');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 text-xs ${
                  currentSystem === 'carwash'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🚗</span> General Car Wash POS
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentSystem('farm');
                  localStorage.setItem('active_system_selected', 'farm');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 text-xs ${
                  currentSystem === 'farm'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🐔</span> MLAY FARM
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              type="button"
              onClick={() => setIsSeparateProjectsOpen(true)}
              className="px-3.5 py-1.5 rounded-xl font-black text-xs bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>📦</span> Save As 2 Separate Projects (Download ZIPs)
            </button>

            <button
              type="button"
              onClick={() => setShowGitHelp(true)}
              className="text-slate-300 hover:text-white font-semibold text-xs underline flex items-center gap-1 bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-700"
            >
              <span>ℹ️</span> GitHub Guide
            </button>
          </div>
        </div>
      </div>

      {/* RENDER CURRENT SYSTEM */}
      {currentSystem === 'carwash' ? (
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-6 bg-white p-5 rounded-2xl shadow-xs">
            <CarWashLogo size="md" />
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-900 font-bold rounded-xl text-xs">
                Active System: General Car Wash
              </span>
              <button
                onClick={() => {
                  setCurrentSystem('farm');
                  localStorage.setItem('active_system_selected', 'farm');
                }}
                className="px-3 py-1 bg-emerald-700 text-white font-bold rounded-xl text-xs hover:bg-emerald-800 transition-colors"
              >
                Switch to MLAY Farm →
              </button>
            </div>
          </div>

          <CarWashApp />
        </div>
      ) : (
        <>
          {/* APP NAVBAR */}
          <header className="bg-white border-b border-slate-200 sticky top-10 z-40 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
                
                {/* Brand Logo */}
                <div className="flex items-center gap-4">
                  <MlayFarmLogo size="md" />

                  {/* Batch Selector Dropdown */}
              <div className="relative hidden md:block">
                <select
                  value={currentBatch.id}
                  onChange={(e) => handleSelectBatch(e.target.value)}
                  className="pl-3 pr-8 py-1.5 bg-emerald-50/80 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none"
                >
                  {farmState.batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.initialCount} birds)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-emerald-700 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Live Count Pill & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Remaining Live Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-700 text-white rounded-xl shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 hidden sm:inline">
                  Flock Balance:
                </span>
                <span className="text-base sm:text-lg font-black font-mono-num leading-none">
                  {metrics.totalAliveCount}
                </span>
                <span className="text-xs text-emerald-100 font-semibold">remaining</span>
              </div>

              {/* New Batch Button */}
              <button
                onClick={() => setIsNewBatchOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-colors"
                title="Create a new meat chicken batch"
              >
                <Plus className="w-4 h-4 text-emerald-800" /> New Batch
              </button>

              {/* Print Report */}
              <button
                onClick={() => setIsPrintReportOpen(true)}
                className="p-2 sm:px-3 sm:py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                title="Print batch stock sheet"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Print Report</span>
              </button>

              {/* Backup / Export */}
              <button
                onClick={() => exportFarmDataAsJSON(farmState)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                title="Backup all farm data to JSON"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Reset demo data */}
              <button
                onClick={handleResetSeedData}
                className="p-2 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-colors"
                title="Reset sample data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-4 border-t border-slate-100 pt-1 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              Flock Dashboard
            </button>

            <button
              onClick={() => setActiveTab('sales')}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'sales'
                  ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              Sold Chickens ({activeBatchSales.length})
            </button>

            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'home'
                  ? 'border-amber-600 text-amber-900 bg-amber-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Utensils className="w-4 h-4 text-amber-600" />
              Eaten at Home ({metrics.totalEatenAtHome})
            </button>

            <button
              onClick={() => setActiveTab('health')}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'health'
                  ? 'border-rose-600 text-rose-900 bg-rose-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-rose-600" />
              Health & Infections ({activeBatchInfections.length})
            </button>

            <button
              onClick={() => {
                setCureGuideInitialCategory('flu');
                setIsCureGuideOpen(true);
              }}
              className="px-3.5 py-2.5 text-xs font-bold text-teal-800 hover:bg-teal-50 rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <HelpCircle className="w-4 h-4 text-teal-600" />
              Cure & Medicine Guide
            </button>

            <button
              onClick={() => setActiveTab('batches')}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'batches'
                  ? 'border-slate-800 text-slate-900 bg-slate-100 rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-500" />
              All Batches ({farmState.batches.length})
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN VIEW CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Mobile Batch Switcher Bar if on small screens */}
        <div className="md:hidden mb-4 p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600">Active Batch:</span>
          <select
            value={currentBatch.id}
            onChange={(e) => handleSelectBatch(e.target.value)}
            className="px-2 py-1 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-950"
          >
            {farmState.batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tab 1: Flock Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Primary Live Overview Card */}
            <BatchOverviewCard
              batch={currentBatch}
              metrics={metrics}
              onOpenSaleModal={() => setIsSaleModalOpen(true)}
              onOpenHomeModal={() => setIsHomeModalOpen(true)}
              onOpenInfectionModal={() => setIsInfectionModalOpen(true)}
              onOpenEditBatchModal={() => setIsEditBatchOpen(true)}
              onOpenCureGuide={() => {
                setCureGuideInitialCategory('flu');
                setIsCureGuideOpen(true);
              }}
            />

            {/* Split Activity Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Home Consumption Snapshot (Highlighting the 7 people) */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-amber-600" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Eaten at Home by Family & Staff</h3>
                      <p className="text-[11px] text-slate-500">Innocent, Angel, Fridah, Juma, Gwineth, Dada 1, Dada 2</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="text-xs font-bold text-amber-700 hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-2">
                  {activeBatchHome.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      No chickens taken for home yet in this batch.
                    </div>
                  ) : (
                    activeBatchHome.slice(0, 4).map((h) => (
                      <div
                        key={h.id}
                        className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="px-2.5 py-1 rounded-md font-extrabold bg-amber-200 text-amber-900 text-[11px]">
                            {h.whoTookIt}
                          </span>
                          <div>
                            <p className="font-semibold text-slate-800">{h.purpose}</p>
                            <p className="text-[10px] text-slate-500">{h.date} {h.notes && `· ${h.notes}`}</p>
                          </div>
                        </div>
                        <span className="font-black text-amber-900 font-mono-num text-sm bg-white px-2 py-0.5 rounded border border-amber-200">
                          {h.quantity} {h.quantity === 1 ? 'chicken' : 'chickens'}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Total taken so far:</span>
                  <span className="font-bold text-amber-900 font-mono-num text-sm">
                    {metrics.totalEatenAtHome} chickens
                  </span>
                </div>
              </div>

              {/* Health & Infection Live Advisory Snapshot */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-rose-600" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Health, Flu & Injury Cures</h3>
                      <p className="text-[11px] text-slate-500">Directed veterinary treatment logs</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('health')}
                    className="text-xs font-bold text-rose-700 hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-2">
                  {activeBatchInfections.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      No diseases or injuries reported in this flock. All healthy!
                    </div>
                  ) : (
                    activeBatchInfections.slice(0, 3).map((inf) => (
                      <div
                        key={inf.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 uppercase text-[11px]">
                              {inf.infectionType === 'flu' && '🤧 Flu / Coryza'}
                              {inf.infectionType === 'injured' && '🩹 Injured / Wound'}
                              {inf.infectionType !== 'flu' && inf.infectionType !== 'injured' && inf.infectionType}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                inf.status === 'recovered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {inf.status === 'recovered' ? 'Cured' : 'In Treatment'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5 truncate max-w-xs">
                            {inf.treatmentApplied}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-rose-700 font-mono-num block">
                            {inf.affectedCount} birds
                          </span>
                          <span className="text-[10px] text-slate-400">{inf.date}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Flock Mortality:</span>
                  <span className="font-bold text-rose-700 font-mono-num text-sm">
                    {metrics.totalMortality} birds ({metrics.mortalityRatePercent.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Sold Chickens */}
        {activeTab === 'sales' && (
          <SalesLedger
            sales={activeBatchSales}
            onOpenAddModal={() => setIsSaleModalOpen(true)}
            onDeleteSale={handleDeleteSale}
            onExportCSV={() => exportSalesToCSV(activeBatchSales, currentBatch.name)}
          />
        )}

        {/* Tab 3: Eaten at Home */}
        {activeTab === 'home' && (
          <HomeConsumptionLedger
            records={activeBatchHome}
            onOpenAddModal={() => setIsHomeModalOpen(true)}
            onDeleteRecord={handleDeleteHomeRecord}
            onExportCSV={() => exportHomeConsumptionToCSV(activeBatchHome, currentBatch.name)}
          />
        )}

        {/* Tab 4: Health & Infections */}
        {activeTab === 'health' && (
          <InfectionLedger
            records={activeBatchInfections}
            onOpenAddModal={() => setIsInfectionModalOpen(true)}
            onUpdateStatus={handleUpdateInfectionStatus}
            onDeleteRecord={handleDeleteInfection}
            onOpenCureGuide={(cat) => {
              if (cat) setCureGuideInitialCategory(cat);
              setIsCureGuideOpen(true);
            }}
          />
        )}

        {/* Tab 5: All Batches Manager */}
        {activeTab === 'batches' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">All Meat Chicken Batches</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage active and past flocks of broilers and meat birds
                </p>
              </div>
              <button
                onClick={() => setIsNewBatchOpen(true)}
                className="px-4 py-2.5 bg-emerald-700 text-white font-bold rounded-xl text-xs hover:bg-emerald-800 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Start New Flock Batch
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {farmState.batches.map((b) => {
                const bMetrics = calculateBatchMetrics(
                  b,
                  farmState.sales,
                  farmState.homeConsumption,
                  farmState.infections,
                  farmState.mortalities
                );
                const isActive = b.id === currentBatch.id;

                return (
                  <div
                    key={b.id}
                    className={`bg-white rounded-2xl p-5 border transition-all ${
                      isActive
                        ? 'border-2 border-emerald-600 shadow-md ring-2 ring-emerald-500/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {b.breed}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1">{b.name}</h3>
                        <p className="text-xs text-slate-500">{b.startDate} · Age: {bMetrics.ageInDays} days</p>
                      </div>
                      {isActive && (
                        <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-4 text-xs">
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Initial</span>
                        <div className="font-bold text-slate-900 font-mono-num text-sm">
                          {b.initialCount} birds
                        </div>
                      </div>
                      <div className="p-2 bg-emerald-50 rounded-xl">
                        <span className="text-[10px] text-emerald-700 uppercase font-semibold">Remaining</span>
                        <div className="font-black text-emerald-900 font-mono-num text-sm">
                          {bMetrics.totalAliveCount} birds
                        </div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Sold</span>
                        <div className="font-bold text-slate-700 font-mono-num">
                          {bMetrics.totalSold} birds
                        </div>
                      </div>
                      <div className="p-2 bg-amber-50 rounded-xl">
                        <span className="text-[10px] text-amber-700 uppercase font-semibold">Home</span>
                        <div className="font-bold text-amber-800 font-mono-num">
                          {bMetrics.totalEatenAtHome} birds
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          handleSelectBatch(b.id);
                          setActiveTab('dashboard');
                        }}
                        className={`w-full py-2 text-xs font-bold rounded-xl transition-colors ${
                          isActive
                            ? 'bg-slate-100 text-slate-800'
                            : 'bg-emerald-700 text-white hover:bg-emerald-800'
                        }`}
                      >
                        {isActive ? 'Currently Selected' : 'Switch to this Batch'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
              MLAY FARM
            </span>
            <span>· Dedicated Meat Poultry & Broiler Flock System</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Initial Count Saved · Sold Tracking · Home Consumption (Innocent, Angel, Fridah, Juma, Gwineth, Dada 1, Dada 2) · Flu & Injury Cure Guides
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <NewBatchModal
        isOpen={isNewBatchOpen}
        onClose={() => setIsNewBatchOpen(false)}
        onSave={handleSaveNewBatch}
        existingBatchCount={farmState.batches.length}
      />

      <EditBatchModal
        isOpen={isEditBatchOpen}
        onClose={() => setIsEditBatchOpen(false)}
        onSave={handleUpdateBatch}
        batch={currentBatch}
      />

      <RecordSaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onSave={handleSaveSale}
        batchId={currentBatch.id}
        batchName={currentBatch.name}
        maxAvailable={metrics.totalAliveCount}
        defaultPriceTzs={farmState.settings.standardBroilerSellingPriceTzs}
      />

      <RecordHomeConsumptionModal
        isOpen={isHomeModalOpen}
        onClose={() => setIsHomeModalOpen(false)}
        onSave={handleSaveHomeConsumption}
        batchId={currentBatch.id}
        batchName={currentBatch.name}
        maxAvailable={metrics.totalAliveCount}
      />

      <RecordInfectionModal
        isOpen={isInfectionModalOpen}
        onClose={() => setIsInfectionModalOpen(false)}
        onSave={handleSaveInfection}
        batchId={currentBatch.id}
        batchName={currentBatch.name}
        maxAvailable={metrics.totalAliveCount}
      />

      <InfectionCureGuideModal
        isOpen={isCureGuideOpen}
        onClose={() => setIsCureGuideOpen(false)}
        initialCategory={cureGuideInitialCategory}
      />

      <PrintableBatchReport
        isOpen={isPrintReportOpen}
        onClose={() => setIsPrintReportOpen(false)}
        batch={currentBatch}
        metrics={metrics}
        sales={activeBatchSales}
        homeRecords={activeBatchHome}
        infectionRecords={activeBatchInfections}
      />
        </>
      )}

      {/* GITHUB OVERWRITE RECOVERY MODAL */}
      {showGitHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-5 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-100 text-amber-900 rounded-xl font-bold text-lg">
                  🛡️
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    How to Recover Your Car Wash System on GitHub
                  </h3>
                  <p className="text-xs text-slate-500">
                    Git records every commit history. Nothing is permanently lost!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGitHelp(false)}
                className="text-slate-400 hover:text-slate-800 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 font-medium">
                <strong>Good News:</strong> Both the <strong>General Car Wash POS</strong> and <strong>MLAY FARM</strong> are fully restored and running right here in this app! You can toggle between them anytime at the top bar.
              </div>

              <div>
                <h4 className="font-extrabold uppercase text-slate-900 mb-1">
                  Option 1: Quick 10-Second Git Undo (Restore Carwash on Main)
                </h4>
                <p className="text-slate-600 mb-2">
                  Open your terminal in your car wash repository folder and run:
                </p>
                <div className="bg-slate-950 text-emerald-400 font-mono p-3 rounded-xl select-all space-y-1">
                  <div># 1. View your commit history to find your previous carwash commit:</div>
                  <div className="text-white">git log -n 5 --oneline</div>
                  <div className="pt-2 text-slate-400"># 2. Reset back to the commit right before the push:</div>
                  <div className="text-amber-300">git reset --hard HEAD~1</div>
                  <div className="pt-2 text-slate-400"># 3. Force push back to GitHub to restore your carwash repository:</div>
                  <div className="text-white">git push --force origin main</div>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold uppercase text-slate-900 mb-1">
                  Option 2: Keep BOTH on GitHub in Separate Branches
                </h4>
                <p className="text-slate-600 mb-2">
                  If you want to keep the carwash on <code>main</code> and MLAY Farm on a new branch:
                </p>
                <div className="bg-slate-950 text-slate-200 font-mono p-3 rounded-xl select-all space-y-1">
                  <div className="text-slate-400"># Save current farm code to a new branch:</div>
                  <div className="text-emerald-400">git checkout -b mlay-farm</div>
                  <div className="text-emerald-400">git push origin mlay-farm</div>
                  <div className="pt-2 text-slate-400"># Switch back to main and restore carwash:</div>
                  <div className="text-white">git checkout main</div>
                  <div className="text-amber-300">git reset --hard HEAD~1</div>
                  <div className="text-white">git push --force origin main</div>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold uppercase text-slate-900 mb-1">
                  Option 3: Recover Directly on GitHub Web
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                  <li>Go to your GitHub repository in your web browser.</li>
                  <li>Click on <strong>"Commits"</strong> (under the green code button).</li>
                  <li>Click on the commit from before today (your carwash commit).</li>
                  <li>Click the <strong>"..."</strong> button on the top right and select <strong>"Revert commit"</strong>.</li>
                </ol>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowGitHelp(false)}
                className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800"
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEPARATE PROJECTS DOWNLOAD MODAL */}
      <SeparateProjectsModal
        isOpen={isSeparateProjectsOpen}
        onClose={() => setIsSeparateProjectsOpen(false)}
      />
    </div>
  );
};

export default App;
