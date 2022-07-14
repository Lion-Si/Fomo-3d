import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Invite = () => {
  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {
    console.log(router.query);

    router.push({
      pathname: "/about",
      query: { code: code },
    });
  }, []);

  return (
    <>
      <h1 style={{ marginTop: "6rem" }}>Invite Code: {code}</h1>
      <ul>
        <li>
          <Link href="/[code]/[comment]" as={`/${code}/first-comment`}>
            <a>First comment</a>
          </Link>
        </li>
        <li>
          <Link href="/[code]/[comment]" as={`/${code}/second-comment`}>
            <a>Second comment</a>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default Invite;
