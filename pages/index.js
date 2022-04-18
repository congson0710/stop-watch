import { useState, useEffect, useReducer, useCallback } from "react";

const getNow = () => Date.now();

const ACTION_TYPES = {
  START: "start",
  CONTINUE: "continue",
  PAUSE: "pause",
  RESUME: "resume",
};

const WATCH_STATUSES = {
  INITIAL: "initial",
  RUNNING: "running",
  PAUSED: "paused",
};

const lapBtnTextMap = {
  initial: "Lap",
  running: "Lap",
  paused: "Reset",
};

const actionBtnTextMap = {
  initial: "Start",
  running: "Pause",
  paused: "Resume",
};

const initialState = {
  status: "initial",
  laps: [],
  idleTime: 0,
  startTime: 0,
  endTime: 0,
};

const formatDuration = (durationMs) => {
  const hh = String(Math.floor(durationMs / 1000 / 60 / 60)).padStart(2, "0");
  const mm = String(Math.floor(durationMs / 1000 / 60) % 60).padStart(2, "0");
  const ss = String(Math.floor(durationMs / 1000) % 60).padStart(2, "0");
  const ms = String(durationMs % 1000).padStart(3, "0");

  return {
    hh,
    mm,
    ss,
    ms,
  };
};

const watchReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case ACTION_TYPES.START: {
      return {
        ...state,
        ...payload,
      };
    }
    case ACTION_TYPES.CONTINUE: {
      return {
        ...state,
        ...payload,
      };
    }
    case ACTION_TYPES.PAUSE: {
      return {
        ...state,
        ...payload,
      };
    }
    case ACTION_TYPES.RESUME: {
      return {
        ...state,
        ...payload,
      };
    }
    case ACTION_TYPES.RESET: {
      return {
        ...state,
        ...payload,
      };
    }
    default:
      return state;
  }
};

const handleOnClick = (state, dispatch) => {
  switch (state.status) {
    case WATCH_STATUSES.INITIAL: {
      dispatch({
        type: ACTION_TYPES.START,
        payload: {
          status: WATCH_STATUSES.RUNNING,
          startTime: getNow(),
          endTime: getNow(),
        },
      });
      break;
    }
    case WATCH_STATUSES.RUNNING: {
      dispatch({
        type: ACTION_TYPES.PAUSE,
        payload: {
          status: WATCH_STATUSES.PAUSED,
          endTime: getNow() - state.idleTime,
        },
      });
      break;
    }
    case WATCH_STATUSES.PAUSED: {
      dispatch({
        type: ACTION_TYPES.RESUME,
        payload: {
          status: WATCH_STATUSES.RUNNING,
          idleTime: getNow() - state.endTime,
        },
      });
      break;
    }
    default: {
      () => {};
      break;
    }
  }
};

const handleOnLap = (state, dispatch) => {
  switch (state.status) {
    case WATCH_STATUSES.RUNNING: {
      dispatch({
        type: ACTION_TYPES.CONTINUE,
        payload: {
          laps: [state.endTime - state.startTime, ...state.laps].slice(0, 9),
        },
      });
      break;
    }
    case WATCH_STATUSES.PAUSED: {
      dispatch({
        type: ACTION_TYPES.RESET,
        payload: {
          ...initialState,
        },
      });
      break;
    }
    default: {
      () => {};
      break;
    }
  }
};

const useStopWatchState = () => {
  const [state, dispatch] = useReducer(watchReducer, initialState);
  const onClick = useCallback(() => handleOnClick(state, dispatch), [state]);
  const onLap = useCallback(() => handleOnLap(state, dispatch), [state]);

  useEffect(() => {
    let id;

    const repaint = () => {
      if (state.status === WATCH_STATUSES.RUNNING) {
        dispatch({
          type: ACTION_TYPES.CONTINUE,
          payload: { endTime: getNow() - state.idleTime },
        });
      }
      id = requestAnimationFrame(repaint);
    };

    repaint();

    return () => {
      cancelAnimationFrame(id);
    };
  }, [state.status]);

  return {
    status: state.status,
    durationMs: state.endTime - state.startTime,
    laps: state.laps,
    onClick,
    onLap,
  };
};

const Duration = ({ durationMs }) => {
  const { hh, mm, ss, ms } = formatDuration(durationMs);

  return (
    <div>
      <code>
        <span>{hh}</span>:<span>{mm}</span>:<span>{ss}</span>.<span>{ms}</span>
      </code>
    </div>
  );
};

const Laps = ({ items = [] }) => (
  <ul>
    {items.map((durationMs) => (
      <li key={durationMs}>
        <Duration durationMs={durationMs} />
      </li>
    ))}
  </ul>
);

const StopWatch = ({ status, laps, durationMs, onClick, onLap }) => (
  <section
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div>
      <div
        style={{
          border: "1px solid",
          borderRadius: "4px",
          padding: "8px",
        }}
      >
        <h4 style={{ textAlign: "center", margin: "8px 0" }}>{status}</h4>
        <Duration durationMs={durationMs} />
        <footer style={{ textAlign: "center", margin: "8px 0" }}>
          <button onClick={onLap}>{lapBtnTextMap[status]}</button>
          <button onClick={onClick}>{actionBtnTextMap[status]}</button>
        </footer>
      </div>
      <Laps items={laps} />
    </div>
  </section>
);

const App = () => {
  const { status, durationMs, onClick, onLap, laps } = useStopWatchState();

  return (
    <StopWatch
      status={status}
      laps={laps}
      durationMs={durationMs}
      onLap={onLap}
      onClick={onClick}
    />
  );
};

export default App;
