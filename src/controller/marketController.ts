import { Router, Request, Response } from 'express';
import { MarketListing, User } from '../Models/index';
import { AuthRequest, authenticateToken } from '../middleware/authMiddlware';

const router = Router();

/**
 * Fetches aggregated market prices using MongoDB Aggregation Pipeline.
 */
router.get('/market-prices', async (req: Request, res: Response) => {
  try {
    const prices = await MarketListing.aggregate([
      {
        $group: {
          _id: "$cropName",
          averagePrice: { $avg: "$pricePerUnit" },
          totalListings: { $sum: 1 }
        }
      },
      {
        $project: {
          crop: "$_id",
          averagePrice: 1,
          totalListings: 1,
          _id: 0
        }
      }
    ]);

    res.json(prices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Fetches all market listings with optional filtering.
 */
router.get('/market-listings', async (req: Request, res: Response) => {
  try {
    const { location, crop } = req.query;
    const filter: any = {};
    
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (crop) filter.cropName = { $regex: crop, $options: 'i' };

    // Populate user details (name and phone) for the buyer to contact the farmer
    const listings = await MarketListing.find(filter)
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Allows a farmer to create a new market listing.
 */
router.post('/listings', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { cropName, pricePerUnit, quantity, unit, location, harvestDate } = req.body;
    
    const listing = await MarketListing.create({
      userId: req.user!.id,
      cropName,
      pricePerUnit,
      quantity,
      unit,
      location,
      harvestDate: new Date(harvestDate)
    });

    res.status(201).json(listing);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;