const express = require('express');
const router = express.Router();
const Toy = require('../models/toyModel');
const { authenticateToken } = require('../middlewares/Auth')


// READ - GET (10 toys)
router.get('/toys', async (req, res) => {
  const skipn = req.query.skip > 0 && !(req.query.skip > (await Toy.find({})).length - 10) ? req.query.skip - 10 : 0;
  try {
    const toys = await Toy.find().limit(10).skip(skipn);
    res.json(toys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ - GET (count)
router.get('/toys/count', async (req, res) => {
  try {
    const toys = await Toy.find({});
    res.json(toys.length);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ - GET (search term)
router.get('/toys/search', async (req, res) => {
  const searchTerm = req.query.s;
  const skipn = req.query.skip > 0 && !(req.query.skip > (await Toy.find({})).length - 10) ? req.query.skip - 10 : 0;
  if (!searchTerm) {
    return res.status(400).json({ message: 'Search term is required' });
  }

  try {
    const toys = await Toy.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { info: { $regex: searchTerm, $options: 'i' } }
      ]
    }).limit(10).skip(skipn);
    if(toys.length > 1) 
      res.json(toys);
    else
      res.json({message: "no such toys"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// READ - GET (prices min max)
router.get('/toys/prices', async (req, res) => {
  const min = req.query.min;
  const max = req.query.max;
  const skipn = req.query.skip > 0 && !(req.query.skip > (await Toy.find({})).length - 10) ? req.query.skip - 10 : 0;
  if (Number(min) > Number(max) || min < 0) return res.status(500).json({message: "min must have a positive value and must be less then max"});
  try {
    const price = await Toy.find({price: {$gte: min } && {$lte: max} }).limit(10).skip(skipn);
    if ((!price) || price.length < 1) return res.status(404).json({ message: 'No toys in that price range' });
    res.json(price);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ - GET (by category)
router.get('/toys/category/:catname', async (req, res) => {
  const skipn = req.query.skip > 0 && !(req.query.skip > (await Toy.find({})).length - 10) ? req.query.skip - 10 : 0;
  try {
    const category = await Toy.find({category: { $regex: req.params.catname, $options: 'i' }}).limit(10).skip(skipn);
    if ((!category) || category.length < 1) return res.status(404).json({ message: 'category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// CREATE - POST (new toy)
router.post('/toys',authenticateToken, async (req, res) => {

  try {
    const newToy = new Toy(req.body);
    const savedToy = await newToy.save();
    res.status(201).json(savedToy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ - GET (single toy by id)
router.get('/toys/:id', async (req, res) => {
  try {
    const toy = await Toy.findById(req.params.id);
    if (!toy) return res.status(404).json({ message: 'Toy not found' });
    res.json(toy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE - PUT (update toy parameters)
router.put('/toys/:id',authenticateToken, async (req, res) => {
  
  try {
  
    const updatedToy = await Toy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedToy) return res.status(404).json({ message: 'Toy not found' });
    res.json(updatedToy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE (delete toy by id)
router.delete('/toys/:id', authenticateToken, async (req, res) => {
  try {
    const deletedToy = await Toy.findByIdAndDelete(req.params.id);
    if (!deletedToy) return res.status(404).json({ message: 'Toy not found' });
    res.json({ message: 'Toy deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
