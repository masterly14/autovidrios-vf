import { Card, CardContent } from "@/components/ui/card"
import { Star } from 'lucide-react'

interface TestimonialCardProps {
  name: string
  text: string
  rating: number
}

export function TestimonialCard({ name, text, rating }: TestimonialCardProps) {
  return (
    <Card className="w-[300px] h-[200px] mx-auto">
      <CardContent className="p-6 flex flex-col justify-between h-full">
        <div>
          <h3 className="font-semibold text-lg mb-2">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">{text}</p>
        </div>
        <div className="flex justify-center mt-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

