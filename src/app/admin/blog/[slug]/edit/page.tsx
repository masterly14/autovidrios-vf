import db from "@/lib/db";
import { notFound } from "next/navigation";
import BlogEditor from "../../new/_components/blog-editor";


export default async function EditPostPage({ params }: { params: { slug: string } }) {

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
            <BlogEditor post={post} />
        </div>
    )
}
