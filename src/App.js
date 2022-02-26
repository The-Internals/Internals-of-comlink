import BasicWorkerExample from "./BasicWorkerExample";
import MathWorkerExample from "./MathWorkerExample";
import MathRPCWorkerExample from "./MathRPCWorkerExample";
import MathComlinkExample from "./MathComlinkExample";

import "./App.css";

function App() {
  return (
    <div className="App">
      <BasicWorkerExample />
      <MathWorkerExample />
      <MathRPCWorkerExample />
      <MathComlinkExample />
    </div>
  );
}

export default App;
