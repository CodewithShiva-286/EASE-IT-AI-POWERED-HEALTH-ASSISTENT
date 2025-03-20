const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Health data: All conditions are false by default.
  healthData: {
    ChronicDiseases: {
      Diabetes: { type: Boolean, default: false },
      Hypertension: { type: Boolean, default: false },
      Asthma: { type: Boolean, default: false },
      HeartDisease: { type: Boolean, default: false },
    },
    InfectiousDiseases: {
      Tuberculosis: { type: Boolean, default: false },
      HepatitisB: { type: Boolean, default: false },
      HIV_AIDS: { type: Boolean, default: false },
      Malaria: { type: Boolean, default: false },
    },
    NeurologicalDisorders: {
      Alzheimer: { type: Boolean, default: false },
      Parkinson: { type: Boolean, default: false },
      Epilepsy: { type: Boolean, default: false },
      MultipleSclerosis: { type: Boolean, default: false },
    },
    Allergies: {
      Peanuts: { type: Boolean, default: false },
      Dust: { type: Boolean, default: false },
      Pollen: { type: Boolean, default: false },
      Shellfish: { type: Boolean, default: false },
      Gluten: { type: Boolean, default: false },
      Lactose: { type: Boolean, default: false },
    },
    VeganConcerns: {
      LactoseIntolerance: { type: Boolean, default: false }
    },
    DailyIssues: {
      Stress: { type: Boolean, default: false },
      SleepIssues: { type: Boolean, default: false },
      Anxiety: { type: Boolean, default: false }
    },
    OnPeriods: {
      // This field is for women
      OnPeriods: { type: Boolean, default: false } // (for women)
    }
  }
});

module.exports = mongoose.model('User', userSchema);
