import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-24 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Welcome to{" "}
              <span className="text-primary">
                Thoughts & Tales
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Share your stories, ideas, and insights with the world. Join our community of passionate writers and readers.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/blog">
                  Read Stories
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                Start Writing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="container px-4 py-16 md:px-6">
        <h2 className="text-2xl font-bold tracking-tight mb-8">Featured Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Featured Blog Post {i}</h3>
                  <p className="text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                  </p>
                  <Button variant="link" className="p-0">
                    Read more →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-16 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Ready to share your story?</h2>
            <p className="text-muted-foreground">
              Join our community and start sharing your thoughts with readers around the world.
            </p>
            <Button size="lg">
              Get Started
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

