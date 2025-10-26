-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 29, 2025 at 02:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lsef_tesda`
--

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `id` int(11) NOT NULL,
  `enrollment_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `course` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `cert_hash` varchar(66) DEFAULT NULL,
  `tx_hash` varchar(66) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certificates`
--

INSERT INTO `certificates` (`id`, `enrollment_id`, `name`, `course`, `date`, `cert_hash`, `tx_hash`, `file_path`, `created_at`) VALUES
(68, 1, 'John Carl Porcopio', 'swat', '2025-09-10', 'LSEF0385decec03fdf01e693543fc7d5c15e6fbdbbbd622c1abc350e17042a5edf', '0xdd76b3a2554f9e18a8969c5e4d235ca1b84dcadf0a6f0d08e9eaee9cc84abc63', 'certs/TESDA_Accreditation_John_Carl_Porcopio_swat.pdf', '2025-09-10 07:36:47'),
(69, 1, 'John Carl Porcopio', 'swat', '2025-09-10', 'LSEFee1c0db31f81c8c735443467990d9526ce35da40263bc0c010103b8a686655', '0x591b05166fcd3ded1e30b1ba70809bc56ec1b009387ddfd7be87a359c0c02911', 'certs/TESDA_Accreditation_John_Carl_Porcopio_swat.pdf', '2025-09-10 07:50:47'),
(70, 1, 'John Carl Porcopio', 'swat', '2025-09-10', 'LSEF94c7e2c8d1bfd0cfe15bb5238662111fefe53907d8964f2fa9b5f341a91dd3', '0x24bef191cf6c4f748cb1dde2ce4d4d85fcce4ea1ee1a1938a3ede6d2c4db9722', 'certs/TESDA_Accreditation_John_Carl_Porcopio_swat.pdf', '2025-09-10 07:51:36'),
(71, 1, 'John Carl Porcopio', 'swat', '2025-09-10', 'LSEF2de60c6ea327510c99587d89b16686abad8f4d1815d5b33a5e0f6cb72d1237', '0x7d14bba591c3b762a1192091827a78002c253d12ba428a46303d241de41a19b9', 'certs/TESDA_Accreditation_John_Carl_Porcopio_swat.pdf', '2025-09-10 08:02:47'),
(72, 1, 'John Carl Porcopio', 'swat', '2025-09-10', 'LSEF6da8778d1ccc40936b8546c6d27a5bf4ce8c5951106dd335d088c6a75e6808', '0x230c0418043edb6bdb434c1cbe0c3e8b2da5a48f9f4a40617e8d2ea60fb25504', 'certs/Completion_Certificate_John_Carl_Porcopio_swat.pdf', '2025-09-10 08:07:11'),
(73, 1, 'John Carl Porcopio', 'swat', '2025-09-10', 'LSEFe303ba83c2ace7865f34f835b1d23426d5cb0bee38f2dbc3719c4c6302152b', '0xb3d8a41d4e2cdf6f90a5449b8c22154920c615109e1de9155f2521f163e65b44', 'certs/TESDA_Accreditation_John_Carl_Porcopio_swat.pdf', '2025-09-10 08:11:35'),
(74, 1, 'John Carl Porcopio', 'swat', '2025-09-10', 'LSEF8ce4e897a48c93c00b944d7459a61e9105edc1d3652cde313bfadd1568318c', '0x245c65e246a885eb62cb34bdb8104fa48b3e4bda540afc81ff6437ac54d858cc', 'certs/Completion_Certificate_John_Carl_Porcopio_swat.pdf', '2025-09-10 08:13:47'),
(75, 1, 'John Carl Porcopio', 'swat', '2025-09-10', 'LSEFf5b2f87025df9bb13d6147ea7a546a204d4b8b2a5062f887b07a245bdcc25b', '0x5a4d82dfa4ab00eadfc3c7693534e87a1755e59fe86d11e76a948d4837552760', 'certs/TESDA_Accreditation_John_Carl_Porcopio_swat.pdf', '2025-09-10 08:23:35'),
(76, 1, 'John Carl Porcopio', 'swat', '2025-09-10', 'LSEF5d5831eba27f1a6cf13f81c9b587554ff3903bb6ffe5d7e3889f6b6ea98a73', '0xb673b42267aa59604a023e6da9ea9c86bec3a1ef3926f22ebd86395270031e13', 'certs/TESDA_Accreditation_John_Carl_Porcopio_swat.pdf', '2025-09-10 08:53:35'),
(77, 1, 'John Carl Porcopio', 'swat', '2025-09-10', 'LSEFe3af61c550e0254b1c0ab382ed14065cfb647da31a7c7bc8932fade32db177', '0xd5add41ea2c482965da0ac9380c42c5e474ac1a4c8618edb303f9d1bf8d9fa53', 'certs/TESDA_Accreditation_John_Carl_Porcopio_swat.pdf', '2025-09-10 09:58:23'),
(78, 1, 'John Carl Porcopio', 'swat', '2025-09-11', 'LSEFc7abb05a19e17bc6efb8434ff99f8a3b287f32d650a19476282c5253a7ef02', '0x5ac0459c396646cd2d33f452ddedd39fa3194cead8878a90986e0a7cfc025ffb', 'certs/TESDA_Accreditation_John_Carl_Porcopio_swat.pdf', '2025-09-10 22:04:21'),
(79, 1, 'John Carl Porcopio', 'swat', '2025-09-11', 'LSEFb8877add6686137bf2c0fad2514fd5eeb10cf591c855dee1c7109c9ee03f96', '0xd21617198c150fc5cb3e2c785897de53bc80c6b62857f4763e87fed9821e80fc', 'certs/Completion_Certificate_John_Carl_Porcopio_swat.pdf', '2025-09-10 22:09:33'),
(80, 1, 'John Carl Porcopio', 'swat', '2025-09-11', 'LSEF869a66c92a1b64b10eaf71b363aad690eb920b7bff0225ad6691d46e7d8371', '0x11bda80ca6653c9b5030b79dec2c88c483b22fca1b280e352cce568f6ff58e76', 'certs/TESDA_Accreditation_John_Carl_Porcopio_swat.pdf', '2025-09-10 22:13:33'),
(81, 1, 'John Carl Porcopio', 'swat', '2025-09-11', 'LSEFe750ce539ca0285293d1eefe916f4e87dbe7fb976a2845c592ee4e1fdeddda', '0x09d726ebfe95b81d2107a87248899f236af83828c148276d6eb30070fece8d2d', 'certs/Completion_Certificate_John_Carl_Porcopio_swat.pdf', '2025-09-10 22:17:09'),
(82, 1, 'John Carl Porcopio', 'swat', '2025-09-11', 'LSEFc31fc6d9d0a0e538fb58dc70a2079357030b9b83920d5c44c93a0d37dc15e6', '0xb67cb5472137791ea2b9f67350ad01e5162a2621982dd8f3fe249de8d54bcc30', 'certs/TESDA_Accreditation_John_Carl_Porcopio_swat.pdf', '2025-09-10 22:25:58'),
(83, 1, 'John Carl Porcopio', 'swat', '2025-09-11', 'LSEF23d19102f1e5c20ef3d66decc69c6921f6fe3f06636653cec0a76874993089', '0xd9947ed2432fe63cb17d083bcfdf61df1a8b22b9fd910bcc4d59248e85355706', 'certs/TESDA_Accreditation_John_Carl_Porcopio_swat.pdf', '2025-09-10 22:53:11'),
(84, 1, 'John Carl Porcopio', 'swat', '2025-09-11', 'LSEF55af7c55e910b05d0b82fef4a73be6938f73d235fde4c3e7ec446485fff88b', '0x1fd4a8fd9615bfd4cabb1531be3ccc8adb759016fbd33d53441b17830a199684', 'certs/Completion_Certificate_John_Carl_Porcopio_swat.pdf', '2025-09-10 22:57:57'),
(85, 1, 'John Carl Porcopio', 'swat', '2025-09-11', 'LSEFc3538ac410ccb48c49b14d800a99ea80bfe8e038b9d7b0ba0dcbc22481407f', '0xcfc4df57df86a05adc84a98eeada7e361ff6d2cafd0a9f40d03e76acf006923f', 'certs/Completion_Certificate_John_Carl_Porcopio_swat.pdf', '2025-09-10 23:00:21'),
(86, 1, 'John Carl Porcopio', 'swat', '2025-09-11', 'LSEF974935b6d12f65144e713a8ea42f1eb43baa568aea74f4d83f303063845890', '0x2d36a2033dc6937022dec7ce5d02f63aa8493be6c176260ce95220e46a8389f0', 'certs/TESDA_Accreditation_John_Carl_Porcopio_swat.pdf', '2025-09-10 23:05:33'),
(87, 1, 'John Carl Porcopio', 'swat', '2025-09-11', 'LSEFadef4c9edafcce07d48d80bcf35cd3d2c3688b2122a192154cacfb387429fd', '0x4ec62a9bacd5b8ef818e17dbba9e4a98bd8230d9b1f3e15e44dc8938f0a18da7', 'certs/Completion_Certificate_John_Carl_Porcopio_swat.pdf', '2025-09-10 23:06:33'),
(88, 1, 'John Carl Porcopio', 'swat', '2025-09-11', 'LSEF8fd4bc71dad64f10e9c1cf82ae526b5240997b2ddbe2ed22e6bbc7bffa8af6', '0xa3e67758d7fdae16e81765c417525762fdf903d016c26bf900dafc00b0638b41', 'certs/Completion_Certificate_John_Carl_Porcopio_swat.pdf', '2025-09-10 23:08:14'),
(89, 1, 'John Carl Porcopio', 'swat', '2025-09-11', 'LSEFf191799c8bb0646a0f786d5f051b052fb13f6e0ab10906172357d8805d0c86', '0x3a0b032f7cbd07bfe8569029cf04fd8a62744ed8e611304383f0fdb6689a4f5c', 'certs/Completion_Certificate_John_Carl_Porcopio_swat.pdf', '2025-09-10 23:09:45'),
(90, 1, 'John Carl Porcopio', 'swat', '2025-09-11', 'LSEF4c72635f4b2bd682733f46136870b408b347cc55c007057217d11dbf58294a', '0x79985f19683d3f6ba7406f52153c138168e5ffc6e38e6a58fc7e02e82393bd50', 'certs/Completion_Certificate_John_Carl_Porcopio_swat.pdf', '2025-09-10 23:11:35'),
(91, 1, 'John Carl Porcopio', 'swat', '2025-09-11', 'LSEF0b1f785aeb212fa4e982ab76058aaf3e4e0c22edf7d66aea28b3c0c16f415e', '0xe679cca7a926ebfb33e4db5c4e6a1d1bfe4e31118988083597ca75cd608441b8', 'certs/TESDA_Accreditation_John_Carl_Porcopio_swat.pdf', '2025-09-10 23:12:45'),
(92, 1, 'John Carl Porcopio', 'swat', '2025-09-11', 'LSEF8f11fc8fae0093137a3a7612d4e00656150afca36a11a1aa1d932b41ed28b8', '0x0ef0c54a5e4bb7eeff57f08c0caab033cb63d34995f68d39c861252224fbdb8f', 'certs/TESDA_Accreditation_John_Carl_Porcopio_swat.pdf', '2025-09-10 23:14:45'),
(93, 1, 'John Carl Porcopio', 'swat', '2025-09-11', 'LSEFf0bafd110d6ca25f64f29eff23257b01f5cad58eeed1a0f1914e51dab31f47', '0xf6100e8386ef9316ed7fe2c5324e80ee575ab9c571f467a9a53840f6d52bc4a5', 'certs/Completion_Certificate_John_Carl_Porcopio_swat.pdf', '2025-09-10 23:15:34'),
(94, 1, 'John Carl Porcopio', 'swat', '2025-09-11', 'LSEF6caaa67a13587c87eb85da5763995dbbf30e0d2f6a7692be28f9e0410c1a0a', '0xb255e3bd2c4f55f2a97b23319a9f7482400b25f28db4359a3c1a9938964cb31c', 'certs/Completion_Certificate_John_Carl_Porcopio_swat.pdf', '2025-09-10 23:16:57'),
(95, 1, 'John Carl Porcopio', 'swat', '2025-09-11', 'LSEF5e54a76f3224a39e818fa31aef05aff2b65a49809e799a2a7a30d2c64e2e42', '0x86a6bf90349d1250a2608cb7bed492d08fedfee3f8cb4191291392b1aebdb2f2', 'certs/TESDA_Accreditation_John_Carl_Porcopio_swat.pdf', '2025-09-10 23:17:57'),
(96, 1, 'John Carl Porcopio', 'swat', '2025-09-11', 'LSEF2d17042d081335483c2b393ffc8d35435db884c4aef4bffde6a65896d1b438', '0x6759ac3da995eadb306a86369ed48e71e73795cadc1bcb80a54df1cd4d5da588', 'certs/TESDA_Accreditation_John_Carl_Porcopio_swat.pdf', '2025-09-11 12:13:48'),
(97, 1, 'John Carl Porcopio', 'swat', '2025-09-18', 'LSEF23d4cbc533acf24cccab9287b1d07b9662cb0d15d9e4efb7bd7fa2fc5d2de7', '0x37a68e863b03d56b8c302da0a1f3eb41c8bc2658e24d86d4386d1a43ce37a69c', 'certs/Completion_Certificate_John_Carl_Porcopio_swat.pdf', '2025-09-18 02:22:21'),
(98, 1, 'John Carl Porcopio', 'swat', '2025-09-19', 'LSEFc16982a481bb92a2a4bf76393089719dec245a5200e46ddfaf27257e4f962d', '0x23993aa1c02cc6b6e37cbb1d414669048841279469a589d6eb10317c6fe75d89', 'certs/Completion_Certificate_John_Carl_Porcopio_swat.pdf', '2025-09-19 12:54:07');

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `class_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL COMMENT 'Foreign key from courses table',
  `class_title` varchar(100) NOT NULL,
  `school_year` varchar(20) NOT NULL,
  `batch` varchar(50) DEFAULT NULL,
  `schedule` varchar(100) NOT NULL COMMENT 'e.g. Mon-Fri 9AM-12PM',
  `days_of_week` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`days_of_week`)),
  `venue` varchar(100) NOT NULL,
  `max_students` int(11) NOT NULL,
  `available_slots` int(11) GENERATED ALWAYS AS (`max_students`) STORED COMMENT 'Calculated as max_students minus enrolled students (to be updated separately)',
  `instructor_id` int(11) NOT NULL COMMENT 'user_id of the instructor (staff)',
  `instructor_name` varchar(100) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `prerequisites` text DEFAULT NULL COMMENT 'Fetched from courses table for reference',
  `status` enum('Draft','active','pending','edited') NOT NULL DEFAULT 'Draft',
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_updated` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `edit_reason` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`class_id`, `course_id`, `class_title`, `school_year`, `batch`, `schedule`, `days_of_week`, `venue`, `max_students`, `instructor_id`, `instructor_name`, `start_date`, `end_date`, `prerequisites`, `status`, `date_created`, `date_updated`, `edit_reason`) VALUES
(1, 4, 'swat', '2025-2026', '2025', '', '{\"Friday\": {\"start\": \"07:00\", \"end\": \"10:00\"}, \"Monday\": {\"start\": \"07:00\", \"end\": \"10:00\"}, \"Thursday\": {\"start\": \"07:00\", \"end\": \"10:00\"}, \"Tuesday\": {\"start\": \"07:00\", \"end\": \"10:00\"}, \"Wednesday\": {\"start\": \"07:00\", \"end\": \"11:00\"}}', 'lspu', 25, 10, 'Budoo', '1970-01-01', '1970-01-01', 'need need', 'edited', '2025-06-13 13:57:43', '2025-07-02 17:17:40', 'qwd'),
(2, 4, 'meow', '2025-2026', '2025', 'Mon 7:00 AM - 1:00 PM', '{\"Monday\": {\"start\": \"01:28\", \"end\": \"23:30\"}}', 'lspu', 2825, 10, 'Mang Marse', '2025-06-14', '2025-09-13', 'need need', 'active', '2025-06-13 14:00:00', '2025-06-19 13:42:33', 'pa tingin'),
(3, 4, 'wam', '2025-2026', '2025', 'Mon 7:00 AM - 10:00 AM', '{\"Monday\": {\"start\": \"07:00\", \"end\": \"10:00\"}}', 'LSPU', 25, 10, NULL, '2025-06-19', '2025-06-29', 'need need', 'active', '2025-06-19 10:50:03', '2025-06-19 10:52:01', NULL),
(8, 5, 'Pastry', '2025-2030', '2', 'Friday 8:00 AM-5:00 PM, Monday 8:00 AM-5:00 PM, Thursday 8:00 AM-5:00 PM, Tuesday 8:00 AM-5:00 PM', '{\"Friday\": {\"start\": \"08:00\", \"end\": \"17:00\"}, \"Monday\": {\"start\": \"08:00\", \"end\": \"17:00\"}, \"Thursday\": {\"start\": \"08:00\", \"end\": \"17:00\"}, \"Tuesday\": {\"start\": \"08:00\", \"end\": \"17:00\"}}', 'LSPU', 25, 10, 'Conan Edugawa', '2025-06-19', '2025-06-29', 'tyhyh', 'active', '2025-06-21 16:07:13', '2025-09-01 22:06:21', 'efef'),
(9, 6, 'ITEP 101', '2025-2026', '2025', '', '{\"Monday\": {\"start\": \"07:00\", \"end\": \"10:00\"}, \"Tuesday\": {\"start\": \"07:00\", \"end\": \"10:00\"}, \"Wednesday\": {\"start\": \"07:00\", \"end\": \"10:00\"}}', 'LSEF', 20, 8, 'Ronaldo Katupao', '2025-06-25', '2025-08-30', 'Basic computer knowledge', 'active', '2025-06-25 11:44:09', '2025-06-25 11:47:24', 'change time'),
(10, 7, 'python', '2025-2026', '2025', 'Monday 8:00 AM-1:00 PM, Tuesday 8:00 AM-3:00 PM, Wednesday 8:00 AM-3:00 PM', '{\"Monday\":{\"start\":\"08:00\",\"end\":\"13:00\"},\"Tuesday\":{\"start\":\"08:00\",\"end\":\"15:00\"},\"Wednesday\":{\"start\":\"08:00\",\"end\":\"15:00\"}}', 'LSPU', 25, 1, 'jose mari', '2025-07-11', '2025-07-22', 'ewfewf', 'active', '2025-07-02 16:17:52', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `course_id` int(11) NOT NULL,
  `course_code` varchar(20) NOT NULL,
  `course_title` varchar(100) NOT NULL,
  `course_description` text NOT NULL,
  `course_category` enum('Technical','Vocational','Skills','Safety','Other') NOT NULL,
  `target_audience` enum('Beginner','Intermediate','Advanced','All Levels') NOT NULL,
  `prerequisites` text DEFAULT NULL,
  `learning_outcomes` text DEFAULT NULL,
  `duration_hours` int(11) NOT NULL,
  `course_fee` decimal(10,2) DEFAULT 0.00,
  `max_students` int(11) DEFAULT NULL,
  `course_status` enum('active','inactive','pending','edited') NOT NULL DEFAULT 'pending',
  `published` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0=draft, 1=published',
  `created_by` int(11) NOT NULL COMMENT 'user_id of creator (staff/admin)',
  `approved_by` int(11) DEFAULT NULL COMMENT 'user_id of admin who approved',
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_updated` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `date_published` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `edit_reason` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`course_id`, `course_code`, `course_title`, `course_description`, `course_category`, `target_audience`, `prerequisites`, `learning_outcomes`, `duration_hours`, `course_fee`, `max_students`, `course_status`, `published`, `created_by`, `approved_by`, `date_created`, `date_updated`, `date_published`, `date_modified`, `edit_reason`) VALUES
(1, '123', 'BSIT', 'computer', 'Skills', 'All Levels', '1', 'hacker kana', 4, 500.00, 20, 'edited', 1, 10, NULL, '2025-06-09 19:11:35', '2025-06-10 16:48:55', '2025-06-10 12:21:55', '2025-06-10 16:48:55', 'gusto kong matuto ang studyante ko pano magn hack at scam'),
(3, '12', 'Pastry', 'baking', 'Skills', 'All Levels', 'emem', 'efef', 3, 500.00, 20, 'edited', 1, 10, NULL, '2025-06-09 19:28:44', '2025-06-27 13:04:26', NULL, '2025-06-27 13:04:26', 'n/a'),
(4, 'Cook-101', 'Pastry', 'asummimi', 'Skills', 'Beginner', 'need need', 'asumscn', 5, 100.00, 10, 'active', 1, 10, 1, '2025-06-10 10:33:14', '2025-06-10 11:24:26', '2025-06-10 11:24:26', '2025-06-10 11:24:26', NULL),
(5, 'Welding', 'BSIT', 'yj', 'Skills', 'Beginner', 'tyhyh', 'rth', 30, 100.00, 20, 'active', 0, 10, 1, '2025-06-21 16:00:56', '2025-06-21 16:01:24', '2025-06-21 16:01:24', '2025-06-21 16:01:24', NULL),
(6, 'Computer', 'Computer Studies', 'All about computer', 'Skills', 'Intermediate', 'Basic computer knowledge', 'Learn the basic of programming ', 9, 100.00, 20, 'active', 1, 8, 1, '2025-06-25 11:30:21', '2025-06-25 11:30:42', '2025-06-25 11:30:42', '2025-06-25 11:30:42', NULL),
(7, 'LOOK-101', 'Computer Studies', 'okay nato', 'Technical', 'Beginner', 'ewfewf', 'fef', 5, 100.00, 20, 'active', 1, 1, NULL, '2025-07-02 14:11:01', '2025-07-02 15:23:02', '2025-07-02 14:11:01', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `enrollment`
--

CREATE TABLE `enrollment` (
  `enrollment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'Foreign key from login table (students only)',
  `class_id` int(11) NOT NULL COMMENT 'Foreign key from classes table',
  `enrollment_date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('enrolled','pending','cancelled','completed','rejected','dropped') NOT NULL DEFAULT 'enrolled'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollment`
--

INSERT INTO `enrollment` (`enrollment_id`, `user_id`, `class_id`, `enrollment_date`, `status`) VALUES
(1, 7, 1, '2025-06-14 14:12:40', 'enrolled'),
(2, 11, 1, '2025-06-18 14:06:01', 'enrolled'),
(3, 12, 9, '2025-06-25 12:39:21', 'enrolled'),
(4, 13, 3, '2025-07-02 18:04:46', 'enrolled'),
(5, 6, 8, '2025-09-05 12:59:02', 'enrolled');

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('admin','staff','student') DEFAULT NULL,
  `account_status` enum('active','inactive','pending') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`user_id`, `username`, `password`, `email`, `role`, `account_status`) VALUES
(1, 'admin', '12345', 'adminako@gmail.com', 'admin', 'active'),
(6, 'Haron Salik', '123', 'salikharold@gmail.com', 'student', 'active'),
(7, 'Kally', '12345678Jc@', 'jcporcopio03@gmail.com', 'student', 'active'),
(8, 'imow', '12345678Jc@', 'jc@gmail.com', 'staff', 'active'),
(10, 'Niko', '123', 'niko@gmail.com', 'staff', 'active'),
(11, 'mark', '123', 'ksapareto@gmail.com', 'student', 'active'),
(12, 'Vince', 'Octav!o094632', 'vin@gmail.com', 'student', 'active'),
(13, 'carl', 'Carl12345678@', 'carl@gmail.com', 'student', 'active'),
(14, 'Crispy_lemon11', 'Ul12345678?', 'ulleysiscads2807@gmail.com', 'student', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `personal_information`
--

CREATE TABLE `personal_information` (
  `info_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `province` varchar(100) NOT NULL,
  `municipality` varchar(100) NOT NULL,
  `baranggay` varchar(100) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `terms_accepted` tinyint(1) NOT NULL DEFAULT 0,
  `date_registered` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personal_information`
--

INSERT INTO `personal_information` (`info_id`, `user_id`, `province`, `municipality`, `baranggay`, `contact_number`, `first_name`, `middle_name`, `last_name`, `date_of_birth`, `gender`, `profile_picture`, `terms_accepted`, `date_registered`) VALUES
(1, 1, 'Metro Manila (NCR)', 'City of Taguig', 'New Lower Bicutan', '09474371682', 'Noknok', 'm', 'Nok', '2025-06-03', 'male', '1_8b857edd7d394680b7a326ad0235ee5e.jpg', 1, '2025-06-05 22:58:27'),
(4, 6, 'Bohol', 'City of Tagbilaran', 'Taloto', '09172468147', 'Student', 'D', 'Teach', '1990-02-12', 'male', '6_01d479807d58480892ffbe6e61ee2a41.png', 1, '2025-06-01 09:57:34'),
(11, 8, 'Laguna', 'Santa Cruz', 'Patimbao', '09108236537', 'jc', 'Kay', 'porcopio', '2025-06-03', 'male', NULL, 1, '2025-06-05 22:29:22'),
(14, 10, 'Leyte', 'City of Tacloban', 'Barangay 109-A', '09474371682', 'niko', 'N', 'Nonoy', '2025-06-02', 'male', '10_8e72396301fc4280980ba99b98f75dff.png', 1, '2025-06-08 09:55:38'),
(20, 7, 'Laguna', 'Santa Cruz', 'Patimbao', '09108236537', 'John Carl', 'C', 'Porcopio', '2025-06-04', 'male', '7_10eb2b47a7874d48b6c72ce419dbdc1e.jpg', 1, '2025-06-05 12:35:25'),
(22, 11, 'Laguna', 'Santa Cruz', 'Palasan', '09163255365', 'mark', '', 'capellan', '2025-06-10', 'male', NULL, 1, '2025-06-17 10:59:46'),
(24, 12, 'Laguna', 'Santa Cruz', 'Malinao', '09999999999', 'Vince', NULL, 'Javier', '1995-08-18', 'male', NULL, 1, '2025-06-17 14:33:16'),
(25, 13, 'Laguna', 'Calauan', 'Dayap', '09108236537', 'carl', 'C', 'Por', '2025-06-24', 'male', NULL, 1, '2025-07-02 18:03:46'),
(26, 14, 'Aurora', 'Maria Aurora', 'Baubo', '09636018971', 'Skibidi', 'Roman', 'Nabulunan', '2005-09-10', 'male', NULL, 1, '2025-09-10 14:21:59');

-- --------------------------------------------------------

--
-- Table structure for table `student_grades`
--

CREATE TABLE `student_grades` (
  `grade_id` int(11) NOT NULL,
  `enrollment_id` int(11) NOT NULL COMMENT 'Foreign key from enrollment table',
  `prelim_grade` decimal(5,2) DEFAULT NULL,
  `midterm_grade` decimal(5,2) DEFAULT NULL,
  `final_grade` decimal(5,2) DEFAULT NULL,
  `remarks` enum('Passed','Failed','Completed','Incomplete','Dropped') DEFAULT NULL,
  `date_recorded` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_grades`
--

INSERT INTO `student_grades` (`grade_id`, `enrollment_id`, `prelim_grade`, `midterm_grade`, `final_grade`, `remarks`, `date_recorded`) VALUES
(1, 1, 94.00, 91.00, 92.00, 'Completed', '2025-07-04 22:12:00'),
(2, 2, 90.00, 85.00, 86.00, 'Passed', '2025-07-04 22:12:00');

-- --------------------------------------------------------

--
-- Table structure for table `user_archived`
--

CREATE TABLE `user_archived` (
  `archive_id` int(11) NOT NULL,
  `original_user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('admin','staff','student') DEFAULT NULL,
  `account_status` enum('active','inactive','pending') NOT NULL DEFAULT 'pending',
  `province` varchar(100) NOT NULL,
  `municipality` varchar(100) NOT NULL,
  `baranggay` varchar(100) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `terms_accepted` tinyint(1) NOT NULL DEFAULT 0,
  `date_registered` datetime NOT NULL COMMENT 'Original registration date',
  `date_archived` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'When the user was archived',
  `archived_by` int(11) DEFAULT NULL COMMENT 'User ID who performed the archive'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_archived`
--

INSERT INTO `user_archived` (`archive_id`, `original_user_id`, `username`, `password`, `email`, `role`, `account_status`, `province`, `municipality`, `baranggay`, `contact_number`, `first_name`, `middle_name`, `last_name`, `date_of_birth`, `gender`, `profile_picture`, `terms_accepted`, `date_registered`, `date_archived`, `archived_by`) VALUES
(14, 5, 'Mungo', 'Marwin12345', 'aragakiaozora@gmail.com', 'staff', 'active', 'Cagayan', 'Iguig', 'Salamague', '09108735236', 'Staff', 'D', 'Law', '2004-03-12', 'male', NULL, 1, '2025-06-01 09:52:04', '2025-06-08 20:02:23', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `enrollment_id` (`enrollment_id`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`class_id`),
  ADD KEY `fk_course_id` (`course_id`),
  ADD KEY `fk_instructor_id` (`instructor_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`course_id`),
  ADD UNIQUE KEY `course_code_unique` (`course_code`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `approved_by` (`approved_by`);

--
-- Indexes for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD PRIMARY KEY (`enrollment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username_unique` (`username`),
  ADD UNIQUE KEY `email_unique` (`email`);

--
-- Indexes for table `personal_information`
--
ALTER TABLE `personal_information`
  ADD PRIMARY KEY (`info_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `student_grades`
--
ALTER TABLE `student_grades`
  ADD PRIMARY KEY (`grade_id`),
  ADD KEY `enrollment_id` (`enrollment_id`);

--
-- Indexes for table `user_archived`
--
ALTER TABLE `user_archived`
  ADD PRIMARY KEY (`archive_id`),
  ADD KEY `original_user_id` (`original_user_id`),
  ADD KEY `username` (`username`),
  ADD KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `class_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `enrollment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `personal_information`
--
ALTER TABLE `personal_information`
  MODIFY `info_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `student_grades`
--
ALTER TABLE `student_grades`
  MODIFY `grade_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_archived`
--
ALTER TABLE `user_archived`
  MODIFY `archive_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `certificates`
--
ALTER TABLE `certificates`
  ADD CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollment` (`enrollment_id`);

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `fk_course_id` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `login` (`user_id`),
  ADD CONSTRAINT `courses_ibfk_2` FOREIGN KEY (`approved_by`) REFERENCES `login` (`user_id`);

--
-- Constraints for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD CONSTRAINT `enrollment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `login` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollment_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`) ON DELETE CASCADE;

--
-- Constraints for table `personal_information`
--
ALTER TABLE `personal_information`
  ADD CONSTRAINT `personal_information_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `login` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `student_grades`
--
ALTER TABLE `student_grades`
  ADD CONSTRAINT `student_grades_ibfk_1` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollment` (`enrollment_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
