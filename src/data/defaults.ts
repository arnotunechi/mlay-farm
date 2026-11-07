import { Batch, FarmSettings, HomeConsumptionRecord, InfectionRecord, MortalityRecord, PersonName, SaleRecord } from '../types/farm';

export const REQUIRED_PEOPLE: PersonName[] = [
  'Innocent',
  'Angel',
  'Fridah',
  'Juma',
  'Gwineth',
  'Dada 1',
  'Dada 2',
];

export const DEFAULT_FARM_SETTINGS: FarmSettings = {
  farmName: 'MLAY FARM',
  tagline: 'Broiler & Meat Poultry Management System',
  location: 'Mlay Poultry Compound, Tanzania',
  currency: 'TZS',
  ownerName: 'Mlay Family & Management',
  phone: '+255 754 000 000',
  standardBroilerSellingPriceTzs: 9500,
  standardTargetAgeDays: 42,
  language: 'en',
};

export const COMMON_PURPOSES = [
  'Family meal / Chakula cha familia',
  'Sunday family dinner / Chakula cha Jumapili',
  'Special visitors / Wageni maalum',
  'Workers / Staff meal',
  'Relative gift / Zawadi ya ndugu',
  'Holiday / Sikukuu celebration',
  'Emergency home need',
];

export function getInitialSeedData(): {
  batches: Batch[];
  sales: SaleRecord[];
  homeConsumption: HomeConsumptionRecord[];
  infections: InfectionRecord[];
  mortalities: MortalityRecord[];
} {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  
  // Date 34 days ago when chicks arrived
  const startDateObj = new Date(today.getTime() - 34 * 24 * 60 * 60 * 1000);
  const startDateStr = startDateObj.toISOString().slice(0, 10);

  const batch1Id = 'batch-mlay-01';

  const batches: Batch[] = [
    {
      id: batch1Id,
      name: 'Batch #1 - Broiler Meat Cobb 500',
      initialCount: 300, // Manual input saved
      startDate: startDateStr,
      breed: 'Cobb 500 (White Broiler Meat)',
      shedPenNumber: 'Shed 1 - Main Broiler Unit',
      costPerChickTzs: 1850,
      targetHarvestAgeDays: 42,
      notes: 'First flock of high-growth meat broilers. Started with 300 chicks, target harvest at 4-5 weeks.',
      status: 'active',
      createdAt: `${startDateStr}T08:00:00Z`,
      updatedAt: `${todayStr}T10:00:00Z`,
    },
  ];

  // Sales records
  const sales: SaleRecord[] = [
    {
      id: 'sale-001',
      batchId: batch1Id,
      date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      quantity: 20,
      unitPriceTzs: 9500,
      totalPriceTzs: 190000,
      buyerName: 'Mama John (Local Eatery / Mgahawa)',
      buyerPhone: '+255 765 890 123',
      paymentMethod: 'Cash',
      isPaid: true,
      averageWeightKg: 1.85,
      recordedBy: 'Juma',
      notes: 'First batch harvest for weekend order. All birds weighed above 1.8kg.',
    },
    {
      id: 'sale-002',
      batchId: batch1Id,
      date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      quantity: 25,
      unitPriceTzs: 9500,
      totalPriceTzs: 237500,
      buyerName: 'Highlands Hotel & Butchery',
      buyerPhone: '+255 712 456 789',
      paymentMethod: 'M-Pesa',
      isPaid: true,
      averageWeightKg: 1.92,
      recordedBy: 'Innocent',
      notes: 'Live birds delivered in crates. Paid in full via M-Pesa.',
    },
  ];

  // Home consumption records with required people (Innocent, Angel, Fridah, Juma, Gwineth, Dada 1, Dada 2)
  const homeConsumption: HomeConsumptionRecord[] = [
    {
      id: 'home-001',
      batchId: batch1Id,
      date: new Date(today.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      quantity: 2,
      whoTookIt: 'Dada 1',
      purpose: 'Family meal / Chakula cha familia',
      notes: 'Prepared for Sunday family lunch.',
      recordedBy: 'Dada 1',
    },
    {
      id: 'home-002',
      batchId: batch1Id,
      date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      quantity: 2,
      whoTookIt: 'Innocent',
      purpose: 'Special visitors / Wageni maalum',
      notes: 'Visitors from town dinner.',
      recordedBy: 'Innocent',
    },
    {
      id: 'home-003',
      batchId: batch1Id,
      date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      quantity: 1,
      whoTookIt: 'Angel',
      purpose: 'Family meal / Chakula cha familia',
      notes: 'Home cooking.',
      recordedBy: 'Angel',
    },
    {
      id: 'home-004',
      batchId: batch1Id,
      date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      quantity: 2,
      whoTookIt: 'Dada 2',
      purpose: 'Family meal / Chakula cha familia',
      notes: 'Midweek home dinner.',
      recordedBy: 'Dada 2',
    },
  ];

  // Infection records with cure instructions applied
  const infections: InfectionRecord[] = [
    {
      id: 'inf-001',
      batchId: batch1Id,
      date: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      infectionType: 'flu',
      affectedCount: 3,
      symptomsObserved: 'Sneezing, swollen eyes, and nasal discharge due to cold night draft.',
      isIsolated: false, // Recovered!
      treatmentApplied: 'Tylodox (Tylosin + Doxycycline) 1g/2L water for 5 days + Aliseryl vitamins.',
      status: 'recovered',
      recoveredCount: 3,
      mortalityCount: 0,
      notes: 'Full recovery observed on day 5. Returned to general pen.',
    },
    {
      id: 'inf-002',
      batchId: batch1Id,
      date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      infectionType: 'injured',
      affectedCount: 2,
      symptomsObserved: 'Back pecking wound with bleeding from feeder scramble; limping.',
      isIsolated: true, // Currently isolated
      treatmentApplied: 'Isolated immediately. Cleaned with warm saline, sprayed Gentian Violet (purple spray) over wound to stop cannibalism. Multivitamin in box water.',
      status: 'under_treatment',
      recoveredCount: 0,
      mortalityCount: 0,
      notes: 'Healing well, separated in isolation box until scab is dry and purple.',
    },
  ];

  // Mortality records
  const mortalities: MortalityRecord[] = [
    {
      id: 'mort-001',
      batchId: batch1Id,
      date: new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      quantity: 3,
      reason: 'First week chick mortality (natural weak day-old chicks)',
      disposalMethod: 'Buried',
      notes: 'Deep pit burial with lime powder.',
    },
    {
      id: 'mort-002',
      batchId: batch1Id,
      date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      quantity: 1,
      reason: 'Severe sudden heat stroke during hot afternoon spike',
      disposalMethod: 'Buried',
      notes: 'Added extra electrolytes and ceiling ventilation.',
    },
  ];

  return { batches, sales, homeConsumption, infections, mortalities };
}
