const Game = require("../models/game");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Categories
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render("category_list", {
    title: "Category List",
    category_list: allCategories,
  });
});

// Display detail page for a specific Category
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, categoryGames] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Game.find({ category: req.params.id }, "title description").sort({ title: 1 }).exec(),
  ]);

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail", {
    title: "Category Detail",
    category: category,
    category_games: categoryGames,
  });
});

// Display Category create form on GET
exports.category_create_get = (req, res, next) => {
  res.render("category_form", { title: "Add Category" });
};

// Handle Category create on POST
exports.category_create_post = [
  body("name", "Category name required")
    .trim()
    .isLength({ min: 1 }),
  body("description", "Description required")
    .trim()
    .isLength({ min: 1 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Add Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const categoryExists = await Category.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];

// Display Category delete form on GET
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, categoryGames] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Game.find({ category: req.params.id }, "title description").sort({ title: 1 }).exec(),
  ]);

  if (category === null) {
    res.redirect("/catalog/categories");
  }

  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    category_games: categoryGames,
  });
});

// Handle Category delete on POST
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, categoryGames] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Game.find({ category: req.params.id }, "title description").sort({ title: 1 }).exec(),
  ]);

  if (categoryGames.length > 0) {
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      category_games: categoryGames,
    });
    return;
  } else {
    if (req.body.password === process.env.admin_password) {
      await Category.findByIdAndRemove(req.body.categoryid);
      res.redirect("/catalog/categories");
    } else {
      res.render("category_delete", {
        title: "Delete Category",
        category: category,
        category_games: categoryGames,
        fail_txt: "*Incorrect password entered, please try again"
      });
    }
  }
});

// Display Category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_form", {
    title: "Update Category",
    category: category,
    password_required: true,
  });
});

// Handle Category update on POST
exports.category_update_post = [
  body("name", "Category name required")
    .trim()
    .isLength({ min: 1 }),
  body("description", "Description required")
    .trim()
    .isLength({ min: 1 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty() || req.body.password != process.env.admin_password) {
      res.render("category_form", {
        title: "Update Category",
        category: category,
        errors: errors.array(),
        password_required: true,
        fail_txt: (req.body.password != process.env.admin_password ? "*Incorrect password entered, please try again" : ""),
      });
      return;
    } else {
      const categoryExists = await Category.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
        res.redirect(updatedCategory.url);
      } 
    }
  }),
];