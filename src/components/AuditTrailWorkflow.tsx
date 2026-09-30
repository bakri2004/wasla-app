import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Camera, 
  Upload, 
  Copy, 
  Check, 
  ArrowRight, 
  AlertCircle, 
  UserCheck, 
  Scale, 
  Lock, 
  PenTool, 
  RotateCcw,
  ChevronRight,
  Info
} from 'lucide-react';
import { ShipmentBooking, Language, UserRole, InspectionPhoto } from '../types';
import { translations } from '../i18n/translations';
import { sampleAuditPhotos, sampleBankakReceiptUrl } from '../data/mockData';
import { getCategoryLabel } from '../utils/labels';
import { CurrencyDisplay } from './CurrencyDisplay';

interface AuditTrailWorkflowProps {
  shipment: ShipmentBooking;
  language: Language;
  activeRole: UserRole;
  onUpdateShipment: (updated: ShipmentBooking) => void;
  onClose?: () => void;
}

export const AuditTrailWorkflow: React.FC<AuditTrailWorkflowProps> = ({
  shipment,
  language,
  activeRole,
  onUpdateShipment,
  onClose
}) => {
  const t = translations[language];
  const [selectedStep, setSelectedStep] = useState<number>(shipment.current_step);
  const [copiedBankak, setCopiedBankak] = useState(false);
  const [copiedMeetingCode, setCopiedMeetingCode] = useState(false);
  
  // Step 2 state
  const [senderMeetingChecked, setSenderMeetingChecked] = useState(
    shipment.steps[1]?.meeting_details?.sender_confirmed || false
  );
  const [travelerMeetingChecked, setTravelerMeetingChecked] = useState(
    shipment.steps[1]?.meeting_details?.traveler_confirmed || false
  );

  // Step 3 state (Inspection)
  const [inspectionChecklist, setInspectionChecklist] = useState(
    shipment.steps[2]?.inspection_details?.checklist || {
      open_unsealed_box: true,
      no_prohibited_substances: true,
      valid_medical_prescription: true,
      scale_verified_weight_kg: shipment.weight_kg,
      traveler_liability_acknowledged: true,
      inspection_location: 'Cairo - Dokki In-Person Meeting'
    }
  );
  const [inspectionPhotos, setInspectionPhotos] = useState<InspectionPhoto[]>(
    shipment.steps[2]?.inspection_details?.photos || []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 4 state (Bankak)
  const [bankakRefId, setBankakRefId] = useState(
    shipment.steps[3]?.bankak_details?.transaction_ref_id || ''
  );
  const [bankakReceiptUrl, setBankakReceiptUrl] = useState(
    shipment.steps[3]?.bankak_details?.screenshot_url || ''
  );
  const [senderConfirmedBankak, setSenderConfirmedBankak] = useState(
    shipment.steps[3]?.bankak_details?.sender_confirmed || false
  );
  const [travelerVerifiedBankak, setTravelerVerifiedBankak] = useState(
    shipment.steps[3]?.bankak_details?.traveler_verified || false
  );

  // Step 5 state (Handoff & Signature)
  const [enteredDeliveryPin, setEnteredDeliveryPin] = useState(
    shipment.steps[4]?.handoff_details?.entered_delivery_pin || ''
  );
  const [pinError, setPinError] = useState(false);
  const [isSigned, setIsSigned] = useState(
    !!shipment.steps[4]?.handoff_details?.digital_signature
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Keep selected step in sync if shipment changes
  useEffect(() => {
    setSelectedStep(shipment.current_step);
  }, [shipment.current_step]);

  // Setup signature canvas
  useEffect(() => {
    if (selectedStep === 5 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0F766E';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        if (shipment.steps[4]?.handoff_details?.digital_signature) {
          const img = new Image();
          img.onload = () => ctx.drawImage(img, 0, 0);
          img.src = shipment.steps[4].handoff_details.digital_signature;
        }
      }
    }
  }, [selectedStep, shipment.steps]);

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    setIsSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsSigned(false);
  };

  // --- Step 2 Action: Confirm Meeting ---
  const handleConfirmMeeting = () => {
    const updated = { ...shipment };
    const step2 = updated.steps[1];
    step2.status = 'completed';
    step2.completed_at = new Date().toISOString();
    step2.completed_by = activeRole;
    step2.meeting_details = {
      scheduled_time: 'Today 14:00 EET',
      meeting_address: 'Dokki Metro Station Exit 2 (Near Cultural House)',
      meeting_city: 'Cairo',
      sender_confirmed: true,
      traveler_confirmed: true,
      security_code: shipment.meeting_code
    };
    
    if (updated.current_step < 3) {
      updated.current_step = 3;
      updated.status = 'meeting_confirmed';
      updated.steps[2].status = 'in_progress';
    }
    
    onUpdateShipment(updated);
    setSelectedStep(3);
  };

  // --- Step 3 Action: Inspection Approval ---
  const handleApproveInspection = () => {
    const updated = { ...shipment };
    const step3 = updated.steps[2];
    step3.status = 'completed';
    step3.completed_at = new Date().toISOString();
    step3.completed_by = 'user-traveler-1';
    step3.inspection_details = {
      checklist: inspectionChecklist,
      photos: inspectionPhotos.length > 0 ? inspectionPhotos : sampleAuditPhotos
    };

    if (updated.current_step < 4) {
      updated.current_step = 4;
      updated.status = 'package_inspected';
      updated.steps[3].status = 'in_progress';
      if (!updated.steps[3].bankak_details) {
        updated.steps[3].bankak_details = {
          bank_name: language === 'ar' ? 'بنك الخرطوم (بنكك)' : 'Bank of Khartoum (Bankak)',
          traveler_account_number: shipment.trip?.traveler?.bankak_account_number || '2948192',
          traveler_account_name: language === 'ar' ? (shipment.trip?.traveler?.full_name_ar || 'محمد الأمين عثمان') : (shipment.trip?.traveler?.bankak_account_name || 'MOHAMED AL-AMIN OSMAN'),
          amount: shipment.total_fee,
          currency: shipment.currency,
          transaction_ref_id: '',
          sender_confirmed: false,
          traveler_verified: false
        };
      }
    }

    onUpdateShipment(updated);
    setSelectedStep(4);
  };

  const handleAddSamplePhotos = () => {
    setInspectionPhotos(sampleAuditPhotos);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const newPhoto: InspectionPhoto = {
          id: `photo-${Date.now()}`,
          url: reader.result,
          caption: `Inspection upload (${file.name})`,
          category: 'contents',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setInspectionPhotos(prev => [...prev, newPhoto]);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- Step 4 Action: Bankak Transfer Submission & Traveler Verification ---
  const handleSubmitBankakSlip = () => {
    const updated = { ...shipment };
    const step4 = updated.steps[3];
    const ref = bankakRefId.trim() || `BOK-${Date.now().toString().slice(-6)}`;
    const url = bankakReceiptUrl || sampleBankakReceiptUrl;
    
    setBankakRefId(ref);
    setBankakReceiptUrl(url);
    setSenderConfirmedBankak(true);

    if (step4.bankak_details) {
      step4.bankak_details.transaction_ref_id = ref;
      step4.bankak_details.screenshot_url = url;
      step4.bankak_details.sender_confirmed = true;
      step4.bankak_details.submitted_at = new Date().toISOString();
    }
    
    onUpdateShipment(updated);
  };

  const handleTravelerVerifyBankak = () => {
    const updated = { ...shipment };
    const step4 = updated.steps[3];
    step4.status = 'completed';
    step4.completed_at = new Date().toISOString();
    step4.completed_by = 'user-traveler-1';
    
    if (step4.bankak_details) {
      step4.bankak_details.traveler_verified = true;
      step4.bankak_details.verified_at = new Date().toISOString();
    }

    if (updated.current_step < 5) {
      updated.current_step = 5;
      updated.status = 'in_transit';
      updated.steps[4].status = 'in_progress';
    }

    setTravelerVerifiedBankak(true);
    onUpdateShipment(updated);
    setSelectedStep(5);
  };

  // --- Step 5 Action: Recipient Hand-off & Digital Sign-off ---
  const handleFinalizeDelivery = () => {
    if (enteredDeliveryPin !== shipment.delivery_pin && enteredDeliveryPin !== '8319') {
      setPinError(true);
      return;
    }
    setPinError(false);

    let sigData = '';
    if (canvasRef.current) {
      sigData = canvasRef.current.toDataURL('image/png');
    }

    const updated = { ...shipment };
    const step5 = updated.steps[4];
    step5.status = 'completed';
    step5.completed_at = new Date().toISOString();
    step5.completed_by = 'user-recipient-1';
    step5.handoff_details = {
      recipient_name: shipment.recipient_name,
      recipient_phone: shipment.recipient_phone,
      recipient_id_type: 'National ID',
      recipient_id_last4: '4819',
      handover_city: 'Port Sudan',
      handover_address: 'Al-Matar Neighborhood, Near Port Sudan Customs House',
      entered_delivery_pin: enteredDeliveryPin,
      correct_delivery_pin: shipment.delivery_pin,
      digital_signature: sigData,
      signed_off: true,
      delivered_at: new Date().toISOString()
    };

    updated.status = 'delivered';
    onUpdateShipment(updated);
  };

  const copyToClipboard = (text: string, type: 'bankak' | 'meeting') => {
    navigator.clipboard.writeText(text);
    if (type === 'bankak') {
      setCopiedBankak(true);
      setTimeout(() => setCopiedBankak(false), 2000);
    } else {
      setCopiedMeetingCode(true);
      setTimeout(() => setCopiedMeetingCode(false), 2000);
    }
  };

  const stepShortLabelsAr = [
    'الخطوة 1: الاتفاق',
    'الخطوة 2: المقابلة',
    'الخطوة 3: المعاينة',
    'الخطوة 4: سداد بنكك',
    'الخطوة 5: التسليم'
  ];
  const stepShortLabelsEn = [
    'Step 1: Match',
    'Step 2: Meeting',
    'Step 3: Inspection',
    'Step 4: Bankak Slip',
    'Step 5: Sign-off'
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Flat Header with Tracking & Route */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <bdi dir="ltr" className="px-2 py-0.5 rounded bg-slate-800 text-slate-100 text-xs font-mono font-semibold">
              {shipment.tracking_number}
            </bdi>
            <span className="text-xs text-emerald-400 font-semibold">
              {shipment.status === 'delivered' 
                ? (language === 'ar' ? 'تم التسليم بنجاح' : 'Delivered & Signed')
                : (language === 'ar' ? 'مسار التدقيق النشط' : 'Active Audit Trail')}
            </span>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-xs px-3 py-1 rounded border border-slate-700 hover:bg-slate-800 transition-colors text-slate-300"
            >
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-xs text-slate-400 font-medium">
              {t.route}
            </div>
            <div className="text-base font-bold flex items-center gap-1.5 mt-0.5">
              <span className="flex items-center gap-1">
                <span className="text-xs font-normal text-slate-400">{language === 'ar' ? 'من' : 'From'}</span>
                <span>{language === 'ar' ? shipment.trip?.origin_city_ar : shipment.trip?.origin_city}</span>
              </span>
              <span className="text-slate-400 text-sm font-normal">{language === 'ar' ? '⟵' : '→'}</span>
              <span className="flex items-center gap-1">
                <span className="text-xs font-normal text-slate-400">{language === 'ar' ? 'إلى' : 'To'}</span>
                <span>{language === 'ar' ? shipment.trip?.destination_city_ar : shipment.trip?.destination_city}</span>
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium">
              {t.itemCategory} & {t.weight}
            </div>
            <div className="text-sm font-bold mt-0.5 line-clamp-1">
              {language === 'ar' ? (shipment.item_title_ar || shipment.item_title) : shipment.item_title}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-300">
              <span className="font-semibold text-white">
                {shipment.weight_kg} {language === 'ar' ? 'كجم' : 'kg'}
              </span>
              <span>·</span>
              <span>
                {getCategoryLabel(shipment.category, language, 'short')}
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium mb-0.5">
              {t.rewardFee} {language === 'ar' ? '(بنكك)' : '(Bankak)'}
            </div>
            <div className="mt-0.5">
              <bdi dir="ltr" className="text-white font-mono font-bold text-base">
                {shipment.total_fee.toLocaleString()} {language === 'ar' ? (shipment.currency === 'SDG' ? 'ج.س' : shipment.currency === 'SAR' ? 'ر.س' : shipment.currency === 'EGP' ? 'ج.م' : shipment.currency) : shipment.currency}
              </bdi>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Step Clean Stepper Bar */}
      <div className="bg-slate-50 p-2 sm:p-3 border-b border-slate-200 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[560px] gap-1.5">
          {shipment.steps.map((step) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.step_number === shipment.current_step;
            const isSelected = step.step_number === selectedStep;

            return (
              <button
                key={step.step_number}
                onClick={() => setSelectedStep(step.step_number)}
                className={`flex-1 flex flex-col items-center text-center p-2 rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-white border border-slate-200 text-slate-900'
                    : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted
                        ? 'bg-[#0F766E] text-white'
                        : isCurrent
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.step_number}
                  </div>
                </div>
                <span className={`text-xs font-medium line-clamp-1 ${
                  isSelected ? 'text-slate-900 font-bold' : 'text-slate-600'
                }`}>
                  {language === 'ar' ? stepShortLabelsAr[step.step_number - 1] : stepShortLabelsEn[step.step_number - 1]}
                </span>
                <span className="text-[10px] text-slate-400">
                  {isCompleted ? (language === 'ar' ? 'مكتمل' : 'Done') : isCurrent ? (language === 'ar' ? 'حالي' : 'Active') : (language === 'ar' ? 'معلق' : 'Pending')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Step Detail Panel */}
      <div className="p-5 sm:p-6">
        {/* STEP 1: Match & Booking Request */}
        {selectedStep === 1 && (
          <div className="space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.step1Desc}
                </p>
              </div>
              <span className="text-xs text-[#0F766E] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t.stepCompletedBadge}
              </span>
            </div>

            {/* Parties Summary (Clean single-level cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Traveler Card */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-semibold text-slate-500">
                    {t.travelerLabel}
                  </span>
                  <span className="text-xs font-medium text-[#0F766E] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t.passportVerified}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={shipment.trip?.traveler?.avatar_url}
                    alt="Traveler"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {language === 'ar' ? shipment.trip?.traveler?.full_name_ar : shipment.trip?.traveler?.full_name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {shipment.trip?.traveler?.city} · {shipment.trip?.traveler?.verified_trips_count || 14} {language === 'ar' ? 'شحنة مكتملة' : 'completed shipments'}
                    </p>
                    <p className="text-xs text-slate-700 font-medium mt-0.5">
                      <span>{language === 'ar' ? 'بنكك: ' : 'Bankak: '}</span>
                      <bdi dir="ltr" className="font-mono font-bold text-slate-900">{shipment.trip?.traveler?.bankak_account_number}</bdi>
                    </p>
                  </div>
                </div>
              </div>

              {/* Sender Card */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-semibold text-slate-500">
                    {t.senderLabel}
                  </span>
                  <span className="text-xs font-medium text-[#0F766E] flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    {t.diasporaVouched}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={shipment.sender?.avatar_url}
                    alt="Sender"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {language === 'ar' ? shipment.sender?.full_name_ar : shipment.sender?.full_name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {shipment.sender?.city} · <bdi dir="ltr" className="font-mono">{shipment.sender?.phone}</bdi>
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {language === 'ar' ? 'المستلم: ' : 'Recipient: '} 
                      <span className="font-semibold text-slate-900">{shipment.recipient_name}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipment details list */}
            <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">{t.itemCategory}</span>
                <span className="font-semibold text-slate-900">
                  {getCategoryLabel(shipment.category, language, 'full')}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">{t.weight}</span>
                <span className="font-bold text-slate-900">
                  {shipment.weight_kg} {language === 'ar' ? 'كجم' : 'kg'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">{t.declaredValue}</span>
                <CurrencyDisplay
                  amount={shipment.declared_value}
                  currency={shipment.currency}
                  language={language}
                  size="sm"
                />
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">{t.rewardFee}</span>
                <CurrencyDisplay
                  amount={shipment.total_fee}
                  currency={shipment.currency}
                  language={language}
                  size="md"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-200 pt-3 mt-4 flex justify-end z-10">
              <button
                onClick={() => setSelectedStep(2)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-none"
              >
                <span>{language === 'ar' ? 'المتابعة للخطوة 2 (المقابلة)' : 'Proceed to Step 2 (Meeting)'}</span>
                <ChevronRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Physical Meeting Confirmation */}
        {selectedStep === 2 && (
          <div className="space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.step2Desc}
                </p>
              </div>
              <span className="text-xs font-semibold flex items-center gap-1 text-slate-700">
                {shipment.steps[1].status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" /> : <Clock className="w-3.5 h-3.5 text-slate-500" />}
                {shipment.steps[1].status === 'completed' ? t.stepCompletedBadge : t.statusInProgress}
              </span>
            </div>

            {/* Meeting Location & Handshake Code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-600" />
                  <span>{t.meetingLocation}</span>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {shipment.steps[1]?.meeting_details?.meeting_address || shipment.trip?.meeting_location_notes}
                </p>
                <div className="text-xs text-slate-500">
                  <span>{t.scheduledTime}: <strong className="text-slate-900 font-semibold">{language === 'ar' ? 'اليوم 14:00 بتوقيت القاهرة' : (shipment.steps[1]?.meeting_details?.scheduled_time || 'Today 14:00 EET')}</strong></span>
                </div>
                <div className="p-3 bg-white rounded border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                  <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>{t.securityPinHelp}</span>
                </div>
              </div>

              {/* 4-Digit Handshake PIN */}
              <div className="p-4 rounded-lg bg-slate-900 text-white flex flex-col justify-center items-center text-center">
                <div className="text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.securityPin}</span>
                </div>
                <bdi dir="ltr" className="text-2xl font-bold tracking-widest my-1 font-mono text-white block">
                  {shipment.meeting_code}
                </bdi>
                <button
                  onClick={() => copyToClipboard(shipment.meeting_code, 'meeting')}
                  className="mt-1 text-xs px-2.5 py-1 rounded border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium flex items-center gap-1 transition-colors"
                >
                  {copiedMeetingCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedMeetingCode ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ الرمز' : 'Copy Code')}</span>
                </button>
              </div>
            </div>

            {/* In-person Verification Checkbox Controls */}
            <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-500">
                {language === 'ar' ? 'تأكيد الحضور المتبادل' : 'Mutual In-Person Confirmation'}
              </h4>

              <div className="space-y-2">
                <label className="flex items-center gap-2.5 p-2.5 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={senderMeetingChecked}
                    onChange={(e) => setSenderMeetingChecked(e.target.checked)}
                    className="w-4 h-4 text-[#0F766E] rounded"
                  />
                  <span className="text-xs text-slate-900">
                    {t.senderConfirmedMeeting} ({language === 'ar' ? 'سارة بابكر - الدقي، القاهرة' : 'Sara Babiker - Cairo Dokki'})
                  </span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={travelerMeetingChecked}
                    onChange={(e) => setTravelerMeetingChecked(e.target.checked)}
                    className="w-4 h-4 text-[#0F766E] rounded"
                  />
                  <span className="text-xs text-slate-900">
                    {t.travelerConfirmedMeeting} ({language === 'ar' ? 'محمد الأمين - الدقي، القاهرة' : 'Mohamed Al-Amin - Cairo Dokki'})
                  </span>
                </label>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-slate-200 pt-3 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
                <button
                  type="button"
                  onClick={() => {
                    setSenderMeetingChecked(true);
                    setTravelerMeetingChecked(true);
                  }}
                  className="text-xs text-teal-700 hover:underline font-semibold"
                >
                  {language === 'ar' ? 'تحديد الطرفين حاضرين تلقائياً' : 'Auto-mark both parties present'}
                </button>

                <button
                  onClick={handleConfirmMeeting}
                  disabled={!senderMeetingChecked || !travelerMeetingChecked}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-none ${
                    senderMeetingChecked && travelerMeetingChecked
                      ? 'bg-teal-700 hover:bg-teal-800 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.confirmMeetingBtn}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Open Package Inspection & Photo Audit Upload */}
        {selectedStep === 3 && (
          <div className="space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.step3Desc}
                </p>
              </div>
              <span className="text-xs font-semibold flex items-center gap-1 text-slate-700">
                {shipment.steps[2].status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" /> : <Clock className="w-3.5 h-3.5 text-slate-500" />}
                {shipment.steps[2].status === 'completed' ? t.stepCompletedBadge : t.statusInProgress}
              </span>
            </div>

            {/* Trust Notice on Baggage Laws */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <h4 className="font-bold text-slate-900">
                {t.inspectionHeader}
              </h4>
              <p className="leading-relaxed text-slate-600">
                {t.inspectionNotice}
              </p>
            </div>

            {/* Mandatory Inspection Checklist */}
            <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-500">
                {language === 'ar' ? 'قائمة التحقق الأمني والإجرائي' : 'Security & Customs Checklist'}
              </h4>

              <div className="space-y-2">
                <label className="flex items-start gap-2.5 text-xs text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inspectionChecklist.open_unsealed_box}
                    onChange={(e) => setInspectionChecklist(prev => ({ ...prev, open_unsealed_box: e.target.checked }))}
                    className="w-4 h-4 text-[#0F766E] rounded mt-0.5"
                  />
                  <span>{t.checklistOpen}</span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inspectionChecklist.no_prohibited_substances}
                    onChange={(e) => setInspectionChecklist(prev => ({ ...prev, no_prohibited_substances: e.target.checked }))}
                    className="w-4 h-4 text-[#0F766E] rounded mt-0.5"
                  />
                  <span>{t.checklistNoContraband}</span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inspectionChecklist.valid_medical_prescription}
                    onChange={(e) => setInspectionChecklist(prev => ({ ...prev, valid_medical_prescription: e.target.checked }))}
                    className="w-4 h-4 text-[#0F766E] rounded mt-0.5"
                  />
                  <span>{t.checklistPrescription}</span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inspectionChecklist.traveler_liability_acknowledged}
                    onChange={(e) => setInspectionChecklist(prev => ({ ...prev, traveler_liability_acknowledged: e.target.checked }))}
                    className="w-4 h-4 text-[#0F766E] rounded mt-0.5"
                  />
                  <span>{t.checklistLiability}</span>
                </label>
              </div>

              {/* Verified Scale Weight */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Scale className="w-4 h-4 text-slate-600" />
                  <span className="font-semibold">{t.checklistWeightVerified}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="50"
                    value={inspectionChecklist.scale_verified_weight_kg}
                    onChange={(e) => setInspectionChecklist(prev => ({ ...prev, scale_verified_weight_kg: parseFloat(e.target.value) || 0 }))}
                    className="w-20 px-2.5 py-1 text-xs font-bold text-center border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-[#0F766E]"
                  />
                  <span className="font-bold text-slate-900">kg</span>
                </div>
              </div>
            </div>

            {/* Photo Audit Gallery & Uploader */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Camera className="w-4 h-4 text-slate-600" />
                  <span>{t.auditPhotos} ({inspectionPhotos.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddSamplePhotos}
                    className="px-2.5 py-1 text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded transition-colors"
                  >
                    <span>{t.useSamplePhotosBtn}</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 text-xs font-semibold bg-[#0F766E] hover:bg-[#0d655e] text-white rounded transition-colors flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{t.uploadPhotoBtn}</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Photo Thumbnails */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {inspectionPhotos.length === 0 ? (
                  <div className="col-span-3 py-6 text-center border border-dashed border-slate-300 rounded-lg text-xs text-slate-500">
                    {language === 'ar' ? 'لا توجد صور تدقيق حتى الآن.' : 'No inspection photos recorded yet.'}
                  </div>
                ) : (
                  inspectionPhotos.map((p, idx) => (
                    <div key={p.id || idx} className="rounded-lg overflow-hidden border border-slate-200 bg-white">
                      <div className="h-28 w-full overflow-hidden">
                        <img
                          src={p.url}
                          alt={p.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2 text-xs">
                        <p className="text-slate-900 font-medium line-clamp-1">
                          {p.caption}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          {p.timestamp}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Approval Action in solid border-t footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 pt-3 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
              <button
                type="button"
                onClick={() => setSelectedStep(2)}
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                {language === 'ar' ? 'الرجوع للخطوة السابقة' : 'Back to Step 2'}
              </button>

              <button
                type="button"
                onClick={handleApproveInspection}
                disabled={
                  !inspectionChecklist.open_unsealed_box ||
                  !inspectionChecklist.no_prohibited_substances ||
                  !inspectionChecklist.valid_medical_prescription ||
                  !inspectionChecklist.traveler_liability_acknowledged ||
                  inspectionPhotos.length === 0
                }
                className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-none ${
                  inspectionChecklist.open_unsealed_box &&
                  inspectionChecklist.no_prohibited_substances &&
                  inspectionChecklist.valid_medical_prescription &&
                  inspectionPhotos.length > 0
                    ? 'bg-teal-700 hover:bg-teal-800 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.confirmInspectionBtn}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Bankak Direct Transfer & Screenshot Upload */}
        {selectedStep === 4 && (
          <div className="space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.step4Desc}
                </p>
              </div>
              <span className="text-xs font-semibold flex items-center gap-1 text-slate-700">
                {shipment.steps[3].status === 'completed' || travelerVerifiedBankak ? <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" /> : <Clock className="w-3.5 h-3.5 text-slate-500" />}
                {shipment.steps[3].status === 'completed' || travelerVerifiedBankak ? t.fundsConfirmedBadge : t.statusInProgress}
              </span>
            </div>

            {/* Bankak Notice */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-slate-900 block">{t.bankakHeader}</span>
              <p className="leading-relaxed text-slate-600">{t.bankakNotice}</p>
            </div>

            {/* Traveler's Verified Bankak Account Details (Clean flat box localized into Arabic) */}
            <div className="p-4 rounded-lg bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    {language === 'ar' ? 'بنك الخرطوم (تطبيق بنكك)' : 'Bank of Khartoum (Bankak)'}
                  </h4>
                  <p className="text-xs text-emerald-400">
                    {language === 'ar' ? 'حساب مصرفي موثق ومطابق للاسم' : 'Direct Account Verification Enabled'}
                  </p>
                </div>
                <div className="text-start sm:text-end">
                  <span className="text-[10px] text-slate-400 block font-medium">{t.transferAmount}</span>
                  <bdi dir="ltr" className="font-mono font-bold text-white text-sm">
                    {shipment.total_fee.toLocaleString()} {language === 'ar' ? (shipment.currency === 'SDG' ? 'ج.س' : shipment.currency === 'SAR' ? 'ر.س' : shipment.currency === 'EGP' ? 'ج.م' : shipment.currency) : shipment.currency}
                  </bdi>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">{t.bankakAccountName}</span>
                  <p className="font-bold text-white">
                    {language === 'ar'
                      ? (shipment.trip?.traveler?.full_name_ar || 'محمد الأمين عثمان')
                      : (shipment.trip?.traveler?.bankak_account_name || 'MOHAMED AL-AMIN OSMAN')}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">{t.bankakAccountNumber}</span>
                  <div className="flex items-center gap-2">
                    <bdi dir="ltr" className="font-mono text-base font-bold text-white">
                      {shipment.trip?.traveler?.bankak_account_number || '2948192'}
                    </bdi>
                    <button
                      onClick={() => copyToClipboard(shipment.trip?.traveler?.bankak_account_number || '2948192', 'bankak')}
                      className="px-2 py-0.5 rounded border border-slate-700 hover:bg-slate-800 text-[11px] font-medium flex items-center gap-1 text-slate-300 transition-colors"
                    >
                      {copiedBankak ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedBankak ? (language === 'ar' ? 'تم النسخ' : 'Done') : (language === 'ar' ? 'نسخ الحساب' : 'Copy')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sender Submission: Reference ID & Screenshot */}
            <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">
                  {language === 'ar' ? 'إثبات تحويل بنكك (إشعار الدفع)' : 'Bankak Proof of Payment'}
                </h4>
                {/* Secondary helper button styled as clean outline/ghost button */}
                <button
                  type="button"
                  onClick={() => {
                    setBankakRefId('BOK-2026-847291');
                    setBankakReceiptUrl(sampleBankakReceiptUrl);
                  }}
                  className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                >
                  {language === 'ar' ? 'إدراج إشعار نموذجي' : t.useSampleReceiptBtn}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-900 mb-1">
                    {t.enterRefId}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={bankakRefId}
                    onChange={(e) => setBankakRefId(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: 20260909-847291' : t.refIdPlaceholder}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded text-start focus:outline-none focus:border-teal-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-900 mb-1">
                    {t.uploadReceipt}
                  </label>
                  {bankakReceiptUrl ? (
                    <div className="flex items-center gap-2.5 p-2 border border-slate-200 rounded bg-slate-50">
                      <img
                        src={bankakReceiptUrl}
                        alt="Bankak Slip"
                        className="w-10 h-10 object-cover rounded border border-slate-300"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-slate-900 block">
                          {language === 'ar' ? 'إشعار_معتمد_بنكك.jpg' : 'Receipt_Verified.jpg'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {language === 'ar' ? 'الرقم المرجعي: ' : 'Ref: '}
                          <bdi dir="ltr">{bankakRefId || (language === 'ar' ? 'قيد الانتظار' : 'Pending')}</bdi>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => setBankakReceiptUrl(sampleBankakReceiptUrl)}
                      className="p-3 border border-dashed border-slate-300 rounded text-center cursor-pointer hover:bg-slate-50 text-xs text-slate-500"
                    >
                      <Upload className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                      <span>{language === 'ar' ? 'اضغط لرفع الإشعار' : 'Click to upload screenshot'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Primary solid action button in solid footer container */}
              {!senderConfirmedBankak && (
                <div className="pt-2">
                  <button
                    onClick={handleSubmitBankakSlip}
                    className="w-full py-2.5 px-4 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-none"
                  >
                    <Upload className="w-3.5 h-3.5 text-white" />
                    <span>{language === 'ar' ? 'إرسال الإشعار للتحقق' : t.submitPaymentSenderBtn}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Traveler Verification */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {language === 'ar' ? 'خطوة التحقق من الرصيد (للمسافر)' : 'Traveler Balance Verification'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'ar' ? 'يتحقق المسافر من وصول الإشعار في حسابه ببنك الخرطوم.' : 'Traveler verifies incoming funds in their official Bankak app.'}
                  </p>
                </div>
                {travelerVerifiedBankak && (
                  <span className="text-xs text-[#0F766E] font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {language === 'ar' ? 'مؤكد' : 'Confirmed'}
                  </span>
                )}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-slate-200 pt-3 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
                <button
                  type="button"
                  onClick={() => setSelectedStep(3)}
                  className="text-xs text-slate-500 hover:text-slate-900"
                >
                  {language === 'ar' ? 'الرجوع للخطوة السابقة' : 'Back to Step 3'}
                </button>

                <button
                  type="button"
                  onClick={handleTravelerVerifyBankak}
                  disabled={travelerVerifiedBankak}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-none ${
                    !travelerVerifiedBankak
                      ? 'bg-teal-700 hover:bg-teal-800 text-white'
                      : 'bg-slate-200 text-slate-500 cursor-default'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{travelerVerifiedBankak ? t.fundsConfirmedBadge : t.verifyReceiptTravelerBtn}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Recipient Hand-off & Digital Sign-off */}
        {selectedStep === 5 && (
          <div className="space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.step5Title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.step5Desc}
                </p>
              </div>
              <span className="text-xs font-semibold flex items-center gap-1 text-slate-700">
                {shipment.status === 'delivered' ? <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" /> : <Clock className="w-3.5 h-3.5 text-slate-500" />}
                {shipment.status === 'delivered' ? t.deliveredSuccess : t.statusInProgress}
              </span>
            </div>

            {/* Destination Notice */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <h4 className="font-bold text-slate-900">
                {t.handoffHeader}
              </h4>
              <p className="leading-relaxed text-slate-600">
                {t.handoffNotice}
              </p>
            </div>

            {/* Recipient Details & Security PIN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-500 block">
                  {language === 'ar' ? 'بيانات المستلم ببورتسودان' : 'Port Sudan Recipient'}
                </span>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.recipientLabel}:</span>
                    <span className="font-bold text-slate-900">{shipment.recipient_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{language === 'ar' ? 'رقم الهاتف' : 'Phone'}:</span>
                    <bdi dir="ltr" className="font-mono font-bold text-slate-900">{shipment.recipient_phone}</bdi>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{language === 'ar' ? 'الموقع' : 'Location'}:</span>
                    <span className="font-semibold text-slate-900">
                      {language === 'ar' ? 'بورتسودان (حي المطار)' : 'Port Sudan (Al-Matar)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery PIN Input Box */}
              <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    {t.deliveryPinLabel}
                  </label>
                  <button
                    onClick={() => setEnteredDeliveryPin(shipment.delivery_pin || '8319')}
                    className="text-xs text-[#0F766E] hover:underline font-semibold"
                  >
                    {language === 'ar' ? 'تعبئة الرمز (8319)' : 'Auto-fill PIN'}
                  </button>
                </div>
                <input
                  type="text"
                  dir="ltr"
                  maxLength={4}
                  value={enteredDeliveryPin}
                  onChange={(e) => setEnteredDeliveryPin(e.target.value)}
                  placeholder="8319"
                  className={`w-full text-center text-xl font-mono font-bold tracking-widest py-1.5 px-3 rounded border text-slate-900 ${
                    pinError ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-[#0F766E]'
                  }`}
                />
                {pinError && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'الرمز السري غير مطابق.' : 'PIN mismatch.'}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Signature Pad */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <PenTool className="w-4 h-4 text-slate-600" />
                  <span>{t.digitalSignatureLabel}</span>
                </div>
                <button
                  onClick={clearCanvas}
                  className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t.clearSignature}</span>
                </button>
              </div>

              <div className="relative rounded border border-slate-200 bg-white overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={130}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-32 cursor-crosshair touch-none"
                />
                {!isSigned && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-400">
                    {language === 'ar' ? 'وقع هنا باللمس أو الفأرة...' : 'Sign here using touch or mouse...'}
                  </div>
                )}
              </div>
            </div>

            {/* Final Sign-off Action in solid border-t footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 pt-3 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
              <button
                type="button"
                onClick={() => setSelectedStep(4)}
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                {language === 'ar' ? 'الرجوع للخطوة السابقة' : 'Back to Step 4'}
              </button>

              <button
                type="button"
                onClick={handleFinalizeDelivery}
                disabled={!enteredDeliveryPin || !isSigned || shipment.status === 'delivered'}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-none ${
                  enteredDeliveryPin && isSigned && shipment.status !== 'delivered'
                    ? 'bg-teal-700 hover:bg-teal-800 text-white'
                    : shipment.status === 'delivered'
                    ? 'bg-slate-200 text-slate-600'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{shipment.status === 'delivered' ? t.deliveredSuccess : t.confirmDeliveryBtn}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
