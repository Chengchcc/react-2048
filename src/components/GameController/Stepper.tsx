import { useCallback, useMemo } from 'react'

interface StepperProps {
  value: number
  max: number
  min: number
  title: string
  onChange: (val: number) => void
  className?: string
}

export function Stepper({
  value,
  max,
  min,
  title,
  className = '',
  onChange
}: StepperProps) {
  const onIncrease = useCallback(() => {
    if (value < max) {
      onChange(value + 1)
    }
  }, [value, max])

  const onDecrease = useCallback(() => {
    if (value > min) {
      onChange(value - 1)
    }
  }, [value, min])

  const minusCursor = useMemo(()=> {
    return value > min ? 'cursor-pointer': 'cursor-not-allowed'
  }, [value ,min])

  const plusCursor = useMemo(()=> {
    return value < max ? 'cursor-pointer' : 'cursor-not-allowed'
  }, [value, max])

  return (
    <div className={'flex flex-col items-center ' + className}>
      <span className="text-[13px] color-primary">{title}</span>
      <div className="flex items-center p-4px color-white">
        <button onClick={()=> onDecrease()} className={"stepper-base bg-secondary " + minusCursor}>-</button>
        <div className="mx-8px flex items-center">
          <span className="text-[16px] color-primary">{value}</span>
        </div>
        <button onClick={()=> onIncrease()} className={"stepper-base bg-primary " + plusCursor}>+</button>
      </div>
    </div>
  )
}
