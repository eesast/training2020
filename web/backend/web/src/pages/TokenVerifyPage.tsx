import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyToken } from "../redux/actions/auth";

const TokenVerifyPage: React.FC = (props) => {
  const history = useHistory();
  const { token } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(verifyToken(token!));
    history.push("/teamstyle/intro");
  }, [dispatch, history, token]);

  return <div>VERIFY TOKEN PAGE</div>;
};

export default TokenVerifyPage;
