import { Batch, BatchCalculations, HomeConsumptionRecord, InfectionRecord, MortalityRecord, SaleRecord } from '../types/farm';

export function calculateBatchMetrics(
  batch: Batch,
  sales: SaleRecord[],
  homeConsumption: HomeConsumptionRecord[],
  infections: InfectionRecord[],
  mortalities: MortalityRecord[]
): BatchCalculations {
  const batchSales = sales.filter((s) => s.batchId === batch.id);
  const batchHome = homeConsumption.filter((h) => h.batchId === batch.id);
  const batchInfections = infections.filter((i) => i.batchId === batch.id);
  const batchMortalities = mortalities.filter((m) => m.batchId === batch.id);

  const initialCount = batch.initialCount || 0;

  // Total sold
  const totalSold = batchSales.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
  const totalSalesRevenueTzs = batchSales.reduce((acc, curr) => acc + (Number(curr.totalPriceTzs) || 0), 0);

  // Total eaten at home
  const totalEatenAtHome = batchHome.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

  // General mortality logs
  const directMortality = batchMortalities.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
  
  // Mortality logged under infection records
  const infectionMortality = batchInfections.reduce((acc, curr) => acc + (Number(curr.mortalityCount) || 0), 0);

  const totalMortality = directMortality + infectionMortality;

  // Currently isolated / under treatment chickens
  const currentlyIsolated = batchInfections
    .filter((inf) => inf.status === 'under_treatment' && inf.isIsolated)
    .reduce((acc, curr) => {
      // Remaining active sick birds that haven't recovered or died
      const remainingSick = Math.max(0, (curr.affectedCount || 0) - (curr.recoveredCount || 0) - (curr.mortalityCount || 0));
      return acc + remainingSick;
    }, 0);

  // Total recovered
  const totalRecovered = batchInfections.reduce((acc, curr) => acc + (Number(curr.recoveredCount) || 0), 0);

  // LIVE REMAINING COUNT
  // Total living birds (healthy + isolated sick)
  const totalAliveCount = Math.max(0, initialCount - totalSold - totalEatenAtHome - totalMortality);

  // Available healthy birds in the pen
  const remainingActiveCount = Math.max(0, totalAliveCount - currentlyIsolated);

  // Rates & percentages
  const mortalityRatePercent = initialCount > 0 ? (totalMortality / initialCount) * 100 : 0;
  const soldRatePercent = initialCount > 0 ? (totalSold / initialCount) * 100 : 0;
  const homeRatePercent = initialCount > 0 ? (totalEatenAtHome / initialCount) * 100 : 0;
  const survivalRatePercent = initialCount > 0 ? (totalAliveCount / initialCount) * 100 : 100;

  // Age in days
  const startDate = new Date(batch.startDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const ageInDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const isReadyForSlaughter = ageInDays >= (batch.targetHarvestAgeDays || 35);

  const initialChickInvestmentTzs = initialCount * (batch.costPerChickTzs || 0);

  // Average selling price for valuing home consumption
  const avgSoldPrice = totalSold > 0 ? totalSalesRevenueTzs / totalSold : 9500;
  const homeConsumptionValueTzs = totalEatenAtHome * avgSoldPrice;

  return {
    initialCount,
    totalSold,
    totalEatenAtHome,
    totalMortality,
    totalInfectedCurrent: currentlyIsolated,
    totalRecovered,
    remainingActiveCount,
    totalAliveCount,
    totalSalesRevenueTzs,
    initialChickInvestmentTzs,
    homeConsumptionValueTzs,
    mortalityRatePercent,
    soldRatePercent,
    homeRatePercent,
    survivalRatePercent,
    ageInDays,
    isReadyForSlaughter,
  };
}

export function formatTZS(amount: number): string {
  return new Intl.NumberFormat('en-TZ', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount) + ' TZS';
}
