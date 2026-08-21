import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { upload } from "../middleware/upload";

// Import Controllers
import * as authController from "../controllers/authController";
import { getDashboardStats } from "../controllers/dashboardController";
import * as productController from "../controllers/productController";
import * as categoryController from "../controllers/categoryController";
import * as orderController from "../controllers/orderController";
import * as customerController from "../controllers/customerController";
import * as bannerController from "../controllers/bannerController";
import * as homepageController from "../controllers/homepageController";
import * as aboutController from "../controllers/aboutController";
import * as contactController from "../controllers/contactController";
import * as seoController from "../controllers/seoController";
import * as mediaController from "../controllers/mediaController";
import * as settingsController from "../controllers/settingsController";
import * as adminUserController from "../controllers/adminUserController";
import * as courierController from "../controllers/courierController";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                               AUTH ROUTES                                  */
/* -------------------------------------------------------------------------- */
router.post("/auth/seed-admin", authController.seedAdmin);
router.post("/auth/login", authController.login);
router.get("/auth/me", requireAuth, authController.me);
router.post("/auth/logout", authController.logout);

/* -------------------------------------------------------------------------- */
/*                            DASHBOARD STATS                                 */
/* -------------------------------------------------------------------------- */
router.get("/dashboard/stats", requireAuth, requireRole(["super-admin", "admin", "editor"]), getDashboardStats);

/* -------------------------------------------------------------------------- */
/*                             PRODUCT ROUTES                                 */
/* -------------------------------------------------------------------------- */
router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProductById);
router.post("/products", requireAuth, requireRole(["super-admin", "admin"]), productController.createProduct);
router.put("/products/:id", requireAuth, requireRole(["super-admin", "admin"]), productController.updateProduct);
router.delete("/products/:id", requireAuth, requireRole(["super-admin"]), productController.deleteProduct);

/* -------------------------------------------------------------------------- */
/*                            CATEGORY ROUTES                                 */
/* -------------------------------------------------------------------------- */
router.get("/categories", categoryController.getCategories);
router.get("/categories/:id", categoryController.getCategoryById);
router.post("/categories", requireAuth, requireRole(["super-admin", "admin"]), categoryController.createCategory);
router.put("/categories/:id", requireAuth, requireRole(["super-admin", "admin"]), categoryController.updateCategory);
router.delete("/categories/:id", requireAuth, requireRole(["super-admin"]), categoryController.deleteCategory);

/* -------------------------------------------------------------------------- */
/*                              ORDER ROUTES                                  */
/* -------------------------------------------------------------------------- */
router.post("/orders", orderController.createOrder); // Open public endpoint for checkout order submissions
router.get("/orders", requireAuth, requireRole(["super-admin", "admin", "editor"]), orderController.getOrders);
router.get("/orders/:id", requireAuth, requireRole(["super-admin", "admin", "editor"]), orderController.getOrderById);
router.put("/orders/:id/status", requireAuth, requireRole(["super-admin", "admin", "editor"]), orderController.updateOrderStatus);
router.post("/orders/:id/calls", requireAuth, requireRole(["super-admin", "admin", "editor"]), orderController.addCallLog);
router.get("/orders/:id/calls", requireAuth, requireRole(["super-admin", "admin", "editor"]), orderController.getCallHistory);

/* -------------------------------------------------------------------------- */
/*                        STEADFAST COURIER ROUTES                           */
/* -------------------------------------------------------------------------- */
router.post("/courier/steadfast/send/:orderId", requireAuth, requireRole(["super-admin", "admin", "editor"]), courierController.sendOrderToSteadfast);
router.get("/courier/steadfast/status/:orderId", requireAuth, requireRole(["super-admin", "admin", "editor"]), courierController.getSteadfastOrderStatus);
router.get("/courier/steadfast/balance", requireAuth, requireRole(["super-admin", "admin", "editor"]), courierController.getSteadfastBalance);
router.post("/courier/steadfast/bulk-send", requireAuth, requireRole(["super-admin", "admin", "editor"]), courierController.bulkSendToSteadfast);
/*                            CUSTOMER ROUTES                                 */
/* -------------------------------------------------------------------------- */
router.get("/customers", requireAuth, requireRole(["super-admin", "admin", "editor"]), customerController.getCustomers);
router.get("/customers/:id", requireAuth, requireRole(["super-admin", "admin", "editor"]), customerController.getCustomerById);
router.get("/customers/history/:phone", requireAuth, requireRole(["super-admin", "admin", "editor"]), customerController.getCustomerOrderHistory);

/* -------------------------------------------------------------------------- */
/*                             BANNER ROUTES                                  */
/* -------------------------------------------------------------------------- */
router.get("/banners", bannerController.getBanners);
router.post("/banners", requireAuth, requireRole(["super-admin", "admin"]), bannerController.createBanner);
router.put("/banners/:id", requireAuth, requireRole(["super-admin", "admin"]), bannerController.updateBanner);
router.delete("/banners/:id", requireAuth, requireRole(["super-admin"]), bannerController.deleteBanner);

/* -------------------------------------------------------------------------- */
/*                            HOMEPAGE ROUTES                                 */
/* -------------------------------------------------------------------------- */
router.get("/homepage", homepageController.getHomepage);
router.put("/homepage", requireAuth, requireRole(["super-admin", "admin"]), homepageController.updateHomepage);

/* -------------------------------------------------------------------------- */
/*                               ABOUT ROUTES                                 */
/* -------------------------------------------------------------------------- */
router.get("/about", aboutController.getAbout);
router.put("/about", requireAuth, requireRole(["super-admin", "admin"]), aboutController.updateAbout);

/* -------------------------------------------------------------------------- */
/*                             CONTACT ROUTES                                 */
/* -------------------------------------------------------------------------- */
router.get("/contact", contactController.getContact);
router.put("/contact", requireAuth, requireRole(["super-admin", "admin"]), contactController.updateContact);

/* -------------------------------------------------------------------------- */
/*                               SEO ROUTES                                   */
/* -------------------------------------------------------------------------- */
router.get("/seo/:pageName", seoController.getSEO);
router.put("/seo/:pageName", requireAuth, requireRole(["super-admin", "admin"]), seoController.updateSEO);

/* -------------------------------------------------------------------------- */
/*                              MEDIA ROUTES                                  */
/* -------------------------------------------------------------------------- */
router.get("/media", requireAuth, requireRole(["super-admin", "admin", "editor"]), mediaController.getMedia);
router.post("/media", requireAuth, requireRole(["super-admin", "admin", "editor"]), upload.single("image"), mediaController.uploadMedia);
router.delete("/media/:id", requireAuth, requireRole(["super-admin", "admin"]), mediaController.deleteMedia);

/* -------------------------------------------------------------------------- */
/*                            SETTINGS ROUTES                                 */
/* -------------------------------------------------------------------------- */
router.get("/settings", settingsController.getSettings);
router.put("/settings", requireAuth, requireRole(["super-admin"]), settingsController.updateSettings);

/* -------------------------------------------------------------------------- */
/*                           ADMIN USERS ROUTES                               */
/* -------------------------------------------------------------------------- */
router.get("/admin-users", requireAuth, requireRole(["super-admin"]), adminUserController.getAdminUsers);
router.post("/admin-users", requireAuth, requireRole(["super-admin"]), adminUserController.createAdminUser);
router.put("/admin-users/:id", requireAuth, requireRole(["super-admin"]), adminUserController.updateAdminUser);
router.delete("/admin-users/:id", requireAuth, requireRole(["super-admin"]), adminUserController.deleteAdminUser);

export default router;
