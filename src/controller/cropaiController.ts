import { Router, Request, Response } from 'express';
import { PlantScan } from '../Models/index';
import { AuthRequest, authenticateToken } from '../middleware/authMiddlware';

const router = Router();

/**
 * MOCK AI Chat: Simulates an agricultural advisory chatbot.
 */
router.post('/chat', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { message, cropType } = req.body;
    
    let response = "I am the HarvestAI assistant. How can I help you optimize your yield today?";
    if (message.toLowerCase().includes('water') || message.toLowerCase().includes('irrigate')) {
      response = `For ${cropType || 'your crops'}, it is recommended to irrigate early in the morning to reduce evaporation. Ensure soil moisture is at 60%.`;
    } else if (message.toLowerCase().includes('fertilizer')) {
      response = `Apply NPK fertilizer during the vegetative stage. For ${cropType || 'your crops'}, 50kg per acre is optimal.`;
    }

    res.json({ aiResponse: response, timestamp: new Date() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * MOCK Disease Detection: Simulates image analysis and saves results to MongoDB.
 */
router.post('/analyze', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const mockImageUrl = req.body.imageUrl || "mock_uploaded_image.jpg";
    
    // Mock AI Analysis Results
    const analysisResult = {
      diseaseName: "Maize Lethal Necrosis (MLN)",
      pestDetected: "Aphids",
      nutrientDeficiency: "Nitrogen deficiency (Yellowing leaves)",
      suggestedTreatment: "Apply Imidacloprid for aphids. Use balanced NPK fertilizer for nitrogen.",
      preventionTips: "Practice crop rotation. Ensure proper spacing for air circulation."
    };

    // Save to MongoDB
    const scanRecord = await PlantScan.create({
      userId: req.user!.id,
      imageUrl: mockImageUrl,
      ...analysisResult
    });

    res.json({ message: "Analysis complete", results: analysisResult, scanId: scanRecord._id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;