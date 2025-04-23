import type { Wrestler } from "@/schema";

const VoteItem = ({ wrestler }: { wrestler: Wrestler }) => {
  return (
    <div className="flex gap-2">
      <p>{wrestler.name}</p>
      <p>{wrestler.school}</p>
      <p>{wrestler.id}</p>
    </div>
  );
};

export default VoteItem;
