import { usePageTracking } from "../utilities/preact-google-analytics";
import Controls from "./Controls";
import Universe from "./Universe";
import { useInterval } from "../hooks/useInterval";
import { useStore } from "../stores/store";

function App() {
  usePageTracking();

  const { inSetup, generateNextState, toggleCell } = useStore((state) => state);
  useInterval(() => generateNextState(), 1000);

  const onToggleClick = (evt: MouseEvent) => {
    if (!inSetup) return;
    const target = evt.target as HTMLElement;
    const row = parseInt(target.getAttribute("data-row") || "0");
    const col = parseInt(target.getAttribute("data-col") || "0");
    toggleCell(row, col);
  };

  return (
    <>
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-12">
              <h1 class="text-center">Conway's Game of Life!</h1>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-9">
              <Universe onToggleClick={onToggleClick} />
            </div>
            <div class="col-md-3">
              <Controls />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
