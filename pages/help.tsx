import Link from "next/link";

function Help() {
  return (
    <div className="">
      <h1 className="t1 text-txt-base w-min mx-auto whitespace-nowrap mt-4">
        Contact Information
      </h1>
      <p className="card-container_no-margin max-w-lg mx-auto table">
        If you have any problem, write to the email below. Please send all the
        information that could be helpful, such as email and username.
      </p>
      <Link href="mailto:font.tester.solve@gmail.com">
        <a className="t2 text-txt-base w-min mx-auto table hover:text-primary">
          font.tester.solve@gmail.com
        </a>
      </Link>
      <p className="card-container_no-margin max-w-lg mx-auto table mt-12">
        If you have any sugestion, send it to the email below. Please send your
        username for a sending you a retribution.
      </p>
      <Link href="mailto:font.tester.app@gmail.com">
        <a className="t2 text-txt-base w-min mx-auto table hover:text-primary">
          font.tester.app@gmail.com
        </a>
      </Link>
    </div>
  );
}

export default Help;
