import Link from "next/link";
import Image from "next/image";
import db from "@/lib/db";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Consejos sobre Vidrios para Vehículos | Autovidrios V&F",
  description: "Encuentra los mejores consejos, noticias y guías sobre el cuidado, mantenimiento y elección de vidrios para tu vehículo. Mantente informado con Autovidrios V&F.",
};

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Nuestro Blog</h1>
      <p className="text-xl text-center text-gray-600 mb-12">
        Consejos, noticias y guías sobre el cuidado de los vidrios de tu vehículo.
      </p>
      
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No hay artículos disponibles por el momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="block transform hover:scale-105 transition-transform duration-300">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  </div>
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  {/* Podríamos poner un extracto aquí si lo añadiéramos al modelo */}
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
