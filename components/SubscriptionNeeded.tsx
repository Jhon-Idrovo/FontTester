import Link from "next/link";

function SubscriptionNeeded() {
  return (
    <div className="container-full">
      <div className="container-full-inner">
        <p>You need a subscription to acces this </p>
        <Link href="/signup">
          <a className="btn px-2 w-min mx-auto mt-2">Join</a>
        </Link>{" "}
      </div>
    </div>
  );
}

export default SubscriptionNeeded;
