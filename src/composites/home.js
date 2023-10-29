import { useEffect } from 'react'
import Konva from '../libs/konva'

export default function Canvas () {
  const ref = useRef()

  useEffect(() => {
    const konva = Konva.init(ref.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      size: 500,
      piece: 8,
      url: '/a-beautiful-young-lady.png',
    })

    return () => {
      konva.destroy()
    }
  }, [])

  return (
    <div ref={ref} className='h-screen'></div>
  )
}
