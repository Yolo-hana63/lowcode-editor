import { Form, Input, Select } from "antd";
import { useComponentsStore } from "../../../stores/components";
import { useEffect } from "react";
import {
  ComponentConfig,
  ComponentSetter,
  useComponentConfigStore,
} from "../../../stores/component-config";

export function ComponentAttr() {
  const [form] = Form.useForm();
  const { curComponentId, curComponent, updateComponentProps } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  useEffect(() => {
    const data = form.getFieldsValue();
    form.setFieldsValue({ ...data, ...curComponent?.props });
  }, [curComponent]);

  if (!curComponentId || !curComponent) return null;

  const valueChange = (changeValues: ComponentConfig) => {
    if (curComponentId) {
      updateComponentProps(curComponentId, changeValues);
    }
  };

  const renderFormElement = (settings: ComponentSetter) => {
    const { type, options } = settings;
    if (type === "select") {
      return <Select options={options}></Select>;
    } else if (type === "input") {
      return <Input></Input>;
    }
  };

  return (
    <Form
      form={form}
      onValuesChange={valueChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item label="组件id">
        <Input value={curComponent.id} disabled></Input>
      </Form.Item>
      <Form.Item label="组件名称">
        <Input value={curComponent.name} disabled></Input>
      </Form.Item>
      <Form.Item label="组件描述">
        <Input value={curComponent.desc} disabled></Input>
      </Form.Item>
      {componentConfig[curComponent.name]?.setter?.map((setter) => (
        <Form.Item key={setter.name} name={setter.name} label={setter.label}>
          {renderFormElement(setter)}
        </Form.Item>
      ))}
    </Form>
  );
}
