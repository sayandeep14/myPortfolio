import PostForm from "@/components/lab/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.6rem", fontWeight: 500, color: "var(--ink)", marginBottom: "2rem" }}>
        New Post
      </h1>
      <PostForm />
    </div>
  );
}
