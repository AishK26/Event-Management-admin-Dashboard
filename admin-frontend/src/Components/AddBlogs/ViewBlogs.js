import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebarcms from '../SidebarCms/Sidebarcms';
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import './Blogs.css';
import EditModal from './EditModal ';

const ViewBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('https://demo.internsbee.in/api/blogs');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (_id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const response = await axios.delete(`https://demo.internsbee.in/api/blogs/${_id}`);
        alert(response.data.message);
        setBlogs(blogs.filter(blog => blog._id !== _id));
      } catch (error) {
        alert(error.response ? error.response.data.message : error.message);
      }
    }
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleSave = (updatedBlog) => {
    setBlogs(blogs.map(blog => (blog._id === updatedBlog._id ? updatedBlog : blog)));
    setIsModalOpen(false);
  };

  return (
    <div>
      <Sidebarcms />
      <div className="min-h-screen flex flex-col items-center justify-start p-4 view-blog-container">
        <h1 className="text-4xl font-bold text-center mt-7">View Blogs</h1>
        <div className="flex justify-between items-center w-full max-w-4xl mb-6">
          <div className="w-full max-w-4xl mt-8 overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog._id}>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <img src={blog.image} alt={blog.blog_title} className="w-16 h-16 object-cover rounded" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{blog.blog_title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.blog_content}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium gap-10">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="text-blue-500 hover:text-blue-700 mr-4"
                      >
                        <MdOutlineModeEditOutline size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <RiDeleteBin6Line size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Render the EditModal if open */}
      {isModalOpen && (
        <EditModal
          blog={selectedBlog}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ViewBlogs;
