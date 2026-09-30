import { Profile, Trip, ShipmentBooking, CommunityReview } from '../types';

export const mockProfiles: Profile[] = [
  {
    id: 'user-traveler-1',
    full_name: 'Mohamed Al-Amin',
    full_name_ar: 'محمد الأمين عثمان',
    phone: '+20 102 938 4811',
    email: 'mohamed.amin@diaspora.sd',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    city: 'Cairo (Dokki / Faisal)',
    country: 'Egypt',
    passport_verified: true,
    national_id_verified: true,
    bankak_account_number: '2948192',
    bankak_account_name: 'MOHAMED AL-AMIN OSMAN',
    trust_score: 98,
    verified_trips_count: 14,
    rating: 4.95,
    reviews_count: 23,
    diaspora_community_vouched: true,
    bio: 'Frequent commuter between Cairo (Dokki Sudanese Club) and Port Sudan. 100% strict adherence to open unsealed package inspections.',
    bio_ar: 'مسافر منتظم بين القاهرة (نادي الدقي السوداني) وبورتسودان. ألتزم التزاماً صارماً بالتفتيش المفتوح لكل الأغراض.',
    created_at: '2024-03-12T10:00:00Z',
  },
  {
    id: 'user-sender-1',
    full_name: 'Sara Babiker',
    full_name_ar: 'سارة بابكر الكاروري',
    phone: '+20 114 829 1044',
    email: 'sara.babiker@cairo.edu.eg',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    city: 'Cairo (Mohandessin)',
    country: 'Egypt',
    passport_verified: true,
    national_id_verified: true,
    bankak_account_number: '1849204',
    bankak_account_name: 'SARA BABIKER AL-KAROURI',
    trust_score: 95,
    verified_trips_count: 5,
    rating: 5.0,
    reviews_count: 9,
    diaspora_community_vouched: true,
    bio: 'Pharmacist in Cairo sending essential medications and academic papers to family in the Red Sea State.',
    bio_ar: 'صيدلانية مقيمة بالقاهرة، أرسل أدوية ضرورية وأوراق رسمية للعائلة في ولاية البحر الأحمر.',
    created_at: '2024-05-18T14:30:00Z',
  },
  {
    id: 'user-recipient-1',
    full_name: 'Amna El-Nour',
    full_name_ar: 'آمنة النور سليمان',
    phone: '+249 912 345 678',
    email: 'amna.elnour@portsudan.sd',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    city: 'Port Sudan (Al-Matar District)',
    country: 'Sudan',
    passport_verified: true,
    national_id_verified: true,
    bankak_account_number: '3109284',
    bankak_account_name: 'AMNA EL-NOUR SULAIMAN',
    trust_score: 92,
    verified_trips_count: 3,
    rating: 4.9,
    reviews_count: 5,
    diaspora_community_vouched: true,
    bio: 'Residing in Port Sudan near the central market. Ready for in-person identification hand-off.',
    bio_ar: 'مقيمة ببورتسودان قرب حي المطار والسوق الرئيسي. جاهزة للاستلام بالرقم السري والتوقيع.',
    created_at: '2024-06-01T09:00:00Z',
  },
  {
    id: 'user-traveler-2',
    full_name: 'Tariq Osman',
    full_name_ar: 'طارق عثمان ميرغني',
    phone: '+966 54 901 8823',
    email: 'tariq.osman@saudi.com',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    city: 'Riyadh (Al-Sulaimaniyah)',
    country: 'Saudi Arabia',
    passport_verified: true,
    national_id_verified: true,
    bankak_account_number: '4491028',
    bankak_account_name: 'TARIQ OSMAN MIRGHANI',
    trust_score: 97,
    verified_trips_count: 8,
    rating: 4.88,
    reviews_count: 14,
    diaspora_community_vouched: true,
    bio: 'Flying direct Riyadh to Port Sudan via Tarco Airlines. Extra baggage available for documents and dry supplies.',
    bio_ar: 'رحلة مباشرة الرياض إلى بورتسودان عبر طيران تاركو. وزن إضافي متاح للأوراق والأغراض الشخصية.',
    created_at: '2024-04-10T12:00:00Z',
  }
];

