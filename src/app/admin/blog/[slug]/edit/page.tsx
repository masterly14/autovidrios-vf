import db from "@/lib/db";
import { notFound } from "next/navigation";
import BlogEditor from "../../new/_components/blog-editor";


interface EditPostPageProps {
    params: {
        slug: string;
    }
}

export default async function EditPostPage({ params }: EditPostPageProps) {

    const post = await db.blogPost.findUnique({
        where: {
            slug: params.slug
        }
    });

    if(!post) {
        notFound();
    }

    return (
        <div>
            <BlogEditor/>
        </div>
    )
}
