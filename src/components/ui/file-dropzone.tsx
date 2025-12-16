import { useDroppable } from "@dnd-kit/core";

export const Droppable = () => {
  const { setNodeRef } = useDroppable({
    id: "file-dropzone",
  });

  return (
    <div ref={setNodeRef}>
      <p>Drop Files here</p>
    </div>
  );
};
