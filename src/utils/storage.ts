import { Batch, FarmSettings, HomeConsumptionRecord, InfectionRecord, MortalityRecord, SaleRecord } from '../types/farm';
import { DEFAULT_FARM_SETTINGS, getInitialSeedData } from '../data/defaults';

const STORAGE_KEYS = {
  BATCHES: 'mlay_farm_batches_v1',
  ACTIVE_BATCH_ID: 'mlay_farm_active_batch_id_v1',
  SALES: 'mlay_farm_sales_v1',
  HOME_CONSUMPTION: 'mlay_farm_home_consumption_v1',
  INFECTIONS: 'mlay_farm_infections_v1',
  MORTALITIES: 'mlay_farm_mortalities_v1',
  SETTINGS: 'mlay_farm_settings_v1',
};

export interface FarmState {
  batches: Batch[];
  activeBatchId: string;
  sales: SaleRecord[];
  homeConsumption: HomeConsumptionRecord[];
  infections: InfectionRecord[];
  mortalities: MortalityRecord[];
  settings: FarmSettings;
}

export function loadFarmState(): FarmState {
  try {
    const storedBatches = localStorage.getItem(STORAGE_KEYS.BATCHES);
    const storedSales = localStorage.getItem(STORAGE_KEYS.SALES);
    const storedHome = localStorage.getItem(STORAGE_KEYS.HOME_CONSUMPTION);
    const storedInfections = localStorage.getItem(STORAGE_KEYS.INFECTIONS);
    const storedMortalities = localStorage.getItem(STORAGE_KEYS.MORTALITIES);
    const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const storedActiveBatchId = localStorage.getItem(STORAGE_KEYS.ACTIVE_BATCH_ID);

    if (!storedBatches) {
      // Initialize with seed data
      const seed = getInitialSeedData();
      const state: FarmState = {
        batches: seed.batches,
        activeBatchId: seed.batches[0]?.id || '',
        sales: seed.sales,
        homeConsumption: seed.homeConsumption,
        infections: seed.infections,
        mortalities: seed.mortalities,
        settings: DEFAULT_FARM_SETTINGS,
      };
      saveFarmState(state);
      return state;
    }

    const batches: Batch[] = JSON.parse(storedBatches);
    const sales: SaleRecord[] = storedSales ? JSON.parse(storedSales) : [];
    const homeConsumption: HomeConsumptionRecord[] = storedHome ? JSON.parse(storedHome) : [];
    const infections: InfectionRecord[] = storedInfections ? JSON.parse(storedInfections) : [];
    const mortalities: MortalityRecord[] = storedMortalities ? JSON.parse(storedMortalities) : [];
    const settings: FarmSettings = storedSettings ? JSON.parse(storedSettings) : DEFAULT_FARM_SETTINGS;
    
    let activeBatchId = storedActiveBatchId || '';
    if (!activeBatchId || !batches.some(b => b.id === activeBatchId)) {
      activeBatchId = batches[0]?.id || '';
    }

    return {
      batches,
      activeBatchId,
      sales,
      homeConsumption,
      infections,
      mortalities,
      settings,
    };
  } catch (err) {
    console.error('Error loading farm state from local storage:', err);
    const seed = getInitialSeedData();
    return {
      batches: seed.batches,
      activeBatchId: seed.batches[0]?.id || '',
      sales: seed.sales,
      homeConsumption: seed.homeConsumption,
      infections: seed.infections,
      mortalities: seed.mortalities,
      settings: DEFAULT_FARM_SETTINGS,
    };
  }
}

export function saveFarmState(state: FarmState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(state.batches));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_BATCH_ID, state.activeBatchId);
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(state.sales));
    localStorage.setItem(STORAGE_KEYS.HOME_CONSUMPTION, JSON.stringify(state.homeConsumption));
    localStorage.setItem(STORAGE_KEYS.INFECTIONS, JSON.stringify(state.infections));
    localStorage.setItem(STORAGE_KEYS.MORTALITIES, JSON.stringify(state.mortalities));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings));
  } catch (err) {
    console.error('Error saving farm state to local storage:', err);
  }
}

export function exportFarmDataAsJSON(state: FarmState): void {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(state, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `MLAY_FARM_BACKUP_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportSalesToCSV(sales: SaleRecord[], batchName: string): void {
  const headers = ['Sale ID', 'Batch Name', 'Date', 'Quantity Sold', 'Unit Price (TZS)', 'Total (TZS)', 'Buyer Name', 'Phone', 'Payment Method', 'Notes'];
  const rows = sales.map(s => [
    s.id,
    batchName,
    s.date,
    s.quantity,
    s.unitPriceTzs,
    s.totalPriceTzs,
    `"${(s.buyerName || '').replace(/"/g, '""')}"`,
    s.buyerPhone || '',
    s.paymentMethod,
    `"${(s.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `MLAY_FARM_SALES_${batchName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function exportHomeConsumptionToCSV(records: HomeConsumptionRecord[], batchName: string): void {
  const headers = ['Record ID', 'Batch Name', 'Date', 'Chickens Taken', 'Who Took It', 'Purpose', 'Notes', 'Recorded By'];
  const rows = records.map(r => [
    r.id,
    batchName,
    r.date,
    r.quantity,
    r.whoTookIt,
    `"${(r.purpose || '').replace(/"/g, '""')}"`,
    `"${(r.notes || '').replace(/"/g, '""')}"`,
    r.recordedBy || '',
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `MLAY_FARM_HOME_CONSUMPTION_${batchName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
