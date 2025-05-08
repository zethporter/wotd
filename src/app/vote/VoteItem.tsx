import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import type { Wrestler } from "@/schema";

const VoteItem = ({ wrestler }: { wrestler: Wrestler }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const checkboxRef = useRef<HTMLInputElement>(null);

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams],
  );
  return (
    <div
      className="border-secondary rounded-field hover:bg-secondary/20 flex w-fit items-center gap-2 p-2"
      onClick={() => checkboxRef.current?.click()}
    >
      <input
        ref={checkboxRef}
        type="checkbox"
        className="checkbox checkbox-primary checkbox-sm md:checkbox-md"
        checked={searchParams.get("id") === wrestler.id}
        onChange={(e) =>
          router.replace(
            pathname +
              "?" +
              createQueryString(
                "id",
                e.target.checked ? wrestler.id : undefined,
              ),
            {
              scroll: false,
            },
          )
        }
        onClick={() => checkboxRef.current?.click()}
      />
      <p className="text-xl font-bold md:text-2xl">{wrestler.name}</p>
      <p>{wrestler.school}</p>
    </div>
  );
};

export default VoteItem;
