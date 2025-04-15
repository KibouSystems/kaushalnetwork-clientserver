import React, { useState } from "react";
import { Button } from "../components/ui/button";

interface BuzzPost {
  postId?: string;
  identity: {
    personName: string;
    position: string;
    company: string;
  };
  content: {
    text: string;
    media: File[] | null;
  };
  timestamp?: Date;
}

const Buzz = () => {
  const [posts, setPosts] = useState<BuzzPost[]>([]);
  const [currentPost, setCurrentPost] = useState<BuzzPost>({
    identity: {
      personName: "",
      position: "",
      company: ""
    },
    content: {
      text: "",
      media: null
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("identity.")) {
      const field = name.split(".")[1];
      setCurrentPost(prev => ({
        ...prev,
        identity: {
          ...prev.identity,
          [field]: value
        }
      }));
    } else {
      setCurrentPost(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [name]: value
        }
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setCurrentPost(prev => ({
        ...prev,
        content: {
          ...prev.content,
          media: Array.from(files)
        }
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add timestamp and ID
    const newPost: BuzzPost = {
      ...currentPost,
      postId: `post_${Date.now()}`,
      timestamp: new Date()
    };
    
    // Development only - log post structure
    if (process.env.NODE_ENV === 'development') {
      console.log('=== New Buzz Post Structure ===');
      console.log(JSON.stringify({
        api_endpoint: '/api/buzz/post',
        method: 'POST',
        request_body: {
          post_id: newPost.postId,
          posted_at: newPost.timestamp?.toISOString(),
          author: {
            name: newPost.identity.personName,
            position: newPost.identity.position,
            company: newPost.identity.company
          },
          content: {
            text: newPost.content.text,
            media: newPost.content.media ? newPost.content.media.map(file => ({
              name: file.name,
              type: file.type,
              size: file.size,
              lastModified: file.lastModified
            })) : null
          }
        }
      }, null, 2));
    }

    setPosts(prev => [newPost, ...prev]);
    
    // Reset form
    setCurrentPost({
      identity: {
        personName: "",
        position: "",
        company: ""
      },
      content: {
        text: "",
        media: null
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Create Post Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Create Buzz Post</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Identity Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="identity.personName"
                  placeholder="Your Name"
                  value={currentPost.identity.personName}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="identity.position"
                  placeholder="Position"
                  value={currentPost.identity.position}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="identity.company"
                  placeholder="Company"
                  value={currentPost.identity.company}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                  required
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Content</h3>
              <textarea
                name="text"
                placeholder="Write your post..."
                value={currentPost.content.text}
                onChange={handleInputChange}
                className="w-full p-2 border rounded h-32"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Media (Images/Videos/PDFs)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf"
                  onChange={handleFileChange}
                  className="w-full"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 text-white">
              Post
            </Button>
          </form>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.postId} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div>
                  <h3 className="font-semibold">{post.identity.personName}</h3>
                  <p className="text-sm text-gray-600">
                    {post.identity.position} at {post.identity.company}
                  </p>
                  <p className="text-xs text-gray-500">
                    {post.timestamp?.toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="mb-4">{post.content.text}</p>
              {post.content.media && (
                <div className="grid grid-cols-2 gap-2">
                  {Array.from(post.content.media).map((file, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Buzz;
