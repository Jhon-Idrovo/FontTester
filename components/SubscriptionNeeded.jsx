import Link from "next/link";

function SubscriptionNeeded() {
  return (
    <div>
      You need a subscription to acces this{" "}
      <Link href="/sign-up">
        <a className="btn px-2">Join</a>
      </Link>{" "}
    </div>
  );
}

export default SubscriptionNeeded;
