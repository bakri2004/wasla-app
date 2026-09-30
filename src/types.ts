export type Language = 'en' | 'ar';

export type Currency = 'SDG' | 'EGP' | 'SAR' | 'USD';

export type ItemCategory = 
  | 'documents' 
  | 'medication' 
  | 'electronics' 
  | 'personal_goods' 
  | 'food_dry' 
  | 'clothing';

export type UserRole = 'sender' | 'traveler' | 'recipient';

export interface Profile {
  id: string;
  full_name: string;
  full_name_ar: string;
  phone: string;
  email: string;
  avatar_url: string;
  city: string;
  country: string;
  passport_verified: boolean;
  national_id_verified: boolean;
  bankak_account_number: string;
  bankak_account_name: string;
  trust_score: number; // 0 to 100
  verified_trips_count: number;
  rating: number; // 1 to 5
  reviews_count: number;
  diaspora_community_vouched: boolean;
  bio?: string;
  bio_ar?: string;
  created_at: string;
}

export interface Trip {
  id: string;
  traveler_id: string;
  traveler?: Profile;
  origin_city: string;
  origin_city_ar: string;
  origin_country: string;
  destination_city: string;
  destination_city_ar: string;
  destination_country: string;
  departure_date: string;
  arrival_date: string;
  max_weight_kg: number;
  available_weight_kg: number;
  price_per_kg: number;
  currency: Currency;
  flight_or_transit_number?: string;
  meeting_location_notes: string;
  meeting_location_notes_ar: string;
  accepted_categories: ItemCategory[];
  prohibited_notes?: string;
  status: 'scheduled' | 'in_transit' | 'completed' | 'cancelled';
  created_at: string;
}

export interface InspectionPhoto {
  id: string;
  url: string;
  caption: string;
  category: 'contents' | 'prescriptions' | 'scale_weight' | 'sealed_bag';
  timestamp: string;
}

export interface InspectionChecklist {
  open_unsealed_box: boolean;
  no_prohibited_substances: boolean;
  valid_medical_prescription: boolean;
  scale_verified_weight_kg: number;
  traveler_liability_acknowledged: boolean;
  inspection_location: string;
  inspected_at?: string;
}

export interface MeetingDetails {
  scheduled_time: string;
  meeting_address: string;
  meeting_city: string;
  sender_confirmed: boolean;
  traveler_confirmed: boolean;
  security_code: string; // 4-digit mutual verification code
}

export interface BankakTransferDetails {
  bank_name: string;
  traveler_account_number: string;
  traveler_account_name: string;
  amount: number;
  currency: Currency;
  transaction_ref_id: string;
  screenshot_url?: string;
  sender_notes?: string;
  submitted_at?: string;
  sender_confirmed: boolean;
  traveler_verified: boolean;
  verified_at?: string;
}

export interface HandoffDetails {
  recipient_name: string;
  recipient_phone: string;
  recipient_id_type: 'National ID' | 'Passport' | 'Family Card';
  recipient_id_last4: string;
  handover_city: string;
  handover_address: string;
  entered_delivery_pin: string;
  correct_delivery_pin: string;
  digital_signature?: string; // base64 PNG data URL
  handover_photo_url?: string;
  delivered_at?: string;
  signed_off: boolean;
  recipient_feedback?: string;
}

export interface AuditTrailStep {
  step_number: 1 | 2 | 3 | 4 | 5;
  title_en: string;
  title_ar: string;
  status: 'pending' | 'in_progress' | 'completed';
  completed_at?: string;
  completed_by?: string;
  meeting_details?: MeetingDetails;
  inspection_details?: {
    photos: InspectionPhoto[];
    checklist: InspectionChecklist;
  };
  bankak_details?: BankakTransferDetails;
  handoff_details?: HandoffDetails;
}

export interface ShipmentBooking {
  id: string;
  tracking_number: string;
  trip_id: string;
  trip?: Trip;
  sender_id: string;
  sender?: Profile;
  recipient_name: string;
  recipient_name_ar: string;
  recipient_phone: string;
  recipient_city: string;
  recipient_city_ar: string;
  item_title: string;
  item_title_ar: string;
  item_description: string;
  category: ItemCategory;
  weight_kg: number;
  declared_value: number;
  currency: Currency;
  total_fee: number;
  current_step: 1 | 2 | 3 | 4 | 5;
  status: 
    | 'requested'
    | 'meeting_confirmed'
    | 'package_inspected'
    | 'payment_verified'
    | 'in_transit'
    | 'delivered'
    | 'cancelled';
  meeting_code: string;
  delivery_pin: string;
  steps: AuditTrailStep[];
  created_at: string;
  updated_at: string;
}

export interface CommunityReview {
  id: string;
  author_name: string;
  author_city: string;
  target_user_id: string;
  rating: number;
  comment: string;
  comment_ar: string;
  route: string;
  created_at: string;
}
