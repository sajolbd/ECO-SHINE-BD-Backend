"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
// Import Controllers
const authController = __importStar(require("../controllers/authController"));
const dashboardController_1 = require("../controllers/dashboardController");
const productController = __importStar(require("../controllers/productController"));
const categoryController = __importStar(require("../controllers/categoryController"));
const orderController = __importStar(require("../controllers/orderController"));
const customerController = __importStar(require("../controllers/customerController"));
const bannerController = __importStar(require("../controllers/bannerController"));
const homepageController = __importStar(require("../controllers/homepageController"));
const aboutController = __importStar(require("../controllers/aboutController"));
const contactController = __importStar(require("../controllers/contactController"));
const seoController = __importStar(require("../controllers/seoController"));
const mediaController = __importStar(require("../controllers/mediaController"));
const settingsController = __importStar(require("../controllers/settingsController"));
const adminUserController = __importStar(require("../controllers/adminUserController"));
const courierController = __importStar(require("../controllers/courierController"));
const router = (0, express_1.Router)();
/* -------------------------------------------------------------------------- */
/*                               AUTH ROUTES                                  */
/* -------------------------------------------------------------------------- */
router.post("/auth/seed-admin", authController.seedAdmin);
router.post("/auth/login", authController.login);
router.get("/auth/me", auth_1.requireAuth, authController.me);
router.post("/auth/logout", authController.logout);
/* -------------------------------------------------------------------------- */
/*                            DASHBOARD STATS                                 */
/* -------------------------------------------------------------------------- */
router.get("/dashboard/stats", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin", "editor"]), dashboardController_1.getDashboardStats);
/* -------------------------------------------------------------------------- */
/*                             PRODUCT ROUTES                                 */
/* -------------------------------------------------------------------------- */
router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProductById);
router.post("/products", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin"]), productController.createProduct);
router.put("/products/:id", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin"]), productController.updateProduct);
router.delete("/products/:id", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin"]), productController.deleteProduct);
/* -------------------------------------------------------------------------- */
/*                            CATEGORY ROUTES                                 */
/* -------------------------------------------------------------------------- */
router.get("/categories", categoryController.getCategories);
router.get("/categories/:id", categoryController.getCategoryById);
router.post("/categories", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin"]), categoryController.createCategory);
router.put("/categories/:id", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin"]), categoryController.updateCategory);
router.delete("/categories/:id", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin"]), categoryController.deleteCategory);
/* -------------------------------------------------------------------------- */
/*                              ORDER ROUTES                                  */
/* -------------------------------------------------------------------------- */
router.post("/orders", orderController.createOrder); // Open public endpoint for checkout order submissions
router.get("/orders", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin", "editor"]), orderController.getOrders);
router.get("/orders/:id", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin", "editor"]), orderController.getOrderById);
router.put("/orders/:id/status", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin", "editor"]), orderController.updateOrderStatus);
router.post("/orders/:id/calls", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin", "editor"]), orderController.addCallLog);
router.get("/orders/:id/calls", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin", "editor"]), orderController.getCallHistory);
/* -------------------------------------------------------------------------- */
/*                        STEADFAST COURIER ROUTES                           */
/* -------------------------------------------------------------------------- */
router.post("/courier/steadfast/send/:orderId", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin", "editor"]), courierController.sendOrderToSteadfast);
router.get("/courier/steadfast/status/:orderId", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin", "editor"]), courierController.getSteadfastOrderStatus);
router.get("/courier/steadfast/balance", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin", "editor"]), courierController.getSteadfastBalance);
router.post("/courier/steadfast/bulk-send", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin", "editor"]), courierController.bulkSendToSteadfast);
/*                            CUSTOMER ROUTES                                 */
/* -------------------------------------------------------------------------- */
router.get("/customers", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin", "editor"]), customerController.getCustomers);
router.get("/customers/:id", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin", "editor"]), customerController.getCustomerById);
router.get("/customers/history/:phone", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin", "editor"]), customerController.getCustomerOrderHistory);
/* -------------------------------------------------------------------------- */
/*                             BANNER ROUTES                                  */
/* -------------------------------------------------------------------------- */
router.get("/banners", bannerController.getBanners);
router.post("/banners", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin"]), bannerController.createBanner);
router.put("/banners/:id", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin"]), bannerController.updateBanner);
router.delete("/banners/:id", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin"]), bannerController.deleteBanner);
/* -------------------------------------------------------------------------- */
/*                            HOMEPAGE ROUTES                                 */
/* -------------------------------------------------------------------------- */
router.get("/homepage", homepageController.getHomepage);
router.put("/homepage", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin"]), homepageController.updateHomepage);
/* -------------------------------------------------------------------------- */
/*                               ABOUT ROUTES                                 */
/* -------------------------------------------------------------------------- */
router.get("/about", aboutController.getAbout);
router.put("/about", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin"]), aboutController.updateAbout);
/* -------------------------------------------------------------------------- */
/*                             CONTACT ROUTES                                 */
/* -------------------------------------------------------------------------- */
router.get("/contact", contactController.getContact);
router.put("/contact", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin"]), contactController.updateContact);
/* -------------------------------------------------------------------------- */
/*                               SEO ROUTES                                   */
/* -------------------------------------------------------------------------- */
router.get("/seo/:pageName", seoController.getSEO);
router.put("/seo/:pageName", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin"]), seoController.updateSEO);
/* -------------------------------------------------------------------------- */
/*                              MEDIA ROUTES                                  */
/* -------------------------------------------------------------------------- */
router.get("/media", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin", "editor"]), mediaController.getMedia);
router.post("/media", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin", "editor"]), upload_1.upload.single("image"), mediaController.uploadMedia);
router.delete("/media/:id", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin", "admin"]), mediaController.deleteMedia);
/* -------------------------------------------------------------------------- */
/*                            SETTINGS ROUTES                                 */
/* -------------------------------------------------------------------------- */
router.get("/settings", settingsController.getSettings);
router.put("/settings", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin"]), settingsController.updateSettings);
/* -------------------------------------------------------------------------- */
/*                           ADMIN USERS ROUTES                               */
/* -------------------------------------------------------------------------- */
router.get("/admin-users", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin"]), adminUserController.getAdminUsers);
router.post("/admin-users", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin"]), adminUserController.createAdminUser);
router.put("/admin-users/:id", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin"]), adminUserController.updateAdminUser);
router.delete("/admin-users/:id", auth_1.requireAuth, (0, auth_1.requireRole)(["super-admin"]), adminUserController.deleteAdminUser);
exports.default = router;
