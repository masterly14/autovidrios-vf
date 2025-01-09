import Image from 'next/image'

interface BackgroundImageWithTextProps {
  imageUrl: string
  title: string
  description: string
}

export default function BackgroundImageWithText({ imageUrl, title, description }: BackgroundImageWithTextProps) {
  return (
    <div className="relative h-[400px] w-full overflow-hidden">
      <Image
        src={imageUrl}
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="opacity-50"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-4 shadow-text">{title}</h2>
        <p className="text-xl text-white max-w-md shadow-text">{description}</p>
      </div>
    </div>
  )
}

