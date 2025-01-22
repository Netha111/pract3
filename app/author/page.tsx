"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { IPost } from "@/app/lib/model";


export default function AuthorDashboard() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    author: "",
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.author) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      toast({
        title: "Success! 🎉",
        description: data.message || "Post created successfully!",
        variant: "default",
        duration: 3000,
      });

      // Reset form and refresh posts
      setFormData({ title: "", content: "", excerpt: "", author: "" });
      fetchPosts();

    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create post. Please try again.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  return (
    <>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Author Dashboard</h1>

        {/* Create Post Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Post Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Short Excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Post Content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="min-h-[200px]"
                  required
                />
              </div>
              <Button type="submit">Publish Post</Button>
            </form>
          </CardContent>
        </Card>

        {/* Posts List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Posts</h2>
          {loading ? (
            <p>Loading posts...</p>
          ) : posts.length > 0 ? (
            posts.map((post: IPost) => (
              <Card key={post.title}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{post.excerpt}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No posts yet.</p>
          )}
        </div>
      </div>
      <Toaster />
    </>
  );
} 