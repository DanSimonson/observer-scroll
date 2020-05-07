import React from "react";
import "./App.css";
const allData = new Array(25).fill(0).map((_val, i) => i + 1);
const perPage = 10;
const types = {
  start: "START",
  loaded: "LOADED",
};

const reducer = (state, action) => {
  switch (action.type) {
    case types.start:
      return { ...state, loading: true };
    case types.loaded:
      return {
        ...state,
        loading: false,
        data: [...state.data, ...action.newData],
        more: action.newData.length === perPage,
        after: state.after + action.newData.length,
      };
    default:
      throw new Error("Don't understand action");
  }
};

function App() {
  const [state, dispatch] = React.useReducer(reducer, {
    loading: false,
    more: true,
    data: [],
    after: 0,
  });
  const { loading, data, after, more } = state;

  const observer = React.useRef(
    new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        console.log(first);
        if (first.isIntersecting) {
          loader.current();
        }
      },
      { threshold: 1 }
    )
  );

  const [element, setElement] = React.useState(null);

  const load = () => {
    dispatch({ type: types.start });

    setTimeout(() => {
      const newData = allData.slice(after, after + perPage);
      dispatch({ type: types.loaded, newData });
    }, 300);
  };

  const loader = React.useRef(load);

  React.useEffect(() => {
    loader.current = load;
  });

  React.useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;
    if (currentElement) {
      currentObserver.observe(currentElement);
    }
    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [element]);

  return (
    <div className="App">
      <ul>
        {data.map((row) => (
          <li key={row} style={{ background: "blue" }}>
            {row}
          </li>
        ))}

        {loading && <li>Loading...</li>}

        {!loading && more && (
          <li ref={setElement} style={{ background: "transparent" }}></li>
        )}
      </ul>
    </div>
  );
}

export default App;
