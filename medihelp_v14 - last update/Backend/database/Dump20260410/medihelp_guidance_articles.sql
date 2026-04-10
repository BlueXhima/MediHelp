-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: medihelp
-- ------------------------------------------------------
-- Server version	9.6.0

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'e7b57e7e-161f-11f1-bfe1-283a4d879ae0:1-485';

--
-- Table structure for table `guidance_articles`
--

DROP TABLE IF EXISTS `guidance_articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guidance_articles` (
  `article_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `icon_emoji` varchar(10) DEFAULT 0xF09F9384,
  `read_time` varchar(20) NOT NULL,
  `view_count` int DEFAULT '0',
  `created_date` date NOT NULL DEFAULT (curdate()),
  `created_time` time NOT NULL DEFAULT (curtime()),
  `updated_date` date DEFAULT NULL,
  `updated_time` time DEFAULT NULL,
  `cat_id` int DEFAULT NULL,
  PRIMARY KEY (`article_id`),
  KEY `fk_article_category` (`cat_id`),
  CONSTRAINT `fk_article_category` FOREIGN KEY (`cat_id`) REFERENCES `article_categories` (`category_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guidance_articles`
--

LOCK TABLES `guidance_articles` WRITE;
/*!40000 ALTER TABLE `guidance_articles` DISABLE KEYS */;
INSERT INTO `guidance_articles` VALUES (1,'Winter Health: Staying Healthy During Cold Season','Essential tips for maintaining good health during winter months, including immune system support.','https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?q=80&w=2070','❄️','6 min',0,'2026-04-04','10:51:13',NULL,NULL,1),(2,'First Aid Essentials: Basic Wound Care','Learn the fundamental steps of cleaning and treating minor cuts, scrapes, and burns at home.','https://images.unsplash.com/photo-1603398938378-e54eab446f8a?auto=format&fit=crop&q=80&w=2070','?','5 min',0,'2026-04-04','10:52:46',NULL,NULL,9),(3,'Strategies for Daily Stress Management','Practical techniques and mindfulness exercises to help reduce anxiety and improve mental clarity.','https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070','?','8 min',0,'2026-04-04','10:53:02',NULL,NULL,6),(4,'The Importance of Proper Hydration','Discover how maintaining optimal water intake affects your energy levels and cognitive function.','https://images.unsplash.com/photo-1548919973-5dea585f3968?q=80&w=2070','?','4 min',0,'2026-04-04','10:53:12',NULL,NULL,1),(5,'Medication Safety: Avoiding Common Errors','A guide on understanding dosage instructions, expiration dates, and potential drug interactions.','https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2070','?','7 min',0,'2026-04-04','10:53:22',NULL,NULL,3),(6,'Nutrition Tips for a Healthier Heart','Exploring the best foods and dietary habits to maintain low cholesterol and strong cardiovascular health.','https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=2070','❤️','10 min',0,'2026-04-04','10:53:33',NULL,NULL,1),(7,'The Role of Vaccines in Preventive Care','Understanding how regular immunizations protect you and your community from preventable diseases.','https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070','?','6 min',0,'2026-04-04','10:53:44',NULL,NULL,8),(8,'Managing Hypertension Daily','A comprehensive guide on maintaining healthy blood pressure through lifestyle and monitoring.','https://images.unsplash.com/photo-1576091160550-2173dad99901','?','8 min',0,'2026-04-04','15:20:30',NULL,NULL,7),(9,'Simple Daily Stretching for Students','Relieve neck and back pain from long hours of studying with these 5-minute easy stretches.','https://images.unsplash.com/photo-1544367567-0f2fcb009e0b','?','5 min',0,'2026-04-04','15:22:47',NULL,NULL,5),(10,'Smart Snacking: Brain Food for Exams','The best nutritious snacks to keep you focused and energized during heavy study sessions.','https://images.unsplash.com/photo-1490645935967-10de6ba17061','?','6 min',0,'2026-04-04','15:22:55',NULL,NULL,4),(11,'Managing Fevers in Children','A parents guide to checking temperatures and knowing when it is time to call a pediatrician.','https://images.unsplash.com/photo-1584622781564-1d987f7333c1','?','8 min',0,'2026-04-04','15:23:05',NULL,NULL,10),(12,'Is it a Cold or the Flu?','Understanding the key differences between common respiratory symptoms to get the right treatment.','https://images.unsplash.com/photo-1584036561566-baf8f5f1b144','?','7 min',0,'2026-04-04','15:23:15',NULL,NULL,2);
/*!40000 ALTER TABLE `guidance_articles` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-10 10:10:12
