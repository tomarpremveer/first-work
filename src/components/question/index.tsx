import Checkbox from "../../ui/Checkbox";
import Input from "../../ui/Input";
import Loader from "../../ui/Loader";
import DeleteIcon from "./images/delete-icon.svg";
import "./index.scss";
import Select from "../../ui/Select";
import Button from "../../ui/Button";
import Number from "../../ui/Number";
import { transformElementOptions } from "../../utils";
import { FORM_ELEMENT } from "../../constants";
import { FormElement } from "../../types";
import { useEffect, useState, useRef } from "react";
import { formService } from "../../services";
import { useDebounce } from "../../utils/hooks/use-debounce";
import { formValidator } from "../form-builder/selector";

interface QuestionProps {
  onDeleteClick: (questionId: number) => void;
  question: FormElement;
  onAddValidationClick: (questionId: number) => void;
  onDeleteValidationClick: (questionId: number, validationId: number) => void;
  onQuestionOptionChange: (
    questionId: number,
    optionId: number,
    value: string
  ) => void;
  onAddOptionClick: (questionId: number) => void;
  onDeleteOptionClick: (questionId: number, optionId: number) => void;
  onQuestionChange: (questionId: number, type: string, value: any) => void;
  onValidationChange: (
    questionId: number,
    validationId: number,
    type: string,
    value: any
  ) => void;
  formId: number;
}

const QUESTION_TYPES = transformElementOptions(Object.values(FORM_ELEMENT));

export const VALIDATION_TYPES = transformElementOptions([
  "equal",
  "min",
  "max",
  "regex",
]);

export default function Question({
  onDeleteClick,
  question,
  onAddValidationClick = () => {},
  onDeleteValidationClick = () => {},
  onQuestionOptionChange = () => {},
  onAddOptionClick = () => {},
  onDeleteOptionClick = () => {},
  onQuestionChange = () => {},
  onValidationChange = () => {},
  formId,
}: QuestionProps) {
  const renderError = (error: string | undefined) => {
    return error ? <p className="error">{error} </p> : null;
  };

  const [isSaving, setIsSaving] = useState(false);
  const isFirstMount = useRef(true);

  const saveQuestion = (question: FormElement) => {
    setIsSaving(true);
    formService.updateQuestion(formId, question).then(() => {
      setIsSaving(false);
    });
  };

  const debouncedUpdate = useDebounce(saveQuestion, 300);

  useEffect(() => {
    if (!formValidator([question])[0]?.error && !isFirstMount.current) {
      debouncedUpdate(question);
    }
    isFirstMount.current = false;
  }, [question]);

  return (
    <div className="question" key={question.id}>
      <div>
        <div className="question-header">
          <div className="question-label-input">
            <Input
              placeholder="Enter your Question title"
              value={question.label || ""}
              onChange={(e) =>
                onQuestionChange(question.id, "label", e.target.value)
              }
            />
          </div>
          <div className="question-header-action">
            {isSaving && <Loader />}
            <Button onClick={() => onDeleteClick(question.id)}>
              <img src={DeleteIcon} height={20} width={20} alt="Delete" />
            </Button>
          </div>
        </div>
        {!question.label && renderError(question?.error)}
      </div>
      <div className="question-body">
        <div className="question-helper-text">
          <div className="question-helper-input">
            <Input
              placeholder="Enter helper text"
              value={question.placeholder || ""}
              onChange={(e) =>
                onQuestionChange(question.id, "placeholder", e.target.value)
              }
            />
          </div>
          <Checkbox
            checked={question.isRequired || false}
            onChange={(e) =>
              onQuestionChange(question.id, "isRequired", e.target.checked)
            }
          >
            Is Required
          </Checkbox>
        </div>
        <div className="question-type">
          <Select
            className="select"
            options={QUESTION_TYPES}
            placeholder="Question Type"
            value={question.type || ""}
            onChange={(value) => onQuestionChange(question.id, "type", value)}
          />
        </div>

        {question.type === "select" && (
          <>
            <p className="label">Select Options </p>
            <div className="select-options">
              {question.options?.map((option, index) => (
                <>
                  <div className="select-option" key={option.id}>
                    <span> {index + 1} </span>
                    <div className="value-input">
                      <Input
                        value={option.label}
                        onChange={(e) =>
                          onQuestionOptionChange(
                            question.id,
                            option.id,
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <Button
                      onClick={() =>
                        onDeleteOptionClick(question.id, option.id)
                      }
                    >
                      -
                    </Button>
                  </div>
                  <div>{renderError(option?.error)}</div>
                </>
              ))}
              {!question.options?.length && renderError(question?.error)}
              <div className="add-option-button">
                <Button onClick={() => onAddOptionClick(question.id)}>
                  Add Option
                </Button>
              </div>
            </div>
          </>
        )}

        <div className="validations">
          <p className="label">Validations</p>
          {!question.validations?.length ? (
            <Button onClick={() => onAddValidationClick(question.id)}>
              Add Validation
            </Button>
          ) : (
            <div>
              {question.validations.map((validation) => (
                <div key={validation.id} className="validation">
                  <div className="validation-elements">
                    <Select
                      className="typeSelect"
                      options={VALIDATION_TYPES}
                      value={validation.type || ""}
                      onChange={(value) =>
                        onValidationChange(
                          question.id,
                          validation.id,
                          "type",
                          value
                        )
                      }
                    />
                    <div className="valueInput">
                      {["min", "max"].includes(validation.type) ? (
                        <div className="number-input">
                          <Number
                            placeholder="Enter value"
                            value={validation.value || ""}
                            className="number-input"
                            onChange={(value) =>
                              onValidationChange(
                                question.id,
                                validation.id,
                                "value",
                                value
                              )
                            }
                          />
                        </div>
                      ) : (
                        <Input
                          placeholder="Enter value"
                          value={validation.value || ""}
                          onChange={(e) =>
                            onValidationChange(
                              question.id,
                              validation.id,
                              "value",
                              e.target.value
                            )
                          }
                        />
                      )}
                    </div>
                    <div className="messageInput">
                      <Input
                        placeholder="Enter message"
                        value={validation.message || ""}
                        onChange={(e) =>
                          onValidationChange(
                            question.id,
                            validation.id,
                            "message",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="validation-action-buttons">
                      <Button
                        onClick={() =>
                          onDeleteValidationClick(question.id, validation.id)
                        }
                      >
                        -
                      </Button>
                    </div>
                  </div>

                  {(!validation.value || !validation.message) && (
                    <div className="validation-error">
                      {renderError(validation.error)}{" "}
                    </div>
                  )}
                </div>
              ))}
              <div className="add-validation-button">
                <Button onClick={() => onAddValidationClick(question.id)}>
                  Add Validation
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
