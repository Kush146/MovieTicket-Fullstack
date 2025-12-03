import PromoCode from "../models/PromoCode.js";

// Validate promo code
export const validatePromoCode = async (req, res) => {
    try {
        const { code, amount } = req.body;

        if (!code) {
            return res.json({ success: false, message: "Promo code is required" });
        }

        const promo = await PromoCode.findOne({ 
            code: code.toUpperCase(), 
            isActive: true 
        });

        if (!promo) {
            return res.json({ success: false, message: "Invalid promo code" });
        }

        // Check validity
        const now = new Date();
        if (now < promo.validFrom || now > promo.validUntil) {
            return res.json({ success: false, message: "Promo code has expired" });
        }

        if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
            return res.json({ success: false, message: "Promo code usage limit reached" });
        }

        if (amount && amount < promo.minAmount) {
            return res.json({ 
                success: false, 
                message: `Minimum amount of ${promo.minAmount} required for this promo code` 
            });
        }

        // Calculate discount
        let discountAmount = 0;
        if (promo.discountType === 'PERCENTAGE') {
            discountAmount = (amount * promo.discountValue) / 100;
            if (promo.maxDiscount) {
                discountAmount = Math.min(discountAmount, promo.maxDiscount);
            }
        } else {
            discountAmount = Math.min(promo.discountValue, amount);
        }

        res.json({
            success: true,
            promo: {
                code: promo.code,
                discountType: promo.discountType,
                discountValue: promo.discountValue,
                discountAmount: discountAmount,
                description: promo.description
            }
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

