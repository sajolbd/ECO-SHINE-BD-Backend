import { Request, Response, NextFunction } from "express";
import { Contact } from "../models/Contact";

const DEFAULT_CONTACT = {
  phone: "01958-058359",
  whatsapp: "8801958058359",
  email: "bdecoshine@gmail.com",
  address: "মিরপুর, ঢাকা-১২১৬, বাংলাদেশ",
  businessHours: "শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - রাত ৮:০০",
  facebook: "https://facebook.com/ecoshinebd",
  instagram: "https://instagram.com/ecoshinebd",
  youtube: "",
  otherSocialLinks: new Map(),
};

export const getContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let contact = await Contact.findOne({});

    if (!contact) {
      contact = await Contact.create(DEFAULT_CONTACT);
    }

    res.status(200).json({ success: true, contact });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let contact = await Contact.findOne({});

    if (!contact) {
      contact = await Contact.create({ ...DEFAULT_CONTACT, ...req.body });
    } else {
      contact = await Contact.findByIdAndUpdate(contact._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({ success: true, contact });
  } catch (error) {
    next(error);
  }
};
