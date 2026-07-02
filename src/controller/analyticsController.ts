import { Router, Response } from 'express';
import { Farm, PlantScan, FoodSecurityReport, Role } from '../Models/index';
import { AuthRequest, authenticateToken, authorizeRoles } from '../middleware/authMiddlware';

const router = Router();

/**
 * Generates Food Security and Regional Analytics Reports.
 */
router.get('/reports', authenticateToken, authorizeRoles(Role.NGO_GOVERNMENT, Role.ADMIN), async (req: AuthRequest, res: Response) => {
  try {
    const { region } = req.query;
    
    const totalFarms = await Farm.countDocuments();
    const diseasedScans = await PlantScan.countDocuments({ diseaseName: { $exists: true, $ne: null } });
    
    const reportData = {
      region: region || "National",
      status: totalFarms > 100 ? "Secure" : "At Risk",
      cropHealth: Math.max(0, 100 - (diseasedScans * 2)), 
      diseaseSpread: Math.min(100, diseasedScans * 5),    
    };

    // Save report to MongoDB
    const savedReport = await new FoodSecurityReport(reportData).save();

    res.json(savedReport);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

export default router;