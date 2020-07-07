import { Tabs, Typography, Divider } from "antd";
import React from "react";
import styles from "./ContestPage.module.css";
import { HomeSitePage } from "../sites/HomeSite";

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

export interface IContestPageProps {
  setPage: (page: HomeSitePage) => void;
}

const ContestPage: React.FC<IContestPageProps> = ({ setPage }) => {
  setPage("contests");

  return (
    <Tabs
      tabBarStyle={{
        marginTop: 48,
      }}
      tabPosition="left"
    >
      <TabPane tab="队式程序设计大赛" key="teamstyle">
        <Typography className={styles.content}>
          <Title level={2}>队式程序设计大赛</Title>
          <Title level={3}>赛事时间</Title>
          <Paragraph>
            队式程序设计大赛在【春季学期】举行。在激烈的赛程之前，会有电子系科协举办的培训讲座，帮助选手们快速上手，参与进紧张有趣的赛程中，感受
            AI 的编程之美。
          </Paragraph>
          <Divider />
          <Title level={3}>赛事简介</Title>
          <Paragraph>
            “队式程序设计大赛”是由清华大学电子系科协举办的一项经典赛事，是一个组队参加的对抗性策略程序设计比赛。比赛主题往往基于某款经典电子游戏，设计出的全新规则，邀请选手组队设计出更加完善和智能的游戏策略，并用高效的程序代码实现。比赛往往以双方AI对战的形式进行，决赛时还会使用3D界面向全场播送比赛实况，对抗性和观赏性极强，为清华大学内一年一度的程序设计盛事。
          </Paragraph>
          <Title level={4}>精彩回顾</Title>
          <Paragraph disabled style={{ textAlign: "center" }}>
            <img
              className={styles.img}
              alt="ts16"
              src="https://api.eesast.com/static/images/ts16.jpg"
            />
            <br />
            队式十六——深蓝 (Deep Blue)
            <br />
          </Paragraph>
          <Paragraph disabled style={{ textAlign: "center" }}>
            <img
              className={styles.img}
              alt="ts17"
              src="https://api.eesast.com/static/images/ts17.jpg"
            />
            <br />
            队式十七——Stellar Craft
            <br />
          </Paragraph>
          <Paragraph disabled style={{ textAlign: "center" }}>
            <img
              className={styles.img}
              alt="ts18"
              src="https://api.eesast.com/static/images/ts18.jpg"
            />
            <br />
            队式十八——CPClash
            <br />
          </Paragraph>
          <Paragraph disabled style={{ textAlign: "center" }}>
            <img
              className={styles.img}
              alt="ts19"
              src="https://api.eesast.com/static/images/ts19.jpg"
            />
            <br />
            2018 年，队式十九作为 A1 组比赛合并到 THU-AI 中
            <br />
          </Paragraph>
          <Paragraph disabled style={{ textAlign: "center" }}>
            <img
              className={styles.img}
              alt="ts20"
              src="https://api.eesast.com/static/images/ts20.jpg"
            />
            <br />
            队式二十——THU-AI 枪林弹雨组
            <br />
          </Paragraph>
        </Typography>
      </TabPane>
      <TabPane tab="电子设计大赛" key="edc">
        <Typography className={styles.content}>
          <Title level={2}>电子设计大赛</Title>
          <Title level={3}>赛事时间</Title>
          <Paragraph>
            电子设计大赛在每年的【秋季学期】举行，从报名领取元件到决赛整个过程大概会持续半个学期，包括赛前培训，预赛初赛决赛等阶段，让同学们从机械结构到电路设计，从控制逻辑到上层策略，一步步完成作品。
          </Paragraph>
          <Divider />
          <Title level={3}>赛事简介</Title>
          <Paragraph>
            “电子设计大赛”是由清华大学电子系和自动化系合办的面向全校的比赛，选手可以组成不多于四人的队伍报名参加比赛。比赛一般是要求选手设计一辆智能车，根据赛题内容设计机械结构，编写单片机代码，实现自动控制。比赛形式是让两支队伍的智能车进行对抗，根据规则，胜者晋级，比赛过程中智能车除了根据传感器检测场地情况之外，还可以通过官方提供的通信模块从上位机处获取信息或者给上位机发送指令；决赛在罗姆楼进行，每年都会吸引大批观众，一边欣赏紧张激烈的比赛，一边听着激情洋溢的解说，见证冠军的诞生。
          </Paragraph>
          <Title level={4}>精彩回顾</Title>
          <Paragraph disabled style={{ textAlign: "center" }}>
            <img
              className={styles.img}
              alt="edc18"
              src="https://api.eesast.com/static/images/edc18.jpg"
            />
            <br />
            第十八届电子设计大赛——天赐良机
            <br />
          </Paragraph>
          <Paragraph disabled style={{ textAlign: "center" }}>
            <img
              className={styles.img}
              alt="edc19"
              src="https://api.eesast.com/static/images/edc19.jpg"
            />
            <br />
            第十九届电子设计大赛——绿茵荣耀
            <br />
          </Paragraph>
          <Paragraph disabled style={{ textAlign: "center" }}>
            <img
              className={styles.img}
              alt="edc20"
              src="https://api.eesast.com/static/images/edc20.jpg"
            />
            <br />
            第二十届电子设计大赛——智圆行方
            <br />
          </Paragraph>
        </Typography>
      </TabPane>
      <TabPane tab="硬件设计大赛" key="hdc">
        <Typography className={styles.content}>
          <Title level={2}>硬件设计大赛</Title>
          <Title level={3}>赛事时间</Title>
          <Paragraph>
            硬件设计大赛在每年【暑假小学期】举办，大概持续两周时间。
          </Paragraph>
          <Divider />
          <Title level={3}>赛事简介</Title>
          <Paragraph>
            硬件设计大赛是清华大学电子系主办的一个比赛，主要面向电子系零基础的同学，赛前有若干次培训讲座，现场发放相应的模块，带领大家从零开始接触、学习单片机的基本操作，旨在激发同学们对硬件的热情。
          </Paragraph>
          <Title level={4}>精彩回顾</Title>
          <Paragraph style={{ textAlign: "center" }}>
            <img
              className={styles.img}
              alt="hwdc2017-1"
              src="https://api.eesast.com/static/images/hwdc2017-1.jpg"
            />
            <img
              className={styles.img}
              alt="hwdc2017-2"
              src="https://api.eesast.com/static/images/hwdc2017-2.jpg"
            />
            <br />
            <Text disabled>2017 年硬件设计大赛作品</Text>
            <br />
          </Paragraph>
          <Paragraph style={{ textAlign: "center" }}>
            <img
              className={styles.img}
              alt="hwdc2018-1"
              src="https://api.eesast.com/static/images/hwdc2018-1.gif"
            />
            <img
              className={styles.img}
              alt="hwdc2018-2"
              src="https://api.eesast.com/static/images/hwdc2018-2.jpg"
            />
            <br />
            <Text disabled>2018 年硬件设计大赛作品</Text>
            <br />
          </Paragraph>
          <Paragraph style={{ textAlign: "center" }}>
            <img
              className={styles.img}
              alt="hwdc2019-1"
              src="https://api.eesast.com/static/images/hwdc2019-1.gif"
            />
            <img
              className={styles.img}
              alt="hwdc2019-2"
              src="https://api.eesast.com/static/images/hwdc2019-2.gif"
            />
            <br />
            <Text disabled>2019 年硬件设计大赛作品</Text>
            <br />
          </Paragraph>
        </Typography>
      </TabPane>
      <TabPane tab="软件设计大赛" key="sdc">
        <Typography className={styles.content}>
          <Title level={2}>软件设计大赛</Title>
          <Title level={3}>赛事时间</Title>
          <Paragraph>
            软件设计大赛在每年【寒假前后】举办。软件设计大赛要求参赛者使用当今主流的技术栈，面向某个特定需求，完成一套具备一定可用性和美观性的软件程序。对于“软件”的定义十分宽泛，游戏、网站、APP
            都可以作为作品提交。
          </Paragraph>
          <Divider />
          <Title level={3}>参赛要求</Title>
          <Paragraph>
            <ul>
              <li>
                参赛者以个人为单位参加比赛。每名同学也可提交不超过 2 个作品。
              </li>
              <li>参赛选手应当是清华大学在校学生。</li>
              <li>
                参赛者应当在指定时间内以指定的方式完成队伍报名和程序提交。
              </li>
            </ul>
          </Paragraph>
          <Divider />
          <Title level={3}>作品要求</Title>
          <ul>
            <li>美观性：提交作品需要对 UI 有基本的设计，具有一定的美观性。</li>
            <li>功能性：提交作品需要针对某一类需求，提供一种解决方案。</li>
            <li>原创性：提交作品应当为选手的原创作品。</li>
            <li>
              稳定性：提交作品需要具有一定的稳定性，尽可能的减少异常和出错的概率。
            </li>
          </ul>
          <Title level={4}>精彩回顾</Title>
          <Paragraph disabled style={{ textAlign: "center" }}>
            2018 软件设计大赛优秀作品
            <br />
            <img
              className={styles.img}
              alt="swdc2018-1"
              src="https://api.eesast.com/static/images/swdc2018-1.png"
            />
            <br />
            多功能计算器 CalcPro
            <br />
            <img
              className={styles.img}
              alt="swdc2018-2"
              src="https://api.eesast.com/static/images/swdc2018-2.jpg"
            />
            <br />
            简易操作系统 BASIC-OS1
            <br />
            <img
              className={styles.img}
              alt="swdc2018-3"
              src="https://api.eesast.com/static/images/swdc2018-3.jpg"
            />
            <br />
            校园网管理软件 .NetCampus
            <br />
          </Paragraph>
          <Paragraph disabled style={{ textAlign: "center" }}>
            2019 软件设计大赛优秀作品
            <br />
            <img
              className={styles.img}
              alt="swdc2019-1"
              src="https://api.eesast.com/static/images/swdc2019-1.png"
            />
            <br />
            音乐节奏游戏 TuneStory
            <br />
            <img
              className={styles.img}
              alt="swdc2019-2"
              src="https://api.eesast.com/static/images/swdc2019-2.png"
            />
            <br />
            三角形滤镜 LowPoly
            <br />
            <img
              className={styles.img}
              alt="swdc2019-3"
              src="https://api.eesast.com/static/images/swdc2019-3.png"
            />
            <br />
            在线多功能绘图
            <br />
          </Paragraph>
        </Typography>
      </TabPane>
      <TabPane tab="挑战杯" key="cc">
        <Typography className={styles.content}>
          <Title level={2}>挑战杯</Title>
          <Title level={3}>赛事时间</Title>
          <Paragraph>
            11 月中旬：开始报名；次年 3 月：进行初审；4 月：进行二审和终审。
          </Paragraph>
          <Divider />
          <Title level={3}>赛事简介</Title>
          <Paragraph>
            清华大学“挑战杯”学生课外学术科技作品竞赛是由教务处、科研院、研究生院、校团委和校学生科协共同主办的全校性学生课外学术科技作品竞赛。挑战杯是清华大学历史最长、规模最大、水平最高的综合性学生课外科技作品竞赛，在电子系承办的诸多赛事中对参赛者的综合能力要求最高，能够显著提升参赛者的创新能力和创新意识。
          </Paragraph>
          <Paragraph>
            参赛流程如下：
            <ul>
              <li>
                选题：一个好的选题能大大提升获奖几率，鼓励大家选择创新性强、实用性佳且技术难度不过于高的项目。
              </li>
              <li>
                展开研究或制作：确定题目后，应在指导老师的指导下展开调查与分析，勇于尝试并精心完成题目研究或发明制作。
              </li>
              <li>
                送审：3
                月会要求选手提交作品初稿并进行系内评审，一般采取现场展示答辩的形式。通过初审的作品会送到校科协参加第二轮评审。二审和终审均安排在四月。
              </li>
              <li>
                参加科展：学校将于 4
                月末校庆期间将参赛作品统一布展，在全校内进行展评。其间，在电子系的展区内，选手可以通过展板、作品实物和讲解来展示自己的作品。
              </li>
              <li>
                参加全国赛/申请专利等：如果你的项目足够牛，就可以代表清华大学参加全国的挑战杯；或者也可以申请专利，投入商业应用。
              </li>
            </ul>
          </Paragraph>
          <Divider />
          <Title level={3}>往年情况</Title>
          <Title level={4}>32 届挑战杯获奖情况</Title>
          <Paragraph>
            一等奖
            <ul>
              <li>超高精度的自然手势获取与识别技术研究</li>
            </ul>
          </Paragraph>
          <Paragraph>
            三等奖
            <ul>
              <li>知了——基于 SNS 的校园活动信息推送系统</li>
              <li>基于数字图像处理的机械臂自动校准技术</li>
              <li>基于红外光通信的智能车远距离对抗平台</li>
              <li>搭建在树莓派上基于人脸识别的自动录播系统</li>
              <li>基于深度学习的人脸表情处理系统</li>
            </ul>
          </Paragraph>
          <Title level={4}>34 届挑战杯获奖情况</Title>
          <Paragraph>
            一等奖
            <ul>
              <li>千里眼——基于虚拟现实技术的全景视频拼接编码传输系统</li>
            </ul>
          </Paragraph>
          <Paragraph>
            三等奖
            <ul>
              <li>基于 real sense 智能交互平台的识别系统研究</li>
              <li>多目标跟踪算法通用平台的设计与实现</li>
            </ul>
          </Paragraph>
          <Title level={4}>35 届挑战杯获奖情况</Title>
          <Paragraph>
            三等奖
            <ul>
              <li>高能效手写文字识别系统设计</li>
            </ul>
          </Paragraph>
          <Title level={4}>36 届挑战杯获奖情况</Title>
          <Paragraph>
            二等奖
            <ul>
              <li>基于多注意力语义表示机制的医考问答系统</li>
              <li>社交媒体噪声文本的维度情感分析系统</li>
              <li>基于 sEMG 信号的便携式帕金森病诊断仪</li>
              <li>智能自主协同编队系统</li>
            </ul>
          </Paragraph>
          <Paragraph>
            三等奖
            <ul>
              <li>基于高精度室内定位技术的无人车导航编队系统</li>
              <li>基于面部表情与动作的唇语识别与语音合成系统</li>
              <li>基于上转换原理的高性能植入式光电子器件</li>
            </ul>
          </Paragraph>
          <Divider />
          <Title level={3}>学长经验</Title>
          <ul>
            <li>
              知识要求：一般来讲挑战杯所需知识与本科所学课程不会有太大的关系，无论是大三参加还是大二参加都会学习一些课外的知识。
            </li>
            <li>
              时间安排：一般来讲挑战杯主力在大三，但是对于电子系同学而言大三上是课业最重的一个学期，所以推荐同学们大二参加。在时间安排合理的情况下，是可以在学业顺利进行的同时好好做挑战杯的。
            </li>
            <li>
              选题建议：一般来讲实用性强、展示性强的项目更有可能会得到好成绩，建议同学们多多观察周边事物，可能就会有好点子冒出来。此外，对于重心放在科研、发论文上面的同学，可以考虑顺手也报一个挑战杯，往年也有一些选手靠纯科研成果拿到较好成绩。
            </li>
            <li>
              团队合作：很少有一个人做项目做到最后的；一般来说组一个小队，联系实验室指导老师会减轻一些做项目的压力。
            </li>
          </ul>
        </Typography>
      </TabPane>
      <TabPane tab="新生知识竞赛" key="fkc">
        <Typography className={styles.content}>
          <Title level={2}>新生信息知识竞赛</Title>
          <Title level={3}>赛事时间</Title>
          <Paragraph>
            ADI
            杯新生信息知识竞赛在【秋季学期】举行，在新生入学后会有相关的宣传工作，通常期中考试前结束所有工作。
          </Paragraph>
          <Divider />
          <Title level={3}>赛事简介</Title>
          <Paragraph>
            清华大学 ADI 杯新生信息知识竞赛至今已成功举办 15
            届。该活动是由清华大学信息学院四系科协（电子系，计算机系，自动化系，软件学院）合办的一年一届的全校活动。活动旨在向新生普及信息知识，发现人才。这项活动面向全校
            3000 多名新生，尤其是 1000
            多名信息学院的新同学，已在校内产生了良好而广泛的影响。
          </Paragraph>
          <Paragraph>
            全校初赛采取统一笔试环节，选取五到七支队伍进入决赛。电子系系内初赛及全校决赛试题以
            PowerPoint
            形式，有必答题、抢答题、视频题、女生题、人气题、你说我猜题、渐进抢答题和风险题等环节，均为现场作答。
          </Paragraph>
          <Divider />
          <Title level={3}>往年情况</Title>
          <Paragraph>
            往年奖品包括小米手环、极路由、蓝牙音箱、扫地机器人、打印机、移动硬盘等等，同时观赛亦有机会获得观众奖。
          </Paragraph>
          <Paragraph disabled style={{ textAlign: "center" }}>
            <img
              className={styles.img}
              alt="fic15"
              src="https://api.eesast.com/static/images/fic15.jpg"
            />
            <br />
            第十五届决赛
            <br />
            <img
              className={styles.img}
              alt="fic16"
              src="https://api.eesast.com/static/images/fic16.jpg"
            />
            <br />
            第十六届决赛
            <br />
            <img
              className={styles.img}
              alt="fic17"
              src="https://api.eesast.com/static/images/fic17.jpg"
            />
            <br />
            第十七届决赛
            <br />
          </Paragraph>
        </Typography>
      </TabPane>
    </Tabs>
  );
};

export default ContestPage;
