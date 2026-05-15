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
-- Table structure for table `intent_patterns`
--

DROP TABLE IF EXISTS `intent_patterns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `intent_patterns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `condition_id` int DEFAULT NULL,
  `keyword` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `condition_id` (`condition_id`),
  CONSTRAINT `intent_patterns_ibfk_1` FOREIGN KEY (`condition_id`) REFERENCES `conditions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `intent_patterns`
--

LOCK TABLES `intent_patterns` WRITE;
/*!40000 ALTER TABLE `intent_patterns` DISABLE KEYS */;
INSERT INTO `intent_patterns` VALUES (1,1,'chest pain'),(2,1,'chest tightness'),(3,1,'angina'),(4,1,'heart attack'),(5,1,'myocardial'),(6,1,'palpitations'),(7,1,'irregular heartbeat'),(8,1,'chest pressure'),(9,1,'squeezing chest'),(10,1,'heart'),(11,2,'shortness of breath'),(12,2,'can\'t breathe'),(13,2,'wheezing'),(14,2,'gasping'),(15,2,'breathing problem'),(16,2,'air hunger'),(17,3,'cough'),(18,3,'coughing'),(19,3,'productive cough'),(20,3,'dry cough'),(21,3,'coughing blood'),(22,4,'thunderclap headache'),(23,4,'worst headache'),(24,4,'sudden severe headache'),(25,4,'headache with stiff neck'),(26,4,'headache with confusion'),(27,5,'headache'),(28,5,'migraine'),(29,5,'throbbing head'),(30,5,'pounding head'),(31,5,'head pain'),(32,5,'sinus headache'),(33,5,'tension headache'),(34,6,'numbness'),(35,6,'tingling'),(36,6,'paralysis'),(37,6,'weakness'),(38,6,'slurred speech'),(39,6,'difficulty speaking'),(40,6,'facial droop'),(41,6,'vision loss'),(42,6,'seizure'),(43,6,'loss of consciousness'),(44,6,'fainting'),(45,7,'very high fever'),(46,7,'temperature above 103'),(47,7,'104 fever'),(48,7,'105 fever'),(49,7,'fever with rash'),(50,8,'fever'),(51,8,'high temperature'),(52,8,'chills'),(53,8,'feeling hot'),(54,8,'thermometer'),(55,9,'covid'),(56,9,'coronavirus'),(57,9,'covid-19'),(58,9,'loss of taste'),(59,9,'loss of smell'),(60,10,'flu'),(61,10,'influenza'),(62,10,'body aches'),(63,10,'muscle pain'),(64,10,'viral symptoms'),(65,11,'severe abdominal pain'),(66,11,'rigid abdomen'),(67,11,'pain with vomiting blood'),(68,11,'bloody diarrhea'),(69,11,'black stool'),(70,12,'stomach pain'),(71,12,'abdominal pain'),(72,12,'belly ache'),(73,12,'gastric pain'),(74,12,'cramping'),(75,12,'abdominal cramping'),(76,13,'nausea'),(77,13,'vomiting'),(78,13,'queasy'),(79,13,'sick to stomach'),(80,13,'throwing up'),(81,14,'back pain'),(82,14,'lower back pain'),(83,14,'lumbar pain'),(84,14,'sciatica'),(85,14,'herniated disc'),(86,14,'spinal pain'),(87,15,'joint pain'),(88,15,'arthritis'),(89,15,'swollen joints'),(90,15,'knee pain'),(91,15,'shoulder pain'),(92,15,'hip pain'),(93,16,'injury'),(94,16,'sprain'),(95,16,'strain'),(96,16,'fracture'),(97,16,'broken bone'),(98,16,'twisted ankle'),(99,16,'wound'),(100,16,'cut'),(101,16,'bleeding'),(102,17,'severe rash'),(103,17,'rash with fever'),(104,17,'blistering rash'),(105,17,'peeling skin'),(106,18,'rash'),(107,18,'hives'),(108,18,'skin irritation'),(109,18,'dermatitis'),(110,18,'eczema'),(111,18,'itching'),(112,19,'tired'),(113,19,'fatigue'),(114,19,'exhaustion'),(115,19,'low energy'),(116,19,'chronic fatigue'),(117,19,'weakness'),(118,20,'dizzy'),(119,20,'dizziness'),(120,20,'vertigo'),(121,20,'lightheaded'),(122,20,'spinning'),(123,20,'imbalance'),(124,21,'allergy'),(125,21,'allergic reaction'),(126,21,'swelling'),(127,21,'difficulty swallowing'),(128,21,'throat closing'),(129,22,'anxiety'),(130,22,'panic attack'),(131,22,'worried'),(132,22,'stressed'),(133,22,'nervous'),(134,22,'racing thoughts'),(135,23,'depression'),(136,23,'sad'),(137,23,'hopeless'),(138,23,'suicidal'),(139,23,'no will to live');
/*!40000 ALTER TABLE `intent_patterns` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-15 18:08:40
