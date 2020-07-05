import { Tabs, Icon, Typography } from "antd";
import styles from "./DivisionPage.module.css";
import React from "react";
import { HomeSitePage } from "../sites/HomeSite";

const { TabPane } = Tabs;

export interface IDivisionPageProps {
  setPage: (page: HomeSitePage) => void;
}

const DivisionPage: React.FC<IDivisionPageProps> = ({ setPage }) => {
  setPage("divisions");

  return (
    <Tabs
      tabBarStyle={{
        marginTop: 48,
      }}
      tabPosition="left"
    >
      <TabPane
        tab={
          <span>
            <Icon type="bug" />
            软件部
          </span>
        }
        key="software"
      >
        <Typography className={styles.content}>
          <Typography.Title level={2}>软件部</Typography.Title>
          <div style={{ textAlign: "center" }}>
            <img
              className={styles.img}
              src="https://api.eesast.com/static/images/division-introduction-software-group-photo.png"
              alt="division-introduction-software-group"
            />
          </div>
          <br />
          <p style={{ fontStyle: "italic" }}>
            软件部，致力于提升技术水平，让同学们体会开发的乐趣，是同学们走向编程大佬之路的踏脚石。
          </p>
          <p>在“暑期培训”中，打下坚实广泛的基础；</p>
          <p>在黑框界面和高亮代码中，操控整个服务器的运行；</p>
          <p>“学生节直播”，带你走进网络编程的世界；</p>
          <p>
            在“AI挑战赛开发”，体验团队协作的开发模式，了解团体项目开发流程，享受做出大工程的成就感。
          </p>
          <p>
            此外，还有定期技术交流，让你结识更多志同道合的伙伴；微信公众号技术分享，为全电子系的同学普及知识。
          </p>
          <p>
            如果你喜欢编程，喜欢开发，来加入软件部吧，迈出你成为大佬的又一步。
          </p>
          <div style={{ textAlign: "center" }}>
            <div style={{ float: "left", width: "50%", padding: 6 }}>
              <img
                className={styles.img}
                src="https://api.eesast.com/static/images/division-introduction-software-training-1.png"
                alt="software-training-1"
                style={{ width: "90%" }}
              />
            </div>
            <div style={{ float: "right", width: "50%", padding: 6 }}>
              <img
                className={styles.img}
                src="https://api.eesast.com/static/images/division-introduction-software-training-2.png"
                alt="software-training-2"
                style={{ width: "90%" }}
              />
            </div>
          </div>
        </Typography>
      </TabPane>
      <TabPane
        tab={
          <span>
            <Icon type="tool" />
            硬件部
          </span>
        }
        key="hardware"
      >
        <Typography className={styles.content}>
          <Typography.Title level={2}>硬件部</Typography.Title>
          <div style={{ textAlign: "center" }}>
            <img
              className={styles.img}
              src="https://api.eesast.com/static/images/division-introduction-hardware-group-photo.png"
              alt="division-introduction-hardware-group"
              style={{ width: "90%" }}
            />
          </div>
          <br />
          <p style={{ fontStyle: "italic" }}>
            硬件部是科协是一个为硬件零基础同学打开硬件世界的大门、为硬件大佬提供展示自己实力、实现自己想法的地方。我们能够为同学们提供的包括但不限于一个训练和交流平台、两次硬件赛事筹办的机会以及实现自己科创目标的大量硬件资源。
          </p>
          <h3>暑期培训</h3>
          <p>
            我们将利用暑假小学期的时间，为大家开设一系列硬件知识讲座，内容包括基于
            STM32 的硬件开发入门、基于 OpenCV 的上位机编写、以及 PCB
            从设计到制作的一系列知识。这些知识将帮助萌新快速打开硬件开发新世界的大门。
          </p>
          <h3>硬件设计大赛</h3>
          <div style={{ textAlign: "center" }}>
            <div style={{ float: "left", width: "50%" }}>
              <img
                className={styles.img}
                src="https://api.eesast.com/static/images/division-introduction-hardware-contest-1.png"
                alt="hardware-contest-1"
                style={{ width: "90%" }}
              />
            </div>
            <div style={{ float: "right", width: "50%" }}>
              <img
                className={styles.img}
                src="https://api.eesast.com/static/images/division-introduction-hardware-contest-2.png"
                alt="hardware-contest-2"
                style={{ width: "90%" }}
              />
            </div>
          </div>
          <br />
          <p>
            硬件设计大赛主要面向大一零基础新生，主要内容要求同学们基于 Arduino
            开发平台完成自定题目的硬件开发项目。在这里，通过亲身参与比赛与参与比赛筹办，大家能够第一次感受到自己的创意借助硬件平台得以实现的快乐和感动，同时，通过与其他同学的交流、切磋，大家也能够进一步提高自己的硬件实力。
          </p>
          <h3>电子设计大赛</h3>
          <div style={{ textAlign: "center" }}>
            <div style={{ float: "left", width: "50%" }}>
              <img
                className={styles.img}
                src="https://api.eesast.com/static/images/division-introduction-edc-1.png"
                alt="edc-1"
                style={{ width: "90%" }}
              />
            </div>
            <div style={{ float: "right", width: "50%" }}>
              <img
                className={styles.img}
                src="https://api.eesast.com/static/images/division-introduction-edc-2.png"
                alt="edc-2"
                style={{ width: "90%" }}
              />
            </div>
          </div>
          <br />
          <p>
            如果说硬件设计大赛是大家在硬件开发路上的一次牛刀小试，那么电子设计大赛就是一场真正激烈的角逐。电子设计大赛主要通过使用基于
            STM32
            的小车来完成一系列赛题，开发组的同学们会利用小学期后的暑假时间和开学后的一段时间，由电子系科协和自动化科协的部长、副部长带队，完成比赛的开发相关工作，包括通信板的设计与制作、样车开发与调试、选手文档编写、上位机编写与调试、场地的设计与搭建等任务，通过实战来提升自己的硬件开发技术。
          </p>
          <h3>大量的硬件开发资源</h3>
          <p>
            在硬件部，你能得到大量的硬件开发资源，从自己的第一块 stm32
            开发板开始，到小车、无人机……只要你有想法，在这里都能实现。
          </p>
        </Typography>
      </TabPane>
      <TabPane
        tab={
          <span>
            <Icon type="unordered-list" />
            项目部
          </span>
        }
        key="project"
      >
        <Typography className={styles.content}>
          <Typography.Title level={2}>项目部</Typography.Title>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <img
              className={styles.img}
              src="https://api.eesast.com/static/images/division-introduction-project-1.png"
              alt="project-1"
              style={{ width: "40%" }}
            />
            <img
              className={styles.img}
              src="https://api.eesast.com/static/images/division-introduction-project-2.png"
              alt="project-2"
              style={{ width: "40%" }}
            />
          </div>
          <br />
          <p style={{ fontStyle: "italic" }}>
            项目部主要负责启航计划与挑战杯的跟进工作。我们致力于引导和帮助电子系的同学们在科研、科创方面不断前进，为同学们搭建良好的科创平台。
          </p>
          <p>
            启航计划是针对电子系优秀科研人才的培养计划。我们将组织丰富的讲座、交流活动，例如名词探究分享、实验室交流、企业调研、特奖经验分享，以至最后的科创年会等等。我们为启航计划的同学们提供全方位的支持与帮助，让同学们从项目中切身锻炼自己的科研科创能力。
          </p>
          <p>
            挑战杯作为一项颇具影响力的赛事，每年都可以吸引众多电子系同学参与。如何吸引更多的同学参加挑战杯？同学们的项目如何才能出彩？我们为挑战杯举办的一次次交流活动例如挑战杯宣讲、项目交流等活动都能够让同学们在挑战杯的道路上顺畅前行。
          </p>
          <p>
            在这里，你能结识系内最优秀的科创大佬；在一次次活动的举办中，丰富活动组织的经验，锻炼缜密的思维；与同学们的交流中，丰富自己的见识、获取宝贵的资源。
          </p>
        </Typography>
      </TabPane>
      <TabPane
        tab={
          <span>
            <Icon type="read" />
            学培部
          </span>
        }
        key="foster"
      >
        <Typography className={styles.content}>
          <Typography.Title level={2}>学培部</Typography.Title>
          <p style={{ fontStyle: "italic" }}>
            学培部是一个关注同学们学习、科研生活的部门，新生知识竞赛和实验室采访是学培部每个学年的主要工作。学培部的工作技术门槛不高，更多的是社工性的要求和工作时间的投入。虽然进入学培部的同学们面对的工作可能与进入科协的预期有所出入，但是部门的工作也能为同学们争取到相应的资源。除了完成以上本职工作之外，部门的工作重心也放在了部员自身的发展上，一方面利用实验室采访等机会鼓励部员接触科研、提高自身学术素质，另一方面与其他部门对接，承担相应筹备和搭建工作，从而满足部员进入科协的初衷。部门工作之余也应当着重团队凝聚和沟通交流，为每一位部员尽其所需。
          </p>
          <h3>新生信息知识竞赛</h3>
          <div style={{ textAlign: "center" }}>
            <div style={{ float: "left", width: "50%" }}>
              <img
                className={styles.img}
                src="https://api.eesast.com/static/images/division-introduction-newbie-contest-1.jpg"
                alt="newbie-contest-1"
                style={{ width: "90%" }}
              />
            </div>
            <div style={{ float: "right", width: "50%" }}>
              <img
                className={styles.img}
                src="https://api.eesast.com/static/images/division-introduction-newbie-contest-2.jpg"
                alt="newbie-contest-2"
                style={{ width: "90%" }}
              />
            </div>
          </div>
          <br />
          <p>
            电子系的大一新生一入学，就有机会参与到学培部举办的新生知识竞赛，严谨又不失趣味的赛题涵盖信息世界的方方面面，信息论、微电子、计算机、通信，以及与信息学史，在比赛中学习将会让新生收获与课堂学习同样丰富的知识。
          </p>
          <p>
            新生信息知识竞赛的筹备工作主要分为三个阶段：暑假期间到学期前三周主要进行赛题准备与外联赞助工作，主要需要每一位部员在暑假期间出赛题，之后由部长进行赛题确定，组织拉赞助、赛前宣传和报名等等工作；学期第四周左右进行初赛，初赛准备需要借用教室、准备答题设备（抢答器、答题白板）、整合必要软件（PPT
            和计分软件）和进行推送海报宣传；学期第七周左右进行决赛，决赛准备与初赛准备类似，需要借用罗姆三层报告厅作为教室。在举办比赛之间还包括判赛题、进行通知等等工作。
          </p>
          <p>
            总体而言，新生信息知识竞赛为学培部工作中非常重要的一部分，需要部员集中精力进行筹备工作，此段时间内部员学业压力相对不大，相信在充足的准备下能够很好地完成此项工作。
          </p>
          <h3>实验室采访</h3>
          <p>
            电子系宽口径、厚基础，为了帮助部员以及其他同学们找到自己感兴趣的或适合自己的方向，学培部还会以实验室采访的形式，从图信、信检、通信，到线路、微波、光电，通过与各研究所老师面对面交流，为各位同学提供电子系实验室最新最全面的信息。实验室采访可以使得同学们了解各个实验室的研究方向，并且通过与老师沟通获得相应的建议，从而在科研上有更加明确的认知。
          </p>
          <p>
            实验室采访工作贯穿一整个学年，主要集中在上半学期末尾和下半学期，相对工作压力较小，工作方向需要综合考虑部员的兴趣和其他同学们的需要，并加以适当的建议和督促。
          </p>
          <h3>其他活动</h3>
          <p>
            除此之外，如果队式程序设计大赛和电子设计大赛在平台搭建或赛事筹备上有需要，鼓励部员参与到其中学习技术、做出贡献。整体一年中学培部应当重视和其他部门的对接，从而更有效率、更创造性地完成工作。
          </p>
          <p>
            在团队建设上，积极鼓励私下交流和讨论，如果有需要，进行一些资源的共享，从而在部员的学习和生活上提供更多帮助。
          </p>
        </Typography>
      </TabPane>
      <TabPane
        tab={
          <span>
            <Icon type="desktop" />
            宣策部
          </span>
        }
        key="publicity"
      >
        <Typography className={styles.content}>
          <Typography.Title level={2}>宣策部</Typography.Title>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              className={styles.img}
              src="https://api.eesast.com/static/images/division-introduction-conference-1.png"
              alt="conference-1"
              style={{ width: "20%", marginRight: 24 }}
            />
            <div>
              <p style={{ fontStyle: "italic" }}>
                宣策部负责统筹规划科协的宣传活动以及辅助大型活动的策划准备，致力于为电子系科协搭建最宽广的宣传平台。
              </p>
              <p>
                每年科协都会举办大型的比赛与活动，而我们始终是科协的第一发声口。从新生
                free
                之夜时的学生组织宣传，到学期中举行的新生知识竞赛、科创爱好者云集的科创年会、再到大家所熟知的电子设计大赛和
                AI
                挑战赛，其对内对外的外联宣传工作由我们来负责，由我们来完成。通过丰富的宣传手段，我们会用最生动有趣的形式为同学们提供全面立体的活动介绍，最大程度地激发同学们投身科创的无限热情。我们代表了科协最前沿的科创视角，最尖端的信息先驱，在宣传与策划中带给同学们最真实的全方位科技体验！
              </p>
              <p>
                来到宣策部，科创的大门将为你打开。从技术层面上讲，你的宣传技能将得到全面的训练，你将可以从零开始快速掌握视频的制作与剪辑、海报的构思与设计、推送的排版与编辑等常用宣传手法；不仅如此，你还可以通过与其他部门相互学习、协同工作，从而优先获得各部门的最新科创信息；通过与系内优秀前辈老师的积极沟通交流，匹配海量科创资源，获得全部科创咨询，培养良好的学术意识，作为第一发言人向系内乃至校内展现电子系科协的综合实力。
              </p>
              <p>
                如果你在宣传策划的过程中体会到了科创比赛的乐趣，我们也会协同其他部门为你提供丰富的资源与广阔的平台，你也完全可以参与到其他各部门比赛、活动的组织与技术开发当中去，从而全面提高综合技术水平。
                电子系科协宣策部，等待你的到来。
              </p>
            </div>
          </div>
          <div style={{ float: "left", width: "50%" }}>
            <img
              className={styles.img}
              src="https://api.eesast.com/static/images/division-introduction-conference-2.png"
              alt="conference-2"
              style={{ width: "90%" }}
            />
          </div>
          <div style={{ float: "right", width: "50%" }}>
            <img
              className={styles.img}
              src="https://api.eesast.com/static/images/division-introduction-conference-3.png"
              alt="conference-3"
              style={{ width: "90%" }}
            />
          </div>
        </Typography>
      </TabPane>
    </Tabs>
  );
};

export default DivisionPage;
