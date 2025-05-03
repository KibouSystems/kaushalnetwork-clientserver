import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { MessageSquare, User, Calendar } from "lucide-react";

interface BuzzPost {
  id: number;
  title: string;
  textContent: string;
  companyUser: {
    id: number;
    username: string;
    name: string;
    designation: string;
    email: string;
  };
}

const CompanyBuzzList: React.FC = () => {
  const [posts, setPosts] = useState<BuzzPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = Cookies.get('auth_token');
        if (!token) {
          toast.error('Authentication token not found');
          return;
        }

        const response = await axios.get(
          'http://localhost:3000/api/v0/buzz/company-admin-view/all',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching buzz posts:', error);
        toast.error('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Company Buzz Posts</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start gap-4 mb-4">
              <User className="w-10 h-10 text-blue-500 bg-blue-50 rounded-full p-2" />
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{post.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{post.companyUser.name}</span>
                  <span>•</span>
                  <span>{post.companyUser.designation}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3">{post.textContent}</p>

            <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Post #{post.id}</span>
              </div>
              <a
                href={`mailto:${post.companyUser.email}`}
                className="text-blue-600 hover:text-blue-700"
              >
                Contact Author
              </a>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl shadow">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No buzz posts found</h3>
            <p className="text-gray-500 mt-2">There are no company buzz posts to display.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyBuzzList;
