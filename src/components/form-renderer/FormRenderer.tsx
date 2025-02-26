import Button from "../../ui/Button";
import { useEffect, useState } from "react";
import { formService } from "../../services";
import Input from "../../ui/Input";
import Number from "../../ui/Number";
import Select from "../../ui/Select";
import "./index.scss";
import { FormElement } from "../../types";
import { validateElement } from "./selector";

export default function FormRenderer() {
  const [isLoading, setIsLoading] = useState(false);
  const [formConfig, setFormConfig] = useState<FormElement[]>([]);
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    setIsLoading(true);
    formService
      .getForm()
      .then((response) => {
        const formElements: FormElement[] = response.formElements || [];
        setFormConfig(formElements);

        const initialValues: { [key: string]: any } = {};
        formElements.forEach((element) => {
          initialValues[element.id] = "";
        });
        setIsLoading(false);

        setFormValues(initialValues);
      })
      .catch((err) => {
        console.error("Error ", err);
        setIsLoading(false);
      });
  }, []);

  const handleInputChange = (id: number, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
    validateForm();
  };

  const validateForm = () => {
    const newErrors: Record<string, string | null> = {};
    formConfig.forEach((element) => {
      newErrors[element.id] = validateElement(element, formValues[element.id]);
    });

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === null);
  };

  const handleSubmitClick = () => {
    if (validateForm()) {
      console.log("Form submitted:", formValues);
      alert("Form submitted successfully!");
    } else {
      alert("Please fix the errors before submitting.");
    }
  };

  const renderError = (elementId: number) => {
    return errors[elementId] ? (
      <p className="error">{errors[elementId]} </p>
    ) : null;
  };

  if (isLoading) {
    return <p>Loading... </p>;
  }

  const renderElement = (element: FormElement) => {
    switch (element.type) {
      case "email":
        return (
          <>
            <Input
              placeholder={element.placeholder}
              required={element.isRequired}
              type="email"
              value={formValues[element.id]}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
            />
            {renderError(element.id)}
          </>
        );
      case "number":
        return (
          <>
            <Number
              placeholder={element.placeholder}
              required={element.isRequired}
              value={formValues[element.id]}
              onChange={(value) => handleInputChange(element.id, value)}
            />
            {renderError(element.id)}
          </>
        );
      case "select":
        return (
          <>
            <Select
              options={element.options}
              placeholder={element.placeholder}
              className="selectElement"
              value={formValues[element.id]}
              onChange={(value) => handleInputChange(element.id, value)}
            />
            {renderError(element.id)}
          </>
        );
      default:
        return (
          <div className="input-renderer">
            <Input
              placeholder={element.placeholder}
              required={element.isRequired}
              type="text"
              value={formValues[element.id]}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
            />
            {renderError(element.id)}
          </div>
        );
    }
  };

  return (
    <div className="form-renderer">
      <div className="form-elements-container">
        {formConfig.map((element) => (
          <div key={element.id} className="form-element">
            <p className="question-label">
              {element.label} {element.isRequired ? "(*)" : ""}
            </p>
            {renderElement(element)}
          </div>
        ))}
      </div>
      <div className="submit-button">
        <Button onClick={handleSubmitClick}>Submit</Button>
      </div>
    </div>
  );
}
