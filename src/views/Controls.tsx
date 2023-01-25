import { useStore } from "../stores/store";
import { useEffect } from "preact/hooks";
import { useState } from "preact/compat";

const Controls = () => {
  type TStatus = { alive: number; dead: number; total: number };
  const [status, setStatus] = useState<TStatus>({
    alive: 0,
    dead: 0,
    total: 0,
  });

  const {
    inSetup,
    isRunning,
    isStable,
    universe,
    generation,
    setIsRunning,
    setInSetup,
    setIsStable,
    setNewUniverse,
  } = useStore((state) => state);

  const onNewClick = () => {
    setIsRunning(false);
    setInSetup(false);
    setIsStable(false);
    setNewUniverse();
  };

  const universeJSON = JSON.stringify(universe);
  useEffect(() => {
    const status = universe.reduce(
      (status, row) => {
        return row.reduce((status, cell) => {
          if (cell) {
            status.alive++;
          } else {
            status.dead++;
          }
          status.total++;
          return status;
        }, status);
      },
      { alive: 0, dead: 0, total: 0 }
    );
    setStatus(status);
  }, [universeJSON]);

  const onSetupClick = () => {
    setInSetup(!inSetup);
  };

  const onStartClick = () => {
    setIsRunning(true);
  };

  return (
    <div className="row text-center">
      <div className="col d-grid gap-2">
        <button className="btn btn-primary" onClick={onSetupClick}>
          {inSetup ? "Play" : "Setup"}
        </button>
        <button className="btn btn-primary" onClick={onNewClick}>
          New Universe
        </button>
        <button
          className={isRunning ? "btn btn-danger" : "btn btn-success"}
          onClick={onStartClick}
          disabled={isStable}
        >
          {isRunning ? "Pause" : isStable ? "Finished" : "Start"}
        </button>
        {inSetup ? "abc" : null}
      </div>
      <div className="status">
        <h5
          className={
            isStable ? "population-status stable" : "population-status unstable"
          }
        >
          {isStable ? "Population is stable" : "Population is unstable"}
        </h5>
        <h5>Alive: {((status.alive / status.total) * 100).toFixed(2)}%</h5>
        <h5>Dead: {((status.dead / status.total) * 100).toFixed(2)}%</h5>
        <h5>Generation {generation}</h5>
      </div>
    </div>
  );
};

export default Controls;
