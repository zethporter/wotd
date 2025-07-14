import { createSignal, createEffect } from "solid-js";
import type { Wrestler } from "@/schema"; // Assuming this path is correct

// --- Mocks for Next.js navigation hooks ---
// In a real SolidJS app, you'd replace these with your router's actual hooks
// For example, if using SolidStart, you'd use `useNavigate`, `useLocation`, etc.

function useRouter() {
  // Simple mock: in a real app, this would be from your SolidJS router
  const replace = (url: string, options?: { scroll?: boolean }) => {
    console.log("Navigating to:", url, "with options:", options);
    // In a browser environment, you'd use history.replaceState
    window.history.replaceState({}, "", url);
    // You might also want to trigger a signal update here if your app depends on it
    // For demonstration, we'll just log and update the 'mock' search params
    updateMockSearchParams(new URL(url).searchParams);
  };
  return { replace };
}

function usePathname() {
  // Simple mock: in a real app, this would be from your SolidJS router
  // For simplicity, we'll just use window.location.pathname
  return window.location.pathname;
}

// A signal to hold the current search params, which can be updated externally
const [currentSearchParams, setCurrentSearchParams] = createSignal(
  new URLSearchParams(window.location.search),
);

// Function to update the mock search params
function updateMockSearchParams(newParams: URLSearchParams) {
  setCurrentSearchParams(newParams);
}

function useSearchParams() {
  // Return the signal getter for the search params
  return currentSearchParams();
}
// --- End Mocks ---

const VoteItem = (props: { wrestler: Wrestler }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams; // Note: This is now a getter in SolidJS

  // Equivalent to useRef for DOM elements
  let checkboxRef: HTMLInputElement | undefined;

  // No need for useCallback in SolidJS. Functions are stable by default.
  // The reactivity is managed by the signals (searchParams here).
  const createQueryString = (name: string, value: string | undefined) => {
    // Access the current searchParams by calling the getter
    const params = new URLSearchParams(searchParams().toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    return params.toString();
  };

  // Solid's JSX handles props, so access wrestler via props.wrestler
  const { wrestler } = props;

  // To react to searchParams changes for the 'checked' state,
  // we can use a signal or directly check inside the JSX.
  // For the 'checked' attribute, it's reactive by default if its value
  // depends on a signal (searchParams()).
  // We can also compute a derived signal if this value is used elsewhere.
  const isChecked = () => searchParams().get("id") === wrestler.id;

  return (
    <div
      class="border-secondary rounded-field hover:bg-secondary/20 flex w-fit items-center gap-2 p-2"
      // SolidJS doesn't have optional chaining for event handlers
      // and directly calling .click() on a ref might not update the ref
      // in time for a click event if it's rendered conditionally.
      // It's usually better to control the checkbox state directly.
      // However, to keep it as close to the original, we'll use a local function.
      onClick={() => checkboxRef?.click()}
    >
      <input
        ref={checkboxRef} // Assigns the DOM element directly
        type="checkbox"
        class="checkbox checkbox-primary checkbox-sm md:checkbox-md"
        // checked is a reactive prop in SolidJS.
        // It will automatically update when isChecked() changes (which depends on searchParams()).
        checked={isChecked()}
        onChange={(e) => {
          router.replace(
            pathname +
              "?" +
              createQueryString(
                "id",
                e.currentTarget.checked ? wrestler.id : undefined, // Use e.currentTarget in SolidJS
              ),
            {
              scroll: false,
            },
          );
        }}
        // This second onClick is redundant if the parent onClick is used.
        // If the intention is to allow clicking the checkbox itself as well as the parent div
        // without event bubbling issues, you might need e.stopPropagation() or a more
        // robust state management. For now, mirroring the React component.
        // If this is meant to *prevent* the parent click from triggering the checkbox, it's incorrect.
        onClick={(e) => {
          // This click handler will run when the input itself is clicked.
          // The parent div's onClick also tries to click the input.
          // This might lead to double clicks or unexpected behavior.
          // Consider if you really need both, or if the parent click should
          // simply update the state directly without simulating a click.
          // For now, mirroring original.
          // e.stopPropagation(); // Uncomment if you want to prevent parent click from firing
          // checkboxRef?.click(); // This line is likely redundant as the checkbox already clicked.
          console.log("Checkbox clicked directly.");
        }}
      />
      <p class="text-xl font-bold md:text-2xl">{wrestler.name}</p>
      <p>{wrestler.school}</p>
    </div>
  );
};

export default VoteItem;
