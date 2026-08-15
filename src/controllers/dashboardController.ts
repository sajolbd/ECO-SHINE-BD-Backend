import { Request, Response, NextFunction } from "express";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { Order } from "../models/Order";
import { Customer } from "../models/Customer";

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const completedOrders = await Order.countDocuments({ status: "delivered" });
    const totalCustomers = await Customer.countDocuments();

    // Fetch recent 5 orders
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    // Fetch recent 5 products
    const recentProducts = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate revenue (sum of total of all non-cancelled orders)
    const revenueStats = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]);
    const totalRevenue = revenueStats[0]?.totalRevenue || 0;

    // Last 7 days orders chart data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const chartData = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalCategories,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalCustomers,
        totalRevenue,
      },
      recentOrders,
      recentProducts,
      chartData,
    });
  } catch (error) {
    next(error);
  }
};
