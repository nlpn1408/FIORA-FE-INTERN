// import { Icons } from '@/components/Icon';
import { BookIcon, InfoIcon, MailIcon, PlayCircleIcon } from 'lucide-react';

export type Language = 'vi' | 'en';
export type Currency = 'vnd' | 'usd';

export const menuSettingItems = [
  // { label: 'Landing Page', icon: Icons.dashboard, url: '/setting/landing', role: 'Admin' },
];

export const helpItems = [
  { label: 'FAQs', icon: BookIcon, url: '/' },
  { label: 'User Tutorials', icon: PlayCircleIcon, url: '/' },
  { label: 'About Us', icon: InfoIcon, url: '/' },
  { label: 'Contact Us', icon: MailIcon, url: '/' },
];
