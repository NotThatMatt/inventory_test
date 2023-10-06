-- Adminer 4.8.1 MySQL 8.0.28 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `item`;
CREATE TABLE `item` (
  `itemId` varchar(36) NOT NULL,
  `userId` varchar(36) NOT NULL,
  `itemName` varchar(255) NOT NULL,
  `itemDescription` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `imageName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `itemTags` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `itemTagsJson` json DEFAULT NULL,
  PRIMARY KEY (`itemId`),
  KEY `userId_idx` (`userId`),
  FULLTEXT KEY `tags_ft` (`itemTags`),
  FULLTEXT KEY `global_search` (`itemName`,`itemDescription`,`itemTags`),
  FULLTEXT KEY `name_ft` (`itemName`),
  FULLTEXT KEY `desc_ft` (`itemDescription`),
  CONSTRAINT `item_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `item` (`itemId`, `userId`, `itemName`, `itemDescription`, `imageName`, `itemTags`, `itemTagsJson`) VALUES
('032f793a-49ed-4aa6-8295-df80b857caf9',	'7a27364e-0266-4fd7-94f4-7526338d61fd',	'Chip',	'',	'Screen Shot 2023-01-16 at 2.34.38 PM.jpg',	'Chip,baby',	NULL),
('0ed3a303-a658-488a-8f1a-2428b95ef686',	'7a27364e-0266-4fd7-94f4-7526338d61fd',	'Chip and Dale',	'',	'Screen Shot 2023-01-16 at 2.35.58 PM.jpg',	'chip,dale,chip and dale,peanut,sharing',	NULL),
('250d0afd-ebb7-491b-9c5d-797b996a647b',	'7a27364e-0266-4fd7-94f4-7526338d61fd',	'Chip and Dale Heart',	'',	'Screen Shot 2023-01-16 at 2.34.34 PM.jpg',	'chip,dale,valentine,chip and dale',	NULL),
('6cef5340-87a7-4eb3-9f98-caab510d935b',	'7a27364e-0266-4fd7-94f4-7526338d61fd',	'Oswald',	'',	'Screen Shot 2023-01-16 at 2.35.07 PM.jpg',	'oswald,rabbit,cat,black and white',	NULL),
('75a634e1-253e-42c1-8fc5-74e176ac43d6',	'7a27364e-0266-4fd7-94f4-7526338d61fd',	'Chip and Dale babies',	'',	'Screen Shot 2023-01-16 at 2.34.45 PM.jpg',	'chip,dale,chip and dale,heart,babies',	NULL),
('84cb5777-0af0-4ddf-a32b-e422a9684e26',	'7a27364e-0266-4fd7-94f4-7526338d61fd',	'Oswald',	'',	'Screen Shot 2023-01-16 at 2.35.20 PM.jpg',	'oswald,rabbit,cat,movie,reel,lucky',	NULL),
('8ed87aaa-501d-4bee-9bcd-85c583357b81',	'7a27364e-0266-4fd7-94f4-7526338d61fd',	'Double Trouble',	'',	'Screen Shot 2023-01-16 at 2.34.15 PM.jpg',	'chip,dale,double trouble,chip and dale',	NULL),
('8f8e1590-da60-4a79-b81b-77d7d7ec48bd',	'7a27364e-0266-4fd7-94f4-7526338d61fd',	'Chip and Dale',	'',	'Screen Shot 2023-01-16 at 2.35.52 PM.jpg',	'chip,dale,chip and dale,winter,campfire',	NULL),
('93a4bca3-b434-4baf-b9c8-fb6137cf4595',	'7a27364e-0266-4fd7-94f4-7526338d61fd',	'Dale',	'',	'Screen Shot 2023-01-16 at 2.35.42 PM.jpg',	'dale,chubby,cheeks',	NULL),
('c863ab7a-f7bc-4aab-b3f5-68d999db5503',	'7a27364e-0266-4fd7-94f4-7526338d61fd',	'Classic Mickey',	'',	'Screen Shot 2023-01-16 at 2.34.54 PM.jpg',	'mickey,classic',	NULL);

DROP TABLE IF EXISTS `type`;
CREATE TABLE `type` (
  `typeId` varchar(36) NOT NULL,
  `typeName` varchar(255) NOT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`typeId`),
  UNIQUE KEY `uidxTypeName` (`typeName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `type` (`typeId`, `typeName`, `isDefault`) VALUES
('3d17c880-d18d-11ed-afa1-0242ac120002',	'Ears',	0),
('539ae6c8-d18d-11ed-afa1-0242ac120002',	'LoungeFly',	0),
('f2efb1a8-d189-11ed-afa1-0242ac120002',	'Pin',	1);

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `userId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `verified` tinyint(1) NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `user` (`userId`, `email`, `verified`, `status`) VALUES
('7a27364e-0266-4fd7-94f4-7526338d61fd',	'matthew.juliana+apptest3@gmail.com',	1,	'CONFIRMED');

DROP TABLE IF EXISTS `user_item_type`;
CREATE TABLE `user_item_type` (
  `userId` varchar(36) NOT NULL,
  `itemId` varchar(36) NOT NULL,
  `typeId` varchar(36) NOT NULL,
  PRIMARY KEY (`userId`,`itemId`,`typeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `user_item_type` (`userId`, `itemId`, `typeId`) VALUES
('7a27364e-0266-4fd7-94f4-7526338d61fd',	'032f793a-49ed-4aa6-8295-df80b857caf9',	'f2efb1a8-d189-11ed-afa1-0242ac120002'),
('7a27364e-0266-4fd7-94f4-7526338d61fd',	'0ed3a303-a658-488a-8f1a-2428b95ef686',	'f2efb1a8-d189-11ed-afa1-0242ac120002'),
('7a27364e-0266-4fd7-94f4-7526338d61fd',	'250d0afd-ebb7-491b-9c5d-797b996a647b',	'f2efb1a8-d189-11ed-afa1-0242ac120002'),
('7a27364e-0266-4fd7-94f4-7526338d61fd',	'6cef5340-87a7-4eb3-9f98-caab510d935b',	'f2efb1a8-d189-11ed-afa1-0242ac120002'),
('7a27364e-0266-4fd7-94f4-7526338d61fd',	'75a634e1-253e-42c1-8fc5-74e176ac43d6',	'f2efb1a8-d189-11ed-afa1-0242ac120002'),
('7a27364e-0266-4fd7-94f4-7526338d61fd',	'84cb5777-0af0-4ddf-a32b-e422a9684e26',	'f2efb1a8-d189-11ed-afa1-0242ac120002'),
('7a27364e-0266-4fd7-94f4-7526338d61fd',	'8ed87aaa-501d-4bee-9bcd-85c583357b81',	'f2efb1a8-d189-11ed-afa1-0242ac120002'),
('7a27364e-0266-4fd7-94f4-7526338d61fd',	'8f8e1590-da60-4a79-b81b-77d7d7ec48bd',	'f2efb1a8-d189-11ed-afa1-0242ac120002'),
('7a27364e-0266-4fd7-94f4-7526338d61fd',	'93a4bca3-b434-4baf-b9c8-fb6137cf4595',	'f2efb1a8-d189-11ed-afa1-0242ac120002'),
('7a27364e-0266-4fd7-94f4-7526338d61fd',	'c863ab7a-f7bc-4aab-b3f5-68d999db5503',	'f2efb1a8-d189-11ed-afa1-0242ac120002');

DROP TABLE IF EXISTS `user_type`;
CREATE TABLE `user_type` (
  `userTypeId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `userId` varchar(36) NOT NULL,
  `typeId` varchar(36) NOT NULL,
  PRIMARY KEY (`userTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `user_type` (`userTypeId`, `userId`, `typeId`) VALUES
('bd4a63a0-d1ba-11ed-afa1-0242ac120002',	'7a27364e-0266-4fd7-94f4-7526338d61fd',	'3d17c880-d18d-11ed-afa1-0242ac120002'),
('c23dcbb8-d1ba-11ed-afa1-0242ac120002',	'7a27364e-0266-4fd7-94f4-7526338d61fd',	'539ae6c8-d18d-11ed-afa1-0242ac120002'),
('c5d230ca-d1ba-11ed-afa1-0242ac120002',	'7a27364e-0266-4fd7-94f4-7526338d61fd',	'f2efb1a8-d189-11ed-afa1-0242ac120002');

DROP VIEW IF EXISTS `vw_item`;
CREATE TABLE `vw_item` (`userId` varchar(36), `itemId` varchar(36), `itemName` varchar(255), `itemDescription` text, `imageName` varchar(255), `itemTags` text, `typeName` varchar(255));


DROP VIEW IF EXISTS `vw_user_type`;
CREATE TABLE `vw_user_type` (`userId` varchar(36), `typeId` varchar(36), `typeName` varchar(255));


DROP TABLE IF EXISTS `vw_item`;
CREATE ALGORITHM=UNDEFINED DEFINER=`admin`@`%` SQL SECURITY DEFINER VIEW `vw_item` AS select `u`.`userId` AS `userId`,`i`.`itemId` AS `itemId`,`i`.`itemName` AS `itemName`,`i`.`itemDescription` AS `itemDescription`,`i`.`imageName` AS `imageName`,`i`.`itemTags` AS `itemTags`,`t`.`typeName` AS `typeName` from (((`user_item_type` `uit` join `user` `u` on((`uit`.`userId` = `u`.`userId`))) join `item` `i` on((`uit`.`itemId` = `i`.`itemId`))) join `type` `t` on((`uit`.`typeId` = `t`.`typeId`)));

DROP TABLE IF EXISTS `vw_user_type`;
CREATE ALGORITHM=UNDEFINED DEFINER=`admin`@`%` SQL SECURITY DEFINER VIEW `vw_user_type` AS select `ut`.`userId` AS `userId`,`t`.`typeId` AS `typeId`,`t`.`typeName` AS `typeName` from (`user_type` `ut` join `type` `t` on((`ut`.`typeId` = `t`.`typeId`))) order by `t`.`isDefault` desc;

-- 2023-10-06 21:25:14