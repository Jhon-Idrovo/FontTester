import Link from "next/link";

function SubscriptionNeeded() {
  return (
    <div className="container-full">
      <div className="container-full-inner">
        <p>You need an account to acces this </p>
        <Link href="/signup">
          <a className="btn px-2 w-min mx-auto mt-2 whitespace-nowrap">
            Join For Free
          </a>
        </Link>{" "}
      </div>
    </div>
  );
}

export default SubscriptionNeeded;
