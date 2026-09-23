import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { PixelSettings } from "../models/PixelSettings";

// Default Pixel Settings fallback
const DEFAULT_PIXEL_SETTINGS = {
  pixelId: "",
  enabled: true,
  capiAccessToken: "",
  testEventCode: "",
  enableCapi: false,
  trackPageView: true,
  trackViewContent: true,
  trackAddToCart: true,
  trackInitiateCheckout: true,
  trackPurchase: true,
  trackContact: true,
  customPixels: [],
};

// SHA256 Hash helper for CAPI User Data compliance
const hashSHA256 = (value: string): string => {
  if (!value) return "";
  const cleaned = value.trim().toLowerCase();
  return crypto.createHash("sha256").update(cleaned).digest("hex");
};

/**
 * Fetch Facebook Pixel Settings
 */
export const getPixelSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await PixelSettings.findOne({});

    if (!settings) {
      settings = await PixelSettings.create(DEFAULT_PIXEL_SETTINGS);
    }

    res.status(200).json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Facebook Pixel Settings (Admin Only)
 */
export const updatePixelSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await PixelSettings.findOne({});

    if (!settings) {
      settings = await PixelSettings.create({ ...DEFAULT_PIXEL_SETTINGS, ...req.body });
    } else {
      settings = await PixelSettings.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

/**
 * Dispatch Meta CAPI Event (Server-side)
 */
export const dispatchCAPIEventHelper = async (payload: {
  eventName: string;
  eventId?: string;
  eventSourceUrl?: string;
  userData?: {
    phone?: string;
    email?: string;
    name?: string;
    clientIp?: string;
    userAgent?: string;
  };
  customData?: Record<string, any>;
}) => {
  try {
    const settings = await PixelSettings.findOne({});
    if (!settings || !settings.enabled || !settings.enableCapi || !settings.pixelId || !settings.capiAccessToken) {
      return { skipped: true, reason: "CAPI or Pixel is disabled or missing credentials" };
    }

    const { eventName, eventId, eventSourceUrl, userData, customData } = payload;

    const formattedUserData: Record<string, any> = {};

    if (userData?.clientIp) formattedUserData.client_ip_address = userData.clientIp;
    if (userData?.userAgent) formattedUserData.client_user_agent = userData.userAgent;
    if (userData?.phone) formattedUserData.ph = [hashSHA256(userData.phone)];
    if (userData?.email) formattedUserData.em = [hashSHA256(userData.email)];
    if (userData?.name) {
      const parts = userData.name.trim().split(" ");
      if (parts[0]) formattedUserData.fn = [hashSHA256(parts[0])];
      if (parts.length > 1) formattedUserData.ln = [hashSHA256(parts.slice(1).join(" "))];
    }

    const capiPayload: Record<string, any> = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          event_source_url: eventSourceUrl || "https://www.ecoshinebd.com",
          action_source: "website",
          user_data: formattedUserData,
          custom_data: customData || {},
          ...(settings.testEventCode ? { test_event_code: settings.testEventCode } : {}),
        },
      ],
    };

    const url = `https://graph.facebook.com/v19.0/${settings.pixelId}/events?access_token=${settings.capiAccessToken}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(capiPayload),
    });

    const data = await response.json();
    return { success: response.ok, response: data };
  } catch (error: any) {
    console.error("CAPI Dispatch Error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Express Endpoint to relay CAPI event from Storefront / Client
 */
export const sendCAPIEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { eventName, eventId, eventSourceUrl, userData, customData } = req.body;

    if (!eventName) {
      return res.status(400).json({ success: false, message: "eventName is required." });
    }

    const clientIp = (req.headers["x-forwarded-for"] as string) || req.ip || "";
    const userAgent = req.headers["user-agent"] || "";

    const mergedUserData = {
      clientIp,
      userAgent,
      ...(userData || {}),
    };

    const result = await dispatchCAPIEventHelper({
      eventName,
      eventId,
      eventSourceUrl,
      userData: mergedUserData,
      customData,
    });

    res.status(200).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
