import { Button, Result } from "antd";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Site } from "../App";

export interface INotFoundSiteProps {
  setSite: (site: Site) => void;
}

const NotFoundSite: React.FC<INotFoundSiteProps> = ({ setSite }) => {
  useEffect(() => {
    setSite("others");
  }, [setSite]);

  return (
    <Result
      status="404"
      title="404"
      subTitle="您所访问的页面不存在"
      extra={
        <Button type="primary">
          <Link to="/home">返回首页</Link>
        </Button>
      }
    />
  );
};

export default NotFoundSite;
