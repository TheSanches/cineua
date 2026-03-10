import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  prevClass: string
  nextClass: string
  topClass?: string
}

export default function SliderNav({
  prevClass,
  nextClass,
  topClass = 'top-16',
}: Props) {
  return (
    <>
      <div
        className={`${prevClass} absolute left-0 ${topClass} z-10 w-8 h-8 bg-accent-purple/50 rounded-full flex items-center justify-center shadow-md hover:bg-accent-purple/80 transition-colors cursor-pointer`}
      >
        <ChevronLeft size={16} className="text-white" />
      </div>
      <div
        className={`${nextClass} absolute right-0 ${topClass} z-10 w-8 h-8 bg-accent-purple/50 rounded-full flex items-center justify-center shadow-md hover:bg-accent-purple/80 transition-colors cursor-pointer`}
      >
        <ChevronRight size={16} className="text-white" />
      </div>
    </>
  )
}
