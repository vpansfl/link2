import Link from "next/link";
import { buttonClassName } from "./button";

export default function AddLinkButton() {
  return (
    <Link href="/new" className={buttonClassName("primary", "sm")}>
      + Add Link
    </Link>
  );
}
