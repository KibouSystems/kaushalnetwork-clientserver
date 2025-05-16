import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { MessageSquare, Search, X, Filter, Bookmark, Share2, ThumbsUp, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface BuzzPost {
  id: number;
  title: string;
  textContent: string;
  CompanyUser: {
    id: number;
    username: string;
    name: string;
    designation: string;
    email: string;
  };
  // Let's assume these fields for improved UI, they can be mocked if not available
  createdAt?: string;
  category?: string;
}

const CompanyBuzzList: React.FC = () => {
  const [posts, setPosts] = useState<BuzzPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Simulated categories for filtering
  const categories = ['Announcements', 'Events', 'News', 'Projects', 'Insights'];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = Cookies.get('auth_token');
        if (!token) {
          toast.error('Authentication token not found');
          return;
        }

        const response = await axios.get(
          'http://69.62.79.102:3000/api/v0/buzz/company-admin-view/all',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPosts(response.data);
        console.warn('Fetched posts:', response.data);
      } catch (error) {
        console.error('Error fetching buzz posts:', error);
        toast.error('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search and category
  const filteredPosts = posts
    .filter(
      post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.textContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.CompanyUser.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(post => activeFilter === 'all' || post.category === activeFilter);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-lg font-medium text-gray-600">Loading company buzz...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header Section - Improved mobile responsiveness */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white pt-6 pb-16 px-4 sm:px-8 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/30 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/20 blur-3xl"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Title section - Stacked on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center">
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-lg shadow-lg mr-4 flex-shrink-0">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Company Buzz</h1>
                <p className="text-blue-100 mt-1 text-sm sm:text-base">
                  Stay updated with company news and announcements
                </p>
              </div>
            </div>

            {/* Search - Full width on mobile */}
            <div className="relative w-full sm:w-auto mt-4 sm:mt-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                className="pl-10 pr-4 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-blue-200 w-full focus:outline-none focus:ring-2 focus:ring-white/30"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white"
                  onClick={() => setSearchTerm('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Filters - Improved scrolling for mobile */}
          <div className="flex flex-col gap-4">
            {/* Filter buttons - Horizontal scrollable container on mobile */}
            <div className="flex items-center">
              <span className="text-blue-100 mr-2 whitespace-nowrap flex items-center text-sm">
                <Filter size={14} className="mr-1" /> Filter by:
              </span>
              <div className="overflow-x-auto flex-1 flex items-center space-x-2 pb-2 scrollbar-hide">
                <button
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${activeFilter === 'all' ? 'bg-white text-blue-600 shadow-md' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                  onClick={() => setActiveFilter('all')}
                >
                  All Posts
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${activeFilter === category ? 'bg-white text-blue-600 shadow-md' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                    onClick={() => setActiveFilter(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* View toggle - Better positioned on mobile */}
            <div className="flex justify-end">
              <div className="inline-flex p-1 bg-white/10 backdrop-blur rounded-lg">
                <button
                  className={`p-2 rounded-md flex items-center justify-center ${viewMode === 'grid' ? 'bg-white text-blue-600' : 'text-white'}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </button>
                <button
                  className={`p-2 rounded-md flex items-center justify-center ${viewMode === 'list' ? 'bg-white text-blue-600' : 'text-white'}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Features Banner */}
          <div className="mt-4 bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 text-sm text-blue-100">
            <div className="flex items-center">
              <span className="bg-yellow-400 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                BETA
              </span>
              <p>
                Some filter options are coming soon! Currently filtering is fully enabled for
                displayed categories.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section - Added spacing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        {' '}
        {/* Increased margin-top */}
        {filteredPosts.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post, index) => {
                // Assign mock categories and dates if not available
                const mockCategory = categories[index % categories.length];
                const mockDate = new Date(
                  Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000
                ).toISOString();

                return (
                  <div
                    key={post.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                  >
                    {/* Color strip based on category */}
                    <div className={`h-2 ${getCategoryColor(post.category || mockCategory)}`}></div>

                    <div className="p-4 sm:p-6 flex-1">
                      {/* Fixed overlapping category badges and date */}
                      <div className="flex flex-col mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full inline-block max-w-[150px] truncate ${getCategoryBadgeColor(post.category || mockCategory)}`}
                          >
                            {post.category || mockCategory}
                          </span>
                          <div className="flex items-center text-gray-400 text-xs whitespace-nowrap ml-2">
                            <Clock size={12} className="mr-1 flex-shrink-0" />
                            <span>{formatDate(post.createdAt || mockDate)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Title with proper overflow handling */}
                      <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2 break-words">
                        {post.title}
                      </h3>

                      {/* Text content with proper overflow handling */}
                      <p className="text-gray-600 mb-4 line-clamp-3 break-words">
                        {post.textContent}
                      </p>

                      <div className="flex items-center mt-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                            {post.CompanyUser.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-3 min-w-0 max-w-[calc(100%-50px)]">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {post.CompanyUser.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {post.CompanyUser.designation}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Fixed the action buttons spacing */}
                    <div className="bg-gray-50 px-4 sm:px-6 py-3 flex justify-between items-center border-t">
                      <div className="flex space-x-2 sm:space-x-3">
                        <button className="text-gray-500 hover:text-blue-600 transition-colors p-1">
                          <ThumbsUp size={16} />
                        </button>
                        <button className="text-gray-500 hover:text-blue-600 transition-colors p-1">
                          <Share2 size={16} />
                        </button>
                        <button className="text-gray-500 hover:text-blue-600 transition-colors p-1">
                          <Bookmark size={16} />
                        </button>
                      </div>
                      <a
                        href={`mailto:${post.CompanyUser.email}`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                      >
                        Contact
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {filteredPosts.map((post, index) => {
                  const mockCategory = categories[index % categories.length];
                  const mockDate = new Date(
                    Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000
                  ).toISOString();

                  return (
                    <li key={post.id} className="hover:bg-blue-50 transition-colors">
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="flex-shrink-0 flex justify-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                              {post.CompanyUser.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                              <h3 className="font-bold text-lg text-gray-900 break-words">
                                {post.title}
                              </h3>
                              <span
                                className={`text-xs font-medium px-2.5 py-1 rounded-full self-start ${getCategoryBadgeColor(post.category || mockCategory)}`}
                              >
                                {post.category || mockCategory}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                              <span className="truncate">{post.CompanyUser.name}</span>
                              <span>•</span>
                              <span className="truncate">{post.CompanyUser.designation}</span>
                            </div>

                            <p className="text-gray-600 mt-2 mb-3 break-words">
                              {post.textContent}
                            </p>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center space-x-4">
                                <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                                  <ThumbsUp size={16} className="mr-1" />
                                  <span className="text-xs">Like</span>
                                </button>
                                <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                                  <Share2 size={16} className="mr-1" />
                                  <span className="text-xs">Share</span>
                                </button>
                              </div>
                              <div className="flex items-center text-gray-400 text-xs">
                                <Clock size={14} className="mr-1 flex-shrink-0" />
                                <span>{formatDate(post.createdAt || mockDate)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-12 text-center">
            <div className="bg-blue-50 rounded-full p-4 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No buzz posts found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchTerm
                ? `We couldn't find any posts matching "${searchTerm}"`
                : 'There are no company buzz posts to display at this time.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Post count summary */}
      {filteredPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
            <p className="text-gray-600 text-sm">
              Showing <span className="font-semibold text-blue-600">{filteredPosts.length}</span> of{' '}
              <span className="font-semibold">{posts.length}</span> total posts
              {searchTerm && (
                <span>
                  {' '}
                  matching "<span className="font-medium">{searchTerm}</span>"
                </span>
              )}
              {activeFilter !== 'all' && (
                <span>
                  {' '}
                  in <span className="font-medium">{activeFilter}</span>
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions for dynamic styling
function getCategoryColor(category: string): string {
  switch (category) {
    case 'Announcements':
      return 'bg-red-500';
    case 'Events':
      return 'bg-green-500';
    case 'News':
      return 'bg-blue-500';
    case 'Projects':
      return 'bg-purple-500';
    case 'Insights':
      return 'bg-amber-500';
    default:
      return 'bg-gray-500';
  }
}

function getCategoryBadgeColor(category: string): string {
  switch (category) {
    case 'Announcements':
      return 'bg-red-100 text-red-800';
    case 'Events':
      return 'bg-green-100 text-green-800';
    case 'News':
      return 'bg-blue-100 text-blue-800';
    case 'Projects':
      return 'bg-purple-100 text-purple-800';
    case 'Insights':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
}

export default CompanyBuzzList;