export const mockTrips: Trip[] = [
  {
    id: 'trip-cairo-portsudan-1',
    traveler_id: 'user-traveler-1',
    traveler: mockProfiles[0],
    origin_city: 'Cairo',
    origin_city_ar: 'القاهرة',
    origin_country: 'Egypt',
    destination_city: 'Port Sudan',
    destination_city_ar: 'بورتسودان',
    destination_country: 'Sudan',
    departure_date: '2026-09-14',
    arrival_date: '2026-09-15',
    max_weight_kg: 15,
    available_weight_kg: 8.5,
    price_per_kg: 850,
    currency: 'EGP',
    flight_or_transit_number: 'EgyptAir MS853 / Badr J4',
    meeting_location_notes: 'Dokki Metro Station exit or Faisal Sudanese cultural center, daytime only.',
    meeting_location_notes_ar: 'محطة مترو الدقي أو مركز الجالية السودانية بفيصل نهاراً.',
    accepted_categories: ['documents', 'medication', 'clothing', 'personal_goods'],
    prohibited_notes: 'Strictly no sealed commercial items or unauthorized liquids. All bags checked open.',
    status: 'scheduled',
    created_at: '2026-09-05T08:00:00Z',
  },
  {
    id: 'trip-riyadh-portsudan-2',
    traveler_id: 'user-traveler-2',
    traveler: mockProfiles[3],
    origin_city: 'Riyadh',
    origin_city_ar: 'الرياض',
    origin_country: 'Saudi Arabia',
    destination_city: 'Port Sudan',
    destination_city_ar: 'بورتسودان',
    destination_country: 'Sudan',
    departure_date: '2026-09-18',
    arrival_date: '2026-09-18',
    max_weight_kg: 20,
    available_weight_kg: 12.0,
    price_per_kg: 120,
    currency: 'SAR',
    flight_or_transit_number: 'Tarco Airlines 3T121',
    meeting_location_notes: 'Al-Batha Sudanese Souq or Sulaimaniyah after Asr prayer.',
    meeting_location_notes_ar: 'سوق البطحاء السوداني أو السليمانية بعد صلاة العصر.',
    accepted_categories: ['documents', 'medication', 'electronics', 'clothing'],
    prohibited_notes: 'Prescription required for any pharmacy medicine.',
    status: 'scheduled',
    created_at: '2026-09-06T11:20:00Z',
  },
  {
    id: 'trip-portsudan-cairo-3',
    traveler_id: 'user-recipient-1',
    traveler: mockProfiles[2],
    origin_city: 'Port Sudan',
    origin_city_ar: 'بورتسودان',
    origin_country: 'Sudan',
    destination_city: 'Cairo',
    destination_city_ar: 'القاهرة',
    destination_country: 'Egypt',
    departure_date: '2026-09-22',
    arrival_date: '2026-09-23',
    max_weight_kg: 15,
    available_weight_kg: 10.0,
    price_per_kg: 25000,
    currency: 'SDG',
    flight_or_transit_number: 'Badr Airlines J4-610',
    meeting_location_notes: 'Port Sudan Airport customs area or Al-Matar district.',
    meeting_location_notes_ar: 'مطار بورتسودان الدولي أو حي المطار.',
    accepted_categories: ['documents', 'medication', 'clothing'],
    prohibited_notes: 'Strict physical inspection audit required.',
    status: 'scheduled',
    created_at: '2026-09-07T09:15:00Z',
  },
  {
    id: 'trip-cairo-portsudan-4',
    traveler_id: 'user-traveler-1',
    traveler: mockProfiles[0],
    origin_city: 'Cairo',
    origin_city_ar: 'القاهرة',
    origin_country: 'Egypt',
    destination_city: 'Port Sudan',
    destination_city_ar: 'بورتسودان',
    destination_country: 'Sudan',
    departure_date: '2026-09-28',
    arrival_date: '2026-09-29',
    max_weight_kg: 25,
    available_weight_kg: 25.0,
    price_per_kg: 750,
    currency: 'EGP',
    flight_or_transit_number: 'Tarco Airlines 3T220',
    meeting_location_notes: 'Tahrir Square or Nasr City Sudanese Club.',
    meeting_location_notes_ar: 'ميدان التحرير أو النادي السوداني بمدينة نصر.',
    accepted_categories: ['documents', 'medication', 'clothing', 'food_dry'],
    prohibited_notes: 'Inspection photo audit mandatory.',
    status: 'scheduled',
    created_at: '2026-09-08T09:15:00Z',
  }
];

