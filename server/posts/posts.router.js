const express = require('express');
const axios = require('axios');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await fetchPosts();

    const postsWithImages = await Promise.all(posts.map(async (post) => {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);
      const images = response.data.map((photo) => ({ url: photo.url }));

      return {
        ...post,
        images: images.length > 0 ? images : [
          { url: 'https://picsum.photos/200/300' },
          { url: 'https://picsum.photos/200/300' },
          { url: 'https://picsum.photos/200/300' },
        ],
      };
    }));

    res.json(postsWithImages);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;
