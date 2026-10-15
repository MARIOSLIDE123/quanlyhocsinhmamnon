import React from 'react';

export function getStudentInitials(name: string): string {
  if (!name || !name.trim()) return 'BÉ';
  const clean = name.trim();
  const parts = clean.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  // Take first letters of the last two words (e.g. "Hoàng An Nhiên" -> "AN")
  const last = parts[parts.length - 1];
  const secondLast = parts[parts.length - 2];
  return (secondLast[0] + last[0]).toUpperCase();
}

const COLOR_SCHEMES = [
  { name: 'rose', gradient: 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white border-rose-200 shadow-rose-100' },
  { name: 'sky', gradient: 'bg-gradient-to-tr from-sky-500 to-blue-500 text-white border-sky-200 shadow-sky-100' },
  { name: 'emerald', gradient: 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-white border-emerald-200 shadow-emerald-100' },
  { name: 'amber', gradient: 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white border-amber-200 shadow-amber-100' },
  { name: 'indigo', gradient: 'bg-gradient-to-tr from-indigo-500 to-violet-500 text-white border-indigo-200 shadow-indigo-100' },
  { name: 'violet', gradient: 'bg-gradient-to-tr from-purple-500 to-fuchsia-500 text-white border-purple-200 shadow-purple-100' }
];

export function getStudentColor(name: string): typeof COLOR_SCHEMES[0] {
  if (!name) return COLOR_SCHEMES[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % COLOR_SCHEMES.length;
  return COLOR_SCHEMES[index];
}

interface Props {
  name: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  colorName?: string;
  className?: string;
}

export const StudentAvatarBadge: React.FC<Props> = ({
  name,
  initials,
  size = 'md',
  colorName,
  className = ''
}) => {
  const displayInitials = initials || getStudentInitials(name);
  const colorScheme = colorName 
    ? (COLOR_SCHEMES.find(c => c.name === colorName) || COLOR_SCHEMES[0])
    : getStudentColor(name);

  const sizeClasses = {
    sm: 'h-8 w-8 text-[11px] rounded-xl font-bold shadow-xs',
    md: 'h-10 w-10 text-xs rounded-xl font-extrabold shadow-xs',
    lg: 'h-14 w-14 text-base rounded-2xl font-black shadow-sm',
    xl: 'h-20 w-20 text-2xl rounded-3xl font-black shadow-md'
  };

  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center select-none border tracking-wider transition transform hover:scale-105 ${colorScheme.gradient} ${sizeClasses[size]} ${className}`}
      title={name}
    >
      <span>{displayInitials}</span>
    </div>
  );
};