export const sampleAuditPhotos = [
  {
    id: 'photo-1',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
    caption: 'Verified unopened original insulin boxes + official Cairo University hospital prescription',
    category: 'prescriptions' as const,
    timestamp: '2026-09-08 14:15 EET'
  },
  {
    id: 'photo-2',
    url: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=500&auto=format&fit=crop&q=80',
    caption: 'Original sealed graduation transcript folder in transparent protective sleeve',
    category: 'contents' as const,
    timestamp: '2026-09-08 14:18 EET'
  },
  {
    id: 'photo-3',
    url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&auto=format&fit=crop&q=80',
    caption: 'Digital hanging scale reading: exactly 3.42 kg (rounded to 3.5 kg)',
    category: 'scale_weight' as const,
    timestamp: '2026-09-08 14:22 EET'
  }
];

export const sampleBankakReceiptUrl = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80';

export const mockShipments: ShipmentBooking[] = [
  {
    id: 'shipment-cairo-ps-001',
    tracking_number: 'WSL-2026-0909',
    trip_id: 'trip-cairo-portsudan-1',
    trip: mockTrips[0],
    sender_id: 'user-sender-1',
    sender: mockProfiles[1],
    recipient_name: 'Amna El-Nour',
    recipient_name_ar: 'آمنة النور سليمان',
    recipient_phone: '+249 912 345 678',
    recipient_city: 'Port Sudan',
    recipient_city_ar: 'بورتسودان',
    item_title: 'Prescribed Thyroid Medicine & Original Degree Certificates',
    item_title_ar: 'أدوية الغدة الدرقية الموصوفة وشهادات تخرج جامعية أصلية',
    item_description: '3 boxes of Euthyrox 100mcg with attached Egyptian doctor prescription, plus laminated Cairo University diploma for ministry authentication.',
    category: 'medication',
    weight_kg: 3.5,
    declared_value: 15000,
    currency: 'EGP',
    total_fee: 2975, // 3.5kg * 850 EGP
    current_step: 4, // Currently at Bankak payment step for interactive showcase!
    status: 'package_inspected',
    meeting_code: '7492',
    delivery_pin: '8319',
    steps: [
      {
        step_number: 1,
        title_en: 'Match & Booking Request',
        title_ar: 'التوافق وطلب الحجز',
        status: 'completed',
        completed_at: '2026-09-08T09:30:00Z',
        completed_by: 'user-sender-1'
      },
      {
        step_number: 2,
        title_en: 'Physical Meeting Confirmation',
        title_ar: 'تأكيد المقابلة الشخصية',
        status: 'completed',
        completed_at: '2026-09-08T14:10:00Z',
        completed_by: 'user-traveler-1',
        meeting_details: {
          scheduled_time: '2026-09-08 14:00 EET',
          meeting_address: 'Dokki Metro Station, Exit 2 (Next to Sudanese Cultural House)',
          meeting_city: 'Cairo',
          sender_confirmed: true,
          traveler_confirmed: true,
          security_code: '7492'
        }
      },
      {
        step_number: 3,
        title_en: 'Open Package Inspection & Photo Audit',
        title_ar: 'فحص الطرد المفتوح والتوثيق',
        status: 'completed',
        completed_at: '2026-09-08T14:25:00Z',
        completed_by: 'user-traveler-1',
        inspection_details: {
          photos: sampleAuditPhotos,
          checklist: {
            open_unsealed_box: true,
            no_prohibited_substances: true,
            valid_medical_prescription: true,
            scale_verified_weight_kg: 3.5,
            traveler_liability_acknowledged: true,
            inspection_location: 'Cairo - Dokki',
            inspected_at: '2026-09-08T14:25:00Z'
          }
        }
      },
      {
        step_number: 4,
        title_en: 'Bankak Direct Transfer & Screenshot Upload',
        title_ar: 'التحويل المباشر عبر بنكك',
        status: 'in_progress', // Ready for user to interact with!
        bankak_details: {
          bank_name: 'بنك الخرطوم (بنكك)',
          traveler_account_number: '2948192',
          traveler_account_name: 'محمد الأمين عثمان',
          amount: 2975,
          currency: 'EGP',
          transaction_ref_id: '',
          screenshot_url: '',
          sender_confirmed: false,
          traveler_verified: false
        }
      },
      {
        step_number: 5,
        title_en: 'Recipient Hand-off & Digital Sign-off',
        title_ar: 'تسليم المستلم والتوقيع الرقمي',
        status: 'pending',
        handoff_details: {
          recipient_name: 'Amna El-Nour',
          recipient_phone: '+249 912 345 678',
          recipient_id_type: 'National ID',
          recipient_id_last4: '4819',
          handover_city: 'Port Sudan',
          handover_address: 'Al-Matar Neighborhood, Near Port Sudan Customs House',
          entered_delivery_pin: '',
          correct_delivery_pin: '8319',
          signed_off: false
        }
      }
    ],
    created_at: '2026-09-08T09:00:00Z',
    updated_at: '2026-09-08T14:25:00Z'
  },
  {
    id: 'shipment-riyadh-ps-002',
    tracking_number: 'WSL-2026-0914',
    trip_id: 'trip-riyadh-portsudan-2',
    trip: mockTrips[1],
    sender_id: 'user-sender-1',
    sender: mockProfiles[1],
    recipient_name: 'Babiker Al-Karouri',
    recipient_name_ar: 'بابكر الكاروري',
    recipient_phone: '+249 915 221 990',
    recipient_city: 'Port Sudan',
    recipient_city_ar: 'بورتسودان',
    item_title: 'Family Blood Pressure Monitor & Cardiac Meds',
    item_title_ar: 'أجهزة قياس ضغط وسكر وأدوية قلبية للعائلة',
    item_description: 'Digital Omron blood pressure device and 4 boxes of prescription cardiac pills in original packing.',
    category: 'medication',
    weight_kg: 2.0,
    declared_value: 300,
    currency: 'SAR',
    total_fee: 240, // 2kg * 120 SAR
    current_step: 2,
    status: 'requested',
    meeting_code: '3819',
    delivery_pin: '4921',
    steps: [
      {
        step_number: 1,
        title_en: 'Match & Booking Request',
        title_ar: 'التوافق وطلب الحجز',
        status: 'completed',
        completed_at: '2026-09-09T10:00:00Z',
        completed_by: 'user-sender-1'
      },
      {
        step_number: 2,
        title_en: 'Physical Meeting Confirmation',
        title_ar: 'تأكيد المقابلة الشخصية',
        status: 'in_progress',
        meeting_details: {
          scheduled_time: '2026-09-17 17:30 AST',
          meeting_address: 'Al-Batha Sudanese Market, Riyadh',
          meeting_city: 'Riyadh',
          sender_confirmed: true,
          traveler_confirmed: false,
          security_code: '3819'
        }
      },
      {
        step_number: 3,
        title_en: 'Open Package Inspection & Photo Audit',
        title_ar: 'فحص الطرد المفتوح والتوثيق',
        status: 'pending'
      },
      {
        step_number: 4,
        title_en: 'Bankak Direct Transfer & Screenshot Upload',
        title_ar: 'التحويل المباشر عبر بنكك',
        status: 'pending'
      },
      {
        step_number: 5,
        title_en: 'Recipient Hand-off & Digital Sign-off',
        title_ar: 'تسليم المستلم والتوقيع الرقمي',
        status: 'pending'
      }
    ],
    created_at: '2026-09-09T10:00:00Z',
    updated_at: '2026-09-09T10:30:00Z'
  },
  {
    id: 'shipment-portsudan-cairo-003',
    tracking_number: 'WSL-2026-0920',
    trip_id: 'trip-portsudan-cairo-3',
    trip: mockTrips[2],
    sender_id: 'user-recipient-1',
    sender: mockProfiles[2],
    recipient_name: 'Dr. Omer Khalid',
    recipient_name_ar: 'د. عمر خالد حسن',
    recipient_phone: '+20 102 938 4811',
    recipient_city: 'Cairo',
    recipient_city_ar: 'القاهرة',
    item_title: 'Original University Degrees & Ministry Attestations',
    item_title_ar: 'شهادات تخرج جامعية أصلية وتوكيل رسمي موثق',
    item_description: 'Sudan High Education Ministry attestation file and sealed parchment folder.',
    category: 'documents',
    weight_kg: 1.0,
    declared_value: 200000,
    currency: 'SDG',
    total_fee: 25000, // 1kg * 25000 SDG
    current_step: 1,
    status: 'requested',
    meeting_code: '9041',
    delivery_pin: '1284',
    steps: [
      {
        step_number: 1,
        title_en: 'Match & Booking Request',
        title_ar: 'التوافق وطلب الحجز',
        status: 'completed',
        completed_at: '2026-09-10T11:00:00Z',
        completed_by: 'user-recipient-1'
      },
      {
        step_number: 2,
        title_en: 'Physical Meeting Confirmation',
        title_ar: 'تأكيد المقابلة الشخصية',
        status: 'pending'
      },
      {
        step_number: 3,
        title_en: 'Open Package Inspection & Photo Audit',
        title_ar: 'فحص الطرد المفتوح والتوثيق',
        status: 'pending'
      },
      {
        step_number: 4,
        title_en: 'Bankak Direct Transfer & Screenshot Upload',
        title_ar: 'التحويل المباشر عبر بنكك',
        status: 'pending'
      },
      {
        step_number: 5,
        title_en: 'Recipient Hand-off & Digital Sign-off',
        title_ar: 'تسليم المستلم والتوقيع الرقمي',
        status: 'pending'
      }
    ],
    created_at: '2026-09-10T11:00:00Z',
    updated_at: '2026-09-10T11:00:00Z'
  }
];

