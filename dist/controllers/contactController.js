"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContact = exports.getContact = void 0;
const Contact_1 = require("../models/Contact");
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
const getContact = async (req, res, next) => {
    try {
        let contact = await Contact_1.Contact.findOne({});
        if (!contact) {
            contact = await Contact_1.Contact.create(DEFAULT_CONTACT);
        }
        res.status(200).json({ success: true, contact });
    }
    catch (error) {
        next(error);
    }
};
exports.getContact = getContact;
const updateContact = async (req, res, next) => {
    try {
        let contact = await Contact_1.Contact.findOne({});
        if (!contact) {
            contact = await Contact_1.Contact.create({ ...DEFAULT_CONTACT, ...req.body });
        }
        else {
            contact = await Contact_1.Contact.findByIdAndUpdate(contact._id, req.body, {
                new: true,
                runValidators: true,
            });
        }
        res.status(200).json({ success: true, contact });
    }
    catch (error) {
        next(error);
    }
};
exports.updateContact = updateContact;
