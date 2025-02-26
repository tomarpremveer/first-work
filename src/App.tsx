import "./styles.css";
import { FormBuilder } from "./components/form-builder/";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FormRenderer from "./components/form-renderer/FormRenderer";
/*
Form Builder -> 
  UI for add Elements
  Auto Save 
  Saving whole Form With validations

Form Renderer
  UI for rendering form
*/

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormBuilder />} />
        <Route path="/form-render" element={<FormRenderer />} />
      </Routes>
    </Router>
  );
}
