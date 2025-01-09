'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import CountUp from 'react-countup'

export default function AnimatedCounter() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const counterRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true)
          setHasAnimated(true)
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current)
      }
    }
  }, [hasAnimated])

  return (
    <div 
      ref={counterRef}
      className="flex flex-col items-center justify-center bg-white w-full"
    >
      <div className="text-muted-foreground text-center">
        <h2 className="text-4xl font-bold mb-4 mt-10">
        Hemos instalado más de {" "} 
          {isVisible ? (
            <CountUp
              start={0}
              end={2000}
              duration={2.0}
              separator=","
              useEasing={true}
              useGrouping={true}
            />
          ) : '0'}
        </h2>
        <p className="text-4xl bg-secondary-foreground rounded-md">{" "}vidrios</p>
      </div>
      <Image src={'/global/winner.png'} alt='winner' width={200} height={200} className='mt-2'/>
    </div>
  )
}

