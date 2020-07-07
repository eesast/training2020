import { Divider, Typography, Anchor } from "antd";
import React from "react";
import styles from "./IntroPage.module.css";
const { Title, Paragraph, Text } = Typography;
const { Link } = Anchor;

const IntroPage: React.FC<{}> = () => {
  return (
    <div>
      <Typography className={styles.root}>
        <Title>Track2 净土保卫战</Title>
        <div className={styles.logos}>
          <div className={styles.logo}>
            <img
              alt="eesast"
              src="https://api.eesast.com/static/images/eesast-logo-black.png"
            />
          </div>
        </div>
        <Divider />
        <Paragraph className={styles.paragraph}>
          <Text strong>目录</Text>
          <br />
          <Anchor affix={false}>
            <Link href="#背景故事" title="背景故事" />
            <Link href="#玩法" title="玩法" />
            <Link href="#赛制" title="赛制" />
          </Anchor>
          <Title level={2} id={"背景故事"}>
            背景故事
          </Title>
          美丽的罗姆森林曾经是一片丰饶的土地，有四个原始族群在其中安居乐业。然而，随着现代工业化进程的推进，罗姆森林的土壤遭到了严重的污染，这使得四个族群的人类无法再轻易获得足够的食物。为了养活各自的族人，各族群派出了自己的“觅食者”，他们两人一组，在这一片荒凉的土地上寻找和制作食物。而由于食材的缺乏，属于不同族群的小队有时需要抢夺食材和竞争食物制作点，才能够为自己的族人带回尽量多的食物。不过，神奇的罗姆森林中也存在着一些奇妙的道具，它们中的一些具有净化土地以获取更多食物的功效。
          <br />
          这一天，来自不同族群的四支小分队来到了同一片荒地上，这里有少量的食材、道具和食物加工点。和往常一样，四支小队为食物展开了一场没有硝烟的斗争。哪支小队能够为自己的族人带回最多的食物呢？
          <br />
          <img
            src="https://api.eesast.com/static/images/ts2020-interface1.png"
            alt="界面展示1"
            height="350"
          />
          <Title level={2} id={"玩法"}>
            玩法
          </Title>
          每局游戏最多有4支队伍参加，每支队伍需要2名玩家。地图中包含墙，桌子，食材与道具产生点，灶台，垃圾桶，任务提交点等元素。每名玩家的视野为以自身为中心的一定大小的正方形地图部分。玩家能够向8个方向进行移动，并进行捡拾、投掷、使用物品等操作。
          <br />
          <img
            src="https://api.eesast.com/static/images/ts2020-interface2.png"
            alt="界面展示2"
            height="350"
          />
          <br />
          系统会定时产生食材、道具与食物制作任务。食物制作任务均有时间限制。玩家需要在地图中搜寻食材和道具，在特定的工作台上完成特定的食物加工操作，并在任务截止时间前将做好的食物提交到任务提交点，即可获得相应的积分。游戏定时进行，游戏结束时获得最多积分的队伍即为本局游戏的胜利者。
          <br />
          此外，每一种食物加工操作都有一定的时限，没有及时停止食物制作进程，或使用了不当的配方与加工方法，将会得到黑暗料理。道具根据其具体类型的不同，可用于辅助本队或干扰其他队伍。根据所选择角色的不同，不同玩家会拥有不同的天赋技能，如移动或食物制作速度提升、道具效果加成等。
          <Title level={2} id={"赛制"}>
            赛制
          </Title>
          每支队伍至多4人组队，完成游戏中同队两名玩家的两份代码。初赛阶段，玩家可在网站上上传代码和邀请其他队伍参与对战，该阶段对战积分供玩家参考，不作为复赛晋级标准。复赛阶段，玩家在截止时间前提交最终版本，主办方使用各队最终提交的代码进行多次对战，总得分最高的16支队伍进入决赛。进入决赛的队伍可以继续完善代码，在决赛截止时间前提交后，主办方使用与初赛相同的方法组织对战，决定各队的最终排名。前16名的队伍获得奖状，前8名的队伍获得奖金。
        </Paragraph>
      </Typography>
    </div>
  );
};

export default IntroPage;
