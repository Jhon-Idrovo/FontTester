import SubscriptionNeeded from "../components/SubscriptionNeeded";
import useUser from "../hooks/useUser";

function ChangePlan() {
  const { user } = useUser();
  if (user.role === "Guest") return <SubscriptionNeeded />;
  return <div></div>;
}

export default ChangePlan;
