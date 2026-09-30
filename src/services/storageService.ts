import { Trip, ShipmentBooking, Profile, UserRole, Language } from '../types';
import { mockTrips, mockShipments, mockProfiles } from '../data/mockData';

const STORAGE_KEYS = {
  TRIPS: 'wasla_trips_v4',
  SHIPMENTS: 'wasla_shipments_v4',
  PROFILES: 'wasla_profiles_v4',
  ACTIVE_ROLE: 'wasla_active_role_v4',
  LANGUAGE: 'wasla_language_v4'
};

class StorageService {
  constructor() {
    this.initStorage();
  }

  public initStorage(): void {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.TRIPS)) {
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(mockTrips));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SHIPMENTS)) {
      localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(mockShipments));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(mockProfiles));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, 'traveler'); // Default to traveler for audit inspection test
    }
    if (!localStorage.getItem(STORAGE_KEYS.LANGUAGE)) {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, 'ar');
    }
  }

  // --- Trips ---
  public getTrips(): Trip[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRIPS);
      if (!data) return mockTrips;
      const trips: Trip[] = JSON.parse(data);
      const profiles = this.getProfiles();
      return trips.map(t => ({
        ...t,
        traveler: profiles.find(p => p.id === t.traveler_id) || t.traveler
      }));
    } catch {
      return mockTrips;
    }
  }

  public getTripById(id: string): Trip | undefined {
    return this.getTrips().find(t => t.id === id);
  }

  public createTrip(tripData: Omit<Trip, 'id' | 'created_at'>): Trip {
    const trips = this.getTrips();
    const newTrip: Trip = {
      ...tripData,
      id: `trip-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    trips.unshift(newTrip);
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    return newTrip;
  }

  // --- Shipments / Bookings ---
  public getShipments(): ShipmentBooking[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHIPMENTS);
      if (!data) return mockShipments;
      const shipments: ShipmentBooking[] = JSON.parse(data);
      const trips = this.getTrips();
      const profiles = this.getProfiles();
      return shipments.map(s => ({
        ...s,
        trip: trips.find(t => t.id === s.trip_id) || s.trip,
        sender: profiles.find(p => p.id === s.sender_id) || s.sender
      }));
    } catch {
      return mockShipments;
    }
  }

  public getShipmentById(id: string): ShipmentBooking | undefined {
    return this.getShipments().find(s => s.id === id);
  }

  public createShipment(
    data: Omit<ShipmentBooking, 'id' | 'tracking_number' | 'steps' | 'current_step' | 'status' | 'created_at' | 'updated_at'>
  ): ShipmentBooking {
    const shipments = this.getShipments();
    const now = new Date().toISOString();
    const tracking_number = `WSL-${Date.now().toString().slice(-6)}`;
    
    const newShipment: ShipmentBooking = {
      ...data,
      id: `shipment-${Date.now()}`,
      tracking_number,
      current_step: 1,
      status: 'requested',
      steps: [
        {
          step_number: 1,
          title_en: 'Match & Booking Request',
          title_ar: 'التوافق وطلب الحجز المسبق',
          status: 'completed',
          completed_at: now,
          completed_by: data.sender_id
        },
        {
          step_number: 2,
          title_en: 'Physical Meeting Confirmation',
          title_ar: 'تأكيد المقابلة الشخصية حضورياً',
          status: 'in_progress',
          meeting_details: {
            scheduled_time: 'Pending schedule',
            meeting_address: 'TBD in Cairo/Transit',
            meeting_city: 'Cairo',
            sender_confirmed: false,
            traveler_confirmed: false,
            security_code: Math.floor(1000 + Math.random() * 9000).toString()
          }
        },
        {
          step_number: 3,
          title_en: 'Open Package Inspection & Photo Audit',
          title_ar: 'فحص الطرد المفتوح والتوثيق الفوتوغرافي',
          status: 'pending'
        },
        {
          step_number: 4,
          title_en: 'Bankak Direct Transfer & Screenshot Upload',
          title_ar: 'التحويل المباشر عبر بنكك ورفع الإشعار',
          status: 'pending'
        },
        {
          step_number: 5,
          title_en: 'Recipient Hand-off & Digital Sign-off',
          title_ar: 'تسليم المستلم والتوقيع الرقمي',
          status: 'pending'
        }
      ],
      created_at: now,
      updated_at: now
    };

    shipments.unshift(newShipment);
    localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(shipments));
    return newShipment;
  }

  public updateShipment(updatedShipment: ShipmentBooking): ShipmentBooking {
    const shipments = this.getShipments();
    const index = shipments.findIndex(s => s.id === updatedShipment.id);
    if (index !== -1) {
      shipments[index] = {
        ...updatedShipment,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(shipments));
    }
    return updatedShipment;
  }

  // --- Profiles ---
  public getProfiles(): Profile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
      return data ? JSON.parse(data) : mockProfiles;
    } catch {
      return mockProfiles;
    }
  }

  public getProfileById(id: string): Profile | undefined {
    return this.getProfiles().find(p => p.id === id);
  }

  // --- App State (Role & Language) ---
  public getActiveRole(): UserRole {
    return (localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE) as UserRole) || 'traveler';
  }

  public setActiveRole(role: UserRole): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
  }

  public getLanguage(): Language {
    return (localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language) || 'ar';
  }

  public setLanguage(lang: Language): void {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  }

  public resetToDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(mockTrips));
    localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(mockShipments));
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(mockProfiles));
  }

  public exportJson(): string {
    return JSON.stringify({
      trips: this.getTrips(),
      shipments: this.getShipments(),
      profiles: this.getProfiles(),
      exported_at: new Date().toISOString()
    }, null, 2);
  }

  public importJson(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.trips && Array.isArray(parsed.trips)) {
        localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(parsed.trips));
      }
      if (parsed.shipments && Array.isArray(parsed.shipments)) {
        localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(parsed.shipments));
      }
      return true;
    } catch {
      return false;
    }
  }

  public getSupabaseDdl(): string {
    return `-- ==============================================================================
-- Wasla Platform: PostgreSQL / Supabase Migration Schema
-- Designed for Sudanese Diaspora Travel Logistics with In-Person Audit Trail
-- ==============================================================================

-- 1. Profiles Table with Passport and Bankak verification
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  full_name TEXT NOT NULL,
  full_name_ar TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  passport_verified BOOLEAN DEFAULT FALSE,
  national_id_verified BOOLEAN DEFAULT FALSE,
  bankak_account_number TEXT,
  bankak_account_name TEXT,
  trust_score INTEGER DEFAULT 80 CHECK (trust_score BETWEEN 0 AND 100),
  verified_trips_count INTEGER DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  diaspora_community_vouched BOOLEAN DEFAULT FALSE,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Trips Table (Travelers offering luggage kg space)
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  traveler_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  origin_city TEXT NOT NULL,
  origin_city_ar TEXT,
  origin_country TEXT NOT NULL,
  destination_city TEXT NOT NULL,
  destination_city_ar TEXT,
  destination_country TEXT NOT NULL,
  departure_date DATE NOT NULL,
  arrival_date DATE NOT NULL,
  max_weight_kg NUMERIC(5, 2) NOT NULL,
  available_weight_kg NUMERIC(5, 2) NOT NULL,
  price_per_kg NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'SDG',
  flight_or_transit_number TEXT,
  meeting_location_notes TEXT NOT NULL,
  accepted_categories TEXT[] NOT NULL DEFAULT ARRAY['documents', 'medication', 'clothing'],
  prohibited_notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_transit', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3. Shipments / Bookings Table
CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number TEXT UNIQUE NOT NULL,
  trip_id UUID REFERENCES public.trips(id) ON DELETE RESTRICT NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  recipient_city TEXT NOT NULL,
  item_title TEXT NOT NULL,
  item_description TEXT NOT NULL,
  category TEXT NOT NULL,
  weight_kg NUMERIC(5, 2) NOT NULL,
  declared_value NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'SDG',
  total_fee NUMERIC(12, 2) NOT NULL,
  current_step INTEGER DEFAULT 1 CHECK (current_step BETWEEN 1 AND 5),
  status TEXT DEFAULT 'requested',
  meeting_code TEXT NOT NULL,
  delivery_pin TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 4. 5-Step In-Person Audit Trail Logs Table
CREATE TABLE IF NOT EXISTS public.shipment_audit_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE NOT NULL,
  step_number INTEGER NOT NULL CHECK (step_number BETWEEN 1 AND 5),
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
  step_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(shipment_id, step_number)
);

-- Indexes for lightning fast mobile queries
CREATE INDEX IF NOT EXISTS idx_trips_route ON public.trips(origin_city, destination_city, departure_date);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON public.shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_audit_shipment ON public.shipment_audit_steps(shipment_id);
`;
  }
}

export const storageService = new StorageService();
