import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

interface BuzzPost {
  postId?: string;
  title: string;
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

interface BuzzResponse {
  id: number;
  title: string;
  textContent: string;
  CompanyUser: {
    name: string;
    designation: string;
    email: string;
  };
}

const Buzz = () => {
  const [buzzList, setBuzzList] = useState<BuzzResponse[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPost, setCurrentPost] = useState<BuzzPost>({
    title: '',
    identity: {
      personName: '',
      position: '',
      company: '',
    },
    content: {
      text: '',
      media: null,
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBuzzPosts();
  }, []);

  const fetchBuzzPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v0/buzz/all', {
        withCredentials: true,
      });
      setBuzzList(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('Failed to load posts');
    }
  };

  const handleCreateClick = () => {
    const authToken = Cookies.get('auth_token');
    if (!authToken) {
      toast.error('Please login to create a post');
      navigate('/login');
      return;
    }
    setShowCreateForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('identity.')) {
      const field = name.split('.')[1];
      setCurrentPost(prev => ({
        ...prev,
        identity: {
          ...prev.identity,
          [field]: value,
        },
      }));
    } else {
      setCurrentPost(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [name]: value,
        },
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
          media: Array.from(files),
        },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const authToken = Cookies.get('auth_token');
    if (!authToken) {
      toast.error('Please login to create a post');
      navigate('/login');
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v0/buzz',
        {
          title: currentPost.title,
          textContent: currentPost.content.text,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 201) {
        await fetchBuzzPosts();
        setShowCreateForm(false);
        setCurrentPost({
          title: '',
          identity: {
            personName: '',
            position: '',
            company: '',
          },
          content: {
            text: '',
            media: null,
          },
        });
        toast.success('Post created successfully');
      }
    } catch (error) {
      console.error('Failed to post:', error);
      toast.error('Failed to create post');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -64 }}
        animate={{ x: 0 }}
        className="absolute top-21 h-[100%] left-0 w-64  bg-white shadow-lg z-20 overflow-y-auto"
      >
        <div className="sticky top-0 p-6 space-y-6 bg-white/90 backdrop-blur-sm border-b">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Buzz Feed
          </h1>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleCreateClick}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Create New Post
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            {/* Create Post Form */}
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-lg p-6 mb-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Create Buzz Post</h2>
                  <Button
                    onClick={() => setShowCreateForm(false)}
                    className="bg-gray-200 text-gray-700"
                    type="button"
                  >
                    Cancel
                  </Button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="title"
                      placeholder="Post Title"
                      value={currentPost.title}
                      onChange={e => setCurrentPost(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  {/* ...existing identity and content fields... */}
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
                  <div className="space-y-4">
                    <h3 className="font-semibold">Content</h3>
                    <textarea
                      name="text"
                      placeholder="Write your post..."
                      value={currentPost.content.text}
                      onChange={handleInputChange}
                      className="w-full p-4 border rounded-lg resize-none h-32 max-w-full"
                      required
                    />
                    <div className="mt-4">
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
                  {/* ...existing media section... */}
                  <Button type="submit" className="w-full bg-blue-600 text-white">
                    Post
                  </Button>
                </form>
              </motion.div>
            )}
            {/* ...existing posts list... */}
            <div className="space-y-6">
              {buzzList.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="max-w-full">
                      <h3 className="font-bold text-xl mb-2 break-words">{post.title}</h3>
                      <p className="text-sm text-gray-600">
                        By {post.CompanyUser.name} • {post.CompanyUser.designation}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap break-words mb-4">
                    {post.textContent}
                  </p>

                  {/* Media Placeholder */}
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {[1, 2].map(placeholder => (
                      <div
                        key={placeholder}
                        className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center group hover:bg-gray-200 transition-colors"
                      >
                        <div className="text-center p-4">
                          <svg
                            className="w-8 h-8 text-gray-400 mx-auto mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-sm text-gray-500">Media placeholder</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            {/* ...existing code... */}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Buzz;
