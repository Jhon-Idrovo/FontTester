import PlanSelection from "../components/PlanSelection";
import SubscriptionNeeded from "../components/SubscriptionNeeded";
import useUser from "../hooks/useUser";

function ChangePlan() {
  const { user } = useUser();
  if (user.role === "Guest") return <SubscriptionNeeded />;
  return (
    <div>
      <PlanSelection></PlanSelection>
    </div>
  );
}

export default ChangePlan;
