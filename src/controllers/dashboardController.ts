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

    // Calculate revenue and gross profit (excluding delivery fee)
    const revenueAndProfitStats = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      {
        $project: {
          total: 1,
          subtotal: 1,
          itemsCost: {
            $sum: {
              $map: {
                input: "$items",
                as: "item",
                in: { $multiply: [{ $ifNull: ["$$item.costPrice", 0] }, "$$item.quantity"] }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          totalSubtotal: { $sum: "$subtotal" },
          totalItemsCost: { $sum: "$itemsCost" }
        }
      }
    ]);

    const totalRevenue = revenueAndProfitStats[0]?.totalRevenue || 0;
    const totalSubtotal = revenueAndProfitStats[0]?.totalSubtotal || 0;
    const totalItemsCost = revenueAndProfitStats[0]?.totalItemsCost || 0;
    const grossProfit = totalSubtotal - totalItemsCost;

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
        grossProfit,
      },
      recentOrders,
      recentProducts,
      chartData,
    });
  } catch (error) {
    next(error);
  }
};
