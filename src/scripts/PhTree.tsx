import { Species } from "./Species";

interface PhtreeProps {
    commonAncestor: Species;
}
export const Phtree = (
    { commonAncestor }: PhtreeProps
) => {
    return (
        <div>
        <h1>{commonAncestor.name}</h1>
        </div>
    );
};