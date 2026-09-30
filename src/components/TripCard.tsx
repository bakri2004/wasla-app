import React from 'react';
import { 
  UserCheck, 
  Check
} from 'lucide-react';
import { Trip, Language } from '../types';
import { getCategoryLabel } from '../utils/labels';

interface TripCardProps {
  trip: Trip;
  language: Language;
  onBookSpace: (trip: Trip) => void;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  language,
  onBookSpace
}) => {
  const traveler = trip.traveler;

  const currencySymbol = trip.currency === 'SDG' 
    ? (language === 'ar' ? 'ج.س' : 'SDG')
    : trip.currency === 'SAR'
    ? (language === 'ar' ? 'ر.س' : 'SAR')
    : trip.currency === 'EGP'
    ? (language === 'ar' ? 'ج.م' : 'EGP')
    : trip.currency;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 hover:border-slate-300 transition-colors">
      {/* 1. Header Row: Traveler Avatar + Info on one side, Compact Action Button Aligned Directly Across */}
      <div className="flex items-center justify-between gap-3 pb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <img
              src={traveler?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'}
              alt={traveler?.full_name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
            {traveler?.passport_verified && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-teal-700 text-white flex items-center justify-center text-[8px]" title="Passport Verified">
                <Check className="w-2.5 h-2.5" />
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight truncate">
                {language === 'ar' ? traveler?.full_name_ar : traveler?.full_name}
              </h4>
              <UserCheck className="w-3.5 h-3.5 text-teal-700 shrink-0" title={language === 'ar' ? 'مسافر معتمد' : 'Verified'} />
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              <bdi dir="ltr">{traveler?.verified_trips_count || 14}</bdi> {language === 'ar' ? 'شحنة مكتملة' : 'completed'}
            </div>
          </div>
        </div>

        {/* Primary Action Button: Compact in Header Row */}
        <button
          onClick={() => onBookSpace(trip)}
          className="px-3 py-1.5 text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition-colors shrink-0 shadow-none"
        >
          {language === 'ar' ? 'تواصل' : 'Contact'}
        </button>
      </div>

      {/* 2. Card Body: Clean 3-Column Data Grid [المسار | الوزن المتاح | السعر] */}
      <div className="grid grid-cols-3 gap-2 py-2.5 my-1 border-y border-slate-100 text-xs">
        {/* Col 1: Route */}
        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-400 block font-medium">
            {language === 'ar' ? 'المسار' : 'Route'}
          </span>
          <div className="font-bold text-slate-900 text-xs flex items-center gap-1 truncate">
            <span>{language === 'ar' ? trip.origin_city_ar : trip.origin_city}</span>
            <span className="text-slate-400 text-[10px]">{language === 'ar' ? '⟵' : '→'}</span>
            <span>{language === 'ar' ? trip.destination_city_ar : trip.destination_city}</span>
          </div>
          <span className="text-[10px] text-slate-500 block truncate">
            <bdi dir="ltr">{trip.departure_date}</bdi>
          </span>
        </div>

        {/* Col 2: Available Weight */}
        <div className="space-y-0.5 border-x border-slate-100 px-2 text-center">
          <span className="text-[10px] text-slate-400 block font-medium">
            {language === 'ar' ? 'الوزن المتاح' : 'Available'}
          </span>
          <div className="font-bold text-slate-900 text-xs sm:text-sm">
            <bdi dir="ltr" className="font-mono">{trip.available_weight_kg}</bdi>
            <span className="text-[10px] sm:text-xs text-slate-500 font-normal ms-1">
              {language === 'ar' ? 'كجم' : 'kg'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block">
            {language === 'ar' ? 'من' : 'of'} <bdi dir="ltr">{trip.max_weight_kg}</bdi> {language === 'ar' ? 'كجم' : 'kg'}
          </span>
        </div>

        {/* Col 3: Price */}
        <div className="space-y-0.5 text-end">
          <span className="text-[10px] text-slate-400 block font-medium">
            {language === 'ar' ? 'السعر' : 'Price'}
          </span>
          <div className="font-bold text-slate-900 text-xs sm:text-sm">
            <bdi dir="ltr" className="font-mono">{trip.price_per_kg.toLocaleString()}</bdi>
            <span className="text-teal-700 font-semibold text-[11px] sm:text-xs ms-1">
              {currencySymbol}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block">
            {language === 'ar' ? '/ كجم' : '/ kg'}
          </span>
        </div>
      </div>

      {/* 3. Card Footer: Clean unboxed metadata tags (NO massive bottom buttons) */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <div className="truncate text-slate-500" title={trip.accepted_categories.map(cat => getCategoryLabel(cat, language, 'short')).join(' · ')}>
          {trip.accepted_categories.map(cat => getCategoryLabel(cat, language, 'short')).join(' · ')}
        </div>
        <span className="text-teal-700 text-[10px] font-medium shrink-0 flex items-center gap-0.5">
          <Check className="w-3 h-3" />
          <span>{language === 'ar' ? 'فحص مفتوح' : 'Unsealed'}</span>
        </span>
      </div>
    </div>
  );
};
