import { ReactNode } from 'react';

import {
  CommonClassesInterface,
  fileClassesInterface,
  FundingFormFieldType,
  InputFieldType
} from '../../utils/types';
import CheckBoxController from './Checkbox';
import DateController from './Date';
import DropdownController from './Dropdown';
import FileController from './FileInput';
import InputController from './Input';
import MultiCheckBoxController from './MultiCheckbox';
import PasswordController from './Password';
import RadioButtonController from './RadioButton';
import RangeController from './RangeBar';
import TextAreaController from './TextArea';

class FieldRenderer {
  private inputFields: InputFieldType[];
  private classes: fileClassesInterface;
  private schema;

  constructor(
    inputFields: InputFieldType[] = [],
    classes: fileClassesInterface,
    schema
  ) {
    this.inputFields = inputFields;
    this.classes = classes;
    this.schema = schema;
  }

  public renderField(
    key: string[] | string,
    propClasses?:
      | Partial<FundingFormFieldType>
      | CommonClassesInterface
      | { onClick?: () => void }
  ): ReactNode {
    if (Array.isArray(key)) {
      return key.map(item => {
        return this.renderField(item, propClasses);
      });
    } else {
      const metaData = this.inputFields.find(i => {
        return i?.name === key;
      });

      const fieldValidationRules = this.schema.fields[key];
      const showAsterisk =
        fieldValidationRules &&
        metaData.label &&
        fieldValidationRules.tests.some(
          test => test.OPTIONS?.name === 'required'
        );

      const fileClasses = Object.assign(
        {},
        this.classes[metaData?.type] || {},
        propClasses || {}
      );

      const classMetaData = {
        isRequired: showAsterisk,
        ...fileClasses,
        ...metaData
      };

      if (metaData) {
        if (
          metaData.type === 'text' ||
          metaData.type === 'email' ||
          metaData.type === 'tel' ||
          metaData.type === 'number'
        ) {
          return <InputController key={key} metaData={classMetaData} />;
        } else if (metaData.type === 'password') {
          return <PasswordController key={key} metaData={classMetaData} />;
        } else if (metaData.type === 'range') {
          return <RangeController key={key} metaData={classMetaData} />;
        } else if (metaData.type === 'textarea') {
          return <TextAreaController metaData={classMetaData} />;
        } else if (metaData.type === 'dropdown') {
          return <DropdownController key={key} metaData={classMetaData} />;
        } else if (metaData.type === 'checkbox') {
          return <CheckBoxController metaData={classMetaData} />;
        } else if (metaData.type === 'multiCheckbox') {
          return <MultiCheckBoxController metaData={classMetaData} />;
        } else if (metaData?.type === 'radioButton') {
          return <RadioButtonController metaData={classMetaData} />;
        } else if (metaData.type === 'file') {
          return <FileController metaData={classMetaData} />;
        } else if (metaData.type === 'date') {
          return <DateController metaData={classMetaData} />;
        }
      }
    }
  }

  public updateConstant(constant) {
    this.inputFields = constant;
  }
  public updatePriConstant(constant) {
    this.inputFields = constant;
  }
  public getConstant() {
    return this.inputFields;
  }
}

export default FieldRenderer;
