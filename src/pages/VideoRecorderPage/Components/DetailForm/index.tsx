import {
  Accordion,
  AccordionItem,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { GENDERS } from "../../../../utils/constants";
import React from "react";

interface DetailFormProps {
  isDisabled: boolean;
  patientName: string;
  showNameError: boolean;
  showGenderError: boolean;
  setPatientName: React.Dispatch<React.SetStateAction<string>>;
  gender: string;
  setGender: React.Dispatch<React.SetStateAction<string>>;
  dateOfBirth: string;
  setDateOfBirth: React.Dispatch<React.SetStateAction<string>>;
  setShowGenderError: React.Dispatch<React.SetStateAction<boolean>>;
}

function DetailForm({
  isDisabled,
  patientName,
  gender,
  dateOfBirth,
  showNameError,
  showGenderError,
  setPatientName,
  setGender,
  setDateOfBirth,
  setShowGenderError,
}: DetailFormProps) {
  return (
    <div>
      <Accordion
        isDisabled={isDisabled}
        variant="shadow"
        itemClasses={{
          titleWrapper: "flex-none",
          trigger: "flex items-center justify-center",
        }}
      >
        <AccordionItem
          key="1"
          aria-label="patient-detail"
          title="Patient Detail"
        >
          <div className="flex justify-center w-full gap-4">
            <Input
              type="text"
              label="Name"
              variant="flat"
              isRequired
              isInvalid={showNameError && !patientName.length}
              errorMessage={
                showNameError && !patientName.length ? "Please enter Name." : ""
              }
              className="max-w-xs"
              value={patientName}
              onValueChange={setPatientName}
            />
            <Input
              type="date"
              label="Date of Birth"
              variant="flat"
              placeholder="Select Date of Birth"
              className="max-w-xs"
              value={dateOfBirth}
              onValueChange={setDateOfBirth}
            />
            <Select
              label="Gender"
              className="max-w-xs"
              isRequired
              isInvalid={showGenderError}
              errorMessage={showGenderError ? "Please select gender." : ""}
              selectedKeys={[gender]}
              onChange={(e) => {
                setGender(e.target.value);
                setShowGenderError(false);
              }}
            >
              {GENDERS.map((gender) => (
                <SelectItem key={gender.value} value={gender.value}>
                  {gender.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default DetailForm;
