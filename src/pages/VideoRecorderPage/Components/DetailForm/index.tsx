import {
  Accordion,
  AccordionItem,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { GENDERS } from "../../../../utils/Constants";

function DetailForm() {
  return (
    <div>
      <Accordion
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
              className="max-w-xs"
            />
            <Input
              type="date"
              label="Date of Birth"
              variant="flat"
              placeholder="Select Date of Birth"
              isRequired
              className="max-w-xs"
            />
            <Select label="Gender" className="max-w-xs">
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
