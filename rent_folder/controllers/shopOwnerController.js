import Rent from '../models/Rent.js';
import RentInfo from '../models/RentInfo.js';
import jwt from 'jsonwebtoken';
import redisClient from '../../utils/redisClient.js';

class ShopOwnerController {
    constructor() {
        this.welcome = this.welcome.bind(this);
        this.fetchRents = this.fetchRents.bind(this);
        this.fetchRentInfos = this.fetchRentInfos.bind(this);
        this.rentMyShop = this.rentMyShop.bind(this);
        this.deleteRent = this.deleteRent.bind(this);
        this.analyzeRentals = this.analyzeRentals.bind(this);
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
        if (user) {
            res.json({ userName: user.userName });
        } else {
            res.status(401).json({ message: "User not authenticated" });
        }
    }

    async fetchRentInfos(req, res) {
        const user = this.decodeToken(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }

        const cacheKey = `rentInfos:${user.userName}`;
        try {
            const cached = await redisClient.get(cacheKey);
            if (cached) {
                return res.json(JSON.parse(cached));
            }

            const rentInfos = await RentInfo.find({ ownerOfStore: user.userName });
            await redisClient.set(cacheKey, JSON.stringify(rentInfos), { EX: 300 });
            res.json(rentInfos);
        } catch (error) {
            console.error('Error fetching rent information:', error);
            res.status(500).json({ message: 'Error fetching rent information' });
        }
    }

    async fetchRents(req, res) {
        const user = this.decodeToken(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }

        const cacheKey = `rents:${user.userName}`;
        try {
            const cached = await redisClient.get(cacheKey);
            if (cached) {
                return res.json(JSON.parse(cached));
            }

            const rents = await Rent.find({ ownerOfStore: user.userName });
            await redisClient.set(cacheKey, JSON.stringify(rents), { EX: 300 });
            res.json(rents);
        } catch (error) {
            console.error('Error fetching rents:', error);
            res.status(500).json({ message: 'Error fetching rents' });
        }
    }

    async rentMyShop(req, res) {
        try {
            const user = this.decodeToken(req);
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized. Please log in.' });
            }

            if (req.method === 'POST') {
                const { location, sqft, price } = req.body;

                if (!location || !sqft || !price) {
                    return res.status(400).json({ message: 'All fields are required.' });
                }

                const rent_id = this.generateUniqueRentId();

                const rent = new Rent({
                    rent_id,
                    ownerOfStore: user.userName,
                    location,
                    sqft,
                    price,
                });

                await rent.save();

                // Invalidate cache
                await redisClient.del(`rents:${user.userName}`);

                return res.status(201).json({ message: 'Shop listed successfully!' });
            } else {
                return res.status(405).json({ message: 'Method not allowed.' });
            }
        } catch (error) {
            console.error('Error processing rent request:', error);
            res.status(500).json({ message: 'Server error. Please try again later.' });
        }
    }

    generateUniqueRentId() {
        const timestamp = Date.now();
        const randomNumber = Math.floor(Math.random() * 100000);
        return timestamp + randomNumber;
    }

    async deleteRent(req, res) {
        const user = this.decodeToken(req);
        if (!user) {
            return res.redirect('/login');
        }

        try {
            const rentId = parseInt(req.params.rent_id, 10);
            if (isNaN(rentId)) {
                return res.status(400).json({ message: 'Invalid rent ID' });
            }

            const deletedRent = await Rent.findOneAndDelete({ rent_id: rentId, ownerOfStore: user.userName });
            if (!deletedRent) {
                return res.status(404).json({ message: 'Rent not found' });
            }

            // Invalidate cache
            await redisClient.del(`rents:${user.userName}`);

            res.json({ message: 'Rent deleted successfully' });
        } catch (error) {
            console.error('Error deleting rent:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async analyzeRentals(req, res) {
        const user = this.decodeToken(req);
        if (!user) {
            return res.redirect('/login');
        }

        try {
            const rentEntries = await Rent.find({ ownerOfStore: user.userName });
            const totalRentals = rentEntries.length;

            const rentedEntries = await RentInfo.find({ ownerOfStore: user.userName });
            const rentedCount = rentedEntries.length;

            res.render('shopOwner/analyzeRentals', {
                totalRentals,
                rentedCount,
            });
        } catch (error) {
            console.error('Error analyzing rentals:', error);
            res.status(500).send('Server Error');
        }
    }
}

export default new ShopOwnerController();
