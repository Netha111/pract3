"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IPost } from "@/app/lib/model";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import React from "react";
import Link from "next/link";

export default function BlogPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = React.useState<IPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [requiresPayment, setRequiresPayment] = React.useState(false);

  React.useEffect(() => {
    if (session) {
      fetchPosts();
    }
  }, [session]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`);
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 403) {
          setRequiresPayment(true);
          return;
        }
       
      }

      setPosts(data);
      setRequiresPayment(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Welcome to Our Blog
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Please sign in to access our blog posts
          </p>
          <Button onClick={() => signIn('google')}>
            Sign in with Google
          </Button>
        </div>
      </div>
    );
  }

  if (requiresPayment) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Premium Content
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Please subscribe to access our blog posts
          </p>
          <Button asChild>
            <Link href="/pricing">
              View Pricing Plans
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Latest Blog Posts
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover stories and insights from our community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <p>Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post: IPost) => (
            <Card key={post.title} className="flex flex-col">
              <CardHeader>
                <div className="space-y-1">
                  <CardTitle className="text-2xl">{post.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    By {post.author} • {new Date(post.createdAt!).toLocaleDateString()}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">
                  {post.excerpt}
                </p>
              </CardContent>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {post.content.length > 200 ? `${Math.ceil(post.content.length / 200)} min read` : "1 min read"}
                  </div>
                  <a 
                    href={`/blog/${post.title.toLowerCase().replace(/ /g, '-')}`} 
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Read more →
                  </a>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-medium text-muted-foreground">
              No posts available yet.
            </h3>
            <p className="text-muted-foreground mt-2">
              Check back soon for new content!
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 