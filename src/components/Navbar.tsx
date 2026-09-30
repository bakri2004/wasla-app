import React from 'react';
import { 
  Package, 
  UserCheck, 
  Plus, 
  ChevronDown
} from 'lucide-react';
import { Language, UserRole } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  language: Language;
  onToggleLanguage?: () => void;
  activeRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onOpenCreateTrip: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  activeRole,
  onChangeRole,
  onOpenCreateTrip
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Header Bar */}
        <div className="h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Brand Logo & Name (Clean, unclipped, no redundant subtitle or pills) */}
          <div className="flex items-center gap-2.5 select-none shrink-0">
            <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
              وصلة
            </span>
          </div>

          {/* Right Actions: Persona Simulator & Post Trip Button (No English toggle to eliminate clutter and clipping) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Persona Simulator Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
                <UserCheck className="w-3.5 h-3.5 text-teal-700" />
                <span className="text-slate-500 hidden sm:inline">{language === 'ar' ? 'الدور:' : 'Role:'}</span>
                <span className="font-semibold text-slate-900">
                  {activeRole === 'sender' && t.roleSender}
                  {activeRole === 'traveler' && t.roleTraveler}
                  {activeRole === 'recipient' && t.roleRecipient}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>

              {/* Dropdown Menu */}
              <div className="absolute end-0 mt-1 w-52 bg-white rounded-lg border border-slate-200 p-1 hidden group-hover:block z-50 shadow-none">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2.5 py-1 text-start">
                  {language === 'ar' ? 'تبديل دور المستخدم' : 'Switch Role'}
                </div>
                <button
                  onClick={() => onChangeRole('traveler')}
                  className={`w-full text-start px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between ${
                    activeRole === 'traveler' ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{t.roleTraveler}</span>
                  {activeRole === 'traveler' && <span className="w-1.5 h-1.5 rounded-full bg-teal-700"></span>}
                </button>
                <button
                  onClick={() => onChangeRole('sender')}
                  className={`w-full text-start px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between ${
                    activeRole === 'sender' ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{t.roleSender}</span>
                  {activeRole === 'sender' && <span className="w-1.5 h-1.5 rounded-full bg-teal-700"></span>}
                </button>
                <button
                  onClick={() => onChangeRole('recipient')}
                  className={`w-full text-start px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between ${
                    activeRole === 'recipient' ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{t.roleRecipient}</span>
                  {activeRole === 'recipient' && <span className="w-1.5 h-1.5 rounded-full bg-teal-700"></span>}
                </button>
              </div>
            </div>

            {/* Post Trip Button */}
            <button
              onClick={onOpenCreateTrip}
              className="px-3 py-1.5 sm:py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-none"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>{language === 'ar' ? 'إضافة رحلة' : 'Add Trip'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
