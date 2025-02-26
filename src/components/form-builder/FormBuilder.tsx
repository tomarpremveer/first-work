import { useState, useMemo } from "react";
import "./index.scss";
import Button from "../../ui/Button";
import { generateRandomSixDigit } from "../../utils/";
import Question from "../question";
import { formService } from "../../services";
import { FormElement, ValidationType } from "../../types";
import { formValidator } from "./selector";
import { useNavigate } from "react-router-dom";

const DEFAULT_NEW_ELEMENT: FormElement = {
  type: "text",
  label: "",
  options: [],
  isRequired: false,
  placeholder: "",
  defaultValue: "",
  id: generateRandomSixDigit(),
  isActive: true,
  error: "",
};

const DEFAULT_VALIDATION: ValidationType = {
  type: "equal",
  value: "",
  message: "",
  id: generateRandomSixDigit(),
};

export const FormBuilder = () => {
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const navigate = useNavigate();
  const formId = useMemo(() => generateRandomSixDigit(), []);

  const handleAddButtonClick = () => {
    const newQuestion = {
      ...DEFAULT_NEW_ELEMENT,
      id: generateRandomSixDigit(),
      options: [],
    };
    formService.addQuestion(formId, newQuestion).then(() => {
      setFormElements((prev) => [...prev, newQuestion]);
    });
  };

  const handleSaveClick = async () => {
    if (formElements.length === 0) {
      return;
    }

    const validatedElements = formValidator(formElements);
    setFormElements(validatedElements);

    if (validatedElements.some((el) => el.error)) {
      return;
    }

    formService
      .saveForm(formId, validatedElements)
      .then(() => {
        alert("Saved successfully");
        navigate("/form-render");
      })
      .catch((error) => {
        alert("Error saving form");
      });
  };

  const onDeleteQuestionClick = (questionId: number) => {
    formService.deleteQuestion(formId, questionId).then(() => {
      setFormElements((prev) => prev.filter(({ id }) => id !== questionId));
    });
  };

  const onDeleteValidationClick = (
    questionId: number,
    validationId: number
  ) => {
    setFormElements((prev) =>
      prev.map((element) =>
        element.id === questionId
          ? {
              ...element,
              validations:
                element.validations?.filter(
                  (validation) => validation.id !== validationId
                ) || [],
            }
          : element
      )
    );
  };

  const onAddValidationClick = (questionId: number) => {
    setFormElements((prev) =>
      prev.map((element) =>
        element.id === questionId
          ? {
              ...element,
              validations: [
                ...(element.validations ?? []),
                { ...DEFAULT_VALIDATION, id: generateRandomSixDigit() },
              ],
            }
          : element
      )
    );
  };

  const handleValidationChange = (
    questionId: number,
    validationId: number,
    field: string,
    newValue: any
  ) => {
    setFormElements((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              validations: (q.validations ?? []).map((validation) =>
                validation.id === validationId
                  ? { ...validation, [field]: newValue }
                  : validation
              ),
            }
          : q
      )
    );
  };

  const onQuestionOptionChange = (
    questionId: number,
    optionId: number,
    newValue: string
  ) => {
    console.log("dfs", optionId, newValue, optionId);
    setFormElements((prev) =>
      prev.map((element) =>
        element.id === questionId
          ? {
              ...element,
              options: (element.options ?? []).map((option) =>
                option.id === optionId ? { ...option, label: newValue } : option
              ),
            }
          : element
      )
    );
  };

  const onQuestionChange = (questionId: number, field: string, value: any) => {
    setFormElements((prev) =>
      prev.map((element) =>
        element.id === questionId ? { ...element, [field]: value } : element
      )
    );
  };

  const onAddOptionClick = (questionId: number) => {
    setFormElements((prev) =>
      prev.map((element) =>
        element.id === questionId
          ? {
              ...element,
              options: [
                ...(element.options ?? []),
                { id: generateRandomSixDigit(), label: "" },
              ],
            }
          : element
      )
    );
  };

  const onDeleteOptionClick = (questionId: number, optionId: number) => {
    setFormElements((prev) =>
      prev.map((element) =>
        element.id === questionId
          ? {
              ...element,
              options:
                element.options?.filter((option) => option.id !== optionId) ||
                [],
            }
          : element
      )
    );
  };

  return (
    <div className="form-builder">
      <div className="form-elements">
        {formElements.map((element) => (
          <Question
            key={element.id}
            onDeleteClick={onDeleteQuestionClick}
            question={element}
            onAddValidationClick={onAddValidationClick}
            onDeleteValidationClick={onDeleteValidationClick}
            onQuestionOptionChange={onQuestionOptionChange}
            onAddOptionClick={onAddOptionClick}
            onDeleteOptionClick={onDeleteOptionClick}
            onQuestionChange={onQuestionChange}
            onValidationChange={handleValidationChange}
            formId={formId}
          />
        ))}
      </div>

      <div className="form-builder-action-buttons">
        <div className="add-button">
          <Button onClick={handleAddButtonClick}>Add Question</Button>
        </div>
        {!!formElements.length && (
          <div className="add-button">
            <Button
              onClick={handleSaveClick}
              disabled={formElements.length === 0}
            >
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
