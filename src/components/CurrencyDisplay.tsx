import React from 'react';
import { Currency, Language } from '../types';

interface CurrencyDisplayProps {
  amount: number;
  currency: Currency;
  language: Language;
  perKg?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showFlag?: boolean;
}

export interface CurrencyConfig {
  code: Currency;
  flag: string;
  nameAr: string;
  nameEn: string;
  symbolAr: string;
  symbolEn: string;
  codeColor: string;
}

export const CURRENCY_CONFIGS: Record<Currency, CurrencyConfig> = {
  SDG: {
    code: 'SDG',
    flag: '🇸🇩',
    nameAr: 'جنيه سوداني',
    nameEn: 'Sudanese Pound',
    symbolAr: 'ج.س',
    symbolEn: 'SDG',
    codeColor: 'text-emerald-700'
  },
  SAR: {
    code: 'SAR',
    flag: '🇸🇦',
    nameAr: 'ريال سعودي',
    nameEn: 'Saudi Riyal',
    symbolAr: 'ر.س',
    symbolEn: 'SAR',
    codeColor: 'text-amber-800'
  },
  EGP: {
    code: 'EGP',
    flag: '🇪🇬',
    nameAr: 'جنيه مصري',
    nameEn: 'Egyptian Pound',
    symbolAr: 'ج.م',
    symbolEn: 'EGP',
    codeColor: 'text-sky-800'
  },
  USD: {
    code: 'USD',
    flag: '🇺🇸',
    nameAr: 'دولار أمريكي',
    nameEn: 'US Dollar',
    symbolAr: '$',
    symbolEn: 'USD',
    codeColor: 'text-slate-800'
  }
};

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  currency,
  language,
  perKg = false,
  size = 'md',
  className = '',
  showFlag = true
}) => {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.SDG;

  const sizeStyles = {
    sm: {
      amount: 'text-xs font-bold text-slate-900',
      tag: 'text-[11px] font-semibold',
      flag: 'text-xs'
    },
    md: {
      amount: 'text-sm sm:text-base font-bold text-slate-900',
      tag: 'text-xs font-semibold',
      flag: 'text-xs'
    },
    lg: {
      amount: 'text-xl sm:text-2xl font-black text-slate-900',
      tag: 'text-xs sm:text-sm font-bold',
      flag: 'text-sm'
    }
  }[size];

  const formattedAmount = amount.toLocaleString();
  const currencyLabel = language === 'ar' ? config.symbolAr : config.symbolEn;
  const perKgLabel = language === 'ar' ? ' / كجم' : ' / kg';

  return (
    <div className={`inline-flex items-baseline gap-1 ${className}`}>
      {/* High-contrast bold black number wrapped in bdi */}
      <bdi dir="ltr" className={`font-mono tabular-nums ${sizeStyles.amount}`}>
        {formattedAmount}
      </bdi>

      {/* Distinct currency label wrapped in bdi */}
      <bdi
        dir="ltr"
        className={`inline-flex items-center gap-0.5 ${config.codeColor} ${sizeStyles.tag}`}
        title={`${language === 'ar' ? config.nameAr : config.nameEn} (${config.code})`}
      >
        {showFlag && <span className={sizeStyles.flag}>{config.flag}</span>}
        <span>{currencyLabel}</span>
      </bdi>

      {perKg && (
        <bdi dir="rtl" className="text-xs text-slate-500 font-medium">
          {perKgLabel}
        </bdi>
      )}
    </div>
  );
};
