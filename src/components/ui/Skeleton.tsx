interface Props {
  className?: string
  height?: number | string
  width?: number | string
  rounded?: 'sm' | 'md' | 'lg' | 'full'
}

const roundedMap = {
  sm: 'rounded',
  md: 'rounded-lg',
  lg: 'rounded-2xl',
  full: 'rounded-full',
}

export function Skeleton({ className = '', height, width, rounded = 'md' }: Props) {
  return (
    <div
      className={`shimmer ${roundedMap[rounded]} ${className}`}
      style={{ height: height ?? 14, width: width ?? '100%' }}
    />
  )
}
