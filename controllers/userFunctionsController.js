import itemModel from "../models/itemModel.js";
import adminModel from "../models/adminModel.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

const listFoodUser = async (req, res) => {
  try {
    // ✅ Use correct cookie name
    const token = req.cookies.userCookies;
    if (!token) {
      return res.status(401).json({ success: false, message: "User not logged in" });
    }

    // ✅ Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // ✅ Get and enrich items
    const items = await itemModel.find();
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const admin = await adminModel.findOne({ email: item.owner_email });
        const shopName = admin?.name_of_the_shop || "Unknown Shop";
        const { owner_email, ...rest } = item._doc;
        return {
          ...rest,
          shop_name: shopName,
        };
      })
    );

    res.json({ success: true, data: enrichedItems });

  } catch (error) {
    console.error("❌ listFoodUser error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { listFoodUser };