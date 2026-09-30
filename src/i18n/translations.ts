import { Language } from '../types';

export const translations = {
  en: {
    brand: 'Wasla',
    brandSubtitle: 'Sudanese Diaspora Travel Logistics',
    tagline: 'Direct diaspora travel logistics across Cairo, Gulf hubs, and Port Sudan',
    switchLang: 'العربية',
    role: 'Available Routes',
    availableRoutes: 'Available Routes',
    roleSender: 'Sender (Cairo)',
    roleTraveler: 'Traveler (Port Sudan Bound)',
    roleRecipient: 'Recipient (Port Sudan)',
    
    // Navigation
    navTrips: 'Available Trips',
    navTripsTab: 'Available Trips',
    navMyShipments: 'Package Requests',
    navShipmentsTab: 'Package Requests',
    navPostTrip: 'Offer Luggage Space',
    navTrustCenter: 'Diaspora Trust Protocol',
    navSupabaseSync: 'Supabase Schema & DB',

    // 5-Step Audit
    auditTrailTitle: '5-Step In-Person Audit Trail',
    auditTrailSubtitle: 'Zero-risk, in-person verification designed for local banking realities',
    step1Title: '1. Match & Booking Request',
    step1Desc: 'Agree on luggage weight, items, and Bankak reward in advance',
    step2Title: '2. Physical Meeting Confirmation',
    step2Desc: 'In-person rendezvous with 4-digit mutual security code',
    step3Title: '3. Open Package Inspection & Photo Audit',
    step3Desc: 'Mandatory unsealed verification and photographic luggage proof',
    step4Title: '4. Bankak Direct Transfer & Screenshot Upload',
    step4Desc: 'Direct Bank of Khartoum transfer with transaction reference ID',
    step5Title: '5. Recipient Hand-off & Digital Sign-off',
    step5Desc: 'Final PIN delivery verification and digital receiver signature',

    // Step Actions & States
    statusPending: 'Pending',
    statusInProgress: 'In Progress',
    statusCompleted: 'Verified & Completed',
    stepCompletedBadge: 'Audit Step Cleared',
    
    // Step 1
    bookingDetails: 'Booking Overview',
    weight: 'Weight',
    declaredValue: 'Declared Value',
    rewardFee: 'Luggage Space Fee',
    itemCategory: 'Item Category',
    senderLabel: 'Sender',
    travelerLabel: 'Traveler',
    recipientLabel: 'Recipient',
    confirmBookingBtn: 'Confirm Match Request',

    // Step 2
    meetingLocation: 'Designated Meeting Location',
    scheduledTime: 'Rendezvous Time',
    securityPin: 'Mutual Handshake PIN',
    securityPinHelp: 'Both sender and traveler must confirm this 4-digit code in person before opening items.',
    senderConfirmedMeeting: 'Sender Confirmed In-Person',
    travelerConfirmedMeeting: 'Traveler Confirmed In-Person',
    confirmMeetingBtn: 'Confirm In-Person Presence',

    // Step 3
    inspectionHeader: 'Mandatory Luggage Security Inspection',
    inspectionNotice: 'The traveler must personally see every item inside the unsealed bag before accepting it into their international luggage allowance.',
    checklistOpen: 'Package presented completely open and unsealed',
    checklistNoContraband: 'Zero prohibited liquids, sealed mystery packages, or unauthorized electronics',
    checklistPrescription: 'Medical items accompanied by official doctor prescription & patient ID',
    checklistWeightVerified: 'Verified on portable luggage scale (kg):',
    checklistLiability: 'Both parties agree traveler is carrying verified personal belongings',
    auditPhotos: 'Audit Photos & Evidence',
    uploadPhotoBtn: 'Upload Inspection Photo',
    useSamplePhotosBtn: 'Auto-fill Verification Photos',
    confirmInspectionBtn: 'Approve & Seal Package',

    // Step 4
    bankakHeader: 'Direct Bank of Khartoum (Bankak) Settlement',
    bankakNotice: 'Due to international card sanctions and local banking dynamics, payment is settled directly into the traveler’s Bankak account prior to flight departure.',
    bankakAccountName: 'Traveler Bankak Name',
    bankakAccountNumber: 'Bankak Account Number',
    transferAmount: 'Agreed Transfer Amount',
    enterRefId: 'Bankak Transaction Reference ID (الرقم المرجعي)',
    refIdPlaceholder: 'e.g., 20260909-847291',
    uploadReceipt: 'Upload Bankak Transfer Screenshot',
    useSampleReceiptBtn: 'Load Bankak Transfer Slip',
    verifyReceiptTravelerBtn: 'Confirm Bankak Funds Received (Traveler)',
    submitPaymentSenderBtn: 'Submit Bankak Slip for Verification',
    fundsConfirmedBadge: 'Bankak Funds Verified in Account',

    // Step 5
    handoffHeader: 'Port Sudan Recipient Delivery & Hand-off',
    handoffNotice: 'Package safely arrived in Port Sudan. Meet the recipient, verify identity, enter delivery PIN, and obtain digital sign-off.',
    deliveryPinLabel: 'Recipient 4-Digit Delivery PIN',
    digitalSignatureLabel: 'Recipient Digital Signature on Touch Screen',
    clearSignature: 'Clear Signature',
    confirmDeliveryBtn: 'Finalize Delivery & Sign-off',
    deliveredSuccess: 'Package Delivered Successfully! Trust score updated.',

    // General & Cards
    availableKg: 'Available Space',
    pricePerKg: 'per kg',
    departure: 'Departure',
    arrival: 'Arrival',
    route: 'Route',
    bookSpaceBtn: 'Contact Traveler',
    requestShippingBtn: 'Request Shipping',
    startChatBtn: 'Start Direct Conversation',
    directChat: 'Direct Chat',
    verifiedTraveler: 'Verified Traveler',
    completedShipments: 'completed shipments',
    viewAuditBtn: 'View Audit Trail',
    trustScore: 'Trust Score',
    passportVerified: 'Passport Verified',
    bankakVerified: 'Bankak Verified',
    diasporaVouched: 'Community Vouched',
    searchPlaceholder: 'Search by city (Cairo, Port Sudan, Riyadh, Jeddah)...',
    filterAll: 'All Routes',
    filterCairoPortSudan: 'Cairo → Port Sudan',
    filterGulfPortSudan: 'Gulf → Port Sudan',
    
    // Prohibited Items
    prohibitedTitle: 'Luggage Regulations & Prohibited Items',
    allowedWithRules: 'Allowed with strict documentation: Prescribed insulin, cardiac medicine, university certificates, baby formula, sealed personal electronics with receipt.',
    strictlyBanned: 'Strictly banned: Sealed mystery boxes, commercial medicine quantities, unauthorized SIM cards, cash above border customs allowance.',

    // Supabase
    supabaseTitle: 'Supabase Architecture & Schema',
    supabaseSubtitle: 'Designed for production PostgreSQL tables with RLS and instant sync',
    copySqlBtn: 'Copy SQL DDL Schema',
    sqlCopied: 'Copied SQL!',
    localDataStatus: 'Storage State: Active in Browser LocalStorage'
  },

  ar: {
    brand: 'وصلة',
    brandSubtitle: 'منصة لوجستيات وسفر الجالية السودانية',
    tagline: 'شحن أمانات بين القاهرة ودول الخليج وبورتسودان عبر مسافرين معتمدين',
    switchLang: 'English',
    role: 'المسارات المتاحة',
    availableRoutes: 'المسارات المتاحة',
    roleSender: 'المرسل (القاهرة)',
    roleTraveler: 'المسافر (متجه لبورتسودان)',
    roleRecipient: 'المستلم (بورتسودان)',

    // Navigation
    navTrips: 'رحلات المسافرين',
    navTripsTab: 'رحلات المسافرين',
    navMyShipments: 'طلبات الشحنات',
    navShipmentsTab: 'طلبات الشحنات',
    navPostTrip: 'إضافة وزن متاح (مسافر)',
    navTrustCenter: 'بروتوكول الثقة والأمان',
    navSupabaseSync: 'قاعدة البيانات (سوبابيز)',

    // 5-Step Audit
    auditTrailTitle: 'مسار التدقيق الحضوري خماسي الخطوات',
    auditTrailSubtitle: 'نظام فحص وتدقيق شخصي متكامل يناسب واقع المعاملات المالية المباشرة (بنكك)',
    step1Title: '١. التوافق وطلب الحجز المسبق',
    step1Desc: 'الاتفاق المسبق على نوع الأغراض، الوزن، ومقابل الأمانة عبر بنكك',
    step2Title: '٢. تأكيد المقابلة الشخصية حضورياً',
    step2Desc: 'اللقاء الميداني وتأكيد رمز الأمان المشترك المكون من ٤ أرقام',
    step3Title: '٣. فحص الطرد المفتوح والتوثيق الفوتوغرافي',
    step3Desc: 'معاينة الأغراض غير المغلقة وتصوير المحتويات ووزنها بالميزان',
    step4Title: '٤. التحويل المباشر عبر بنكك ورفع الإشعار',
    step4Desc: 'تحويل مباشر لحساب المسافر في بنك الخرطوم وإدخال الرقم المرجعي',
    step5Title: '٥. تسليم المستلم والتوقيع الرقمي',
    step5Desc: 'مطابقة رمز التسليم وتوقيع المستلم النهائي ببورتسودان إلكترونياً',

    // Step Actions & States
    statusPending: 'قيد الانتظار',
    statusInProgress: 'جاري الإجراء',
    statusCompleted: 'تم التدقيق والاكتمال',
    stepCompletedBadge: 'تم اجتياز الخطوة بنجاح',

    // Step 1
    bookingDetails: 'تفاصيل الحجز',
    weight: 'الوزن',
    declaredValue: 'القيمة التقريبية',
    rewardFee: 'أتعاب نقل الأمانة',
    itemCategory: 'تصنيف الأغراض',
    senderLabel: 'المرسل',
    travelerLabel: 'المسافر',
    recipientLabel: 'المستلم',
    confirmBookingBtn: 'تأكيد طلب التوافق',

    // Step 2
    meetingLocation: 'موقع المقابلة المتفق عليه',
    scheduledTime: 'موعد اللقاء',
    securityPin: 'رمز المقابلة المشترك',
    securityPinHelp: 'يتحقق الطرفان من هذا الرمز المكون من ٤ أرقام قبل فتح الأغراض وفحصها.',
    senderConfirmedMeeting: 'أكد المرسل حضوره في الموقع',
    travelerConfirmedMeeting: 'أكد المسافر حضوره في الموقع',
    confirmMeetingBtn: 'تأكيد الحضور في موقع المقابلة',

    // Step 3
    inspectionHeader: 'الفحص الأمني الإلزامي للطرد المفتوح',
    inspectionNotice: 'يجب على المسافر رؤية كل قطعة داخل الحقيبة المفتوحة بعينيه والتأكد التام منها قبل إغلاقها وقبولها في وزنه الشخصي.',
    checklistOpen: 'تم تقديم الطرد مفتوحاً تماماً بدون أي علب مغلقة بإحكام',
    checklistNoContraband: 'خلو الطرد تماماً من أي سوائل محظورة، أجهزة مجهولة، أو مواد غير مصرح بها',
    checklistPrescription: 'الأدوية الحيوية مصحوبة بروشتة طبية معتمدة ورقم هوية المريض',
    checklistWeightVerified: 'الوزن المؤكد على ميزان الأمتعة (كجم):',
    checklistLiability: 'إقرار متبادل بأن الأغراض شخصية وقانونية بالكامل',
    auditPhotos: 'صور التوثيق والتدقيق',
    uploadPhotoBtn: 'رفع صورة فحص',
    useSamplePhotosBtn: 'إدراج صور توثيق نموذجية',
    confirmInspectionBtn: 'اعتماد الفحص وإغلاق الطرد',

    // Step 4
    bankakHeader: 'السداد المباشر عبر تطبيق بنكك (بنك الخرطوم)',
    bankakNotice: 'نظراً لواقع التحويلات البنكية، يتم تحويل أتعاب المسافر مباشرة لحسابه في بنكك قبل موعد السفر مع رفع الإشعار.',
    bankakAccountName: 'اسم صاحب حساب بنكك',
    bankakAccountNumber: 'رقم حساب بنكك (بنك الخرطوم)',
    transferAmount: 'المبلغ المتفق عليه',
    enterRefId: 'الرقم المرجعي للإشعار (بنكك)',
    refIdPlaceholder: 'مثال: 20260909-847291',
    uploadReceipt: 'رفع صورة إشعار التحويل من بنكك',
    useSampleReceiptBtn: 'إدراج إشعار بنكك نموذجي',
    verifyReceiptTravelerBtn: 'تأكيد استلام المبلغ في الحساب (المسافر)',
    submitPaymentSenderBtn: 'إرسال الإشعار للتحقق',
    fundsConfirmedBadge: 'تم التحقق من وصول الرصيد للحساب',

    // Step 5
    handoffHeader: 'تسليم الأمانة للمستلم ببورتسودان والتوقيع',
    handoffNotice: 'وصل الطرد بحمد الله إلى بورتسودان. قم بمطابقة هوية المستلم ورمز الأمان ثم التوقيع الإلكتروني على الشاشة.',
    deliveryPinLabel: 'رمز الاستلام السري (٤ أرقام)',
    digitalSignatureLabel: 'توقيع المستلم الرقمي على الشاشة باللمس',
    clearSignature: 'مسح التوقيع',
    confirmDeliveryBtn: 'إتمام التسليم النهائي وتحديث السجل',
    deliveredSuccess: 'تم تسليم الأمانة بنجاح وتحديث نقاط الثقة!',

    // General & Cards
    availableKg: 'الوزن المتاح',
    pricePerKg: 'لكل كجم',
    departure: 'تاريخ السفر',
    arrival: 'تاريخ الوصول',
    route: 'خط السير',
    bookSpaceBtn: 'تواصل مع المسافر',
    requestShippingBtn: 'طلب شحن',
    startChatBtn: 'بدء المحادثة المباشرة',
    directChat: 'المحادثة المباشرة',
    verifiedTraveler: 'مسافر معتمد',
    completedShipments: 'شحنة مكتملة',
    viewAuditBtn: 'متابعة مسار التدقيق',
    trustScore: 'مؤشر الموثوقية',
    passportVerified: 'جواز سفر موثق',
    bankakVerified: 'حساب بنكك موثق',
    diasporaVouched: 'تزكية الجالية السودانية',
    searchPlaceholder: 'ابحث بالمدينة أو المسافر أو رقم الشحنة...',
    filterAll: 'كافة المسارات',
    filterCairoPortSudan: 'القاهرة ⟵ بورتسودان',
    filterGulfPortSudan: 'الخليج ⟵ بورتسودان',

    // Prohibited Items
    prohibitedTitle: 'دليل الأغراض المصرح بها والممنوعة',
    allowedWithRules: 'مسموح بشروط دقيقة: أدوية الأمراض المزمنة مع الروشتة، أوراق وشهادات جامعية، حليب أطفال، أجهزة شخصية مفتوحة مع الفاتورة.',
    strictlyBanned: 'ممنوع منعاً باتاً: الصناديق المغلقة التي لا يمكن فحصها، الأدوية بكميات تجارية، شرائح الاتصال غير المسجلة، مبالغ النقد المتجاوزة للحد الجمركي.',

    // Supabase
    supabaseTitle: 'بنية وجداول سوبابيز (Supabase SQL)',
    supabaseSubtitle: 'جاهز للنقل المباشر إلى قاعدة بيانات PostgreSQL مع سياسات RLS',
    copySqlBtn: 'نسخ استعلامات SQL للإنشاء',
    sqlCopied: 'تم نسخ كود SQL!',
    localDataStatus: 'حالة التخزين: نشط محلياً في متصفحك (LocalStorage)'
  }
};
