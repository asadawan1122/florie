type FontSize = 'xmini' | 'mini' | 'xsmall' | 'small' | 'normal' | 'medium' | 'xmedium' | 'large'

type FontSizeValues = {
  fontSize: number
  lineHeight: number
}

export const size: Record<FontSize, FontSizeValues> = {
  xmini: { fontSize: 8, lineHeight: 10 },
  mini: { fontSize: 10, lineHeight: 12 },
  xsmall: { fontSize: 12, lineHeight: 14 },
  small: { fontSize: 14, lineHeight: 16.8 },
  normal: { fontSize: 16, lineHeight: 17.8 },
  medium: { fontSize: 18, lineHeight: 21 },
  xmedium: { fontSize: 22, lineHeight: 27 },
  large: { fontSize: 24, lineHeight: 29 },
}
