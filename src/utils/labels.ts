import { ItemCategory, Language } from '../types';

export interface CategoryInfo {
  value: ItemCategory;
  ar: string;
  en: string;
  shortAr: string;
  shortEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

export const CATEGORY_DEFINITIONS: Record<ItemCategory, CategoryInfo> = {
  medication: {
    value: 'medication',
    ar: 'أدوية علاجية موصوفة (مع الروشتة)',
    en: 'Vital Prescribed Medication (with Rx)',
    shortAr: 'أدوية علاجية',
    shortEn: 'Medication',
    descriptionAr: 'أدوية الأمراض المزمنة والعلاجات المعتمدة مع روشتة الطبيب',
    descriptionEn: 'Essential prescribed treatments with valid doctor prescription'
  },
  documents: {
    value: 'documents',
    ar: 'وثائق وشهادات رسمية',
    en: 'Official Academic & Legal Documents',
    shortAr: 'وثائق رسمية',
    shortEn: 'Documents',
    descriptionAr: 'شهادات جامعية وأوراق ثبوتية ووكالات شرعية',
    descriptionEn: 'Degree certificates, passports, embassy and legal documents'
  },
  personal_goods: {
    value: 'personal_goods',
    ar: 'أغراض ومقتنيات شخصية',
    en: 'Personal Goods & Essentials',
    shortAr: 'أغراض شخصية',
    shortEn: 'Personal Goods',
    descriptionAr: 'مقتنيات شخصية وهدايا خفيفة غير تجارية',
    descriptionEn: 'Personal belongings and non-commercial diaspora gifts'
  },
  clothing: {
    value: 'clothing',
    ar: 'ملابس وأقمشة شخصية',
    en: 'Clothing & Textiles',
    shortAr: 'ملابس',
    shortEn: 'Clothing',
    descriptionAr: 'ملابس شخصية ومفروشات خفيفة',
    descriptionEn: 'Personal clothes, fabrics, and light essentials'
  },
  electronics: {
    value: 'electronics',
    ar: 'أجهزة إلكترونية شخصية',
    en: 'Personal Electronics (Open Box)',
    shortAr: 'إلكترونيات',
    shortEn: 'Electronics',
    descriptionAr: 'هواتف وأجهزة شخصية مفتوحة غير تجارية مع الفاتورة',
    descriptionEn: 'Personal devices, open box with valid proof of purchase'
  },
  food_dry: {
    value: 'food_dry',
    ar: 'أغذية جافة ومونة منزلية',
    en: 'Specialty Dry Foods & Spices',
    shortAr: 'أغذية جافة',
    shortEn: 'Dry Foods',
    descriptionAr: 'بهارات وأغذية جافة مغلفة للاستخدام الشخصي',
    descriptionEn: 'Packaged dry foods, spices, and domestic pantry items'
  }
};

export const CATEGORIES_LIST: CategoryInfo[] = Object.values(CATEGORY_DEFINITIONS);

/**
 * Returns localized category label from the single source-of-truth.
 * Prevents any raw enum string (e.g. "personal_goods", "medication", "food_dry")
 * from leaking into the UI.
 */
export function getCategoryLabel(
  rawCategory: string | undefined | null,
  language: Language = 'ar',
  variant: 'short' | 'full' = 'short'
): string {
  if (!rawCategory) return '';

  const normalized = rawCategory.toLowerCase().trim();
  // Check exact key
  let info = CATEGORY_DEFINITIONS[normalized as ItemCategory];

  // Fallback for plural forms like 'medications'
  if (!info && normalized.endsWith('s')) {
    const singular = normalized.slice(0, -1);
    info = CATEGORY_DEFINITIONS[singular as ItemCategory];
  }

  if (info) {
    if (variant === 'full') {
      return language === 'ar' ? info.ar : info.en;
    }
    return language === 'ar' ? info.shortAr : info.shortEn;
  }

  // If unknown category, format cleanly rather than showing snake_case
  const humanized = rawCategory.replace(/_/g, ' ');
  return humanized;
}

/**
 * Localized shipment statuses preventing raw enum leaks
 */
export function getShipmentStatusLabel(status: string, language: Language = 'ar'): string {
  const map: Record<string, { ar: string; en: string }> = {
    pending_match: { ar: 'بانتظار الموافقة', en: 'Pending Match' },
    meeting_confirmed: { ar: 'تمت المقابلة', en: 'Meeting Confirmed' },
    package_inspected: { ar: 'تم فحص الطرد', en: 'Package Inspected' },
    funds_transferred: { ar: 'تم تحويل بنكك', en: 'Bankak Transferred' },
    delivered: { ar: 'مكتملة ومسلمة', en: 'Delivered' },
    scheduled: { ar: 'مجدولة', en: 'Scheduled' },
    in_transit: { ar: 'في المسار', en: 'In Transit' },
    completed: { ar: 'مكتملة', en: 'Completed' },
    cancelled: { ar: 'ملغاة', en: 'Cancelled' }
  };

  const entry = map[status];
  if (entry) {
    return language === 'ar' ? entry.ar : entry.en;
  }
  return status.replace(/_/g, ' ');
}
