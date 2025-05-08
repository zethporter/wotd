import Link from "next/link";

export default function InvalidId() {
  return (
    <div className="flex h-dvh w-full flex-col justify-center gap-5 p-10">
      <h1 className="text-primary w-full text-center text-4xl font-bold text-wrap">
        Oops Looks like you used an invalid link or Code
      </h1>
      <div
        role="alert"
        className="alert alert-warning alert-soft mx-auto w-2/3"
      >
        Please double check your email and click on the link. You can also
        request a new link
        <Link href={"/"} className="link">
          here
        </Link>
      </div>
    </div>
  );
}
