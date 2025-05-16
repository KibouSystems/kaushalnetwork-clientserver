import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../components/ui/button';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Send, 
  Image as ImageIcon, 
  Paperclip, 
  X, 
  Plus, 
  Calendar,
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Clock, 
  User, 
  Menu, 
  Search,
  Info,
  Sparkles,
  TrendingUp,
  Bell
} from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('latest');
  const formRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBuzzPosts();
  }, []);

  const fetchBuzzPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://69.62.79.102:3000/api/v0/buzz/all', {
        withCredentials: true,
      });
      setBuzzList(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
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
    // Scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
    } else if (name === 'title') {
      setCurrentPost(prev => ({
        ...prev,
        title: value,
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
        'http://69.62.79.102:3000/api/v0/buzz',
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

  // Toggle mobile sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20">
      {/* Feature Preview Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-2 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-center text-sm">
          <Info size={16} className="mr-2" /> 
          <span>Buzz is in preview mode. Some features like media sharing are coming soon!</span>
        </div>
      </div>
      
      {/* Header */}
      <header className="bg-white shadow-md sticky top-10 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-gray-100 md:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
              <Sparkles size={24} className="text-blue-600 mr-2" /> Buzz Feed
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                placeholder="Search posts..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button 
              onClick={handleCreateClick}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-full"
            >
              <Plus size={18} /> Create Post
            </Button>
            <Button 
              onClick={handleCreateClick}
              className="md:hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium p-2 rounded-full"
            >
              <Plus size={18} />
            </Button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="container mx-auto px-4 border-t border-gray-100">
          <div className="flex overflow-x-auto whitespace-nowrap space-x-6 py-2 scrollbar-hide">
            <TabButton 
              icon={<Clock size={16} />} 
              label="Latest" 
              active={activeTab === 'latest'} 
              onClick={() => setActiveTab('latest')} 
            />
            <TabButton 
              icon={<TrendingUp size={16} />} 
              label="Trending" 
              active={activeTab === 'trending'} 
              onClick={() => setActiveTab('trending')} 
              comingSoon
            />
            <TabButton 
              icon={<Bell size={16} />} 
              label="Notifications" 
              active={activeTab === 'notifications'} 
              onClick={() => setActiveTab('notifications')} 
              comingSoon
            />
            <TabButton 
              icon={<User size={16} />} 
              label="My Posts" 
              active={activeTab === 'myPosts'} 
              onClick={() => setActiveTab('myPosts')} 
              comingSoon
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Hidden on mobile */}
          <div className={`
            fixed md:relative inset-0 bg-black/50 md:bg-transparent z-30
            ${sidebarOpen ? 'block' : 'hidden'} md:block md:w-64 lg:w-80 flex-shrink-0
          `}>
            {/* Close button for mobile */}
            <button 
              onClick={toggleSidebar}
              className="absolute top-4 right-4 p-2 bg-white rounded-full md:hidden"
            >
              <X size={20} />
            </button>
            
            {/* Sidebar content */}
            <div className="h-full w-3/4 max-w-xs md:w-full md:max-w-none bg-white shadow-lg md:rounded-xl overflow-hidden animate-slide-in">
              <div className="p-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <h2 className="text-xl font-bold">Buzz Community</h2>
                <p className="text-sm opacity-80 mt-1">Connect with your business network</p>
              </div>
              
              <div className="p-5">
                <div className="mb-6">
                  <button 
                    onClick={handleCreateClick}
                    className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus size={18} /> Create New Post
                  </button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-500 uppercase text-xs tracking-wider">Categories</h3>
                  
                  <SidebarLink 
                    icon={<Sparkles size={18} className="text-blue-500" />} 
                    label="All Posts" 
                    active={true} 
                  />
                  <SidebarLink 
                    icon={<User size={18} className="text-purple-500" />} 
                    label="Company Announcements" 
                    comingSoon={true}
                  />
                  <SidebarLink 
                    icon={<Bell size={18} className="text-amber-500" />} 
                    label="Trending Topics" 
                    comingSoon={true}
                  />
                  <SidebarLink 
                    icon={<MessageCircle size={18} className="text-green-500" />} 
                    label="Discussions" 
                    comingSoon={true}
                  />
                </div>
                
                {/* Stats */}
                <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-medium text-gray-600 mb-3">Your Activity</h3>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">0</div>
                      <div className="text-xs text-gray-500">Posts</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">0</div>
                      <div className="text-xs text-gray-500">Interactions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Create Post Form */}
            <AnimatePresence>
              {showCreateForm && (
                <motion.div
                  ref={formRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl shadow-lg mb-8"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold">Create New Post</h2>
                    <Button
                      onClick={() => setShowCreateForm(false)}
                      className="bg-white/20 hover:bg-white/30 text-white"
                      type="button"
                    >
                      <X size={18} />
                    </Button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          name="title"
                          placeholder="Write a compelling title..."
                          value={currentPost.title}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      {/* Content */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea
                          name="text"
                          placeholder="Share your thoughts, ideas, or announcements..."
                          value={currentPost.content.text}
                          onChange={handleInputChange}
                          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-40"
                          required
                        />
                      </div>
                      
                      {/* Upload section */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="flex items-center mb-4">
                          <Info size={18} className="text-blue-500 mr-2" />
                          <p className="text-blue-700 text-sm">Media uploads will be available in a future update</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button type="button" disabled className="flex items-center gap-2 px-4 py-2 bg-white/70 text-gray-400 rounded-lg cursor-not-allowed">
                            <ImageIcon size={16} /> Add Image
                          </button>
                          <button type="button" disabled className="flex items-center gap-2 px-4 py-2 bg-white/70 text-gray-400 rounded-lg cursor-not-allowed">
                            <Paperclip size={16} /> Attach File
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Submit button */}
                    <div className="mt-6 flex justify-end">
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                      >
                        <Send size={16} /> Publish Post
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Posts List */}
            <div className="space-y-6">
              {loading ? (
                <LoadingPosts />
              ) : buzzList.length > 0 ? (
                buzzList.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} />
                ))
              ) : (
                <EmptyState onCreateClick={handleCreateClick} />
              )}
            </div>
          </div>
          
          {/* Right Sidebar - Only visible on larger screens */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm sticky top-32">
              <div className="p-5 border-b">
                <h3 className="font-semibold">Trending Topics</h3>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">1</div>
                    <span className="text-gray-800">Feature coming soon</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">2</div>
                    <span className="text-gray-800">Feature coming soon</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">3</div>
                    <span className="text-gray-800">Feature coming soon</span>
                  </div>
                </div>
                
                <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 flex items-center">
                  <Info size={14} className="mr-2" /> 
                  This feature is coming soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components 
const SidebarLink = ({ icon, label, active = false, comingSoon = false }) => (
  <div className="relative">
    <button 
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active 
          ? 'bg-blue-50 text-blue-700' 
          : comingSoon
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-50'
      }`}
      disabled={comingSoon}
    >
      {icon}
      <span>{label}</span>
      {comingSoon && (
        <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Soon</span>
      )}
    </button>
  </div>
);

const TabButton = ({ icon, label, active = false, onClick, comingSoon = false }) => (
  <button 
    onClick={onClick}
    disabled={comingSoon}
    className={`
      flex items-center gap-2 px-4 py-2 border-b-2 whitespace-nowrap transition-colors
      ${active 
        ? 'border-blue-600 text-blue-700 font-medium' 
        : comingSoon
          ? 'border-transparent text-gray-400 cursor-not-allowed'
          : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-200'
      }
    `}
  >
    {icon}
    <span>{label}</span>
    {comingSoon && (
      <span className="ml-1 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">Soon</span>
    )}
  </button>
);

const PostCard = ({ post, index }) => {
  // For demo, generate a random date in the past week
  const randomDate = new Date();
  randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 7));
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {/* Post Header */}
      <div className="p-5 flex items-start justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            {post.CompanyUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{post.CompanyUser.name}</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span>{post.CompanyUser.designation}</span>
              <span className="inline-block w-1 h-1 rounded-full bg-gray-300"></span>
              <span>{randomDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Post Content */}
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
        <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.textContent}</p>
        
        {/* Image Placeholder (Future Feature) */}
        <div className="bg-gray-50 rounded-lg p-8 flex flex-col items-center justify-center border border-gray-100 mb-4 text-center">
          <ImageIcon size={32} className="text-gray-300 mb-2" />
          <p className="text-gray-400 text-sm">Image uploads will be supported in an upcoming update</p>
        </div>
      </div>
      
      {/* Post Actions */}
      <div className="bg-gray-50 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors text-sm">
            <ThumbsUp size={18} />
            <span>Like</span>
          </button>
          <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors text-sm">
            <MessageCircle size={18} />
            <span>Comment</span>
          </button>
          <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors text-sm">
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>
        
        <span className="text-xs text-gray-500">
          {Math.floor(Math.random() * 10)} likes
        </span>
      </div>
    </motion.div>
  );
};

const LoadingPosts = () => (
  <>
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-white rounded-xl shadow-sm p-5 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="h-40 bg-gray-100 rounded w-full"></div>
      </div>
    ))}
  </>
);

const EmptyState = ({ onCreateClick }) => (
  <div className="bg-white rounded-xl shadow-sm p-10 text-center">
    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <MessageSquare size={24} className="text-blue-600" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
    <p className="text-gray-600 mb-6">Be the first to share something with your network</p>
    <Button
      onClick={onCreateClick}
      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-lg inline-flex items-center gap-2"
    >
      <Plus size={18} /> Create Your First Post
    </Button>
  </div>
);

export default Buzz;
