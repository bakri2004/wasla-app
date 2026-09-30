import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Lock, 
  FileText, 
  CreditCard
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface TrustCenterModalProps {
  language: Language;
  onClose: () => void;
}

export const TrustCenterModal: React.FC<TrustCenterModalProps> = ({
  language,
  onClose
}) => {
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Flat Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base">
                {t.navTrustCenter}
              </h3>
              <p className="text-xs text-slate-400">
                {t.auditTrailSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Pillar 1: Why No Card Gateways */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <CreditCard className="w-4 h-4 text-slate-600" />
              <span>
                {language === 'ar' ? 'لماذا لا نستخدم بوابات دفع إلكترونية تقليدية؟' : 'Why No Direct Card Gateways?'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'نظراً للعقوبات المصرفية الدولية السابقة وواقع التحويلات في السودان، فإن بطاقات فيزا وماستركارد الدولية غير عملية لدفع أتعاب المسافر في بورتسودان. تطبيق بنكك (بنك الخرطوم) هو شريان الحياة المالي للشعب السوداني. لذلك نعتمد التحويل المباشر مع التحقق من الرقم المرجعي للإشعار وإشعار المسافر فور استلام الرصيد.'
                : 'Due to international banking realities in Sudan, traditional card processing is impractical for travelers in Port Sudan. The Bank of Khartoum (Bankak) mobile app is the undisputed financial backbone for the Sudanese diaspora. Our platform matches payments directly to Bankak accounts with reference audits.'}
            </p>
          </div>

          {/* Pillar 2: The 5-Step In-Person Audit Trail */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Lock className="w-4 h-4 text-slate-600" />
              <span>{t.auditTrailTitle}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-xs">١. التوافق المسبق (Match)</span>
                <p className="text-slate-600 leading-normal">
                  الاتفاق المسبق على نوع الأغراض، الوزن الأقصى، والقيمة التقديرية قبل أي لقاء.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-xs">٢. رمز المقابلة المشترك (Handshake PIN)</span>
                <p className="text-slate-600 leading-normal">
                  رمز أمان من ٤ أرقام يتحقق منه الطرفان وجهاً لوجه قبل فتح أي أمتعة.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-xs">٣. تفتيش الطرد المفتوح (Open Inspection)</span>
                <p className="text-slate-600 leading-normal">
                  فحص كامل بالعين المجردة بدون أي علب مغلقة، ووزن الأمتعة بميزان رقمي وتوثيق الصور.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-xs">٤. تحويل بنكك (Bankak Direct)</span>
                <p className="text-slate-600 leading-normal">
                  تحويل الأتعاب لحساب المسافر المعتمد، ورفع الإشعار مع الرقم المرجعي للتحقق قبل الإقلاع.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block text-xs">٥. تسليم المستلم والتوقيع الرقمي (Sign-off)</span>
              <p className="text-slate-600 mt-1 leading-normal">
                تسليم الأمانة للمستلم في بورتسودان عبر مطابقة رمز التسليم وتوقيعه على الشاشة، مع رفع نقاط الثقة تلقائياً.
              </p>
            </div>
          </div>

          {/* Pillar 3: Customs & Regulated Items Matrix */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>{t.prohibitedTitle}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Allowed with conditions */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                  <CheckCircle className="w-4 h-4 text-[#0F766E]" />
                  <span>{language === 'ar' ? 'مسموح بشروط دقيقة' : 'Allowed with conditions'}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {t.allowedWithRules}
                </p>
              </div>

              {/* Strictly Banned */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>{language === 'ar' ? 'ممنوع منعاً باتاً' : 'Strictly Banned'}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {t.strictlyBanned}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Wasla Community Trust Protocol · Cairo ⇄ Port Sudan
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0F766E] hover:bg-[#0d655e] text-white font-semibold text-xs transition-colors"
          >
            {language === 'ar' ? 'فهمت وموافق' : 'I Understand'}
          </button>
        </div>
      </div>
    </div>
  );
};
