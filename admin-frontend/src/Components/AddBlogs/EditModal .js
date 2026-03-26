import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditModal = ({ blog, onClose, onSave }) => {
  const [inputValue, setInputValue] = useState({
    title: '',
    description: ''
  });
  const [inputFile, setInputFile] = useState(null);

  useEffect(() => {
    if (blog) {
      setInputValue({
        title:blog.blog_title,
        description:blog.blog_content
      });
      setInputFile(null); // Reset image when blog changes
    }
  }, [blog]);

 // Handle text input changes
 const handleChange = (e) => {
  const { name, value } = e.target;
  setInputValue((prevState) => ({
    ...prevState,
    [name]: value
  }));
};

// Handle file input changes
const handleFileChange = (e) => {
  const file = e.target.files[0];
  setInputFile(file);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('blog_title', inputValue.title);
    formData.append('blog_content', inputValue.description); // API expects 'blog_content'
    formData.append('image', inputFile); // API expects 'image'

    try {
      const response = await axios.patch(`https://demo.internsbee.in/api/blogs/${blog._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onSave(response.data); // Pass the updated blog data to the parent component
      onClose(); // Close the modal
      alert("Successfully update blog")
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Failed to update blog');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="blog_title" className="block mb-2 text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Enter blog title"
            value={inputValue.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <label htmlFor="image" className="block mt-4 mb-2 text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <label htmlFor="blog_content" className="block mt-4 mb-2 text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="blog_content"
            name="description"
            placeholder="Enter blog description"
            value={inputValue.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            required
            style={{ height: '100px' }}
          />
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="submit"
              className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
