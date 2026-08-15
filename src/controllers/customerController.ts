import { Request, Response, NextFunction } from "express";
import { Customer } from "../models/Customer";
import { Order } from "../models/Order";

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, limit = 50, page = 1 } = req.query;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const pageSize = Number(limit);
    const pageNum = Number(page);
    const skip = (pageNum - 1) * pageSize;

    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .sort({ totalSpending: -1 })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / pageSize),
      customers,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found." });
    }

    res.status(200).json({ success: true, customer });
  } catch (error) {
    next(error);
  }
};

export const getCustomerOrderHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.params;
    const orders = await Order.find({ phone }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};
