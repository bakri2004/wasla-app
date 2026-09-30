import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Package, 
  Search, 
  MapPin, 
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { 
  Language, 
  UserRole, 
  Trip, 
  ShipmentBooking 
} from './types';
import { translations } from './i18n/translations';
import { storageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { TripCard } from './components/TripCard';
import { AuditTrailWorkflow } from './components/AuditTrailWorkflow';
import { CreateShipmentModal } from './components/CreateShipmentModal';
import { CreateTripModal } from './components/CreateTripModal';
import { TrustCenterModal } from './components/TrustCenterModal';
import { CurrencyDisplay } from './components/CurrencyDisplay';
import { getCategoryLabel } from './utils/labels';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [activeRole, setActiveRole] = useState<UserRole>('traveler');
  const [activeTab, setActiveTab] = useState<'trips' | 'shipments'>('trips');
  
  // Data State
  const [trips, setTrips] = useState<Trip[]>([]);
  const [shipments, setShipments] = useState<ShipmentBooking[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentBooking | null>(null);

  // Modals
  const [bookingTrip, setBookingTrip] = useState<Trip | null>(null);
  const [bookingModalMode, setBookingModalMode] = useState<'request' | 'chat'>('request');
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [isTrustCenterOpen, setIsTrustCenterOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [routeFilter, setRouteFilter] = useState<'all' | 'cairo' | 'gulf'>('all');

  // Load initial data
  const loadData = () => {
    storageService.initStorage();
    setTrips(storageService.getTrips());
    const allShipments = storageService.getShipments();
    setShipments(allShipments);
    if (allShipments.length > 0 && !selectedShipment) {
      setSelectedShipment(allShipments[0]);
    }
    setLanguage(storageService.getLanguage());
    setActiveRole(storageService.getActiveRole());
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const handleToggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'ar' : 'en';
    setLanguage(nextLang);
    storageService.setLanguage(nextLang);
  };

  const handleChangeRole = (newRole: UserRole) => {
    setActiveRole(newRole);
    storageService.setActiveRole(newRole);
  };

  const handleShipmentUpdated = (updated: ShipmentBooking) => {
    const updatedShipment = storageService.updateShipment(updated);
    setShipments(storageService.getShipments());
    setSelectedShipment(updatedShipment);
  };

  const handleTripCreated = (newTrip: Trip) => {
    setIsCreateTripOpen(false);
    setTrips(storageService.getTrips());
    setActiveTab('trips');
  };

  const handleShipmentCreated = (newShipment: ShipmentBooking) => {
    setBookingTrip(null);
    setShipments(storageService.getShipments());
    setSelectedShipment(newShipment);
    setActiveTab('shipments');
  };

  const t = translations[language];

  // Filtered trips
  const filteredTrips = trips.filter(trip => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      trip.origin_city.toLowerCase().includes(q) ||
      trip.destination_city.toLowerCase().includes(q) ||
      trip.origin_city_ar.includes(q) ||
      trip.destination_city_ar.includes(q);

    if (!matchesSearch) return false;

    if (routeFilter === 'cairo') {
      return trip.origin_city === 'Cairo';
    }
    if (routeFilter === 'gulf') {
      return trip.origin_city === 'Riyadh' || trip.origin_city === 'Jeddah' || trip.origin_city === 'Dubai';
    }
    return true;
  });

  // Filtered shipments
  const filteredShipments = shipments.filter(shipment => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      shipment.tracking_number.toLowerCase().includes(q) ||
      shipment.item_title.toLowerCase().includes(q) ||
      shipment.item_title_ar.includes(q) ||
      (shipment.trip && (
        shipment.trip.origin_city.toLowerCase().includes(q) ||
        shipment.trip.origin_city_ar.includes(q) ||
        shipment.trip.destination_city.toLowerCase().includes(q) ||
        shipment.trip.destination_city_ar.includes(q)
      ));

    if (!matchesSearch) return false;

    if (routeFilter === 'cairo') {
      return shipment.trip?.origin_city === 'Cairo';
    }
    if (routeFilter === 'gulf') {
      return (
        shipment.trip?.origin_city === 'Riyadh' ||
        shipment.trip?.origin_city === 'Jeddah' ||
        shipment.trip?.origin_city === 'Dubai'
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navigation */}
      <Navbar
        language={language}
        onToggleLanguage={handleToggleLanguage}
        activeRole={activeRole}
        onChangeRole={handleChangeRole}
        onOpenCreateTrip={() => setIsCreateTripOpen(true)}
      />

      {/* Main Container: Fixed stable mobile container width (max-w-md mx-auto) to prevent layout shifts */}
      <main className="flex-1 max-w-md w-full mx-auto px-3.5 sm:px-4 pt-3.5 pb-24 space-y-4">
        {/* Streamlined Top Control Section */}
        <div className="space-y-3">
          {/* Flat 2-Option Segmented Tab Bar */}
          <div className="flex items-center justify-center">
            <div className="w-full inline-flex p-1 rounded-lg bg-slate-200/80 border border-slate-200">
              <button
                onClick={() => setActiveTab('trips')}
                className={`flex-1 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'trips'
                    ? 'bg-white text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Plane className="w-4 h-4 text-slate-600" />
                <span>{t.navTripsTab}</span>
                <bdi dir="ltr" className="text-xs text-slate-500 font-mono">
                  ({trips.length})
                </bdi>
              </button>

              <button
                onClick={() => setActiveTab('shipments')}
                className={`flex-1 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'shipments'
                    ? 'bg-white text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Package className="w-4 h-4 text-slate-600" />
                <span>{t.navShipmentsTab}</span>
                <bdi dir="ltr" className="text-xs text-slate-500 font-mono">
                  ({shipments.length})
                </bdi>
              </button>
            </div>
          </div>

          {/* Consolidated Search & Filter Controls: Single unified component directly under tab switcher */}
          <div className="bg-white rounded-xl border border-slate-200 p-2.5 space-y-2">
            {/* Search Input with inline icon */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full ps-9 pe-3 py-2 text-xs text-slate-900 placeholder-slate-400 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-700 focus:bg-white transition-colors"
              />
            </div>

            {/* Filter Pills directly integrated in the same bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-0.5 no-scrollbar">
              <button
                onClick={() => setRouteFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors text-xs shrink-0 ${
                  routeFilter === 'all'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t.filterAll}
              </button>
              <button
                onClick={() => setRouteFilter('cairo')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors text-xs shrink-0 ${
                  routeFilter === 'cairo'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t.filterCairoPortSudan}
              </button>
              <button
                onClick={() => setRouteFilter('gulf')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors text-xs shrink-0 ${
                  routeFilter === 'gulf'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t.filterGulfPortSudan}
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: AVAILABLE TRIPS */}
        {activeTab === 'trips' && (
          <div className="space-y-3">
            {filteredTrips.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-xl border border-slate-200 p-6 space-y-3">
                <Plane className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="font-bold text-sm text-slate-900">
                  {language === 'ar' ? 'لا توجد رحلات مطابقة للمسار المحدد' : 'No matching trips found'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'ar' ? 'جرب البحث عن مدينة أخرى أو قم بإضافة رحلتك كمسافر.' : 'Try another route or offer luggage space on your flight.'}
                </p>
                <button
                  onClick={() => setIsCreateTripOpen(true)}
                  className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors"
                >
                  {t.navPostTrip}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTrips.map(trip => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    language={language}
                    onBookSpace={(selected) => {
                      setBookingTrip(selected);
                      setBookingModalMode('request');
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PACKAGE REQUESTS & 5-STEP AUDIT TRAIL */}
        {activeTab === 'shipments' && (
          <div className="space-y-3">
            {/* Package Requests List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-slate-700" />
                  <span>{t.navShipmentsTab}</span>
                  <span className="text-xs font-normal text-slate-500">
                    (<bdi dir="ltr">{filteredShipments.length}</bdi>)
                  </span>
                </h2>
                <span className="text-[11px] text-slate-500">
                  {language === 'ar' ? 'اختر شحنة لعرض التدقيق' : 'Select to track'}
                </span>
              </div>

              {filteredShipments.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl border border-slate-200 space-y-3">
                  <Package className="w-8 h-8 text-slate-400 mx-auto" />
                  <h3 className="font-bold text-sm text-slate-900">
                    {language === 'ar' ? 'لا توجد طلبات شحنات مطابقة' : 'No matching package requests'}
                  </h3>
                  <button
                    onClick={() => setActiveTab('trips')}
                    className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors"
                  >
                    {t.navTripsTab}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredShipments.map(s => {
                    const isSelected = selectedShipment?.id === s.id;
                    const currencyLabel = s.currency === 'SDG' 
                      ? (language === 'ar' ? 'ج.س' : 'SDG')
                      : s.currency === 'SAR'
                      ? (language === 'ar' ? 'ر.س' : 'SAR')
                      : s.currency === 'EGP'
                      ? (language === 'ar' ? 'ج.م' : 'EGP')
                      : s.currency;

                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedShipment(s)}
                        className={`p-3.5 sm:p-4 rounded-xl border transition-colors cursor-pointer text-xs ${
                          isSelected
                            ? 'bg-white border-teal-700 ring-1 ring-teal-700'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Header: Tracking number + Compact action button */}
                        <div className="flex items-center justify-between gap-2 pb-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-slate-900 text-xs shrink-0">
                              <bdi dir="ltr">{s.tracking_number}</bdi>
                            </span>
                            <span className="text-[11px] text-slate-500 truncate">
                              {getCategoryLabel(s.category, language, 'short')}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[11px] font-semibold text-teal-700">
                              {language === 'ar' ? `المرحلة ${s.current_step}/5` : `Step ${s.current_step}/5`}
                            </span>
                            <button
                              type="button"
                              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                                isSelected 
                                  ? 'bg-teal-700 text-white' 
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              {isSelected ? (language === 'ar' ? 'قيد العرض' : 'Viewing') : (language === 'ar' ? 'عرض' : 'View')}
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 mb-1.5">
                          {language === 'ar' ? s.item_title_ar || s.item_title : s.item_title}
                        </h4>

                        {/* 3-Column Data Grid [المسار | الوزن | المقابل] */}
                        <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-xs">
                          {/* Col 1: Route */}
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-slate-400 block font-medium">
                              {language === 'ar' ? 'المسار' : 'Route'}
                            </span>
                            <div className="font-bold text-slate-900 text-xs flex items-center gap-1 truncate">
                              <span>{language === 'ar' ? s.trip?.origin_city_ar : s.trip?.origin_city}</span>
                              <span className="text-slate-400 text-[10px]">{language === 'ar' ? '⟵' : '→'}</span>
                              <span>{language === 'ar' ? s.trip?.destination_city_ar : s.trip?.destination_city}</span>
                            </div>
                          </div>

                          {/* Col 2: Weight */}
                          <div className="space-y-0.5 border-x border-slate-100 px-2 text-center">
                            <span className="text-[10px] text-slate-400 block font-medium">
                              {language === 'ar' ? 'الوزن' : 'Weight'}
                            </span>
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">
                              <bdi dir="ltr" className="font-mono">{s.weight_kg}</bdi>
                              <span className="text-[10px] sm:text-xs text-slate-500 font-normal ms-1">
                                {language === 'ar' ? 'كجم' : 'kg'}
                              </span>
                            </div>
                          </div>

                          {/* Col 3: Fee */}
                          <div className="space-y-0.5 text-end">
                            <span className="text-[10px] text-slate-400 block font-medium">
                              {language === 'ar' ? 'المقابل' : 'Fee'}
                            </span>
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">
                              <bdi dir="ltr" className="font-mono">{s.total_fee.toLocaleString()}</bdi>
                              <span className="text-teal-700 font-semibold text-[11px] sm:text-xs ms-1">
                                {currencyLabel}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Footer: Recipient & Chat button */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5">
                          <span>
                            {language === 'ar' ? 'المستلم: ' : 'To: '}
                            <strong className="text-slate-700 font-semibold">{s.recipient_name}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (s.trip) {
                                setBookingTrip(s.trip);
                                setBookingModalMode('chat');
                              }
                            }}
                            className="text-slate-500 hover:text-teal-700 flex items-center gap-1 p-0.5 rounded"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{language === 'ar' ? 'محادثة' : 'Chat'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Active Audit Trail Component for Selected Shipment */}
            {selectedShipment && (
              <div className="pt-2">
                <AuditTrailWorkflow
                  shipment={selectedShipment}
                  language={language}
                  activeRole={activeRole}
                  onUpdateShipment={handleShipmentUpdated}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm">وصلة (Wasla)</span>
            <span>·</span>
            <span>{language === 'ar' ? 'خدمة لوجستية تشاركية للمغتربين السودانيين' : 'Sudanese diaspora crowdsourced logistics platform'}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button 
              onClick={() => setIsTrustCenterOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              {t.navTrustCenter}
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {bookingTrip && (
        <CreateShipmentModal
          trip={bookingTrip}
          language={language}
          initialMode={bookingModalMode}
          onClose={() => setBookingTrip(null)}
          onCreated={handleShipmentCreated}
        />
      )}

      {isCreateTripOpen && (
        <CreateTripModal
          language={language}
          onClose={() => setIsCreateTripOpen(false)}
          onCreated={handleTripCreated}
        />
      )}

      {isTrustCenterOpen && (
        <TrustCenterModal
          language={language}
          onClose={() => setIsTrustCenterOpen(false)}
        />
      )}
    </div>
  );
}
