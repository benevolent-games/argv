
export function replaceTabs(text: string, glyph: string) {
	return text.replaceAll(/\t/gim, glyph)
}

