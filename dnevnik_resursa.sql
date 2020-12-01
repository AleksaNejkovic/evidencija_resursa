-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 07, 2020 at 06:32 PM
-- Server version: 5.7.24
-- PHP Version: 7.2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dnevnik_resursa`
--

-- --------------------------------------------------------

--
-- Table structure for table `dnevnik`
--

DROP TABLE IF EXISTS `dnevnik`;
CREATE TABLE IF NOT EXISTS `dnevnik` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ime_predmeta` varchar(100) NOT NULL,
  `datum_uzimanja` varchar(100) NOT NULL,
  `datum_vracanja` varchar(100) NOT NULL,
  `id_korisnika` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idkor` (`id_korisnika`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `korisnik`
--

DROP TABLE IF EXISTS `korisnik`;
CREATE TABLE IF NOT EXISTS `korisnik` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ime` varchar(100) NOT NULL,
  `prezime` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `broj_telefona` varchar(100) NOT NULL,
  `datum_rodjenja` varchar(100) NOT NULL,
  `sifra` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `rezervacija`
--

DROP TABLE IF EXISTS `rezervacija`;
CREATE TABLE IF NOT EXISTS `rezervacija` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ime_predmeta` varchar(100) NOT NULL,
  `datum_uzimanja` varchar(100) NOT NULL,
  `id_korisnika` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ime_predmeta` (`ime_predmeta`),
  KEY `id_korisnika` (`id_korisnika`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dnevnik`
--
ALTER TABLE `dnevnik`
  ADD CONSTRAINT `idkor` FOREIGN KEY (`id_korisnika`) REFERENCES `korisnik` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `rezervacija`
--
ALTER TABLE `rezervacija`
  ADD CONSTRAINT `id_korisnika` FOREIGN KEY (`id_korisnika`) REFERENCES `korisnik` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
