const prisma = require("../../prismaCliaynt");


const customerNearbt = async (req, res) => {
    try {
        const { latitude, longitude, radius = 300 } = req.query;

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        const searchRadius = parseFloat(radius);

        if (isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid latitude or longitude',
            });
        }

        const suppliers = await prisma.supplier.findMany({
            where: {
                isActive: true,
                isApproved: true
            },
            select: {
                id: true,
                companyName: true,
                lat: true,
                lng: true,
                address: true,
                phone: true,
            },
        });

        const toRadians = (deg) => (deg * Math.PI) / 180;
        const earthRadius = 6371; // Radius of Earth in km

        const nearbySuppliers = suppliers
            .map((supplier) => {
                if (!supplier.lat || !supplier.lng) return null;

                const dLat = toRadians(supplier.lat - lat);
                const dLng = toRadians(supplier.lng - lng);
                const a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(toRadians(lat)) *
                    Math.cos(toRadians(supplier.lat)) *
                    Math.sin(dLng / 2) *
                    Math.sin(dLng / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distance = earthRadius * c;

                return { ...supplier, distance };
            })
            .filter((supplier) => supplier && supplier.distance < searchRadius)
            .sort((a, b) => a.distance - b.distance);

        return res.json({
            status: true,
            suppliers: nearbySuppliers,
            message: `Found ${nearbySuppliers.length} suppliers within ${searchRadius}km`,
        });
    } catch (error) {
        console.error('Error finding nearby suppliers:', error);
        return res.status(500).json({
            status: false,
            message: 'An error occurred while finding nearby suppliers',
        });
    }
}


module.exports = { customerNearbt }