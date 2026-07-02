import mongoose, { Schema, Document } from 'mongoose';

// --- ENUMS ---
export enum Role { FARMER = 'FARMER', AG_OFFICER = 'AG_OFFICER', NGO_GOVERNMENT = 'NGO_GOVERNMENT', ADMIN = 'ADMIN' }
export enum CropStatus { PLANTED = 'PLANTED', GROWING = 'GROWING', READY_FOR_HARVEST = 'READY_FOR_HARVEST', HARVESTED = 'HARVESTED', FAILED = 'FAILED' }
export enum AlertType { WEATHER_WARNING = 'WEATHER_WARNING', DISEASE_OUTBREAK = 'DISEASE_OUTBREAK', PEST_ALERT = 'PEST_ALERT', GENERAL = 'GENERAL' }

// --- INTERFACES ---
export interface IUser extends Document { email: string; passwordHash: string; name: string; role: Role; phone?: string; }
export interface IFarm extends Document { userId: mongoose.Types.ObjectId; name: string; location: string; sizeHectares: number; }
export interface ICrop extends Document { farmId: mongoose.Types.ObjectId; name: string; variety: string; plantingDate: Date; expectedHarvest: Date; status: CropStatus; }
export interface IPlantScan extends Document { userId: mongoose.Types.ObjectId; cropId?: mongoose.Types.ObjectId; imageUrl: string; diseaseName?: string; pestDetected?: string; nutrientDeficiency?: string; suggestedTreatment?: string; preventionTips?: string; }
export interface IWeatherData extends Document { farmId: mongoose.Types.ObjectId; temperature: number; humidity: number; condition: string; alertLevel: string; }
export interface IMarketListing extends Document { userId: mongoose.Types.ObjectId; cropName: string; pricePerUnit: number; quantity: number; unit: string; location: string; harvestDate: Date; }
export interface IAlert extends Document { senderId: mongoose.Types.ObjectId; type: AlertType; title: string; message: string; targetRole?: Role; }
export interface IFoodSecurityReport extends Document { region: string; status: string; cropHealth: number; diseaseSpread: number; }
export interface ITask extends Document { userId: mongoose.Types.ObjectId; title: string; description?: string; dueDate: Date; isCompleted: boolean; }

// --- SCHEMAS ---
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: Object.values(Role), default: Role.FARMER },
  phone: { type: String }
}, { timestamps: true });

const FarmSchema = new Schema<IFarm>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  location: { type: String, required: true }, // e.g., "Lat: -1.29, Lon: 36.82"
  sizeHectares: { type: Number, required: true }
}, { timestamps: true });

const CropSchema = new Schema<ICrop>({
  farmId: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
  name: { type: String, required: true },
  variety: { type: String, required: true },
  plantingDate: { type: Date, required: true },
  expectedHarvest: { type: Date, required: true },
  status: { type: String, enum: Object.values(CropStatus), default: CropStatus.PLANTED }
}, { timestamps: true });

const PlantScanSchema = new Schema<IPlantScan>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cropId: { type: Schema.Types.ObjectId, ref: 'Crop' },
  imageUrl: { type: String, required: true },
  diseaseName: String, pestDetected: String, nutrientDeficiency: String, 
  suggestedTreatment: String, preventionTips: String
}, { timestamps: true });

const WeatherDataSchema = new Schema<IWeatherData>({
  farmId: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
  temperature: Number, humidity: Number, condition: String, alertLevel: String
}, { timestamps: true });

const MarketListingSchema = new Schema<IMarketListing>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cropName: { type: String, required: true },
  pricePerUnit: { type: Number, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  location: { type: String, required: true },
  harvestDate: { type: Date, required: true }
}, { timestamps: true });

const AlertSchema = new Schema<IAlert>({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: Object.values(AlertType), required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  targetRole: { type: String, enum: Object.values(Role) } // Null means broadcast to all
}, { timestamps: true });

const FoodSecurityReportSchema = new Schema<IFoodSecurityReport>({
  region: { type: String, required: true },
  status: { type: String, required: true },
  cropHealth: { type: Number, required: true },
  diseaseSpread: { type: Number, required: true }
}, { timestamps: true });

const TaskSchema = new Schema<ITask>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  dueDate: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

// --- EXPORT MODELS ---
export const User = mongoose.model<IUser>('User', UserSchema);
export const Farm = mongoose.model<IFarm>('Farm', FarmSchema);
export const Crop = mongoose.model<ICrop>('Crop', CropSchema);
export const PlantScan = mongoose.model<IPlantScan>('PlantScan', PlantScanSchema);
export const WeatherData = mongoose.model<IWeatherData>('WeatherData', WeatherDataSchema);
export const MarketListing = mongoose.model<IMarketListing>('MarketListing', MarketListingSchema);
export const Alert = mongoose.model<IAlert>('Alert', AlertSchema);
export const FoodSecurityReport = mongoose.model<IFoodSecurityReport>('FoodSecurityReport', FoodSecurityReportSchema);
export const Task = mongoose.model<ITask>('Task', TaskSchema);