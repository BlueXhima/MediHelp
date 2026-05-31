const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const profileController = require('../controller/profileController'); // updated
const medicalController = require('../controller/medicalRecordController'); // updated
const medicationController = require('../controller/medicationController'); // updated
const emergencyController = require('../controller/emergencyContactController'); // updated

// Multer Setup
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, `pfp-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Patient Profile & Health Metrics
router.get('/patient-profile/', profileController.getPatientProfile);
router.post('/update-profile-full', upload.single('profileImage'), profileController.updateFullProfile);

router.get('/health-metrics/:patientId', profileController.getLatestMetrics);
router.post('/health-metrics/:patientId', profileController.updateMetrics);

// Medical Records
router.get('/medical-records/:patientId', medicalController.getMedicalRecords);

router.post('/medical-condition/:patientId', medicalController.addCondition);
router.post('/medical-allergy/:patientId', medicalController.addAllergy);
router.post('/medical-surgery/:patientId', medicalController.addSurgery);

router.delete('/medical-condition/:conditionId', medicalController.deleteCondition);
router.delete('/medical-allergy/:allergyId', medicalController.deleteAllergy); // i-implement sa controller
router.delete('/medical-surgery/:surgeryId', medicalController.deleteSurgery);   // i-implement sa controller

// Medications
router.get('/medications/:patientId', medicationController.getMedications);
router.post('/medication/:patientId', medicationController.addMedication);
router.delete('/medication/:medicationId', medicationController.deleteMedication);

// Emergency Contacts
router.get('/emergency-contacts/:patientId', emergencyController.getContacts);
router.post('/emergency-contact/:patientId', emergencyController.addContact);
router.delete('/emergency-contact/:patientId', emergencyController.deleteContact);

module.exports = router;