import React, { useState } from 'react';
import { Utensils, Download, Plus, Calendar, User, Search, Trash2 } from 'lucide-react';
import { HomeConsumptionRecord } from '../types/farm';
import { REQUIRED_PEOPLE } from '../data/defaults';

interface HomeConsumptionLedgerProps {
  records: HomeConsumptionRecord[];
  onOpenAddModal: () => void;
  onDeleteRecord: (id: string) => void;
  onExportCSV: () => void;
}

export const HomeConsumptionLedger: React.FC<HomeConsumptionLedgerProps> = ({
  records,
  onOpenAddModal,
  onDeleteRecord,
  onExportCSV,
}) => {
  const [selectedPersonFilter, setSelectedPersonFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Calculate totals per person
  const personSummary = REQUIRED_PEOPLE.map((person) => {
    const personRecords = records.filter((r) => r.whoTookIt === person);
    const totalCount = personRecords.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
    return {
      person,
      totalCount,
      logCount: personRecords.length,
    };
  });

  // Calculate other persons
  const otherRecords = records.filter((r) => !REQUIRED_PEOPLE.includes(r.whoTookIt));
  const otherTotal = otherRecords.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

  const totalAllConsumed = records.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

  // Filtered records
  const filteredRecords = records.filter((rec) => {
    const matchesPerson = selectedPersonFilter === 'ALL' || rec.whoTookIt === selectedPersonFilter;
    const matchesSearch =
      searchQuery === '' ||
      rec.whoTookIt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.notes && rec.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPerson && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats by Person */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-600" />
              Chickens Eaten at Home by Family & Staff
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of chickens taken by Innocent, Angel, Fridah, Juma, Gwineth, Dada 1, and Dada 2
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportCSV}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Record Taken
            </button>
          </div>
        </div>

        {/* Person Tally Grid */}
        <div className="mt-4">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
            Total Taken by Person:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {/* All Filter Card */}
            <button
              onClick={() => setSelectedPersonFilter('ALL')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                selectedPersonFilter === 'ALL'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider">All Members</div>
              <div className="text-lg font-black font-mono-num mt-0.5">{totalAllConsumed}</div>
              <div className="text-[9px] opacity-80">{records.length} records</div>
            </button>

            {/* Individual required persons */}
            {personSummary.map(({ person, totalCount, logCount }) => (
              <button
                key={person}
                onClick={() => setSelectedPersonFilter(person)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedPersonFilter === person
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-amber-50/50 text-slate-800 border-slate-200'
                }`}
              >
                <div className="text-[11px] font-bold truncate">{person}</div>
                <div className="text-lg font-black font-mono-num mt-0.5 text-amber-900">
                  {totalCount}
                </div>
                <div className="text-[9px] text-slate-500">{logCount} times</div>
              </button>
            ))}

            {otherTotal > 0 && (
              <button
                onClick={() => setSelectedPersonFilter('OTHER')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedPersonFilter === 'OTHER'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="text-[11px] font-bold">Others</div>
                <div className="text-lg font-black font-mono-num mt-0.5">{otherTotal}</div>
                <div className="text-[9px] text-slate-500">{otherRecords.length} times</div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search person, purpose, or notes..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 text-slate-800"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing {filteredRecords.length} of {records.length} records
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center">
            <Utensils className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No home consumption records found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery ? 'Try adjusting your search filter' : 'Click "Record Taken" above to log chickens eaten at home.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Who Took It</th>
                  <th className="py-3 px-4 text-center">Quantity</th>
                  <th className="py-3 px-4">Purpose</th>
                  <th className="py-3 px-4">Notes / Remarks</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono-num text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{record.date}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold">
                        <User className="w-3 h-3 text-amber-700" />
                        {record.whoTookIt}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-full font-black text-amber-800 bg-amber-50 border border-amber-200 font-mono-num text-sm">
                        {record.quantity} {record.quantity === 1 ? 'chicken' : 'chickens'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800 max-w-xs truncate">
                      {record.purpose}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                      {record.notes || '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete record for ${record.quantity} chicken(s) taken by ${record.whoTookIt}?`)) {
                            onDeleteRecord(record.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
