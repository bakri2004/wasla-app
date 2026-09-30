import React, { useState } from 'react';
import { X, Plane, ShieldCheck } from 'lucide-react';
import { Currency, Language, Trip } from '../types';
import { translations } from '../i18n/translations';
import { storageService } from '../services/storageService';

interface CreateTripModalProps {
  language: Language;
  onClose: () => void;
  onCreated: (newTrip: Trip) => void;
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  language,
  onClose,
  onCreated
}) => {
  const t = translations[language];
  const [originCity, setOriginCity] = useState('Cairo');
  const [originCountry, setOriginCountry] = useState('Egypt');
  const [destinationCity, setDestinationCity] = useState('Port Sudan');
  const [destinationCountry, setDestinationCountry] = useState('Sudan');
  const [departureDate, setDepartureDate] = useState('2026-09-25');
  const [arrivalDate, setArrivalDate] = useState('2026-09-26');
  const [maxWeightKg, setMaxWeightKg] = useState<number>(15);
  const [pricePerKg, setPricePerKg] = useState<number>(850);
  const [currency, setCurrency] = useState<Currency>('EGP');
  const [meetingNotes, setMeetingNotes] = useState('Dokki Metro Exit or Cultural Center');
  const [flightNumber, setFlightNumber] = useState('Flight route');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentProfile = storageService.getProfiles()[0]; // Mohamed Al-Amin

    const newTrip = storageService.createTrip({
      traveler_id: currentProfile.id,
      traveler: currentProfile,
      origin_city: originCity,
      origin_city_ar: originCity === 'Cairo' ? 'القاهرة' : originCity === 'Riyadh' ? 'الرياض' : originCity,
      origin_country: originCountry,
      destination_city: destinationCity,
      destination_city_ar: destinationCity === 'Port Sudan' ? 'بورتسودان' : destinationCity,
      destination_country: destinationCountry,
      departure_date: departureDate,
      arrival_date: arrivalDate,
      max_weight_kg: maxWeightKg,
      available_weight_kg: maxWeightKg,
      price_per_kg: pricePerKg,
      currency: currency,
      flight_or_transit_number: flightNumber,
      meeting_location_notes: meetingNotes,
      meeting_location_notes_ar: meetingNotes,
      accepted_categories: ['documents', 'medication', 'clothing'],
      status: 'scheduled'
    });

    onCreated(newTrip);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-slate-200 w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* Flat Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Plane className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base">
                {t.navPostTrip}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'ar' ? 'اعرض وزن أمتعتك المتاح لمساعدة الجالية' : 'Offer your extra luggage allowance'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Cities */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-900 mb-1">
                {language === 'ar' ? 'مدينة الانطلاق' : 'Origin City'}
              </label>
              <select
                value={originCity}
                onChange={(e) => {
                   const city = e.target.value;
                   setOriginCity(city);
                   if (city === 'Riyadh') {
                     setOriginCountry('Saudi Arabia');
                     setCurrency('SAR');
                     setPricePerKg(120);
                   } else if (city === 'Jeddah') {
                     setOriginCountry('Saudi Arabia');
                     setCurrency('SAR');
                     setPricePerKg(110);
                   } else if (city === 'Port Sudan') {
                     setOriginCountry('Sudan');
                     setCurrency('SDG');
                     setPricePerKg(25000);
                   } else if (city === 'Dubai') {
                     setOriginCountry('UAE');
                     setCurrency('USD');
                     setPricePerKg(35);
                   } else {
                     setOriginCountry('Egypt');
                     setCurrency('EGP');
                     setPricePerKg(850);
                   }
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-900 focus:outline-none focus:border-[#0F766E]"
              >
                <option value="Cairo">Cairo (القاهرة) - EGP</option>
                <option value="Riyadh">Riyadh (الرياض) - SAR</option>
                <option value="Jeddah">Jeddah (جدة) - SAR</option>
                <option value="Port Sudan">Port Sudan (بورتسودان) - SDG</option>
                <option value="Dubai">Dubai (دبي) - USD</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">
                {language === 'ar' ? 'مدينة الوصول' : 'Destination'}
              </label>
              <select
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-900 focus:outline-none focus:border-[#0F766E]"
              >
                <option value="Port Sudan">Port Sudan (بورتسودان)</option>
                <option value="Atbara">Atbara (عطبرة)</option>
                <option value="Kassala">Kassala (كسلا)</option>
                <option value="Wad Madani">Wad Madani (ود مدني)</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-900 mb-1">
                {t.departure}
              </label>
              <input
                type="date"
                required
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0F766E]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-900 mb-1">
                {t.arrival}
              </label>
              <input
                type="date"
                required
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0F766E]"
              />
            </div>
          </div>

          {/* Weight & Price */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-900 mb-1">
                {t.availableKg} (kg)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                required
                value={maxWeightKg}
                onChange={(e) => setMaxWeightKg(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold font-mono text-slate-900 focus:outline-none focus:border-[#0F766E]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-900 mb-1">
                {language === 'ar' ? 'السعر / كجم' : 'Price / kg'}
              </label>
              <input
                type="number"
                min="1"
                required
                value={pricePerKg}
                onChange={(e) => setPricePerKg(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold font-mono text-slate-900 focus:outline-none focus:border-[#0F766E]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-900 mb-1">
                {language === 'ar' ? 'العملة' : 'Currency'}
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-semibold text-slate-900 focus:outline-none focus:border-[#0F766E]"
              >
                <option value="SDG">SDG (جنيه سوداني)</option>
                <option value="EGP">EGP (جنيه مصري)</option>
                <option value="SAR">SAR (ريال سعودي)</option>
                <option value="USD">USD (دولار)</option>
              </select>
            </div>
          </div>

          {/* Meeting Notes */}
          <div>
            <label className="block font-bold text-slate-900 mb-1">
              {t.meetingLocation}
            </label>
            <input
              type="text"
              required
              value={meetingNotes}
              onChange={(e) => setMeetingNotes(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: محطة مترو الدقي أو بالقرب من المطار' : 'e.g. Dokki Metro Exit or Airport Area'}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0F766E]"
            />
          </div>

          {/* Mandatory audit disclaimer */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
            <span>
              {language === 'ar'
                ? 'يلتزم المسافر بفتح وتفتيش كافة الطرود حضورياً قبل قبولها والسفر بها إلى بورتسودان حفاظاً على سلامته الشخصية.'
                : 'As a traveler, you agree to conduct an open package inspection before accepting and carrying any luggage items.'}
            </span>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-none"
            >
              {language === 'ar' ? 'نشر الرحلة والوزن' : 'Publish Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
