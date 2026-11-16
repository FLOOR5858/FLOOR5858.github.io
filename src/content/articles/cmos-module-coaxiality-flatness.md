---
title: '从 PCB 选材到 AA 锁焦：CMOS 模组同轴度与平整度的全链路拆解'
description: '批量对焦反复跑焦的三个坑——板材 Tg、导向螺纹、AA 装配顺序与点胶固化，摄像头模组平整度与同轴度的硬件全链路拆解。'
date: 2026-11-16
category: hardware
tags: ['摄像头模组', 'AA工艺', 'PCB', 'IMX678']
---

> 作者：LLY · 首发于微信公众号
> 原文链接：https://mp.weixin.qq.com/s/_g1WhFePeQmNBsyXbyUbKQ

之前解决了 IMX678 sensor 暗光下图像质量的问题，BLC 量化的数据也正常，以为万事大吉，但是批量对焦又出现问题。我总结了有如下三个：

1. 我们要求看清楚 30 米的物体，但是模组厂每次在工厂调好焦距以后拿给我们测试，却没对清；
2. 第二个问题是对焦一边清晰，另一边不清晰；
3. 我们已经把镜头调好焦距，并且打了 UV 胶，但是后面再测试居然跑焦了。

今天不说对焦原理，以及工厂 AA 工艺的问题，重点说一下和硬件相关的板材如何保证同轴度。特此记录，方便我后续查阅，我觉得可能也会对大家有帮助。之前的文章如下：

