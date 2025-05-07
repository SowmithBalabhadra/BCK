import Rent from '../models/Rent.js';
import RentInfo from '../models/RentInfo.js';
import jwt from 'jsonwebtoken';
import redisClient from '../../utils/redisClient.js';

class ShoptakerController {
    constructor() {
        this.decodeToken = this.decodeToken.bind(this);
        this.welcome = this.welcome.bind(this);
        this.dashboard = this.dashboard.bind(this);
        this.surfRent = this.surfRent.bind(this);
        this.bookRent = this.bookRent.bind(this);
        this.analyzeBookings = this.analyzeBookings.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
    }

    decodeToken(req) {
        const token = req.cookies.token; 
        if (!token) return null;

        try {
            const decoded = jwt.verify(token, 'hello'); 
            return decoded; 
        } catch (error) {
            console.error('Token verification failed:', error);
            return null;
        }
    }

    async welcome(req, res) {
        const user = this.decodeToken(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized, please log in.' }); 
        }

        try {
            res.status(200).json({ userName: user.userName }); 
        } catch (error) {
            console.error('Error sending user data:', error);
            res.status(500).json({ error: 'Server Error' });
        }
    }

    async dashboard(req, res) {
        const user = this.decodeToken(req); 
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' }); 
        }

        try {
            const rentInfos = await RentInfo.find({ renterOfStore: user.userName });

            res.status(200).json({
                name: user.userName, 
                rentInfos: rentInfos.map(rentInfo => ({
                    rentId: rentInfo.rentId,
                    ownerOfStore: rentInfo.ownerOfStore,
                    location: rentInfo.location,
                    sqft: rentInfo.sqft,
                    price: rentInfo.price,
                    renterOfStore: rentInfo.renterOfStore,
                    is_profit: rentInfo.is_profit,
                    is_normal: rentInfo.is_normal,
                    is_loss: rentInfo.is_loss,
                    rent_giver_gmail: rentInfo.rent_giver_gmail,
                    rent_taker_gmail: rentInfo.rent_taker_gmail
                })),
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async surfRent(req, res) {
        const user = this.decodeToken(req);
        if (!user) {
            return res.redirect('/login');
        }

        const cacheKey = 'surfRent:all';
        try {
            const cached = await redisClient.get(cacheKey);
            if (cached) {
                console.log("Serving from Redis cache");
                return res.json(JSON.parse(cached));
            }

            const rents = await Rent.find();
            await redisClient.set(cacheKey, JSON.stringify({ rents }), { EX: 300 }); // 5 min

            res.json({ rents });
        } catch (error) {
            console.error('Error fetching rents:', error);
            res.status(500).send('Server Error');
        }
    }

    async bookRent(req, res) {
        const user = this.decodeToken(req);
        if (!user) {
            return res.status(401).json({ message: "User not authenticated" }); 
        }

        try {
            const { id } = req.params; 
            const rent = await Rent.findById(id);

            if (rent) {
                const rentInfo = new RentInfo({
                    ownerOfStore: rent.ownerOfStore,
                    location: rent.location,
                    sqft: rent.sqft,
                    price: rent.price,
                    renterOfStore: user.userName, 
                    rentId: rent.rent_id,
                });

                await rentInfo.save();
                await Rent.findByIdAndDelete(id);

                // Invalidate cache
                await redisClient.del('surfRent:all');

                return res.status(200).json({ message: "Rent booked successfully!" });
            } else {
                return res.status(404).json({ message: "Rent not found" });
            }
        } catch (error) {
            console.error("Error booking rent:", error);
            return res.status(500).json({ message: "Server error while booking rent" });
        }
    }

    async analyzeBookings(req, res) {
        const user = this.decodeToken(req);
        if (!user) {
            return res.redirect('/login'); 
        }

        try {
            const rentInfos = await RentInfo.find({ renterOfStore: user.userName });
            const totalBookings = rentInfos.length;

            const currentTime = new Date();
            const twentyFourHoursAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

            const recentBookings = rentInfos.filter(rentInfo => {
                const bookingDate = rentInfo._id.getTimestamp();
                return bookingDate >= twentyFourHoursAgo;
            }).length;

            res.render('shoptaker/analyzeBookings', {
                totalBookings,
                recentBookings
            });
        } catch (error) {
            console.error('Error analyzing bookings:', error);
            res.status(500).send('Server Error');
        }
    }

    async updateStatus(req, res) {
        const user = this.decodeToken(req);
        console.log("hello in update status");
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            const { rentId, statusField } = req.body;
            if (!rentId || !statusField) {
                return res.status(400).json({ error: "Invalid input" });
            }

            const validFields = ['is_profit', 'is_normal', 'is_loss'];
            if (!validFields.includes(statusField)) {
                return res.status(400).json({ error: "Invalid status field" });
            }

            const updateObject = validFields.reduce((acc, field) => {
                acc[field] = field === statusField;
                return acc;
            }, {});

            const updatedRentInfo = await RentInfo.findOneAndUpdate(
                { rentId, renterOfStore: user.userName },
                updateObject,
                { new: true }
            );

            if (!updatedRentInfo) {
                return res.status(404).json({ error: "RentInfo not found" });
            }

            res.status(200).json({ message: "Status updated successfully", rentInfo: updatedRentInfo });
        } catch (error) {
            console.error("Error updating status:", error);
            res.status(500).json({ error: "Server error while updating status" });
        }
    }
}

export default new ShoptakerController();
