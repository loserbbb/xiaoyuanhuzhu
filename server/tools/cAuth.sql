-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2018-05-04 07:18:33
-- 服务器版本： 5.7.18
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cAuth`
--

-- --------------------------------------------------------

--
-- 表的结构 `cAppinfo`
--

CREATE TABLE `cAppinfo` (
  `appid` char(36) DEFAULT NULL,
  `secret` char(64) DEFAULT NULL,
  `ip` char(20) DEFAULT NULL,
  `login_duration` int(11) DEFAULT NULL,
  `qcloud_appid` char(64) DEFAULT NULL,
  `session_duration` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `cAppinfo`
--

INSERT INTO `cAppinfo` (`appid`, `secret`, `ip`, `login_duration`, `qcloud_appid`, `session_duration`) VALUES
('wx0456cbc2d635ebc3', '', '119.29.15.161', 1000, '1256425404', 2000);

-- --------------------------------------------------------

--
-- 表的结构 `cAssist`
--

CREATE TABLE `cAssist` (
  `assistId` int(11) NOT NULL COMMENT '帮助ID',
  `publisher` char(28) NOT NULL COMMENT '发布者',
  `reward` int(11) NOT NULL DEFAULT '0' COMMENT '悬赏',
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '状态',
  `discription` text NOT NULL COMMENT '描述',
  `title` text NOT NULL COMMENT '标题',
  `picture` varchar(1024) DEFAULT NULL COMMENT '图片',
  `location` varchar(36) NOT NULL COMMENT '位置信息',
  `accepter` char(28) DEFAULT NULL COMMENT '接受者',
  `createTime` datetime NOT NULL COMMENT '创建时间',
  `archieveTime` datetime DEFAULT NULL COMMENT '完成时间'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `cHistory`
--

CREATE TABLE `cHistory` (
  `assistId` int(11) NOT NULL COMMENT '帮助ID',
  `publisher` char(28) NOT NULL COMMENT '发布者',
  `reward` int(11) NOT NULL DEFAULT '0' COMMENT '悬赏',
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '状态',
  `discription` text NOT NULL COMMENT '描述',
  `title` text NOT NULL COMMENT '标题',
  `picture` varchar(1024) DEFAULT NULL COMMENT '图片',
  `location` varchar(36) NOT NULL COMMENT '位置信息',
  `accepter` char(28) DEFAULT NULL COMMENT '接受者',
  `createTime` datetime NOT NULL COMMENT '创建时间',
  `archieveTime` datetime DEFAULT NULL COMMENT '完成时间'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `cMessage`
--

CREATE TABLE `cMessage` (
  `sender` char(28) NOT NULL COMMENT '发送者',
  `sendTime` datetime NOT NULL COMMENT '发送时间',
  `receiver` char(28) NOT NULL COMMENT '接收者',
  `content` text NOT NULL COMMENT '消息内容'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `cSessionInfo`
--

CREATE TABLE `cSessionInfo` (
  `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uuid` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skey` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `session_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_info` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话管理用户信息';

--
-- 转存表中的数据 `cSessionInfo`
--

