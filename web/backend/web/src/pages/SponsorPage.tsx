import { Typography, Divider } from "antd";
import React from "react";
import styles from "./SponsorPage.module.css";

const { Title, Paragraph } = Typography;

const SponsorPage: React.FC<{}> = () => {
  return (
    <div>
      <Typography className={styles.root}>
        <Title>赞助商：商汤科技</Title>
        <Divider />
        <Paragraph className={styles.paragraph}>
          作为全球领先的人工智能平台公司，商汤科技SenseTime是中国科技部指定的“智能视觉”国家新一代人工智能开放创新平台。同时，商汤科技也是全球总融资额及估值最高的人工智能创新企业。
        </Paragraph>
        <Paragraph className={styles.paragraph}>
          商汤科技以“坚持原创，让AI引领人类进步”为愿景，自主研发并建立了全球顶级的深度学习平台和超算中心，推出一系列领先的人工智能技术，包括：人脸识别、图像识别、文本识别、医疗影像识别、视频分析、无人驾驶和遥感等，并已与国内外700多家世界知名的企业和机构建立合作，在多个垂直领域的市场占有率位居首位，成为亚洲最大的AI算法提供商。
        </Paragraph>
        <Paragraph className={styles.paragraph}>
          商汤科技集合了来自学术界和产业界的顶级人才推动最先进的AI研究，与国内外多所大学建立联合实验室或开展科研合作的同时，积极与全球学术界保持密切合作。商汤科技拥有亚洲领先的深度学习研究团队，其中200多位拥有顶尖大学授予的博士学位，核心团队具有20年的科研经验。
        </Paragraph>
        <Paragraph className={styles.paragraph}>
          商汤科技创始人汤晓鸥所创办的香港中文大学多媒体实验室，是亚洲唯一入选的世界十大人工智能先锋实验室。2014年，商汤团队发表DeepID系列人脸识别算法击败Facebook，全球首次超过人眼识别率。
        </Paragraph>
        <Paragraph className={styles.paragraph}>
          更多商汤科技最新学术进展资讯，敬请关注商汤泰坦公开课。
        </Paragraph>
        <div
          style={{
            display: "flex",
            justifyItems: "space-around",
            alignItems: "center",
          }}
        >
          <img
            alt="sensetime-titan"
            src="https://api.eesast.com/static/images/sensetime-titan-qrcode.png"
            style={{ maxWidth: 700, width: "70%", margin: "8px auto" }}
          />
          <img
            src="https://api.eesast.com/static/images/sensetime-logo.png"
            alt="sensetime-logo"
            style={{ maxWidth: 200, width: "20%", margin: "8px auto" }}
          />
        </div>
      </Typography>
    </div>
  );
};

export default SponsorPage;
