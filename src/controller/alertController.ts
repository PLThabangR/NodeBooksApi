import { Router, Response } from 'express';
import { Alert, Role } from '../Models/index';
import { AuthRequest, authenticateToken, authorizeRoles } from '../middleware/authMiddlware';

const router = Router();

/**
 * Officers/Admins send alerts to farmers.
 */
router.post('/', authenticateToken, authorizeRoles(Role.AG_OFFICER, Role.ADMIN, Role.NGO_GOVERNMENT), async (req: AuthRequest, res: Response) => {
  try {
    const { type, title, message, targetRole } = req.body;
    const alert = await Alert.create({
      senderId: req.user!.id, type, title, message, targetRole
    });
    res.status(201).json(alert);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

/**
 * Farmers view their relevant alerts.
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    // Fetch alerts targeted at their role OR general alerts (targetRole doesn't exist/is null)
    const alerts = await Alert.find({
      $or: [
        { targetRole: req.user!.role }, 
        { targetRole: { $exists: false } }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(alerts);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

export default router;