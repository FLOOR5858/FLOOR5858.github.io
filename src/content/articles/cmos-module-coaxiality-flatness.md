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
● 回流焊峰值温度通常在240℃~260℃，若使用常规低Tg板材，基板在高温下玻璃态软化，极易产生弓曲和扭曲。
● 采用 Tg170 高耐热板材，能显著提高PCB的抗高温热形变能力，保证Sensor贴片焊接降温后的全局平整度。
![PCB翘曲示意图](/images/cmos-module-coaxiality-flatness/06-PCB-qiaoqu.png)

2. **表面处理工艺（ENIG vs. ENEPIG）**
● 常规贴片（化金工艺 ENIG）： 焊盘平整度好，抗氧化能力强，适合大多数SMT回流焊方案。
● 金线打线（Banding）： 如果Sensor是COB（Chip on Board）制程，需要打金线，必须采用化学镍钯金（ENEPIG）工艺。
● 钯层不仅能阻挡镍向金层的迁移，避免出现“黑盘”现象，还能大幅提升引线键合的结合力与可靠性。
![banding打金线示意图](/images/cmos-module-coaxiality-flatness/05-Banding-cob.png)

3. **其他可能导致板子变形的原因**
● 锡膏印刷厚度不一致——因单边锡量过多形成回流焊后的“虚浮”与倾斜；
● 叠层不对称——顶层残铜率 80%、底层 20%，过炉后板子像一张拉紧的弓；
● 无脑减薄——1.6 mm 减到 0.8 mm，抗弯刚性按立方律掉到 1/8；
● 细长拼板——弓弯主要沿长轴发生，方形拼板明显更稳；
● 裸板受潮——按 IPC-J-STD-033 烘板（105℃ × 1 h 起），否则过炉直接爆板。

## 二、机械定位：镜头与镜座的导向配合

镜头（Lens）在拧入或装入底座（Holder）时，螺纹公差或安装间隙往往会导致光轴倾斜。

1. **引入导向螺纹（Guide Thread / 导向止口）**

- 普通螺纹配合存在间隙，在旋入初期容易产生偏角或轴心歪斜。

- 结构设计上，建议在螺纹前段增加一段无螺纹的圆柱导向段，或者设计双向精确定位止口。先通过圆柱导向完成同轴定心，再进入螺纹啮合，大幅消除光轴机械偏角。

2. **配合公差优化**

- 严格控制螺纹外径、中径与底座内孔的配合公差，避免因间隙过大导致镜头在轴向受力时晃动。

![镜头与镜座的导向配合结构](/images/cmos-module-coaxiality-flatness/02-guide-thread.png)

## 三、组装与调焦：行程预置与 AA 工艺锁定

传统机械对焦（Fixed Focus 直接拧到底）很难补偿 PCB、SMT 以及镜片注塑累积的微小公差。

引入 **AA（Active Alignment，主动对准）** 是高像素模组的必然选择。那么 AA 的装配顺序是什么——是先把镜头和底座固定，还是先把底座和 sensor 板固定？

![AA 装配顺序示意](/images/cmos-module-coaxiality-flatness/03-aa-sequence.png)

**最后被固化的那个界面，才是被主动对准的界面。**

![胶水固化界面与主动对准的关系](/images/cmos-module-coaxiality-flatness/04-cure-interface.png)

详细装配流程

1. **预组装**

- 把镜头旋入到底座中，调整到理论标称后焦（BFL）的机械行程范围内。这一步叫“粗对焦”。

2. **镜头与底座点胶固化（AA 前）**

- 在螺纹缝隙处点胶（通常用厌氧胶、UV胶或热固化胶）锁定，让镜头和底座成为一个刚性整体。

- 为什么要留行程裕量？ 目的就是保证这个整体组件进入AA设备时，底座底部与PCB之间的胶水间隙（俗称胶厚，通常设计在 0.15-0.3mm）刚好处于机械臂的正负调整中位。

3. **AA 动态校准**

- 底座底部或PCB焊盘边缘先预点好AA专用结构胶（UV+热双固化胶）。

- AA设备在镜头点亮成像的状态下，实时采集并计算全图多个视场（ROI）的 MTF值。

- AA机械手夹持住“镜头+底座总成”，在 6个自由度（X, Y, Z,θx,θy,θz 上进行微米级微调，动态消除前面所有工序累积的倾斜与偏心，直接让Sensor靶面与镜头焦平面达到物理意义上的最佳贴合。

4. **底座与 PCB 固化**

- AA调整完毕后，点胶 → UV 预固化 → 复测 → 终固化 → 100% 复测。分步固化，检查固化过程中的偏差。

## 四、锁死固化：点胶工艺与应力控制

前面好不容易通过 AA 调整到了最佳 MTF 位置，如果胶水固化时产生形变拉扯，前面的努力就会前功尽弃。

1. **胶水性能选择**

- 低收缩率与低内应力： 选用固化体积收缩率小（通常要求 <1.5%甚至更低）的UV+热固化双重固化胶水。

- 耐高温与低衰减：镜头模组工作环境温度范围广，胶水需具备良好的耐温性与耐老化性，防止高温下胶体软化或蠕变导致焦距漂移。

2. **点胶方式：杜绝单边受力，采用对称点胶**

- 严禁非对称出胶： 如果从单侧打胶，胶水固化收缩时会产生单向拉扯力，直接将镜头拉偏。
- 多点对称或环形连续点胶： 推荐采用4 点均布（90° 间隔）打胶，先点 180° 的对侧两点、预固化，再点另外一对。分两次固化，让收缩力矩自己抵消掉。

3. **固化工艺控制**

- UV 胶在照不到紫外的阴影区（螺纹根部、结构背面），仍会靠残余引发剂缓慢反应，几小时到几天才收缩到位。
- 采用UV + 热双固化胶，先在数秒内以极小形变锁定相对位置，再进烤箱进行低温长烤完成热固化，把暗固化应力"彻底释放掉。

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
