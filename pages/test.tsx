import React from "react";
import usePlans from "../hooks/usePlans";

function Test() {
  const { plans } = usePlans();
  console.log(plans);

  return <div></div>;
}

export default Test;
