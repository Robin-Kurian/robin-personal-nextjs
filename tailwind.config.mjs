import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
	darkMode: ["class"],
	content: [
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				poppins: ["var(--font-poppins)"],
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))'
				},
				'color-header/input-text': '#1B1B1B',
				'color-title-text': '#535558',
				'color-body-text': '#242424',
				'color-label-text': '#787878',
				'color-error-text': '#CD241A',
				'color-success-s50': '#00A15B',
				'color-button-text': '#ffffff',
				'color-secondary-s05': '#0C0C0C',
				'color-secondary-s15': '#242424',
				'color-secondary-s30': '#484848',
				'color-secondary-s50': '#787878',
				'color-secondary-s60': '#939393',
				'color-secondary-s70': '#AEAEAE',
				'color-secondary-s80': '#C9C9C9',
				'color-secondary-s90': '#E4E4E4',
				'color-secondary-s95': '#F4F4F4',
				'color-primary-p40': '#2755CE',
				'color-primary-p50': '#316AFF',
				'color-primary-p60': '#83A6FF',
				'color-primary-p70': '#B1C6FC',
				'color-primary-p80': '#CCDAFC',
				'color-primary-p90': '#E6EDFF',
				'color-primary-p100': '#F0F8FF',
				'color-primary-p105': '#FCFDFF',
				'color-purple-p40': '#9E66C3',
				'color-purple-p50': '#B57EDC',
				'color-purple-p60': '#D1A1F6',
				'color-purple-p70': '#D9B3F8',
				'color-purple-p80': '#E5CAFA',
				'color-purple-p90': '#EEDCFC',
				'color-purple-p100': '#F2E6FC',
				'color-error-e90': '#EFD1CF',
				'color-light-mint': '#E7FFF4',
				'color-basement': '#FFF9E5',
				'color-primary-p85': 'rgba(193, 210, 255, 1)',
				'color-header/input': '#1B1B1B',
				'color-card-body': '#ffffff',
				'color-info': '#AEAEAE',
				'color-info-1': '#B2B2B2',
				'color-main': '#1A1A1A',
				'color-input-border': '#E5E5E5',
				'color-bg-light': '#FBFBFB'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate"), heroui()],
};
