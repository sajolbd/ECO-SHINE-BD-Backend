import { Request, Response, NextFunction } from "express";
import { Order } from "../models/Order";

const STEADFAST_API_KEY =
  process.env.STEADFAST_API_KEY || "ton0jglsswkdgddbezrk00srezqho7ks";
const STEADFAST_SECRET_KEY =
  process.env.STEADFAST_SECRET_KEY || "asr1xaba09sk8hsfy1gle0kv";
const STEADFAST_BASE_URL =
  process.env.STEADFAST_BASE_URL || "https://portal.packzy.com/api/v1";

const getHeaders = () => ({
  "Api-Key": STEADFAST_API_KEY,
  "Secret-Key": STEADFAST_SECRET_KEY,
  "Content-Type": "application/json",
  "Accept": "application/json",
  "User-Agent": "EcoShineBangladesh/1.0",
});

/**
 * Send a single order to Steadfast Courier
 */
export const sendOrderToSteadfast = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;

    let order = await Order.findOne({ orderId });
    if (!order && orderId.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(orderId);
    }

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    const payload = {
      invoice: order.orderId,
      recipient_name: order.customerName,
      recipient_phone: order.phone,
      recipient_address: order.address,
      cod_amount: order.total,
      note: order.note || `Eco Shine Order ${order.orderId}`,
    };

    const response = await fetch(`${STEADFAST_BASE_URL}/create_order`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({
        success: false,
        message: `Steadfast server response error (${response.status}): ${text.substring(0, 150)}`,
      });
    }

    if (data.status === 200 && data.consignment) {
      const consignment = data.consignment;
      order.courierName = "Steadfast";
      order.courierConsignmentId = String(consignment.consignment_id);
      order.courierTrackingCode = consignment.tracking_code;
      order.courierStatus = consignment.status || "in_review";
      order.courierSentAt = new Date();

      if (order.status === "pending" || order.status === "confirmed") {
        order.status = "shipped";
      }

      await order.save();

      return res.status(200).json({
        success: true,
        message: "Order successfully submitted to Steadfast Courier!",
        consignment: data.consignment,
        order,
      });
    } else {
      return res.status(400).json({
        success: false,
        message:
          data.message ||
          (data.errors ? JSON.stringify(data.errors) : "Failed to create order on Steadfast Courier."),
        data,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error processing Steadfast Courier request.",
    });
  }
};

/**
 * Fetch current tracking status of an order from Steadfast Courier API
 */
export const getSteadfastOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;

    let order = await Order.findOne({ orderId });
    if (!order && orderId.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(orderId);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    let url = `${STEADFAST_BASE_URL}/status_by_invoice/${order.orderId}`;
    if (order.courierConsignmentId) {
      url = `${STEADFAST_BASE_URL}/status_by_cid/${order.courierConsignmentId}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({
        success: false,
        message: `Steadfast status response error (${response.status}): ${text.substring(0, 150)}`,
      });
    }

    if (data.status === 200) {
      const courierStatus = data.delivery_status || data.status;
      order.courierStatus = courierStatus;

      if (courierStatus === "delivered" && order.status !== "delivered") {
        order.status = "delivered";
      } else if (courierStatus === "cancelled" && order.status !== "cancelled") {
        order.status = "cancelled";
      }

      await order.save();

      return res.status(200).json({
        success: true,
        courierStatus,
        deliveryData: data,
        order,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: data.message || "Failed to fetch Steadfast status.",
        data,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching Steadfast status.",
    });
  }
};

/**
 * Check merchant account balance from Steadfast API
 */
export const getSteadfastBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await fetch(`${STEADFAST_BASE_URL}/get_balance`, {
      method: "GET",
      headers: getHeaders(),
    });

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({
        success: false,
        message: `Steadfast balance response error (${response.status}): ${text.substring(0, 150)}`,
      });
    }

    if (data.status === 200) {
      return res.status(200).json({
        success: true,
        balance: data.current_balance,
        data,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: data.message || "Failed to fetch Steadfast balance.",
        data,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error checking Steadfast balance.",
    });
  }
};

/**
 * Send bulk orders to Steadfast Courier
 */
export const bulkSendToSteadfast = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderIds } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of orderIds to process.",
      });
    }

    const results = [];
    for (const id of orderIds) {
      const order = await Order.findOne({ orderId: id });
      if (order) {
        const payload = {
          invoice: order.orderId,
          recipient_name: order.customerName,
          recipient_phone: order.phone,
          recipient_address: order.address,
          cod_amount: order.total,
          note: order.note || `Eco Shine Order ${order.orderId}`,
        };

        try {
          const resp = await fetch(`${STEADFAST_BASE_URL}/create_order`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(payload),
          });
          const text = await resp.text();
          let resJson: any;
          try {
            resJson = JSON.parse(text);
          } catch {
            resJson = { status: 502, message: text.substring(0, 100) };
          }

          if (resJson.status === 200 && resJson.consignment) {
            order.courierName = "Steadfast";
            order.courierConsignmentId = String(resJson.consignment.consignment_id);
            order.courierTrackingCode = resJson.consignment.tracking_code;
            order.courierStatus = resJson.consignment.status || "in_review";
            order.courierSentAt = new Date();
            order.status = "shipped";
            await order.save();
            results.push({ orderId: id, success: true, trackingCode: resJson.consignment.tracking_code });
          } else {
            results.push({ orderId: id, success: false, error: resJson.message });
          }
        } catch (e: any) {
          results.push({ orderId: id, success: false, error: e.message });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `Processed ${results.length} orders for Steadfast Courier.`,
      results,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error processing bulk Steadfast orders.",
    });
  }
};
