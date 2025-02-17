const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const { Admin } = require("../controllers/adminController");
const multer = require("multer");
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/product_images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

router.get("/cms", authMiddleware, Admin.getCmsPage);
router.get("/get_cms_list_content", authMiddleware, Admin.getCmsListContent);
router.get("/catalog_management", authMiddleware, Admin.getСatalogPage);
router.get("/orders", authMiddleware, Admin.getOrdersPage);
router.get("/sign_out", authMiddleware, Admin.signOut);

router.post("/cms_data_update", authMiddleware, Admin.saveCmsChanges);
router.post(
  "/catalog_management/add_product",
  authMiddleware,
  multer({ storage: storageConfig }).single("img_file"),
  Admin.createProduct
);
router.post(
  "/catalog_management/edit_product/:id",
  authMiddleware,
  multer({ storage: storageConfig }).single("img_file"),
  Admin.editProduct
);
router.post(
  "/catalog_management/delete_product/:id",
  authMiddleware,
  Admin.deleteProduct
);

// router.get("/cms", authMiddleware, Admin.getQuerry);
// router.post(
//   "/admin",
//   [
//     check(
//       "password",
//       "Пароль должен быть больше 4 и меньше 10 символов"
//     ).isLength({ min: 4, max: 10 }),
//   ],
//   postAdmin
// );

module.exports = router;