export const mockReviews: CommunityReview[] = [
  {
    id: 'rev-1',
    author_name: 'Dr. Omer Khalid',
    author_city: 'Cairo',
    target_user_id: 'user-traveler-1',
    rating: 5,
    comment: 'Mohamed is extremely meticulous. He weighed the parcel on a digital scale in front of me at Dokki Metro and checked the doctor prescription. Delivered safely to my father in Port Sudan in 24 hours.',
    comment_ar: 'الأخ محمد دقيق جداً وأمين. وزن الطرد بالميزان أمامي في الدقي وتأكد من الروشتة وسلم الدواء لوالدي في بورتسودان في أقل من ٢٤ ساعة.',
    route: 'Cairo → Port Sudan',
    created_at: '2026-08-28'
  },
  {
    id: 'rev-2',
    author_name: 'Fatima El-Zubair',
    author_city: 'Riyadh',
    target_user_id: 'user-traveler-2',
    rating: 5,
    comment: 'Smooth Bankak transaction and instant receipt confirmation. Delivered original passport renewal documents to Port Sudan ministry.',
    comment_ar: 'معاملة بنكك سلسة ومباشرة. وصل أوراق تجديد الجواز لوزارة الخارجية ببورتسودان بكل أمانة.',
    route: 'Riyadh → Port Sudan',
    created_at: '2026-09-01'
  }
];
