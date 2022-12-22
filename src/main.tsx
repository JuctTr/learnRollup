import React from "react";
import ReactDOM from "react-dom/client";
import { a } from "@common/demo"; // tsconfig.json添加了path，所以不会声明找不到的报错
console.log(a);

// import "./index.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <h1>Rollup + React + TS</h1>
    </React.StrictMode>
);