INSERT INTO `cSessionInfo` (`open_id`, `uuid`, `skey`, `create_time`, `last_visit_time`, `session_key`, `user_info`) VALUES
('o6xPM4gmpnzSvYgGVVz67kJ_GFxo', '24c3e946-aacc-4d3e-90be-83ffe3c673ed', 'bd6692b61bfc8bb751754b72079a083bd7e7abc9', '2018-05-04 03:58:44', '2018-05-04 03:58:44', 'V7z37oWKY7nwq+bQDPE5gw==', '{\"openId\":\"o6xPM4gmpnzSvYgGVVz67kJ_GFxo\",\"nickName\":\"文盲\",\"gender\":1,\"language\":\"zh_CN\",\"city\":\"\",\"province\":\"\",\"country\":\"Andorra\",\"avatarUrl\":\"https://wx.qlogo.cn/mmopen/vi_32/P8h3wxWDqCoicu8CMSBFiaaoe8ibAo77lcqW1DKAdXw1ib70r7V7BbTRhUUWnmrorDxJ55xoDMfB3yu299ib3IAyoxw/132\",\"watermark\":{\"timestamp\":1525406323,\"appid\":\"wx0456cbc2d635ebc3\"}}'),
('o6xPM4hXLAb4VIHSGbfEQ7K65eNw', '4055ec02-1af0-44e8-8944-2fc9923c6e3e', 'eaa8d185934f39a5c0f6b04d584514754de8b798', '2018-04-06 15:29:22', '2018-04-06 15:29:22', 'acu9gkPhzX4sPuI4SNJ8sA==', '{\"openId\":\"o6xPM4hXLAb4VIHSGbfEQ7K65eNw\",\"nickName\":\"G    A    O\",\"gender\":1,\"language\":\"zh_CN\",\"city\":\"Yuncheng\",\"province\":\"Shanxi\",\"country\":\"China\",\"avatarUrl\":\"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIeD484iblrautLYmRfoCouKpxZdJQOGjPTpAMGgFrIn0JGn2czicQj1lBOibCHYzMIvYibxbzR5Uiaib9Q/0\",\"watermark\":{\"timestamp\":1523086160,\"appid\":\"wx0456cbc2d635ebc3\"}}'),
('o6xPM4oRCu0OrtWCUg_bucPUkEkI', 'a6f7c3e9-767d-4308-ae5d-7cd0495f7d2a', '4097dba3d0c375b71638e5dfc0a0454dfe453a98', '2018-04-06 15:56:15', '2018-04-06 15:56:15', '8UQX4dTQ3KH6p0oHsYEsUg==', '{\"openId\":\"o6xPM4oRCu0OrtWCUg_bucPUkEkI\",\"nickName\":\"牛啊\",\"gender\":0,\"language\":\"zh_CN\",\"city\":\"\",\"province\":\"\",\"country\":\"\",\"avatarUrl\":\"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJS0jwYKhjm1ne1O0hgoTiaxH6MAPFSqr4tLDO9bvloZiboxxr2gxia07K9qXBLbzjG6Y55zwwQQBMJA/0\",\"watermark\":{\"timestamp\":1523087773,\"appid\":\"wx0456cbc2d635ebc3\"}}');

-- --------------------------------------------------------

--
-- 表的结构 `cTask`
--

CREATE TABLE `cTask` (
  `taskId` int(11) NOT NULL COMMENT '任务编号',
  `reward` int(11) NOT NULL DEFAULT '0' COMMENT '任务悬赏',
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `cTaskAchieve`
--

CREATE TABLE `cTaskAchieve` (
  `userId` char(28) NOT NULL COMMENT '完成任务的用户',
  `achieveTime` datetime NOT NULL COMMENT '完成时间',
  `getReward` int(11) NOT NULL COMMENT '奖励数目',
  `taskId` int(11) NOT NULL COMMENT '任务编号'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `cUser`
--

CREATE TABLE `cUser` (
  `openId` char(28) NOT NULL COMMENT '微信提供的openID',
  `realName` varchar(16) NOT NULL COMMENT '真实姓名',
  `phoneNumber` char(11) NOT NULL COMMENT '手机号码',
  `coin` int(11) NOT NULL DEFAULT '0' COMMENT '积分',
  `experience` int(11) NOT NULL DEFAULT '0' COMMENT '经验'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cAssist`
--
ALTER TABLE `cAssist`
  ADD PRIMARY KEY (`assistId`);

--
-- Indexes for table `cHistory`
--
ALTER TABLE `cHistory`
  ADD PRIMARY KEY (`assistId`);

--
-- Indexes for table `cMessage`
--
ALTER TABLE `cMessage`
  ADD PRIMARY KEY (`sender`,`sendTime`);

--
-- Indexes for table `cSessionInfo`
--
ALTER TABLE `cSessionInfo`
  ADD PRIMARY KEY (`open_id`),
  ADD KEY `openid` (`open_id`) USING BTREE,
  ADD KEY `skey` (`skey`) USING BTREE;

--
-- Indexes for table `cTask`
--
ALTER TABLE `cTask`
  ADD PRIMARY KEY (`taskId`);

--
-- Indexes for table `cTaskAchieve`
--
ALTER TABLE `cTaskAchieve`
  ADD PRIMARY KEY (`userId`,`achieveTime`);

--
-- Indexes for table `cUser`
--
ALTER TABLE `cUser`
  ADD PRIMARY KEY (`openId`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `cAssist`
--
ALTER TABLE `cAssist`
  MODIFY `assistId` int(11) NOT NULL AUTO_INCREMENT COMMENT '帮助ID';
--
-- 使用表AUTO_INCREMENT `cHistory`
--
ALTER TABLE `cHistory`
  MODIFY `assistId` int(11) NOT NULL AUTO_INCREMENT COMMENT '帮助ID';
--
-- 使用表AUTO_INCREMENT `cTask`
--
ALTER TABLE `cTask`
  MODIFY `taskId` int(11) NOT NULL AUTO_INCREMENT COMMENT '任务编号';COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
