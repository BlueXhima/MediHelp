-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: medihelp_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `related_articles`
--

DROP TABLE IF EXISTS `related_articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `related_articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `condition_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `condition_id` (`condition_id`),
  CONSTRAINT `related_articles_ibfk_1` FOREIGN KEY (`condition_id`) REFERENCES `conditions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `related_articles`
--

LOCK TABLES `related_articles` WRITE;
/*!40000 ALTER TABLE `related_articles` DISABLE KEYS */;
INSERT INTO `related_articles` VALUES (1,1,'Understanding Heart Attacks','https://medlineplus.gov/heartattack.html'),(2,1,'Angina','https://medlineplus.gov/angina.html'),(3,1,'Pulmonary Embolism','https://medlineplus.gov/pulmonaryembolism.html'),(4,2,'Asthma','https://medlineplus.gov/asthma.html'),(5,2,'COPD','https://medlineplus.gov/copd.html'),(6,2,'Heart Failure','https://medlineplus.gov/heartfailure.html'),(7,3,'Common Cold','https://medlineplus.gov/commoncold.html'),(8,3,'Bronchitis','https://medlineplus.gov/acutebronchitis.html'),(9,3,'Pneumonia','https://medlineplus.gov/pneumonia.html'),(10,4,'Stroke','https://medlineplus.gov/stroke.html'),(11,4,'Meningitis','https://medlineplus.gov/meningitis.html'),(12,4,'Brain Aneurysm','https://medlineplus.gov/brainaneurysm.html'),(13,5,'Migraine','https://medlineplus.gov/migraine.html'),(14,5,'Tension Headache','https://medlineplus.gov/tensionheadache.html'),(15,5,'Sinusitis','https://medlineplus.gov/sinusitis.html'),(16,6,'Stroke','https://medlineplus.gov/stroke.html'),(17,6,'Transient Ischemic Attack','https://medlineplus.gov/transientischemicattack.html'),(18,6,'Seizures','https://medlineplus.gov/seizures.html'),(19,7,'Heat Illness','https://medlineplus.gov/heatillness.html'),(20,7,'Meningitis','https://medlineplus.gov/meningitis.html'),(21,7,'Sepsis','https://medlineplus.gov/sepsis.html'),(22,8,'Influenza','https://medlineplus.gov/flu.html'),(23,8,'COVID-19','https://medlineplus.gov/covid19.html'),(24,8,'Dehydration','https://medlineplus.gov/dehydration.html'),(25,9,'COVID-19 Testing','https://medlineplus.gov/covid19testing.html'),(26,9,'Long COVID','https://medlineplus.gov/longcovid.html'),(27,9,'COVID-19 Vaccines','https://medlineplus.gov/covid19vaccines.html'),(28,10,'Influenza','https://medlineplus.gov/flu.html'),(29,10,'Pneumonia','https://medlineplus.gov/pneumonia.html'),(30,10,'Flu Shot','https://medlineplus.gov/flushot.html'),(31,11,'Appendicitis','https://medlineplus.gov/appendicitis.html'),(32,11,'Gallbladder Diseases','https://medlineplus.gov/gallbladderdiseases.html'),(33,11,'Pancreatitis','https://medlineplus.gov/pancreatitis.html'),(34,12,'Indigestion','https://medlineplus.gov/indigestion.html'),(35,12,'Irritable Bowel Syndrome','https://medlineplus.gov/irritablebowelsyndrome.html'),(36,12,'Gastroenteritis','https://medlineplus.gov/gastroenteritis.html'),(37,13,'Food Poisoning','https://medlineplus.gov/foodpoisoning.html'),(38,13,'Morning Sickness','https://medlineplus.gov/morningsickness.html'),(39,13,'Motion Sickness','https://medlineplus.gov/motionsickness.html'),(40,14,'Sciatica','https://medlineplus.gov/sciatica.html'),(41,14,'Herniated Disk','https://medlineplus.gov/herniateddisk.html'),(42,14,'Osteoporosis','https://medlineplus.gov/osteoporosis.html'),(43,15,'Osteoarthritis','https://medlineplus.gov/osteoarthritis.html'),(44,15,'Rheumatoid Arthritis','https://medlineplus.gov/rheumatoidarthritis.html'),(45,15,'Gout','https://medlineplus.gov/gout.html'),(46,16,'Fractures','https://medlineplus.gov/fractures.html'),(47,16,'Sprains and Strains','https://medlineplus.gov/sprainsandstrains.html'),(48,16,'Wounds','https://medlineplus.gov/woundsandinjuries.html'),(49,17,'Drug Reactions','https://medlineplus.gov/drugreactions.html'),(50,17,'Meningococcal Infections','https://medlineplus.gov/meningococcalinfections.html'),(51,17,'Allergic Reactions','https://medlineplus.gov/allergicreactions.html'),(52,18,'Eczema','https://medlineplus.gov/eczema.html'),(53,18,'Psoriasis','https://medlineplus.gov/psoriasis.html'),(54,18,'Contact Dermatitis','https://medlineplus.gov/contactdermatitis.html'),(55,19,'Anemia','https://medlineplus.gov/anemia.html'),(56,19,'Sleep Apnea','https://medlineplus.gov/sleepapnea.html'),(57,19,'Chronic Fatigue Syndrome','https://medlineplus.gov/chronicfatiguesyndrome.html'),(58,20,'Vertigo','https://medlineplus.gov/vertigo.html'),(59,20,'Low Blood Pressure','https://medlineplus.gov/lowbloodpressure.html'),(60,20,'Meniere\'s Disease','https://medlineplus.gov/menieresdisease.html'),(61,21,'Food Allergy','https://medlineplus.gov/foodallergy.html'),(62,21,'Anaphylaxis','https://medlineplus.gov/anaphylaxis.html'),(63,21,'Hives','https://medlineplus.gov/hives.html'),(64,22,'Panic Disorder','https://medlineplus.gov/panicdisorder.html'),(65,22,'Generalized Anxiety Disorder','https://medlineplus.gov/generalizedanxietydisorder.html'),(66,22,'Stress','https://medlineplus.gov/stress.html'),(67,23,'Suicide','https://medlineplus.gov/suicide.html'),(68,23,'Mental Health','https://medlineplus.gov/mentalhealth.html'),(69,23,'Antidepressants','https://medlineplus.gov/antidepressants.html');
/*!40000 ALTER TABLE `related_articles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-15 18:08:42
