import React, { useState } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  X, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle, 
  Code, 
  Layers,
  ArrowDown
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { storageService } from '../services/storageService';

interface SupabaseSyncModalProps {
  language: Language;
  onClose: () => void;
  onDataReset: () => void;
}

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({
  language,
  onClose,
  onDataReset
}) => {
  const t = translations[language];
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'sql' | 'json' | 'architecture'>('sql');
  const [importText, setImportText] = useState('');
  const [importSuccess, setImportSuccess] = useState<boolean | null>(null);

  const ddlSql = storageService.getSupabaseDdl();
  const currentJson = storageService.exportJson();

  const handleCopySql = () => {
    navigator.clipboard.writeText(ddlSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([currentJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wasla_diaspora_db_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const ok = storageService.importJson(importText);
    setImportSuccess(ok);
    if (ok) {
      setTimeout(() => {
        onDataReset();
        onClose();
      }, 800);
    }
  };

  const handleReset = () => {
    if (confirm(language === 'ar' ? 'هل تريد استعادة البيانات النموذجية الافتراضية؟' : 'Reset all data to default demo state?')) {
      storageService.resetToDefaults();
      onDataReset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-[#e8ded1] shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#065f46] to-[#047857] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-[#10b981]" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {t.supabaseTitle}
              </h3>
              <p className="text-xs text-white/80">
                {t.supabaseSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-2 border-b border-[#e8ded1] bg-[#faf8f5] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'sql'
                ? 'bg-[#065f46] text-white'
                : 'text-[#4a3c2c] hover:bg-[#e8ded1]'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>PostgreSQL / Supabase DDL</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'architecture'
                ? 'bg-[#065f46] text-white'
                : 'text-[#4a3c2c] hover:bg-[#e8ded1]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Schema Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'json'
                ? 'bg-[#065f46] text-white'
                : 'text-[#4a3c2c] hover:bg-[#e8ded1]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>LocalStorage Sync / JSON</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: SQL DDL */}
          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8c7355] font-medium">
                  {language === 'ar' ? 'انسخ هذا المخطط والصقه مباشرة في محرّر SQL في Supabase:' : 'Copy and run this migration in your Supabase SQL Editor:'}
                </span>
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 rounded-lg bg-[#065f46] hover:bg-[#047857] text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? t.sqlCopied : t.copySqlBtn}</span>
                </button>
              </div>

              <div className="bg-[#1c2e24] text-[#d6c6b2] p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-[380px] leading-relaxed border border-[#065f46]/30">
                <pre>{ddlSql}</pre>
              </div>
            </div>
          )}

          {/* TAB 2: Architecture */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <h4 className="font-bold text-[#065f46] text-xs mb-1">
                  1:1 Type Mapping (TypeScript Repository ⇄ Supabase Tables)
                </h4>
                <p className="text-[11px] text-emerald-950 leading-relaxed">
                  The client-side persistence is decoupled through typed Repository interfaces (`src/types.ts` & `src/services/storageService.ts`). Connecting to live Supabase merely requires swapping `storageService` calls with `@supabase/supabase-js` client queries.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8ded1] space-y-1.5">
                  <span className="font-bold text-[#065f46] block text-xs">public.profiles</span>
                  <p className="text-[11px] text-[#8c7355]">
                    Stores diaspora user passport/ID verification, Bankak account details, verified trips count, and dynamic trust scores.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8ded1] space-y-1.5">
                  <span className="font-bold text-[#065f46] block text-xs">public.trips</span>
                  <p className="text-[11px] text-[#8c7355]">
                    Stores traveler schedules (Cairo/Gulf to Port Sudan), available luggage kg, price per kg, and meeting spots.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8ded1] space-y-1.5">
                  <span className="font-bold text-[#065f46] block text-xs">public.shipments</span>
                  <p className="text-[11px] text-[#8c7355]">
                    Stores individual parcel bookings, item categories, declared values, Bankak reward fees, and recipient info.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8ded1] space-y-1.5">
                  <span className="font-bold text-[#065f46] block text-xs">public.shipment_audit_steps</span>
                  <p className="text-[11px] text-[#8c7355]">
                    JSONB stores for the 5-Step In-Person Audit Trail (meeting security codes, unsealed inspection photos, Bankak reference IDs, and digital touch signatures).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: JSON Inspector & Import/Export */}
          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1c2e24]">
                  {t.localDataStatus}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadJson}
                    className="px-3 py-1.5 rounded-lg bg-[#faf8f5] border border-[#e8ded1] hover:bg-[#e8ded1] font-semibold text-xs text-[#065f46] flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 font-semibold text-xs flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Demo Data</span>
                  </button>
                </div>
              </div>

              {/* Paste JSON import */}
              <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8ded1] space-y-2">
                <label className="block font-bold text-xs text-[#1c2e24]">
                  {language === 'ar' ? 'استيراد نسخة بيانات احتياطية (JSON)' : 'Import Database Snapshot (JSON)'}
                </label>
                <textarea
                  rows={4}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste JSON exported data here..."
                  className="w-full p-2.5 rounded-lg border border-[#e8ded1] bg-white font-mono text-[11px]"
                />
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleImport}
                    disabled={!importText.trim()}
                    className="px-3 py-1.5 rounded-lg bg-[#065f46] text-white font-bold text-xs disabled:opacity-50"
                  >
                    Load into LocalStorage
                  </button>
                  {importSuccess === true && (
                    <span className="text-xs text-[#065f46] font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Imported successfully!
                    </span>
                  )}
                  {importSuccess === false && (
                    <span className="text-xs text-red-600 font-bold">
                      Invalid JSON structure.
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#faf8f5] border-t border-[#e8ded1] flex items-center justify-between">
          <span className="text-[11px] text-[#8c7355]">
            Wasla Diaspora DB • LocalStorage + Supabase Architecture
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#065f46] text-white font-bold text-xs hover:bg-[#047857]"
          >
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