- [拆解索尼 CMOS 芯片的"电源命名法则"，看懂就懂了一半硬件设计](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247487554&idx=1&sn=faef97b14d77f58cfc03480ddae8c21a&scene=21#wechat_redirect)
- [索尼图像 sensor 芯片 IMX678 调试过程遇到的两个问题](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247487458&idx=1&sn=b4c4fbb7b4aa20dfe6d58c3b86e85431&scene=21#wechat_redirect)
- [搞定索尼 IMX678 图像条纹与黑电平异常问题分析和解决](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247487697&idx=1&sn=aeba7a6fd51124cc31e56cac58e4c193&scene=21#wechat_redirect)

## 一、板子不平，Sensor 就永远装不平

**在摄像头模组的生产与组装中，同轴度与平整度是决定成像质量的"生命线"。**

**一旦 Sensor 表面出现微小倾斜，或者光轴与 Sensor 几何中心偏离，最直接的表现就是边缘清晰度骤降、画面四周像散不均、MTF 测试不过。**

![摄像头模组组装堆叠结构](/images/cmos-module-coaxiality-flatness/01-assembly-stack.png)

根据上图的组装方式，我们从下往上去看，第一个就是 sensor 贴装。

要保证 Sensor 的平整度，根底在于 PCB/FPC 基板的平整度。所以贴片过程中回流焊的高温考验，是平整度失控的第一关。

1. **板材选用 High-Tg（Tg 170 及以上）**
2. **表面处理工艺（ENIG vs. ENEPIG）**
3. **其他可能导致板子变形的原因**

## 二、机械定位：镜头与镜座的导向配合

镜头（Lens）在拧入或装入底座（Holder）时，螺纹公差或安装间隙往往会导致光轴倾斜。

1. **引入导向螺纹（Guide Thread / 导向止口）**
2. **配合公差优化**

![镜头与镜座的导向配合结构](/images/cmos-module-coaxiality-flatness/02-guide-thread.png)

## 三、组装与调焦：行程预置与 AA 工艺锁定

传统机械对焦（Fixed Focus 直接拧到底）很难补偿 PCB、SMT 以及镜片注塑累积的微小公差。

引入 **AA（Active Alignment，主动对准）** 是高像素模组的必然选择。那么 AA 的装配顺序是什么——是先把镜头和底座固定，还是先把底座和 sensor 板固定？

![AA 装配顺序示意](/images/cmos-module-coaxiality-flatness/03-aa-sequence.png)

**最后被固化的那个界面，才是被主动对准的界面。**

![胶水固化界面与主动对准的关系](/images/cmos-module-coaxiality-flatness/04-cure-interface.png)

### 详细装配流程

1. **预组装**
2. **镜头与底座点胶固化（AA 前）**
3. **AA 动态校准**
4. **底座与 PCB 固化**

## 四、锁死固化：点胶工艺与应力控制

前面好不容易通过 AA 调整到了最佳 MTF 位置，如果胶水固化时产生形变拉扯，前面的努力就会前功尽弃。

1. **胶水性能选择**
2. **点胶方式：杜绝单边受力，采用对称点胶**
3. **固化工艺控制**

## 五、写在最后

并不是出图就万事大吉，批量生产的一致性才是大头。

以上关于 sensor 模组的同轴度与平整度控制，很细，大小模组厂也许由于成本或者周期考虑并一定是最优解。

但我想起了苹果总裁特努斯在当工程师时说过的一句话，"这也许不正常，但却是正确的"。

最后汇总下上面信息：

- **PCB 端：** 选 Tg170 + 控表面工艺（ENIG/ENEPIG），稳住底座平整度；
- **机构端：** 增加导向螺纹与止口，规范机械同轴度；
- **组装端：** 预置行程 + 6 轴 AA 工艺，算法动态补偿几何偏差；
- **固化端：** 耐温低收缩胶水 + 严格对称点胶，防止应力回弹拉倾。

把控好这 4 个环节，无论是高像素手机模组、车载环视还是安防高清镜头，良率与光学一致性都会得到显著提升。

**上面开头三个问题的第一个——对焦为什么总是反复，待我梳理下后面再讲。**

## 往期文章（公众号）

- [自举电路接着说，自举稳压器 BSTREG 在芯片内部是如何工作的](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247487410&idx=1&sn=49251d26ed580cc377bbd43b4cda1464&scene=21#wechat_redirect)
- [磁传感器 TLE5012 的位置怎么放，我们应该如何考虑](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247486984&idx=1&sn=fbb531dde9dcd006ac501dbb87447230&scene=21#wechat_redirect)
- [浩瀚 iSteady X 手持云台方案，电机一拖三，角度线性霍尔](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247487170&idx=1&sn=bea7fccce16f12764da04f87b92436c6&scene=21#wechat_redirect)
- [机器上电没反应，输入电容短路，电源输入接口防护我做了如下四点设计](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247487443&idx=1&sn=3c8ccd8424093ff0ddcae8c21a&scene=21#wechat_redirect)
- [MOS 管做开关，在低温下出现无法开启问题的原因分析](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247486487&idx=1&sn=5ef6078df3812534b43609675a5ad6534b4360967&scene=21#wechat_redirect)
- [索尼图像 sensor 芯片 IMX678 调试过程遇到的两个问题](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247487458&idx=1&sn=b4c4fbb7b4aa20dfe6d58c3b86e85431&scene=21#wechat_redirect)
- [开源 | 云台主控板设计原理图分享：附 Gitea 开源地址连接](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247487064&idx=1&sn=ef4f3abd2f14dfce780d65f1ca13d01c&scene=21#wechat_redirect)
- [为什么 pocket 云台开机要"上下左右乱甩"？揭秘电机里的"寻位"黑科技（一）](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247487270&idx=1&sn=9f6094763523d0494d8ffa7d6d022068&scene=21#wechat_redirect)
- [为什么 pocket 云台开机要"上下左右乱甩"？揭秘电机里的"寻位"黑科技（二）](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247487318&idx=1&sn=03626e638bee2a45c85b98b180c649f7&scene=21#wechat_redirect)

> 关于作者：硬件工程师"源哥"，多年硬件产品实战经验，在这里分享硬件开发干货知识，帮你少走弯路。
