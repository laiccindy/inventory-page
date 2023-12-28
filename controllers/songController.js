const Song = require('../models/Song');
const mongoose = require('mongoose');

exports.homepage = async (req,res)=>{
  const locals = {
    title: 'NodeJS',
    description: 'Song Inventory Application using NodeJS'
  }
  try {
    const songs = await Song.find({});
    res.render('index', { locals, songs })
  } catch (error) {
    console.log(error);
  }
};


exports.addSong = async (req,res)=>{
  const locals = {
    title: 'Add New Song',
    description: 'Song Inventory Application using NodeJS'
  }
  res.render('add', locals);
};

exports.postSong = async (req,res)=>{
  const newSong = new Song({
    songTitle: req.body.songTitle,
    artist: req.body.artist,
    genre: req.body.genre,
    releaseYear: req.body.releaseYear
  })
  try {
    await Song.create(newSong),
    res.redirect('/');

  } catch (error) {
    console.log(error);
  }
};

exports.view = async (req,res)=>{
  try {
    const song = await Song.findOne({ _id: req.params.id })
    const locals = {
      title: 'View Song Data',
      description: 'Song Inventory Application using NodeJS'
    }
    res.render('view', { song, locals })
  } catch (error) {
    console.log(error);
  }
};

exports.edit = async (req,res)=>{
  try {
    const song = await Song.findOne({ _id: req.params.id })
    const locals = {
      title: 'View Song Data',
      description: 'Song Inventory Application using NodeJS'
    }
    res.render('edit', { song, locals })
  } catch (error) {
    console.log(error);
  }
}

exports.editEntry = async (req,res)=>{
  try {
    await Song.findByIdAndUpdate(req.params.id,{
      songTitle: req.body.songTitle,
      artist: req.body.artist,
      genre: req.body.genre,
      releaseYear: req.body.releaseYear,
      updatedAt: Date.now()
    });
    await res.redirect('/');

  } catch (error) {
    console.log(error);
  }
}

exports.deleteSong = async (req,res)=>{
  try {
    await Song.deleteOne({ _id: req.params.id });
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
}

exports.searchSongs = async (req,res)=>{
  const locals =  {
    title: 'Search Song Data',
    description: 'Song Inventory Application using NodeJS'
  };
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
    const songs = await Song.find({
         songTitle: { $regex: new RegExp(searchNoSpecialChar, "i") } 
    });
    res.render("search", { songs, locals });
  } catch (error) {
    console.log(error);
  }
};