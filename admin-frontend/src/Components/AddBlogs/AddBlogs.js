import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonBox from '../ButtonBox/ButtonBox';
import InputField from '../InputField/InputField';
import Sidebarcms from '../SidebarCms/Sidebarcms';
import './Blogs.css'

const AddBlogs = () => {

  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    title: '',
    description: ''
  });
  const [inputFile, setInputFile] = useState(null);

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
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('blog_title', inputValue.title);
    formData.append('blog_content', inputValue.description); // API expects 'blog_content'
    formData.append('image', inputFile); // API expects 'image'

    try {
      const response = await axios.post('https://demo.internsbee.in/api/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(response.data.message);
      setInputValue({ title: '', description: '' }); // Clear text inputs
      setInputFile(null); // Clear file input
      navigate('/viewBlogs'); // Redirect to view blogs page
    } catch (err) {
      alert(err.response ? err.response.data.message : err.message);
    }
  };

  return (
    <div>
      <Sidebarcms />
    <div className="min-h-screen flex justify-center mt-7 add-blog-container">
      <div className="w-full max-w-3xl px-4 m-7 mt-7">
        <h1 className="text-4xl font-bold mb-6 text-center">Add Blog</h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
            <InputField
              label="Title"
              name="title"
              type="text"
              placeholder="Enter Title"
              value={inputValue.title}
              onChange={handleChange}
              required
            />
            <InputField
              label="Image"
              name="image"
              type="file"
              onChange={handleFileChange}
              id = 'file-input'
              required
            />
            {/* <input 
              label="Image"
              name="image"
              type="file"
              className='input-file'
              onChange={handleFileChange}
              required
            />  */}
          </div>

          <label htmlFor="description" className="block mb-2">
            Description
          </label>
        <textarea
          className="m-2 py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent textarea-responsive"
          id="description"
          name="description"
          placeholder="Enter Description"
          required
          value={inputValue.description}
          onChange={handleChange}
        />


          <div className="flex flex-col mt-3 md:flex-row justify-center md:items-center gap-5 space-y-4 md:space-y-0">
            <div className="flex justify-between gap-4 md:gap-7">
              <ButtonBox
                type="submit"
                label="Add Blog"
                className="bg-red-400 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full"
              />
              {/* <ButtonBox
                label='View Blogs'
                className="bg-red-400 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full"
                onClick={() => navigate('/viewBlogs')}
              /> */}
            </div>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default AddBlogs;
