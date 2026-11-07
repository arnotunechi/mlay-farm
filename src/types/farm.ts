export type PersonName = 
  | 'Innocent'
  | 'Angel'
  | 'Fridah'
  | 'Juma'
  | 'Gwineth'
  | 'Dada 1'
  | 'Dada 2'
  | string;

export type InfectionCategory = 
  | 'flu'
  | 'injured'
  | 'coccidiosis'
  | 'newcastle'
  | 'fowl_pox'
  | 'gumboro'
  | 'heat_stress'
  | 'bumblefoot'
  | 'pecking_cannibalism'
  | 'other';

export interface InfectionAdvice {
  conditionId: InfectionCategory;
  nameEn: string;
  nameSw: string;
  severity: 'mild' | 'moderate' | 'high' | 'critical';
  commonSymptoms: string[];
  immediateAction: string;
  immediateActionSw: string;
  directedCure: string[];
  directedCureSw: string[];
  recommendedMeds: {
    name: string;
    dosage: string;
    purpose: string;
  }[];
  slaughterWithdrawalDays: number; // Meat withdrawal period before slaughtering
  preventionAdvice: string;
  preventionAdviceSw: string;
}

export interface Batch {
  id: string;
  name: string; // e.g. "Batch 1 - Cobb 500 Broilers"
  initialCount: number; // Manual input saved
  startDate: string; // YYYY-MM-DD
  breed: string; // e.g. "Cobb 500 Broiler (White Meat)", "Ross 308", "Sasso Meat", "Kuroiler Meat"
  shedPenNumber?: string; // e.g. "Shed A", "Banda la Kwanza"
  costPerChickTzs: number; // Purchase price per chick e.g. 1800 TZS
  targetHarvestAgeDays: number; // Typically 35 - 42 days for broilers
  notes?: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface SaleRecord {
  id: string;
  batchId: string;
  date: string; // YYYY-MM-DD or ISO
  quantity: number; // Number of chickens sold
  unitPriceTzs: number; // Price per chicken in TZS e.g. 9000
  totalPriceTzs: number; // quantity * unitPrice
  buyerName: string; // Customer / Buyer name
  buyerPhone?: string;
  paymentMethod: 'Cash' | 'M-Pesa' | 'Tigo Pesa' | 'Airtel Money' | 'Bank' | 'Credit';
  isPaid: boolean;
  averageWeightKg?: number;
  recordedBy?: string;
  notes?: string;
}

export interface HomeConsumptionRecord {
  id: string;
  batchId: string;
  date: string;
  quantity: number; // Number of chickens eaten/taken
  whoTookIt: PersonName; // Dropdown: Innocent, Angel, Fridah, Juma, Gwineth, Dada 1, Dada 2
  purpose: string; // e.g. "Family meal", "Sunday lunch", "Special visitors", "Worker staff lunch"
  notes?: string;
  recordedBy?: string;
}

export interface InfectionRecord {
  id: string;
  batchId: string;
  date: string;
  infectionType: InfectionCategory;
  customConditionName?: string;
  affectedCount: number; // Number of chickens affected
  symptomsObserved: string;
  isIsolated: boolean; // Are they currently separated to hospital cage
  treatmentApplied: string; // e.g. "Tylodox in water for 5 days"
  slaughterSafeDate?: string; // Date after drug withdrawal period has ended
  status: 'under_treatment' | 'recovered' | 'died';
  recoveredCount: number;
  mortalityCount: number; // Died due to this condition
  notes?: string;
}

export interface MortalityRecord {
  id: string;
  batchId: string;
  date: string;
  quantity: number;
  reason: string;
  disposalMethod: 'Buried' | 'Incinerated' | 'Composted';
  notes?: string;
}

export interface BatchCalculations {
  initialCount: number;
  totalSold: number;
  totalEatenAtHome: number;
  totalMortality: number;
  totalInfectedCurrent: number; // Currently sick / under treatment
  totalRecovered: number;
  
  // LIVE REMAINING CALCULATION
  // Chickens currently alive & available in pen
  remainingActiveCount: number;
  // Total alive (including currently isolated sick chickens)
  totalAliveCount: number;
  
  // Financial metrics
  totalSalesRevenueTzs: number;
  initialChickInvestmentTzs: number;
  homeConsumptionValueTzs: number; // quantity * avg selling price
  
  // Rates
  mortalityRatePercent: number;
  soldRatePercent: number;
  homeRatePercent: number;
  survivalRatePercent: number;
  
  // Age in days
  ageInDays: number;
  isReadyForSlaughter: boolean;
}

export interface FarmSettings {
  farmName: string;
  tagline: string;
  location: string;
  currency: string;
  ownerName: string;
  phone: string;
  standardBroilerSellingPriceTzs: number;
  standardTargetAgeDays: number;
  language: 'en' | 'sw';
}
