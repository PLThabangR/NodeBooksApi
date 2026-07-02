import { Router, Response } from 'express';
import { Farm, Crop, User, PlantScan,Role } from '../Models/index';
import { AuthRequest, authenticateToken } from '../middleware/authMiddlware';



const router = Router();

/**
 * GET /api/dashboard/summary
 * Generates a summary dashboard based on user role.
 */
router.get('/summary', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const role = req.user!.role;
    let summary = {};

    if (role === Role.FARMER) { // Best practice to use Enum here too
      const farmerFarms = await Farm.find({ userId: req.user!.id }).select('_id');
      const farmIds = farmerFarms.map(f => f._id);
      const crops = await Crop.countDocuments({ farmId: { $in: farmIds } });
      const alerts = await PlantScan.countDocuments({ userId: req.user!.id, diseaseName: { $exists: true, $ne: null } });
      summary = { totalCrops: crops, pendingAlerts: alerts };
    } else {
      // FIX: Use Role.FARMER instead of the string 'FARMER'
      const totalFarmers = await User.countDocuments({ role: Role.FARMER });
      const totalFarms = await Farm.countDocuments();
      const activeDiseaseScans = await PlantScan.countDocuments({ diseaseName: { $exists: true, $ne: null } });
      summary = { totalFarmers, totalFarms, activeDiseaseOutbreaks: activeDiseaseScans };
    }

    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;