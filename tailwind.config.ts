import type { Config } from "tailwindcss"
import colors from "tailwindcss/colors"

export default {
	content: ["app/**/*.{ts,tsx}"],
	theme: {
		colors: {
			white: colors.white,
			black: colors.black,
			transparent: colors.transparent,
			current: colors.current,
			gold: {
				1: "hsl(var(--gold-1) / <alpha-value>)",
				2: "hsl(var(--gold-2) / <alpha-value>)",
				3: "hsl(var(--gold-3) / <alpha-value>)",
				4: "hsl(var(--gold-4) / <alpha-value>)",
				5: "hsl(var(--gold-5) / <alpha-value>)",
				6: "hsl(var(--gold-6) / <alpha-value>)",
				7: "hsl(var(--gold-7) / <alpha-value>)",
				8: "hsl(var(--gold-8) / <alpha-value>)",
				9: "hsl(var(--gold-9) / <alpha-value>)",
				10: "hsl(var(--gold-10) / <alpha-value>)",
				11: "hsl(var(--gold-11) / <alpha-value>)",
				12: "hsl(var(--gold-12) / <alpha-value>)",
			},
			gray: {
				1: "hsl(var(--gray-1) / <alpha-value>)",
				2: "hsl(var(--gray-2) / <alpha-value>)",
				3: "hsl(var(--gray-3) / <alpha-value>)",
				4: "hsl(var(--gray-4) / <alpha-value>)",
				5: "hsl(var(--gray-5) / <alpha-value>)",
				6: "hsl(var(--gray-6) / <alpha-value>)",
				7: "hsl(var(--gray-7) / <alpha-value>)",
				8: "hsl(var(--gray-8) / <alpha-value>)",
				9: "hsl(var(--gray-9) / <alpha-value>)",
				10: "hsl(var(--gray-10) / <alpha-value>)",
				11: "hsl(var(--gray-11) / <alpha-value>)",
				12: "hsl(var(--gray-12) / <alpha-value>)",
			},
			red: {
				9: "hsl(var(--red-9) / <alpha-value>)",
				10: "hsl(var(--red-10) / <alpha-value>)",
			},
			overlay: {
				1: "hsla(0, 0%, 0%, 0.012)",
				2: "hsla(0, 0%, 0%, 0.027)",
				3: "hsla(0, 0%, 0%, 0.047)",
				4: "hsla(0, 0%, 0%, 0.071)",
				5: "hsla(0, 0%, 0%, 0.090)",
				6: "hsla(0, 0%, 0%, 0.114)",
				7: "hsla(0, 0%, 0%, 0.141)",
				8: "hsla(0, 0%, 0%, 0.220)",
				9: "hsla(0, 0%, 0%, 0.439)",
				10: "hsla(0, 0%, 0%, 0.478)",
				11: "hsla(0, 0%, 0%, 0.565)",
				12: "hsla(0, 0%, 0%, 0.910)",
			},
		},
		extend: {},
	},
	plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
} satisfies Config
