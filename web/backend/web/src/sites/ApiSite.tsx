import axios from "axios";
import React, { Suspense, useEffect } from "react";
import "swagger-ui-react/swagger-ui.css";
import { Site } from "../App";
const SwaggerUI = React.lazy(() => import("swagger-ui-react"));

export interface IApiSiteProps {
  setSite: (site: Site) => void;
}

const ApiSite: React.FC<IApiSiteProps> = ({ setSite }) => {
  useEffect(() => {
    setSite("others");
  }, [setSite]);

  return (
    <Suspense fallback={null}>
      <SwaggerUI url={`${axios.defaults.baseURL}/v1/swagger.yaml`} />
    </Suspense>
  );
};

export default ApiSite;
