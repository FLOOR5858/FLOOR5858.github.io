---
title: 'From PCB Selection to AA Focus Lock: A Full-Chain Teardown of CMOS Module Coaxiality and Flatness'
description: 'Three culprits behind focus drift in mass production — PCB Tg, guide threads, AA assembly order, and adhesive curing — decoded across the full hardware chain of camera module flatness and coaxiality.'
date: 2026-11-16
category: hardware
tags: ['camera module', 'AA process', 'PCB', 'IMX678']
lang: en
translationKey: cmos-module-coaxiality-flatness
---

> Author: LLY · First published on WeChat
> Original: https://mp.weixin.qq.com/s/_g1WhFePeQmNBsyXbyUbKQ

I had previously solved the low-light image-quality problem of the IMX678 sensor, and the quantified BLC data was behaving normally, so I thought everything was settled — until focus problems showed up again in mass production. I summed them up as three issues:

1. We require objects at 30 m to be in sharp focus, but every time the module factory finished focusing and handed samples back to us for testing, the image was not sharp;
2. The second issue: one side of the frame was sharp while the other side was not;
3. We had already focused the lens and applied UV adhesive, yet later testing showed the focus had drifted.

Today I won't talk about the principles of focusing or the factory's AA process. I'll focus on the hardware side — how substrate selection keeps a module coaxial. I'm recording this for my own reference, and I hope it helps someone else too. Previous articles:

- [Demystifying Sony CMOS power-pin naming — get this and you understand half of hardware design](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247487554&idx=1&sn=faef97b14d77f58cfc03480ddae8c21a&scene=21#wechat_redirect)
- [Two problems encountered while tuning the Sony IMX678 image sensor](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247487458&idx=1&sn=b4c4fbb7b4aa20dfe6d58c3b86e85431&scene=21#wechat_redirect)
- [Analyzing and fixing image banding and black-level anomalies on the Sony IMX678](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247487697&idx=1&sn=aeba7a6fd51124cc31e56cac58e4c193&scene=21#wechat_redirect)

## 1. If the board isn't flat, the sensor will never sit flat

**In camera module production and assembly, coaxiality and flatness are the lifeline that determines image quality.**

**The moment the sensor surface tilts even slightly, or the optical axis deviates from the sensor's geometric center, the most direct symptoms are a sudden loss of edge sharpness, uneven astigmatism around the frame, and failed MTF tests.**

![Camera module assembly stack-up](/images/cmos-module-coaxiality-flatness/01-assembly-stack.png)

Following the stack-up above, let's go from the bottom up. The first step is sensor die attach.

Ensuring sensor flatness comes down, fundamentally, to the flatness of the PCB/FPC substrate. The high temperature of reflow soldering during assembly is the first place flatness gets out of control.

1. **Use a high-Tg substrate (Tg 170 or above)**
2. **Surface finish (ENIG vs. ENEPIG)**
3. **Other causes of board warpage**

## 2. Mechanical alignment: the guide fit between lens and holder

When a lens is screwed or pressed into the holder, thread tolerance or mounting clearance often tilts the optical axis.

1. **Add a guide thread (guide lead / pilot fit)**
2. **Optimize the fit tolerance**

![Guide fit between lens and holder](/images/cmos-module-coaxiality-flatness/02-guide-thread.png)

## 3. Assembly and focusing: stroke pre-setting and AA process lock

Traditional mechanical focusing (fixed focus, simply screwed all the way down) can hardly compensate for the accumulated small tolerances of the PCB, SMT, and molded lens elements.

Bringing in **AA (Active Alignment)** is the inevitable choice for high-resolution modules. So what is the AA assembly order — do you fix the lens to the holder first, or the holder to the sensor board first?

![AA assembly sequence](/images/cmos-module-coaxiality-flatness/03-aa-sequence.png)

**The interface that is cured last is the one that gets actively aligned.**

![Relationship between adhesive cure interface and active alignment](/images/cmos-module-coaxiality-flatness/04-cure-interface.png)

### Detailed assembly flow

1. **Pre-assembly**
2. **Lens-to-holder dispensing and cure (before AA)**
3. **AA dynamic calibration**
4. **Holder-to-PCB cure**

## 4. Locking the cure: dispensing process and stress control

We went to great lengths in AA to reach the best MTF position; if the adhesive deforms and pulls during cure, all that effort is wasted.

1. **Adhesive selection**
2. **Dispensing method: avoid one-sided loading, use symmetric dispensing**
3. **Cure process control**

## 5. Closing thoughts

Getting an image out of the sensor is not the finish line — consistency in mass production is the bigger part.

The coaxiality and flatness control for sensor modules described above is detailed, and different module makers may not arrive at the optimal solution for cost or schedule reasons.

But I'm reminded of something John Ternus said when he was an engineer: "It may not be normal, but it is correct."

To summarize:

- **PCB side:** choose Tg170 + control the surface finish (ENIG/ENEPIG) to keep the holder flat;
- **Mechanics side:** add a guide thread and pilot fit to standardize mechanical coaxiality;
- **Assembly side:** pre-set the stroke + 6-axis AA, using the algorithm to dynamically compensate geometric deviation;
- **Cure side:** low-shrinkage, temperature-resistant adhesive + strictly symmetric dispensing to prevent stress rebound from tilting the stack.

Get these four links right, and whether it's a high-resolution phone module, an automotive surround-view camera, or a security lens, yield and optical consistency will improve markedly.

**As for the first of the three questions at the start — why focus keeps drifting — I'll write that up after I've sorted it out.**

## Previous articles (WeChat)

- [Bootstrapping, continued: how a BSTREG bootstrap regulator works inside the chip](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247487410&idx=1&sn=49251d26ed580cc377bbd43b4cda1464&scene=21#wechat_redirect)
- [Where to place the TLE5012 magnetic sensor — how should we think about it](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247486984&idx=1&sn=fbb531dde9dcd006ac501dbb87447230&scene=21#wechat_redirect)
- [Hohem iSteady X gimbal teardown: one motor driving three, linear Hall angle sensing](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247487170&idx=1&sn=bea7fccce16f12764da04f87b92436c6&scene=21#wechat_redirect)
- [No response on power-up, shorted input capacitor — four protection choices I made at the power input](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247487443&idx=1&sn=3c8ccd8424093ff0ddcae8c21a&scene=21#wechat_redirect)
- [Why a MOSFET switch fails to turn on at low temperature](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247486487&idx=1&sn=5ef6078df3812534b43609675a5ad6534b4360967&scene=21#wechat_redirect)
- [Two problems encountered while tuning the Sony IMX678 image sensor](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247487458&idx=1&sn=b4c4fbb7b4aa20dfe6d58c3b86e85431&scene=21#wechat_redirect)
- [Open source: gimbal controller schematic shared, with Gitea repo link](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247487064&idx=1&sn=ef4f3abd2f14dfce780d65f1ca13d01c&scene=21#wechat_redirect)
- [Why does a Pocket gimbal "shake up/down/left/right" on startup? The motor's position-finding trick (Part 1)](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247487270&idx=1&sn=9f6094763523d0494d8ffa7d6d022068&scene=21#wechat_redirect)
- [Why does a Pocket gimbal "shake up/down/left/right" on startup? The motor's position-finding trick (Part 2)](https://mp.weixin.qq.com/s?__biz=MzIzMTgwNjUyOQ==&mid=2247487318&idx=1&sn=03626e638bee2a45c85b98b180c649f7&scene=21#wechat_redirect)

> About the author: hardware engineer "Source", sharing hands-on hardware development experience built over many years to help you avoid the detours.
