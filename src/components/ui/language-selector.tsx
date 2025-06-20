'use client';

import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const languages = [
  { 
    code: 'en', 
    name: 'English',
    flag: (
      <svg className="h-4 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
        <path fill="#012169" d="M0 0h640v480H0z"/>
        <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"/>
        <path fill="#C8102E" d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"/>
        <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z"/>
        <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z"/>
      </svg>
    )
  },
  { 
    code: 'de', 
    name: 'Deutsch',
    flag: (
      <svg className="h-4 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
        <path fill="#000" d="M0 0h640v160H0z"/>
        <path fill="#DD0000" d="M0 160h640v160H0z"/>
        <path fill="#FFCE00" d="M0 320h640v160H0z"/>
      </svg>
    )
  }
];

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onlyFlag?: boolean;
  className?: string;
}

export function LanguageSelector({
  currentLanguage,
  onLanguageChange,
  onlyFlag = false,
  className = '',
}: LanguageSelectorProps) {
  const selectedLanguage = languages.find(lang => lang.code === currentLanguage);

  return (
    <Select value={currentLanguage} onValueChange={onLanguageChange}>
      <SelectTrigger className={cn(onlyFlag ? 'w-10 justify-center' : 'w-[140px]', className)}>
        <div className={cn("flex items-center", onlyFlag ? "justify-center" : "gap-2")}>
          {selectedLanguage?.flag}
          {!onlyFlag && (
            <span>{selectedLanguage?.name}</span>
          )}
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem
            key={language.code}
            value={language.code}
            className="pl-2 [&>span:first-child]:hidden"
          >
            <div className="flex items-center gap-2">
              {language.flag}
              <span>{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 