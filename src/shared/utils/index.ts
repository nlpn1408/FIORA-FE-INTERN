import { iconOptions } from '@/shared/constants/data';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const useGetIconLabel = (icon: string): string => {
  return (
    iconOptions
      .find((option) => option.options.some((o) => o.value === icon))
      ?.options.find((o) => o.value === icon)?.label || ''
  );
};

export const formatCurrency = (value: number, currency: string = 'VND') => {
  // Handle compact notation for large numbers
  let formattedValue = value;
  let suffix = '';

  if (Math.abs(value) >= 1_000_000) {
    // Convert to millions (M)
    formattedValue = value / 1_000_000;
    suffix = 'M';
  } else if (Math.abs(value) >= 1_000) {
    // Convert to thousands (K)
    formattedValue = value / 1_000;
    suffix = 'K';
  }

  // Determine the locale and currency format
  const formatter =
    currency === 'USD'
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: suffix ? 2 : 0, // Use 2 decimals for compact notation
          maximumFractionDigits: suffix ? 2 : 0, // Limit decimals for compact notation
        })
      : new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          minimumFractionDigits: suffix ? 2 : 0, // Use 2 decimals for compact notation
          maximumFractionDigits: suffix ? 2 : 0, // Limit decimals for compact notation
        });

  // Format the number and insert suffix before the currency symbol
  const formatted = formatter.format(formattedValue);
  if (suffix) {
    if (currency === 'USD') {
      // For USD, move the suffix after the number but keep $ at the start
      const numericPart = formatted.replace('$', '').trim();
      return `$${numericPart}${suffix}`;
    } else {
      // For VND, split at ₫ and place suffix before the currency symbol
      const parts = formatted.split('₫').map((part) => part.trim());
      return `${parts[0]}${suffix} ₫${parts[1] || ''}`;
    }
  }

  return formatted;
};

export const convertVNDToUSD = (amountVND: number): number => {
  const exchangeRate = 25000; // 1 USD = 25000 VND
  return amountVND / exchangeRate;
};

export const convertUSDToVND = (amountUSD: number): number => {
  const exchangeRate = 25000; // 1 USD = 25000 VND
  return amountUSD * exchangeRate;
};

export const calculateAvailableLimit = (limit: string, balance: string): string => {
  const limitValue = Number.parseFloat(limit) || 0;
  const balanceValue = Number.parseFloat(balance) || 0;
  return (limitValue + balanceValue).toFixed(2);
};

export const isImageUrl = (str: string): boolean => {
  return str.startsWith('http') || str.startsWith('https') || str.startsWith('data:');
};
