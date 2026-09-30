import React, { useState } from 'react';
import { 
  X, 
  Package, 
  MessageCircle, 
  Send, 
  Lock, 
  UserCheck, 
  Check, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { Trip, ItemCategory, Language, ShipmentBooking } from '../types';
import { translations } from '../i18n/translations';
import { storageService } from '../services/storageService';
import { CATEGORIES_LIST } from '../utils/labels';
import { CurrencyDisplay } from './CurrencyDisplay';

interface CreateShipmentModalProps {
  trip: Trip;
  language: Language;
  onClose: () => void;
  onCreated: (newShipment: ShipmentBooking) => void;
  initialMode?: 'request' | 'chat';
}

interface ChatMessage {
  id: string;
  sender: 'traveler' | 'user';
  text: string;
  time: string;
}

export const CreateShipmentModal: React.FC<CreateShipmentModalProps> = ({
  trip,
  language,
  onClose,
  onCreated,
  initialMode = 'request'
}) => {
  const t = translations[language];
  const traveler = trip.traveler;

  const [activeView, setActiveView] = useState<'request' | 'chat'>(initialMode);
  const [itemTitle, setItemTitle] = useState(
    language === 'ar' ? 'أدوية أنسولين وشهادة تخرج موثقة' : 'Prescribed Insulin & Attested Diploma'
  );
  const [category, setCategory] = useState<ItemCategory>('medication');
  const [weightKg, setWeightKg] = useState<number>(2.0);
  const [description, setDescription] = useState(
    language === 'ar' ? 'طرد شخصي يحتوي على أدوية ووثائق رسمية مفتوح للمعاينة' : 'Personal items including medication and certificates, unsealed for inspection'
  );

  const totalFee = Math.round(weightKg * trip.price_per_kg);

  // Direct chat preview messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'traveler',
      text: language === 'ar'
        ? `السلام عليكم ورحمة الله، مرحباً بك! رحلتي قريبة ومتجه إلى ${trip.destination_city_ar || 'بورتسودان'}. هل الأمانة جاهزة ومفتوحة للمعاينة الشخصية؟`
        : `Hello! My trip to ${trip.destination_city || 'Port Sudan'} is coming up soon. Is the parcel unsealed and ready for in-person inspection?`,
      time: '10:14 AM'
    },
    {
      id: 'm2',
      sender: 'user',
      text: language === 'ar'
        ? `وعليكم السلام يا ${traveler?.full_name_ar || traveler?.full_name}. نعم، الأمانة جاهزة ومفتوحة بالكامل بوزن ${weightKg} كجم (${itemTitle}).`
        : `Hello ${traveler?.full_name}! Yes, it is fully unsealed and ready, approx ${weightKg} kg (${itemTitle}).`,
      time: '10:16 AM'
    },
    {
      id: 'm3',
      sender: 'traveler',
      text: language === 'ar'
        ? `ممتاز جداً ويسعدني مساعدتك. أين تفضلين نقطة اللقاء في ${trip.origin_city_ar || 'القاهرة'} لتسليم الأمانة وفحصها معاً؟`
        : `Great, glad to help! Where would you prefer our private meeting point in ${trip.origin_city || 'Cairo'} to inspect and hand over the item?`,
      time: '10:18 AM'
    },
    {
      id: 'm4',
      sender: 'user',
      text: language === 'ar'
        ? `يناسبني اللقاء بالقرب من ميدان الدقي غداً بعد صلاة العصر (الساعة 4:30 مساءً). هل هذا الموعد ملائم لك؟`
        : `Dokki Square or near the Metro tomorrow at 4:30 PM would be ideal for me. Does that work for your schedule?`,
      time: '10:20 AM'
    },
    {
      id: 'm5',
      sender: 'traveler',
      text: language === 'ar'
        ? `تمام، الموعد مناسب جداً. سنتقابل هناك ونتأكد من رمز الأمان الخماسي معاً فور الفحص.`
        : `Perfect, that works nicely. We will meet there and verify the security PIN code upon physical inspection.`,
      time: '10:22 AM'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
  };

  const handleStartChatFromForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim() || weightKg <= 0) return;
    setActiveView('chat');
  };

  const handleConfirmAndProceedToAudit = () => {
    const currentProfile = storageService.getProfiles()[1]; // Sara Babiker
    const totalFee = Math.round(weightKg * trip.price_per_kg);

    const newShipment = storageService.createShipment({
      trip_id: trip.id,
      trip: trip,
      sender_id: currentProfile.id,
      sender: currentProfile,
      recipient_name: 'Amna El-Nour',
      recipient_name_ar: 'آمنة النور',
      recipient_phone: '+249 912 345 678',
      recipient_city: trip.destination_city || 'Port Sudan',
      recipient_city_ar: trip.destination_city_ar || 'بورتسودان',
      item_title: itemTitle || 'شحنة أمانة شخصية',
      item_title_ar: itemTitle || 'شحنة أمانة شخصية',
      item_description: description || 'Personal diaspora shipment unsealed for in-person verification.',
      category: category,
      weight_kg: weightKg,
      declared_value: 50000,
      currency: trip.currency,
      total_fee: totalFee,
      meeting_code: Math.floor(1000 + Math.random() * 9000).toString(),
      delivery_pin: Math.floor(1000 + Math.random() * 9000).toString()
    });

    onCreated(newShipment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-slate-200 w-full max-w-xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header with Traveler identity & View tabs */}
        <div className="bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={traveler?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'}
                  alt={traveler?.full_name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                {traveler?.passport_verified && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-[8px]">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <span>{language === 'ar' ? traveler?.full_name_ar : traveler?.full_name}</span>
                  <span className="text-xs text-[#0F766E] font-medium flex items-center gap-0.5">
                    <UserCheck className="w-3 h-3" />
                    {language === 'ar' ? 'معتمد' : 'Verified'}
                  </span>
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span><bdi dir="ltr">{traveler?.verified_trips_count || 14}</bdi> {language === 'ar' ? 'شحنة مكتملة' : 'completed shipments'}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <span className="text-slate-400">{language === 'ar' ? 'من' : 'From'}</span>
                    <span>{language === 'ar' ? trip.origin_city_ar : trip.origin_city}</span>
                    <span className="text-slate-400 text-xs">{language === 'ar' ? '⟵' : '→'}</span>
                    <span className="text-slate-400">{language === 'ar' ? 'إلى' : 'To'}</span>
                    <span>{language === 'ar' ? trip.destination_city_ar : trip.destination_city}</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Segmented Switch: Details vs Direct Chat */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveView('request')}
              className={`flex-1 py-1.5 px-3 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                activeView === 'request'
                  ? 'bg-white text-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تفاصيل الشحن' : 'Shipping Details'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('chat')}
              className={`flex-1 py-1.5 px-3 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                activeView === 'chat'
                  ? 'bg-white text-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'المحادثة المباشرة' : 'Direct Chat'}</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: CLEAN SHIPPING DETAILS FORM */}
        {activeView === 'request' && (
          <form onSubmit={handleStartChatFromForm} className="p-5 overflow-y-auto space-y-4 text-xs">
            {/* Weight input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-900">
                  {language === 'ar' ? 'الوزن المطلوب (كجم)' : 'Required Weight (kg)'}
                </label>
                <span className="text-xs text-slate-500 font-medium">
                  {language === 'ar' ? `المتاح: ${trip.available_weight_kg} كجم` : `Available: ${trip.available_weight_kg} kg`}
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max={trip.available_weight_kg}
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0.5)}
                  className="w-full px-3 py-2 text-sm font-bold font-mono rounded-lg border border-slate-200 focus:outline-none focus:border-[#0F766E] bg-white text-slate-900"
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-xs text-slate-500 pointer-events-none">
                  {language === 'ar' ? 'كجم' : 'kg'}
                </span>
              </div>
            </div>

            {/* Item Category */}
            <div>
              <label className="block font-bold text-slate-900 mb-1">
                {t.itemCategory}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0F766E]"
              >
                {CATEGORIES_LIST.map((c) => (
                  <option key={c.value} value={c.value}>
                    {language === 'ar' ? c.ar : c.en}
                  </option>
                ))}
              </select>
            </div>

            {/* Item Description */}
            <div>
              <label className="block font-bold text-slate-900 mb-1">
                {language === 'ar' ? 'وصف الأغراض' : 'Item Description'}
              </label>
              <input
                type="text"
                required
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
                placeholder={language === 'ar' ? 'أدوية الغدة الدرقية الموصوفة وشهادات تخرج' : 'Prescribed Medication & Attested Certificates'}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#0F766E] bg-white text-slate-900"
              />
            </div>

            {/* Estimated Total Fee Summary */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-600 block">
                  {language === 'ar' ? 'إجمالي أتعاب المسافر:' : 'Estimated Fee:'}
                </span>
                <span className="text-[11px] text-slate-400">
                  (<bdi dir="ltr">{weightKg}</bdi> {language === 'ar' ? 'كجم' : 'kg'} × <bdi dir="ltr">{trip.price_per_kg.toLocaleString()}</bdi>)
                </span>
              </div>
              <CurrencyDisplay
                amount={totalFee}
                currency={trip.currency}
                language={language}
                size="md"
              />
            </div>

            {/* Privacy Notice */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
              <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block mb-0.5">
                  {language === 'ar' ? 'خصوصية نقطة اللقاء وموعد الرحلة' : 'Private Rendezvous & Flight Coordination'}
                </strong>
                <span>
                  {language === 'ar'
                    ? 'تفاصيل موعد السفر ونقطة اللقاء للمعاينة تتم مناقشتها وتأكيدها بأمان داخل المحادثة المباشرة دون نشرها علناً.'
                    : 'Exact flight timing and designated meeting points are discussed and confirmed privately inside direct messages.'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold flex items-center justify-center gap-2 transition-colors shadow-none"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === 'ar' ? 'بدء المحادثة المباشرة' : 'Start Direct Conversation'}</span>
              </button>
            </div>
          </form>
        )}

        {/* VIEW 2: FLAT DIRECT CHAT */}
        {activeView === 'chat' && (
          <div className="flex flex-col flex-1 overflow-hidden min-h-[400px]">
            {/* Privacy Notice Banner */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>{language === 'ar' ? 'محادثة خاصة لتنسيق المقابلة' : 'Private chat to coordinate meeting'}</span>
              </div>
              <span className="text-[11px] text-slate-400">
                {language === 'ar' ? 'مشفرة' : 'Encrypted'}
              </span>
            </div>

            {/* Chat Messages List (Flat WhatsApp-like bubbles) */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[11px] font-semibold text-slate-500">
                        {isUser 
                          ? (language === 'ar' ? 'أنت' : 'You')
                          : (language === 'ar' ? traveler?.full_name_ar || traveler?.full_name : traveler?.full_name)}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        <bdi dir="ltr">{msg.time}</bdi>
                      </span>
                    </div>

                    <div
                      className={`max-w-[85%] sm:max-w-[78%] p-2.5 rounded-lg leading-relaxed ${
                        isUser
                          ? 'bg-teal-700 text-white'
                          : 'bg-white text-slate-900 border border-slate-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Coordinate Suggestions */}
            <div className="px-3 py-2 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
              <button
                type="button"
                onClick={() => setInputMessage(language === 'ar' ? 'هل يناسبك اللقاء في محطة المترو أو المطار؟' : 'Would meeting near the metro station work?')}
                className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 shrink-0"
              >
                {language === 'ar' ? 'نقطة اللقاء' : 'Meeting Point'}
              </button>
              <button
                type="button"
                onClick={() => setInputMessage(language === 'ar' ? 'ما هو موعد إقلاع الرحلة المحدد؟' : 'What is the flight departure time?')}
                className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 shrink-0"
              >
                {language === 'ar' ? 'موعد الرحلة' : 'Flight Time'}
              </button>
              <button
                type="button"
                onClick={() => setInputMessage(language === 'ar' ? 'الأغراض أدوية مع الروشتة جاهزة للفحص.' : 'Items are ready with prescription.')}
                className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 shrink-0"
              >
                {language === 'ar' ? 'فحص الأدوية' : 'Inspection'}
              </button>
            </div>

            {/* Message Input Field */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={language === 'ar' ? 'اكتب رسالتك للمسافر لتنسيق المقابلة...' : 'Type a message to coordinate meeting...'}
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0F766E] text-slate-900"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2 rounded-lg bg-[#0F766E] text-white disabled:opacity-40 hover:bg-[#0d655e] transition-colors"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Bottom Footer: Proceed to 5-Step Audit */}
            <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
              <button
                type="button"
                onClick={() => setActiveView('request')}
                className="text-slate-600 hover:text-slate-900 font-medium"
              >
                {language === 'ar' ? 'تعديل التفاصيل' : 'Edit Details'}
              </button>

              <button
                type="button"
                onClick={handleConfirmAndProceedToAudit}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold flex items-center justify-center gap-2 transition-colors shadow-none"
              >
                <span>{language === 'ar' ? 'المتابعة إلى مسار التدقيق الخماسي' : 'Continue to Audit Trail'}</span>
                <ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
